"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useActiveSessions,
  useCompleteSession,
  useCreateSession,
  useDiscardSession as useDiscardSessionMutation,
  usePauseSession,
  useResumeSession as useResumeSessionMutation,
} from "@/hooks";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Flame,
  Mic,
  MicOff,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Trash2,
  Zap,
} from "lucide-react";

import {
  getAyahCount,
  type FlowerStage,
  type Season,
} from "@/lib/gamification/surah-trees";
import {
  normalizeArabic,
  splitIntoWords,
} from "@/lib/memorization/arabic-utils";
import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import { getPageForAyah } from "@/lib/quran/mushaf-layout";
import { usePostSessionGamification } from "@/hooks/use-gamification";
import { useMemorizeVerse } from "@/hooks/use-memorize-verse";
import { useVoiceRecognition } from "@/hooks/use-voice-recognition";
import { useQuranStore } from "@/stores/quranStore";
import {
  useSessionStore,
  type DBSessionSnapshot,
  type SessionSummary as SessionSummaryType,
  type StartSessionConfig,
} from "@/stores/sessionStore";
import { AyahPlayButton } from "@/components/audio/AyahPlayButton";
import { AyahModePanel } from "@/components/memorization/AyahModePanel";
import { MemorizeToolbar } from "@/components/memorization/MemorizeToolbar";
import { MistakeList } from "@/components/memorization/MistakeHighlight";
import {
  HideQuickToggles,
  MushafModePanel,
} from "@/components/memorization/MushafModePanel";
import {
  MushafSidebar,
  MushafSidebarMobile,
} from "@/components/memorization/MushafSidebar";
import { SessionProgressBar } from "@/components/memorization/SessionProgressBar";
import { SessionSummary } from "@/components/memorization/SessionSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FluencyDisplay } from "@/components/voice/FluencyDisplay";
import { RecitationTracker } from "@/components/voice/RecitationTracker";
import {
  VoiceRecorder,
  type EngineType,
} from "@/components/voice/VoiceRecorder";

// ---------- helpers for tree visualization ----------

function computeFlowerStage(
  masteryPercent: number,
  hasStarted: boolean
): FlowerStage {
  if (!hasStarted) return "seed";
  if (masteryPercent < 10) return "sprout";
  if (masteryPercent < 50) return "bud";
  if (masteryPercent >= 50) return "bloom";
  return "sprout";
}

function computeSeason(accuracy: number): Season {
  if (accuracy >= 90) return "summer";
  if (accuracy >= 70) return "spring";
  if (accuracy >= 40) return "autumn";
  return "winter";
}

// ---------- live word tracking ----------

type LiveStatus = "pending" | "correct" | "wrong" | "current";

interface LiveWordState {
  originalWord: string;
  wordKey: string;
  status: LiveStatus;
  recitedWord?: string;
}

interface LiveTrackingResult {
  wordStates: LiveWordState[];
  correctKeys: Set<string>;
  mistakeKeys: Set<string>;
  mistakeDetails: Map<string, { recitedWord?: string }>;
  currentKey: string | undefined;
  progress: number;
  accuracy: number;
  wordsCompleted: number;
  totalWords: number;
  streak: number;
  isComplete: boolean;
}

const EMPTY_LIVE: LiveTrackingResult = {
  wordStates: [],
  correctKeys: new Set(),
  mistakeKeys: new Set(),
  mistakeDetails: new Map(),
  currentKey: undefined,
  progress: 0,
  accuracy: 0,
  wordsCompleted: 0,
  totalWords: 0,
  streak: 0,
  isComplete: false,
};

/**
 * Check if a word text is a Quranic stop/pause mark (waqf sign) rather than
 * an actual recitable word.  These marks (e.g. ۗ ۖ ۚ ۛ) appear as standalone
 * "words" in QPC data but are never spoken, so they must be skipped in tracking.
 */
/** Module-level timestamp helper to avoid react-hooks/purity lint for Date.now() */
const timestamp = () => Date.now();

function isWaqfMark(text: string): boolean {
  // Strip diacritics and whitespace, then check if remaining chars are all
  // Arabic small-high marks (U+06D6-U+06ED) used for Quranic stop signs.
  const stripped = text.replace(/[\s\u0610-\u061A\u064B-\u065F\u0670]/g, "");
  return stripped.length > 0 && /^[\u06D6-\u06ED]+$/.test(stripped);
}

/**
 * Real-time word-by-word comparison of spoken text against original ayah words.
 * Returns per-word status, mushaf overlay keys, and progress metrics.
 */
function computeLiveTracking(
  originalWords: string[],
  wordKeys: string[],
  spokenText: string
): LiveTrackingResult {
  if (originalWords.length === 0 || wordKeys.length !== originalWords.length) {
    return EMPTY_LIVE;
  }

  // Count recitable words (exclude waqf marks) for accurate totals
  const recitableCount = originalWords.filter((w) => !isWaqfMark(w)).length;
  if (recitableCount === 0) return EMPTY_LIVE;

  const spokenWords = splitIntoWords(spokenText);
  if (spokenWords.length === 0) {
    // Find first recitable word for initial "current" marker
    const firstRecitable = originalWords.findIndex((w) => !isWaqfMark(w));
    const states: LiveWordState[] = originalWords.map((w, i) => ({
      originalWord: w,
      wordKey: wordKeys[i],
      status: isWaqfMark(w)
        ? ("correct" as const) // waqf marks auto-pass
        : i === firstRecitable
          ? ("current" as const)
          : ("pending" as const),
    }));
    return {
      ...EMPTY_LIVE,
      wordStates: states,
      currentKey: firstRecitable >= 0 ? wordKeys[firstRecitable] : undefined,
      totalWords: recitableCount,
    };
  }

  const normalizedOrig = originalWords.map(normalizeArabic);
  const normalizedSpoken = spokenWords.map(normalizeArabic);

  // Muqatta'at detection: when the original is 1 recitable word and the user
  // spoke multiple words (e.g. "ألف لام ميم" for الم), extract the first letter
  // of each spoken word and check if they spell the original word.
  if (recitableCount === 1 && spokenWords.length > 1) {
    const recitableIdx = originalWords.findIndex((w) => !isWaqfMark(w));
    const firstLetters = normalizedSpoken.map((w) => w.charAt(0)).join("");
    if (recitableIdx >= 0 && firstLetters === normalizedOrig[recitableIdx]) {
      const states: LiveWordState[] = originalWords.map((w, i) => ({
        originalWord: w,
        wordKey: wordKeys[i],
        status: "correct" as const,
      }));
      return {
        wordStates: states,
        correctKeys: new Set(wordKeys),
        mistakeKeys: new Set<string>(),
        mistakeDetails: new Map(),
        currentKey: undefined,
        progress: 100,
        accuracy: 100,
        wordsCompleted: 1,
        totalWords: 1,
        streak: 1,
        isComplete: true,
      };
    }
  }

  const states: LiveWordState[] = originalWords.map((w, i) => ({
    originalWord: w,
    wordKey: wordKeys[i],
    status: isWaqfMark(w)
      ? ("correct" as LiveStatus)
      : ("pending" as LiveStatus),
  }));

  let origIdx = 0;
  let spokenIdx = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let streak = 0;
  let maxStreak = 0;

  while (
    spokenIdx < normalizedSpoken.length &&
    origIdx < normalizedOrig.length
  ) {
    // Auto-skip waqf marks — they are not spoken
    if (isWaqfMark(originalWords[origIdx])) {
      origIdx++;
      continue;
    }

    const spoken = normalizedSpoken[spokenIdx];
    const expected = normalizedOrig[origIdx];

    // Direct match (exact or high similarity after normalization)
    if (spoken === expected) {
      states[origIdx].status = "correct";
      correctCount++;
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      origIdx++;
      spokenIdx++;
      continue;
    }

    // Lookahead: check if user skipped 1-2 recitable words (said a later word)
    let found = false;
    for (
      let ahead = 1;
      ahead <= 2 && origIdx + ahead < normalizedOrig.length;
      ahead++
    ) {
      // Skip waqf marks in lookahead
      if (isWaqfMark(originalWords[origIdx + ahead])) continue;
      if (spoken === normalizedOrig[origIdx + ahead]) {
        // Mark skipped recitable words as wrong (skip waqf marks)
        for (let skip = 0; skip < ahead; skip++) {
          if (!isWaqfMark(originalWords[origIdx + skip])) {
            states[origIdx + skip].status = "wrong";
            // Skipped words have no direct spoken equivalent
            wrongCount++;
          }
        }
        states[origIdx + ahead].status = "correct";
        correctCount++;
        streak = 1;
        origIdx = origIdx + ahead + 1;
        spokenIdx++;
        found = true;
        break;
      }
    }

    if (!found) {
      // Current word is wrong
      states[origIdx].status = "wrong";
      states[origIdx].recitedWord = spokenWords[spokenIdx];
      wrongCount++;
      streak = 0;
      origIdx++;
      spokenIdx++;
    }
  }

  // Skip past any trailing waqf marks to find next recitable word
  while (origIdx < states.length && isWaqfMark(originalWords[origIdx])) {
    origIdx++;
  }

  // Mark current word (first recitable pending after last processed)
  if (origIdx < states.length) {
    states[origIdx].status = "current";
  }

  const completed = correctCount + wrongCount;
  const total = recitableCount;
  const correctKeys = new Set<string>();
  const mistakeKeys = new Set<string>();

  const mistakeDetails = new Map<string, { recitedWord?: string }>();
  for (const s of states) {
    if (s.status === "correct") correctKeys.add(s.wordKey);
    if (s.status === "wrong") {
      mistakeKeys.add(s.wordKey);
      mistakeDetails.set(s.wordKey, { recitedWord: s.recitedWord });
    }
  }

  return {
    wordStates: states,
    correctKeys,
    mistakeKeys,
    mistakeDetails,
    currentKey: origIdx < states.length ? wordKeys[origIdx] : undefined,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    accuracy:
      completed > 0 ? Math.round((correctCount / completed) * 100) : 100,
    wordsCompleted: completed,
    totalWords: total,
    streak: maxStreak,
    isComplete: completed >= total,
  };
}

// ---------- LiveTrackerPanel (left sidebar) ----------

function LiveTrackerPanel({
  liveResult,
  surahNumber,
  ayahNumber,
  onPrevAyah,
  onNextAyah,
  onRetryAyah,
  isFirstAyah,
  isLastAyah,
  isRecording,
  autoAdvance,
  onAutoAdvanceChange,
}: {
  liveResult: LiveTrackingResult;
  surahNumber: number;
  ayahNumber: number;
  onPrevAyah: () => void;
  onNextAyah: () => void;
  onRetryAyah: () => void;
  isFirstAyah: boolean;
  isLastAyah: boolean;
  isRecording: boolean;
  autoAdvance: boolean;
  onAutoAdvanceChange: (v: boolean) => void;
}) {
  const {
    wordStates,
    progress,
    accuracy,
    wordsCompleted,
    totalWords,
    streak,
    isComplete,
  } = liveResult;

  return (
    <div className="p-3 space-y-4">
      {/* Ayah Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onPrevAyah}
          disabled={isFirstAyah}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold tabular-nums">
            {surahNumber}:{ayahNumber}
          </span>
          <AyahPlayButton
            surahNumber={surahNumber}
            ayahNumber={ayahNumber}
            className="h-6 w-6"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onNextAyah}
          disabled={isLastAyah}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Word Progress Dots */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
          Word Progress
        </div>
        <div className="flex flex-wrap gap-1">
          {wordStates.map((ws, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                ws.status === "correct"
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : ws.status === "wrong"
                    ? "bg-red-500 dark:bg-red-400 animate-pulse"
                    : ws.status === "current"
                      ? "bg-primary/60 animate-pulse ring-2 ring-primary/30"
                      : "bg-muted-foreground/20"
              }`}
              style={{
                width: `${Math.max(8, Math.min(20, ws.originalWord.length * 2.5))}px`,
              }}
              title={
                ws.status === "correct" || ws.status === "wrong"
                  ? ws.originalWord
                  : "???"
              }
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">
            {wordsCompleted}/{totalWords} words
          </span>
          <span className="font-semibold tabular-nums">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-primary to-emerald-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <div
            className={`text-lg font-bold tabular-nums ${
              accuracy >= 80
                ? "text-emerald-600 dark:text-emerald-400"
                : accuracy >= 50
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
            }`}
          >
            {accuracy}%
          </div>
          <div className="text-[10px] text-muted-foreground">Accuracy</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold tabular-nums text-primary flex items-center justify-center gap-0.5">
            {streak > 0 && <Flame className="h-4 w-4 text-orange-500" />}
            {streak}
          </div>
          <div className="text-[10px] text-muted-foreground">Streak</div>
        </div>
      </div>

      {/* Complete Banner */}
      {isComplete &&
        (() => {
          const wrongWords = wordStates.filter((ws) => ws.status === "wrong");
          const wrongCount = wrongWords.length;
          return (
            <div
              className={`rounded-lg p-3 ${
                accuracy >= 90
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                  : accuracy >= 70
                    ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                    : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-semibold">
                  {accuracy >= 90
                    ? "Excellent!"
                    : accuracy >= 70
                      ? "Good effort!"
                      : `${wrongCount} word${wrongCount !== 1 ? "s" : ""} wrong`}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {accuracy}% accuracy — {wordsCompleted} words
                </div>
              </div>
              {/* Play correct recitation */}
              <div className="flex justify-center mt-2">
                <AyahPlayButton
                  surahNumber={surahNumber}
                  ayahNumber={ayahNumber}
                  className="h-7 w-7"
                />
              </div>
              {/* Mini diff: show first 3 wrong words with corrections */}
              {wrongCount > 0 && (
                <div
                  className="mt-2 pt-2 border-t border-current/10 space-y-0.5"
                  dir="rtl"
                >
                  {wrongWords.slice(0, 3).map((ws, i) => (
                    <div
                      key={i}
                      className="text-xs flex items-center gap-1.5 justify-end font-arabic"
                    >
                      {ws.recitedWord && (
                        <span className="text-red-500 line-through">
                          {ws.recitedWord}
                        </span>
                      )}
                      <span className="text-muted-foreground">←</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {ws.originalWord}
                      </span>
                    </div>
                  ))}
                  {wrongCount > 3 && (
                    <div
                      className="text-[10px] text-muted-foreground text-center"
                      dir="ltr"
                    >
                      +{wrongCount - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

      {/* Quick Actions */}
      <div className="space-y-1.5">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 text-xs"
          onClick={onRetryAyah}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Ayah
        </Button>

        {isComplete && !isLastAyah && (
          <Button
            size="sm"
            className="w-full gap-1.5 text-xs"
            onClick={onNextAyah}
          >
            <Zap className="h-3.5 w-3.5" />
            Next Ayah
          </Button>
        )}
      </div>

      {/* Settings */}
      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={autoAdvance}
          onChange={(e) => onAutoAdvanceChange(e.target.checked)}
          className="rounded border-muted-foreground/30"
        />
        Auto-advance on 70%+
      </label>

      {/* Mic status — always visible */}
      <div
        className={`flex items-center gap-1.5 text-xs ${isRecording ? "text-red-500" : "text-muted-foreground"}`}
      >
        {isRecording ? (
          <>
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <Mic className="h-3 w-3" />
            Listening...
          </>
        ) : (
          <>
            <MicOff className="h-3 w-3" />
            Mic off
          </>
        )}
      </div>
    </div>
  );
}

// ---------- voice section (shared UI) ----------

function VoiceSection({
  interimText,
  finalText,
  isRecording,
  trackerWords,
  fluencyMetrics,
  isActive,
  onTranscript,
  onRecordingChange,
  onEngineChange,
  onReset,
  onCheck,
}: {
  interimText: string;
  finalText: string;
  isRecording: boolean;
  trackerWords: string[];
  fluencyMetrics: ReturnType<typeof useVoiceRecognition>["fluencyMetrics"];
  isActive: boolean;
  onTranscript: (text: string, isFinal: boolean) => void;
  onRecordingChange: (recording: boolean) => void;
  onEngineChange: (engine: EngineType) => void;
  onReset: () => void;
  onCheck: () => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 py-6">
        <RecitationTracker
          interimText={interimText}
          finalText={finalText}
          isListening={isRecording}
          originalWords={trackerWords}
        />

        <FluencyDisplay metrics={fluencyMetrics} isActive={isRecording} />

        <VoiceRecorder
          onTranscript={onTranscript}
          onRecordingChange={onRecordingChange}
          onEngineChange={onEngineChange}
          disabled={!isActive}
        />

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onReset} disabled={!finalText}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={onCheck} disabled={!finalText}>
            Check Recitation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- main page ----------

export default function MemorizePage() {
  const router = useRouter();
  const session = useSessionStore();
  const memorizeMode = useQuranStore((s) => s.memorizeMode);
  const setMemorizeMode = useQuranStore((s) => s.setMemorizeMode);
  const createSession = useCreateSession();
  const { processSession } = usePostSessionGamification();

  // DB session lifecycle hooks
  const { data: activeSessionsData } = useActiveSessions();
  const pauseSessionMutation = usePauseSession();
  const resumeSessionMutation = useResumeSessionMutation();
  const completeSessionMutation = useCompleteSession();
  const discardSessionMutation = useDiscardSessionMutation();

  const [sessionSummary, setSessionSummary] =
    useState<SessionSummaryType | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [overlayCollapsed, setOverlayCollapsed] = useState(false);

  // --- Session persistence: hydration + recovery ---
  const [hydrationChecked, setHydrationChecked] = useState(false);
  const [sessionRecovered, setSessionRecovered] = useState(false);
  // DB recovery: tracks if we found a resumable session from the DB
  const [dbRecoverySession, setDbRecoverySession] = useState<{
    id: string;
    surahNumber: number;
    startAyah: number;
    endAyah: number;
    pageNumber: number | null;
    mode: string;
    targetType: string | null;
    duration: number;
    stateSnapshot: DBSessionSnapshot | null;
    pausedAt: string | null;
    createdAt: string;
    status: string;
  } | null>(null);

  const STALE_THRESHOLD_MS = 4 * 60 * 60 * 1000; // 4 hours
  const PAUSED_STALE_MS = 24 * 60 * 60 * 1000; // 24 hours

  // Check for DB recovery sessions
  const dbRecoveryChecked = useRef(false);
  useEffect(() => {
    if (dbRecoveryChecked.current) return;
    if (!activeSessionsData?.sessions) return;
    const dbSessions = activeSessionsData.sessions;
    if (dbSessions.length === 0) return;

    dbRecoveryChecked.current = true;

    // Find first non-stale session
    const now = Date.now();
    const resumable = dbSessions.find((s) => {
      const createdAt = new Date(s.createdAt).getTime();
      const threshold =
        s.status === "PAUSED" ? PAUSED_STALE_MS : STALE_THRESHOLD_MS;
      return now - createdAt < threshold;
    });

    if (resumable && !session.isActive) {
      setDbRecoverySession(resumable as typeof dbRecoverySession);
    }
  }, [activeSessionsData, session.isActive]);

  useEffect(() => {
    // Wait for Zustand persist to finish rehydrating from localStorage
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      const state = useSessionStore.getState();
      if (state.isActive && state.startTime) {
        const elapsed = Date.now() - state.startTime;
        if (elapsed > STALE_THRESHOLD_MS) {
          // Session is too old — auto-discard
          state.discardSession();
        } else {
          setSessionRecovered(true);
        }
      }
      setHydrationChecked(true);
    });
    // If hydration already happened (e.g. fast localStorage), check immediately
    if (useSessionStore.persist.hasHydrated()) {
      const state = useSessionStore.getState();
      if (state.isActive && state.startTime) {
        const elapsed = Date.now() - state.startTime;
        if (elapsed > STALE_THRESHOLD_MS) {
          state.discardSession();
        } else {
          setSessionRecovered(true);
        }
      }
      setHydrationChecked(true);
    }
    return unsub;
  }, []);

  // --- beforeunload warning for active sessions ---
  useEffect(() => {
    if (!session.isActive) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [session.isActive]);

  // For mushaf mode: the original text + word keys/texts come from the page data (bridge module).
  const mushafOriginalTextRef = useRef("");
  const [mushafOriginalText, setMushafOriginalText] = useState("");
  const [mushafWordKeys, setMushafWordKeys] = useState<string[]>([]);
  const [mushafWordTexts, setMushafWordTexts] = useState<string[]>([]);
  const [autoAdvance, setAutoAdvance] = useState(true);
  // First word of the next ayah — used for first-word trigger when auto-advance is off
  const nextAyahFirstWordRef = useRef<string | null>(null);

  // Resolve current verse for non-mushaf modes
  const verse = useMemorizeVerse();

  // Determine the text for voice comparison based on mode
  const originalText =
    session.isActive && memorizeMode === "mushaf"
      ? mushafOriginalText
      : verse.currentText;

  // Voice recognition
  const {
    interimText,
    finalText,
    handleTranscript,
    handleEngineChange,
    compareAndScore,
    fluencyMetrics,
    reset: resetVoice,
  } = useVoiceRecognition({
    originalText,
    sensitivity: session.mistakeSensitivity,
    onComparisonResult: setComparisonResult,
  });

  // Gate transcript callbacks during ayah transitions so stale speech results
  // from the OLD ayah don't bleed into the NEW ayah's accumulator.
  // Two mechanisms: a boolean flag AND a time-based mute window.
  // The flag blocks during the synchronous transition. The mute window
  // blocks delayed speech results that arrive after the flag is cleared.
  const isTransitioningRef = useRef(false);
  const muteUntilRef = useRef(0);
  const gatedHandleTranscript = useCallback(
    (text: string, isFinal: boolean) => {
      if (isTransitioningRef.current || Date.now() < muteUntilRef.current)
        return;
      handleTranscript(text, isFinal);
    },
    [handleTranscript]
  );

  const handleStartSession = useCallback(
    (config: StartSessionConfig) => {
      session.startSession(config);
      setSessionSummary(null);
      setComparisonResult(null);
      setSessionRecovered(false);
      setDbRecoverySession(null);
      resetVoice();

      // Create ACTIVE session in DB
      createSession.mutate(
        {
          surahNumber: config.surahNumber,
          startAyah: config.startAyah,
          endAyah: config.endAyah,
          pageNumber: config.pageNumber,
          mode: "MEMORIZE",
          duration: 0,
          wordsRecited: 0,
          mistakeCount: 0,
          status: "ACTIVE",
          targetType: config.targetType,
        } as Parameters<typeof createSession.mutate>[0],
        {
          onSuccess: (data: { id: string }) => {
            useSessionStore.getState().setActiveSessionId(data.id);
          },
        }
      );
    },
    [session, resetVoice, createSession]
  );

  const handleEndSession = useCallback(async () => {
    if (finalText) {
      await compareAndScore();
    }

    const activeSessionId = useSessionStore.getState().activeSessionId;
    const summary = session.endSession();
    if (summary) {
      setSessionSummary(summary);

      const mistakeData = summary.mistakes.map((m) => ({
        surahNumber: m.surahNumber,
        ayahNumber: m.ayahNumber,
        wordIndex: m.wordIndex,
        type: m.type.toUpperCase(),
        recitedText: m.recitedText ?? undefined,
        correctText: m.correctText,
        severity: m.severity.toUpperCase(),
      }));

      const onGamification = () => {
        processSession({
          versesRecited: summary.totalVerses,
          accuracy: summary.accuracy,
          duration: summary.duration,
          surahNumber: summary.surahNumber,
        });
      };

      if (activeSessionId) {
        // Complete via PATCH (DB-tracked session)
        completeSessionMutation.mutate(
          {
            sessionId: activeSessionId,
            duration: summary.duration,
            accuracy: summary.accuracy,
            wordsRecited: summary.wordsRecited,
            mistakeCount: summary.mistakes.length,
            mistakes: mistakeData,
          },
          { onSuccess: onGamification }
        );
      } else {
        // Fallback: direct POST (offline/unauthenticated)
        createSession.mutate(
          {
            surahNumber: summary.surahNumber,
            startAyah: summary.startAyah,
            endAyah: summary.endAyah,
            mode: "MEMORIZE",
            duration: summary.duration,
            accuracy: summary.accuracy,
            wordsRecited: summary.wordsRecited,
            mistakeCount: summary.mistakes.length,
            mistakes: mistakeData,
          },
          { onSuccess: onGamification }
        );
      }
    }
  }, [
    finalText,
    compareAndScore,
    session,
    createSession,
    completeSessionMutation,
    processSession,
  ]);

  // Save & Exit handler — pause to DB
  const handleSaveAndExit = useCallback(() => {
    const state = useSessionStore.getState();
    const activeSessionId = state.activeSessionId;
    if (!activeSessionId) return;

    const duration = state.startTime
      ? Math.floor((Date.now() - state.startTime) / 1000)
      : 0;

    const stateSnapshot: DBSessionSnapshot = {
      currentAyah: state.currentAyah,
      currentVerseIndex: state.currentVerseIndex,
      currentPageNumber: state.currentPageNumber,
      mushafCurrentAyahKey: state.mushafCurrentAyahKey,
      revealedWordKeys: Array.from(state.revealedWordKeys),
      revealedWords: state.revealedWords,
      wordsRecited: state.wordsRecited,
      correctWords: state.correctWords,
      mistakes: state.mistakes,
      verseList: state.verseList,
      revealMode: state.revealMode,
      hideMode: state.hideMode,
      hideDifficulty: state.hideDifficulty,
      mistakeSensitivity: state.mistakeSensitivity,
      isHidden: state.isHidden,
      targetId: state.targetId,
      juzNumber: state.juzNumber,
      hizbNumber: state.hizbNumber,
      subjectId: state.subjectId,
    };

    pauseSessionMutation.mutate(
      {
        sessionId: activeSessionId,
        stateSnapshot: stateSnapshot as unknown as Record<string, unknown>,
        duration,
      },
      {
        onSuccess: () => {
          state.discardSession();
          router.push("/sessions");
        },
      }
    );
  }, [pauseSessionMutation, router]);

  // Navigation handlers — cross-surah aware
  const isCrossSurah = session.verseList.length > 0;

  const handleNextAyah = async () => {
    isTransitioningRef.current = true;
    muteUntilRef.current = timestamp() + 600;
    if (finalText) {
      await compareAndScore();
    }
    resetVoice();
    setComparisonResult(null);
    if (isCrossSurah) {
      session.nextVerse();
    } else {
      // Compute next ayah number before mutating store
      const nextAyahNum = Math.min(session.currentAyah + 1, session.endAyah);
      session.nextAyah();
      // Sync mushaf navigation key so MushafModePanel advances too
      if (memorizeMode === "mushaf") {
        // Merge correctly-recited words into revealedWordKeys so they stay
        // visible on the page after advancing to the next ayah.
        const currentState = useSessionStore.getState();
        const merged = new Set(currentState.revealedWordKeys);
        for (const k of confirmedResult.correctKeys) merged.add(k);
        // Detect page boundary: nextAyahFirstWord is null when we're on
        // the last ayah of the current page (MushafModePanel can't see next page).
        // Also fallback to getPageForAyah estimation for cross-surah cases.
        const isLastOnPage = nextAyahFirstWordRef.current === null;
        const nextPage = getPageForAyah(session.surahNumber, nextAyahNum);
        if (isLastOnPage || nextPage > currentState.currentPageNumber) {
          // Advance to next page — clear revealed for fresh page
          useSessionStore.setState({
            currentPageNumber: currentState.currentPageNumber + 1,
            mushafCurrentAyahKey: null,
            revealedWordKeys: new Set<string>(),
          });
        } else {
          useSessionStore.setState({
            mushafCurrentAyahKey: `${session.surahNumber}:${nextAyahNum}`,
            revealedWordKeys: merged,
          });
        }
      }
    }
  };

  const handlePreviousAyah = () => {
    isTransitioningRef.current = true;
    muteUntilRef.current = timestamp() + 600;
    resetVoice();
    setComparisonResult(null);
    if (isCrossSurah) {
      session.previousVerse();
    } else {
      const prevAyahNum = Math.max(session.currentAyah - 1, session.startAyah);
      session.previousAyah();
      if (memorizeMode === "mushaf") {
        // Keep already-revealed words visible when going back
        const currentState = useSessionStore.getState();
        const merged = new Set(currentState.revealedWordKeys);
        for (const k of confirmedResult.correctKeys) merged.add(k);
        // Check if previous ayah is on a different page
        const prevPage = getPageForAyah(session.surahNumber, prevAyahNum);
        if (prevPage < currentState.currentPageNumber) {
          useSessionStore.setState({
            currentPageNumber: prevPage,
            mushafCurrentAyahKey: null,
            revealedWordKeys: new Set<string>(),
          });
        } else {
          useSessionStore.setState({
            mushafCurrentAyahKey: `${session.surahNumber}:${prevAyahNum}`,
            revealedWordKeys: merged,
          });
        }
      }
    }
  };

  const handleCheckRecitation = async () => {
    await compareAndScore();
  };

  const handleRetry = () => {
    setSessionSummary(null);
    setComparisonResult(null);
    resetVoice();
  };

  // Mushaf mode: callback when current ayah changes
  const handleMushafAyahChange = useCallback(
    (
      _surah: number,
      ayah: number,
      text: string,
      wordKeys: string[],
      wordTexts: string[],
      nextFirstWord: string | null
    ) => {
      mushafOriginalTextRef.current = text;
      setMushafOriginalText(text);
      setMushafWordKeys(wordKeys);
      setMushafWordTexts(wordTexts);
      nextAyahFirstWordRef.current = nextFirstWord;
      // Sync session store's currentAyah so left panel shows correct ayah number
      // Use getState() to avoid adding session to deps (which causes infinite re-render)
      useSessionStore.getState().setCurrentAyah(ayah);
      resetVoice();
      setComparisonResult(null);
      // Allow transcript processing now that the new ayah data is loaded
      isTransitioningRef.current = false;
    },
    [resetVoice]
  );

  const accuracy =
    session.wordsRecited > 0
      ? Math.round((session.correctWords / session.wordsRecited) * 100)
      : 0;

  // Determine words for RecitationTracker (differs by mode)
  const trackerWords =
    memorizeMode === "mushaf" ? mushafWordTexts : verse.currentWords;

  // Navigation bounds for cross-surah modes
  const navStartAyah = isCrossSurah ? 1 : session.startAyah;
  const navEndAyah = isCrossSurah ? session.verseList.length : session.endAyah;

  // Is mushaf mode active?
  const isMushafActive = memorizeMode === "mushaf" && session.isActive;

  // Tree visualization props (derived from session state)
  const totalAyahs = getAyahCount(session.surahNumber) || 7;
  const masteryPercent = Math.min(100, accuracy);
  const flowerStage = computeFlowerStage(masteryPercent, session.isActive);
  const season = computeSeason(accuracy);

  // Surah selection handler for sidebar
  const handleSurahSelect = useCallback(
    (surahNumber: number) => {
      // When a new surah is selected in the sidebar, update the session
      if (session.isActive) {
        // Navigate mushaf to the surah's first page — clear revealed for new surah
        const page = getPageForAyah(surahNumber, 1);
        useSessionStore.setState({
          currentPageNumber: page,
          mushafCurrentAyahKey: null,
          revealedWordKeys: new Set<string>(),
        });
      }
    },
    [session]
  );

  // Voice section props
  const voiceReset = useCallback(() => {
    resetVoice();
    setComparisonResult(null);
  }, [resetVoice]);

  // Sidebar props (shared between desktop and mobile)
  const sidebarProps = {
    surahNumber: session.surahNumber,
    onSurahSelect: handleSurahSelect,
    sessionAccuracy: accuracy,
    masteryPercent,
    season,
    flowerStage,
    totalAyahs,
    bloomingAyahs: [] as number[],
  };

  // ---------- Live word tracking for mushaf mode ----------
  // Use aligned word texts from the bridge (1:1 with word keys) instead of
  // re-splitting text, which breaks on QPC words with internal spaces.
  const mushafOriginalWords = mushafWordTexts;

  // Dual tracking: full text (final+interim) for responsive UI,
  // finalText only for confirmed word reveals on mushaf.
  const fullSpokenText = finalText + (interimText ? " " + interimText : "");
  const spokenText = fullSpokenText;

  // Live result from full text — drives progress dots, accuracy, current cursor
  const liveResult = useMemo(
    () =>
      computeLiveTracking(mushafOriginalWords, mushafWordKeys, fullSpokenText),
    [mushafOriginalWords, mushafWordKeys, fullSpokenText]
  );

  // Confirmed result from finalText only — drives mushaf word reveals
  // so words don't flash ahead of actual recitation from volatile interim

  const confirmedResult = useMemo(
    () => computeLiveTracking(mushafOriginalWords, mushafWordKeys, finalText),
    [mushafOriginalWords, mushafWordKeys, finalText]
  );

  // Auto-advance to next ayah on completion with high accuracy.
  // Use a ref for the handler to avoid the effect re-running (and clearing
  // the timeout) every time handleNextAyah changes identity.
  const handleNextAyahRef = useRef(handleNextAyah);
  // eslint-disable-next-line react-hooks/refs -- intentional ref-sync pattern for stable effect callback
  handleNextAyahRef.current = handleNextAyah;

  // Auto-advance uses confirmedResult (final text only) to avoid triggering
  // prematurely from volatile interim speech recognition results.
  const prevCompleteRef = useRef(false);
  useEffect(() => {
    if (
      autoAdvance &&
      isMushafActive &&
      confirmedResult.isComplete &&
      confirmedResult.accuracy >= 70 &&
      !prevCompleteRef.current
    ) {
      prevCompleteRef.current = true;
      // Small delay so user sees the completion state
      const timer = setTimeout(() => {
        handleNextAyahRef.current();
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (!confirmedResult.isComplete) {
      prevCompleteRef.current = false;
    }
  }, [
    confirmedResult.isComplete,
    confirmedResult.accuracy,
    autoAdvance,
    isMushafActive,
  ]);

  // Auto-expand overlay when recording starts, auto-collapse 2s after stop
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = null;
    }
    if (isRecording) {
      setOverlayCollapsed(false);
    } else if (finalText || interimText) {
      overlayTimerRef.current = setTimeout(
        () => setOverlayCollapsed(true),
        2000
      );
      return () => {
        if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
      };
    }
  }, [isRecording, finalText, interimText]);

  // First-word trigger: when auto-advance is OFF and the current ayah is complete,
  // advance if the user speaks the first word of the next ayah.
  // Uses confirmedResult to ensure the current ayah is truly complete before checking.
  // Also handles page boundaries: when nextAyahFirstWord is null (last ayah on page),
  // any extra spoken word triggers page advancement.
  const firstWordTriggeredRef = useRef(false);
  useEffect(() => {
    if (
      !autoAdvance &&
      isMushafActive &&
      confirmedResult.isComplete &&
      !firstWordTriggeredRef.current
    ) {
      const nextFirst = nextAyahFirstWordRef.current;
      const spokenWords = splitIntoWords(spokenText);
      const completedCount = confirmedResult.totalWords;
      const extraWords = spokenWords.slice(completedCount);

      if (!nextFirst) {
        // Last ayah on page — any extra spoken word triggers page advance
        if (extraWords.length > 0) {
          firstWordTriggeredRef.current = true;
          const timer = setTimeout(() => {
            handleNextAyahRef.current();
          }, 400);
          return () => clearTimeout(timer);
        }
        return;
      }

      // Normal case: check if the extra words match the next ayah's first word
      if (extraWords.length > 0) {
        const normalizedNext = normalizeArabic(nextFirst);
        const hasMatch = extraWords.some(
          (w) => normalizeArabic(w) === normalizedNext
        );
        if (hasMatch) {
          firstWordTriggeredRef.current = true;
          const timer = setTimeout(() => {
            handleNextAyahRef.current();
          }, 400);
          return () => clearTimeout(timer);
        }
      }
    }
    if (!confirmedResult.isComplete) {
      firstWordTriggeredRef.current = false;
    }
  }, [
    confirmedResult.isComplete,
    confirmedResult.totalWords,
    spokenText,
    autoAdvance,
    isMushafActive,
  ]);

  const handleRetryAyah = useCallback(() => {
    resetVoice();
    setComparisonResult(null);
  }, [resetVoice]);

  // --- Recovery dialog helpers ---
  const handleResumeSession = useCallback(() => {
    // Sync memorizeMode with the recovered session's targetType
    setMemorizeMode(session.targetType);
    setSessionRecovered(false);
    setDbRecoverySession(null);
  }, [session.targetType, setMemorizeMode]);

  const handleDiscardSession = useCallback(() => {
    const activeId = useSessionStore.getState().activeSessionId;
    if (activeId) {
      discardSessionMutation.mutate(activeId);
    }
    session.discardSession();
    setSessionRecovered(false);
    setDbRecoverySession(null);
  }, [session, discardSessionMutation]);

  // Resume from DB recovery session
  const handleResumeFromDB = useCallback(() => {
    if (!dbRecoverySession) return;
    resumeSessionMutation.mutate(dbRecoverySession.id, {
      onSuccess: () => {
        session.loadFromSnapshot({
          id: dbRecoverySession.id,
          surahNumber: dbRecoverySession.surahNumber,
          startAyah: dbRecoverySession.startAyah,
          endAyah: dbRecoverySession.endAyah,
          pageNumber: dbRecoverySession.pageNumber,
          mode: dbRecoverySession.mode,
          targetType: dbRecoverySession.targetType,
          duration: dbRecoverySession.duration,
          stateSnapshot: dbRecoverySession.stateSnapshot,
        });
        const targetType = dbRecoverySession.targetType;
        if (targetType) {
          setMemorizeMode(targetType as Parameters<typeof setMemorizeMode>[0]);
        }
        setDbRecoverySession(null);
      },
    });
  }, [dbRecoverySession, resumeSessionMutation, session, setMemorizeMode]);

  // Discard DB recovery session
  const handleDiscardFromDB = useCallback(() => {
    if (!dbRecoverySession) return;
    discardSessionMutation.mutate(dbRecoverySession.id);
    setDbRecoverySession(null);
  }, [dbRecoverySession, discardSessionMutation]);

  const formatTimeAgo = (ts: number) => {
    const mins = Math.floor((timestamp() - ts) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  const modeLabels: Record<string, string> = {
    mushaf: "Mushaf",
    ayah: "Ayah",
    surah: "Surah",
    juz: "Juz",
    hizb: "Hizb",
    subject: "Subject",
  };

  // Show DB recovery dialog (takes priority over localStorage recovery)
  if (dbRecoverySession && !session.isActive) {
    const dbCreatedAt = new Date(dbRecoverySession.createdAt).getTime();
    return (
      <div className="flex flex-col -mt-14 lg:-mt-16 h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-4.125rem)] bg-[#F8FAF9] dark:bg-[#121E18]">
        <MemorizeToolbar
          memorizeMode={memorizeMode}
          onModeChange={setMemorizeMode}
          isActive={false}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
        />
        <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F0ED] dark:bg-[#0A1210] p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-[#059669] dark:text-[#00E5A0]" />
                Resume Saved Session?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have a saved session that can be resumed.
              </p>

              <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium">
                    {modeLabels[dbRecoverySession.targetType ?? "ayah"] ??
                      dbRecoverySession.targetType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Range</span>
                  <span className="font-medium">
                    {dbRecoverySession.surahNumber}:
                    {dbRecoverySession.startAyah}–{dbRecoverySession.endAyah}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`font-medium ${dbRecoverySession.status === "PAUSED" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
                  >
                    {dbRecoverySession.status === "PAUSED"
                      ? "Paused"
                      : "Active"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTimeAgo(dbCreatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={handleDiscardFromDB}
                >
                  <Trash2 className="h-4 w-4" />
                  Discard
                </Button>
                <Button className="flex-1 gap-1.5" onClick={handleResumeFromDB}>
                  <PlayCircle className="h-4 w-4" />
                  Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show localStorage recovery dialog
  if (sessionRecovered && hydrationChecked && session.isActive) {
    const recoveredAccuracy =
      session.wordsRecited > 0
        ? Math.round((session.correctWords / session.wordsRecited) * 100)
        : 0;
    return (
      <div className="flex flex-col -mt-14 lg:-mt-16 h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-4.125rem)] bg-[#F8FAF9] dark:bg-[#121E18]">
        <MemorizeToolbar
          memorizeMode={memorizeMode}
          onModeChange={setMemorizeMode}
          isActive={false}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
        />
        <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F0ED] dark:bg-[#0A1210] p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-[#059669] dark:text-[#00E5A0]" />
                Resume Session?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have an unfinished memorization session.
              </p>

              <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium">
                    {modeLabels[session.targetType] ?? session.targetType}
                  </span>
                </div>
                {session.targetType === "mushaf" ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Page</span>
                    <span className="font-medium">
                      {session.currentPageNumber}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Range</span>
                    <span className="font-medium">
                      {session.surahNumber}:{session.startAyah}–
                      {session.endAyah}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Ayah</span>
                  <span className="font-medium">
                    {session.surahNumber}:{session.currentAyah}
                  </span>
                </div>
                {session.wordsRecited > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium">{recoveredAccuracy}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {session.startTime
                      ? formatTimeAgo(session.startTime)
                      : "unknown"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={handleDiscardSession}
                >
                  <Trash2 className="h-4 w-4" />
                  Discard
                </Button>
                <Button
                  className="flex-1 gap-1.5"
                  onClick={handleResumeSession}
                >
                  <PlayCircle className="h-4 w-4" />
                  Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show session summary
  if (sessionSummary) {
    return (
      <div className="flex flex-col -mt-14 lg:-mt-16 h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-4.125rem)] bg-[#F8FAF9] dark:bg-[#121E18]">
        <MemorizeToolbar
          memorizeMode={memorizeMode}
          onModeChange={setMemorizeMode}
          isActive={false}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
        />
        <div className="flex-1 min-h-0 overflow-y-auto bg-[#F2F0ED] dark:bg-[#0A1210] p-4 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <SessionSummary
              summary={sessionSummary}
              detectedMistakes={comparisonResult?.mistakes}
              onClose={() => {
                setSessionSummary(null);
              }}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col -mt-14 lg:-mt-16 h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-4.125rem)] bg-[#F8FAF9] dark:bg-[#121E18]">
      {/* Compact Toolbar */}
      <MemorizeToolbar
        memorizeMode={memorizeMode}
        onModeChange={setMemorizeMode}
        isActive={session.isActive}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        onSaveAndExit={session.activeSessionId ? handleSaveAndExit : undefined}
        extraActions={
          isMushafActive ? <MushafSidebarMobile {...sidebarProps} /> : undefined
        }
      />

      {/* Progress bar (during active session) */}
      {session.isActive && (
        <SessionProgressBar
          mode={session.targetType}
          surahNumber={session.surahNumber}
          currentAyah={session.currentAyah}
          startAyah={session.startAyah}
          endAyah={session.endAyah}
          accuracy={accuracy}
          startTime={session.startTime}
          currentPageNumber={session.currentPageNumber}
          juzNumber={session.juzNumber}
          hizbNumber={session.hizbNumber}
          subjectId={session.subjectId}
          verseListLength={session.verseList.length}
          currentVerseIndex={session.currentVerseIndex}
        />
      )}

      {/* Content area */}
      {isMushafActive ? (
        /* ====== 3-COLUMN MUSHAF LAYOUT ====== */
        <div className="flex-1 min-h-0 flex bg-[#F2F0ED] dark:bg-[#0A1210]">
          {/* Left: Live Tracker (lg+) */}
          <div className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[#D1E0D8]/40 dark:border-[#1E3228] bg-[#F8FAF9] dark:bg-[#121E18] overflow-y-auto">
            <LiveTrackerPanel
              liveResult={liveResult}
              surahNumber={session.surahNumber}
              ayahNumber={session.currentAyah}
              onPrevAyah={handlePreviousAyah}
              onNextAyah={handleNextAyah}
              onRetryAyah={handleRetryAyah}
              isFirstAyah={session.currentAyah <= session.startAyah}
              isLastAyah={session.currentAyah >= session.endAyah}
              isRecording={isRecording}
              autoAdvance={autoAdvance}
              onAutoAdvanceChange={setAutoAdvance}
            />
          </div>

          {/* Center: Mushaf page with overlay + action bar */}
          <main className="flex-1 min-w-0 flex flex-col">
            {/* Scrollable mushaf area */}
            <div className="flex-1 min-h-0 overflow-y-auto relative">
              {/* Desktop view */}
              <div className="hidden lg:block py-4 px-2">
                <MushafModePanel
                  surahNumber={session.surahNumber}
                  startAyah={session.startAyah}
                  endAyah={session.endAyah}
                  hideMode={session.hideMode}
                  hideDifficulty={session.hideDifficulty}
                  isHidden={session.isHidden}
                  comparisonResult={comparisonResult}
                  onCurrentAyahChange={handleMushafAyahChange}
                  showInlineControls={false}
                  liveCorrectKeys={confirmedResult.correctKeys}
                  liveMistakeKeys={confirmedResult.mistakeKeys}
                  liveCurrentKey={confirmedResult.currentKey}
                  isListening={isRecording}
                  liveMistakeDetails={confirmedResult.mistakeDetails}
                />
              </div>

              {/* Mobile view */}
              <div className="lg:hidden py-4 px-2">
                <MushafModePanel
                  surahNumber={session.surahNumber}
                  startAyah={session.startAyah}
                  endAyah={session.endAyah}
                  hideMode={session.hideMode}
                  hideDifficulty={session.hideDifficulty}
                  isHidden={session.isHidden}
                  comparisonResult={comparisonResult}
                  onCurrentAyahChange={handleMushafAyahChange}
                  showInlineControls
                  liveCorrectKeys={confirmedResult.correctKeys}
                  liveMistakeKeys={confirmedResult.mistakeKeys}
                  liveCurrentKey={confirmedResult.currentKey}
                  isListening={isRecording}
                  liveMistakeDetails={confirmedResult.mistakeDetails}
                />
              </div>
            </div>

            {/* Recitation Overlay — collapsible, above action bar */}
            {(finalText || interimText || isRecording) && (
              <div className="mx-2 lg:mx-4 -mb-1">
                <div className="bg-white/80 dark:bg-[#0F1A14]/80 backdrop-blur-md rounded-t-xl border border-b-0 border-[#D1E0D8]/60 dark:border-[#1E3228] shadow-lg">
                  {overlayCollapsed ? (
                    <button
                      className="w-full flex items-center gap-2 p-2 text-xs text-muted-foreground hover:bg-muted/30 transition-colors"
                      onClick={() => setOverlayCollapsed(false)}
                    >
                      <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                      <span
                        className="truncate text-right flex-1 font-arabic"
                        dir="rtl"
                      >
                        {finalText || interimText}
                      </span>
                    </button>
                  ) : (
                    <div className="relative">
                      <div className="max-h-24 overflow-y-auto p-3">
                        <RecitationTracker
                          interimText={interimText}
                          finalText={finalText}
                          isListening={isRecording}
                        />
                      </div>
                      <button
                        className="absolute top-1 left-1 p-0.5 rounded hover:bg-muted/50 text-muted-foreground"
                        onClick={() => setOverlayCollapsed(true)}
                        aria-label="Collapse overlay"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mushaf Action Bar — always at bottom */}
            <div
              className={`shrink-0 bg-white/90 dark:bg-[#0F1A14]/90 backdrop-blur-md border-t ${isRecording ? "border-t-red-400/50 border-t-2" : "border-[#D1E0D8]/40 dark:border-[#1E3228]"}`}
            >
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                <HideQuickToggles />
                <div className="w-px h-8 bg-[#D1E0D8]/60 dark:bg-[#1E3228] shrink-0" />
                <VoiceRecorder
                  onTranscript={gatedHandleTranscript}
                  onRecordingChange={setIsRecording}
                  onEngineChange={handleEngineChange}
                  disabled={!session.isActive}
                  compact
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={voiceReset}
                  disabled={!finalText}
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleCheckRecitation}
                  disabled={!finalText}
                >
                  Check
                </Button>
              </div>
            </div>
          </main>

          {/* Right: Sidebar (lg+) */}
          <MushafSidebar {...sidebarProps} />
        </div>
      ) : (
        /* ====== SINGLE-COLUMN LAYOUT (non-mushaf modes) ====== */
        <div className="flex-1 min-h-0 overflow-y-auto bg-[#F2F0ED] dark:bg-[#0A1210]">
          {/* Welcome state (no active session) */}
          {!session.isActive && <ModeWelcomeState mode={memorizeMode} />}

          {/* Active Session */}
          {session.isActive && (
            <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
              {/* Mode-specific verse display */}
              <AyahModePanel
                surahNumber={verse.currentSurahNumber}
                currentAyah={verse.currentAyahNumber}
                startAyah={navStartAyah}
                endAyah={navEndAyah}
                currentWords={verse.currentWords}
                hideMode={session.hideMode}
                hideDifficulty={session.hideDifficulty}
                isHidden={session.isHidden}
                revealedWords={session.revealedWords}
                comparisonResult={comparisonResult}
                previousVerse={verse.previousAyah?.text}
                nextVerse={verse.nextAyah?.text}
                onWordClick={(index) => session.revealWord(index)}
                onToggleHidden={session.toggleHidden}
                onPreviousAyah={handlePreviousAyah}
                onNextAyah={handleNextAyah}
                isCrossSurah={isCrossSurah}
                currentVerseIndex={session.currentVerseIndex}
                totalVerses={
                  isCrossSurah ? session.verseList.length : undefined
                }
              />

              {/* Voice Section */}
              <VoiceSection
                interimText={interimText}
                finalText={finalText}
                isRecording={isRecording}
                trackerWords={trackerWords}
                fluencyMetrics={fluencyMetrics}
                isActive={session.isActive}
                onTranscript={gatedHandleTranscript}
                onRecordingChange={setIsRecording}
                onEngineChange={handleEngineChange}
                onReset={voiceReset}
                onCheck={handleCheckRecitation}
              />

              {/* Mistake Details */}
              {comparisonResult && comparisonResult.mistakes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mistake Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MistakeList mistakes={comparisonResult.mistakes} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModeWelcomeState({ mode }: { mode: string }) {
  const descriptions: Record<
    string,
    { title: string; desc: string; steps: string[] }
  > = {
    mushaf: {
      title: "Mushaf Mode",
      desc: "Memorize from the Mushaf page layout — just like a physical copy.",
      steps: [
        "Select a page number in the toolbar above",
        "Press Start to begin your session",
        "Words will be hidden on the page — try to recall them",
        "Tap hidden words to peek, or use voice to recite",
      ],
    },
    ayah: {
      title: "Ayah Mode",
      desc: "Select a range of verses to practice one by one.",
      steps: [
        "Choose a surah and ayah range in the toolbar",
        "Press Start to begin memorizing",
        "Each verse appears individually — recite from memory",
        "Navigate between ayahs with arrow buttons",
      ],
    },
    surah: {
      title: "Surah Mode",
      desc: "Memorize an entire surah from start to finish.",
      steps: [
        "Select a surah from the dropdown above",
        "Press Start — all verses load automatically",
        "Work through the surah verse by verse",
        "Track your progress across the full surah",
      ],
    },
    juz: {
      title: "Juz Mode",
      desc: "Practice an entire juz (section) with cross-surah navigation.",
      steps: [
        "Select a juz number (1-30) from the toolbar",
        "Press Start to load all verses in the juz",
        "Navigate across surah boundaries seamlessly",
        "Great for khatm-style revision",
      ],
    },
    hizb: {
      title: "Hizb Mode",
      desc: "Smaller sections — each juz has 2 hizbs (60 total).",
      steps: [
        "Select a hizb number (1-60) from the toolbar",
        "Press Start to load the hizb verses",
        "Shorter than a full juz — perfect for daily revision",
        "Cross-surah navigation included",
      ],
    },
    subject: {
      title: "Subject Mode",
      desc: "Memorize themed verse collections — Du'a, Stories, Names of Allah, and more.",
      steps: [
        "Choose a theme from the dropdown above",
        "Press Start to load the themed verses",
        "Verses are from across the Quran — non-contiguous",
        "Learn verses connected by meaning, not just position",
      ],
    },
  };

  const info = descriptions[mode] ?? descriptions.ayah;

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">{info.title}</h2>
        <p className="text-sm text-muted-foreground">{info.desc}</p>
        <div className="text-left space-y-2 bg-white/60 dark:bg-white/5 rounded-lg p-4">
          {info.steps.map((step, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 text-[10px] font-medium text-[#059669] dark:text-[#00E5A0] mr-2">
                {i + 1}
              </span>
              {step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
