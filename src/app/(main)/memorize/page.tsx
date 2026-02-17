"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SURAH_NAMES } from "@/data/hizb-data";
import {
  useActiveSessions,
  useCompleteSession,
  useCreateSession,
  useDiscardSession as useDiscardSessionMutation,
  usePauseSession,
  useResumeSession as useResumeSessionMutation,
} from "@/hooks";

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
import { MemorizeToolbar } from "@/components/memorization/MemorizeToolbar";
import { MushafSidebarMobile } from "@/components/memorization/MushafSidebar";
import { SessionProgressBar } from "@/components/memorization/SessionProgressBar";

import { AyahCompletionCard } from "./_components/AyahCompletionCard";
import { AyahLayout } from "./_components/AyahLayout";
import { ComboOverlay } from "./_components/ComboOverlay";
import { FocusModeToggle } from "./_components/FocusModeToggle";
import { MidSessionNavigator } from "./_components/MidSessionNavigator";
import { MushafLayout } from "./_components/MushafLayout";
import {
  DBRecoveryDialog,
  LocalRecoveryDialog,
} from "./_components/RecoveryDialog";
import { SessionMap } from "./_components/SessionMap";
import { SessionSummaryEnhanced } from "./_components/SessionSummaryEnhanced";
import { SmartDashboard } from "./_components/SmartDashboard";
import { useComboSystem } from "./_hooks/use-combo-system";
import { useHapticFeedback } from "./_hooks/use-haptic-feedback";
import { computeLiveTracking } from "./_lib/live-tracking";

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

/** Module-level timestamp helper to avoid react-hooks/purity lint for Date.now() */
const timestamp = () => Date.now();

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
  const [autoStartMic, setAutoStartMic] = useState(false);

  // --- Session persistence: hydration + recovery ---
  const [hydrationChecked, setHydrationChecked] = useState(false);
  const [sessionRecovered, setSessionRecovered] = useState(false);
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
    const unsub = useSessionStore.persist.onFinishHydration(() => {
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
    });
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

  // For mushaf mode: the original text + word keys/texts come from the page data
  const mushafOriginalTextRef = useRef("");
  const [mushafOriginalText, setMushafOriginalText] = useState("");
  const [mushafWordKeys, setMushafWordKeys] = useState<string[]>([]);
  const [mushafWordTexts, setMushafWordTexts] = useState<string[]>([]);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const nextAyahFirstWordRef = useRef<string | null>(null);

  // Resolve current verse for non-mushaf modes
  const verse = useMemorizeVerse();

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
    surahNumber: session.surahNumber,
    ayahNumber: session.currentAyah,
    sensitivity: session.mistakeSensitivity,
    onComparisonResult: setComparisonResult,
  });

  // Combo + haptic systems
  const { registerCorrectAyah, resetCombo } = useComboSystem();
  const haptic = useHapticFeedback();
  const [comboState, setComboState] = useState({
    combo: 0,
    multiplier: 1,
    milestone: null as string | null,
  });
  const [sessionXP, setSessionXP] = useState(0);
  const [completionCard, setCompletionCard] = useState<{
    surah: number;
    ayah: number;
    accuracy: number;
    wordCount: number;
  } | null>(null);
  const ayahStartTimeRef = useRef(timestamp());

  // Gate transcript during ayah transitions
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

  // --- Session lifecycle handlers ---

  const handleStartSession = useCallback(
    (config: StartSessionConfig) => {
      session.startSession(config);
      setSessionSummary(null);
      setComparisonResult(null);
      setSessionRecovered(false);
      setDbRecoverySession(null);
      setCompletionCard(null);
      setSessionXP(0);
      setComboState({ combo: 0, multiplier: 1, milestone: null });
      resetCombo();
      ayahStartTimeRef.current = timestamp();
      resetVoice();

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
    [session, resetVoice, createSession, resetCombo]
  );

  const handleEndSession = useCallback(async () => {
    if (finalText) {
      await compareAndScore();
    }

    haptic.onSessionComplete();

    const activeSessionId = useSessionStore.getState().activeSessionId;
    const summary = session.endSession();
    if (summary) {
      setSessionSummary(summary);
      setCompletionCard(null);

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
          startAyah: summary.startAyah,
          endAyah: summary.endAyah,
        });
      };

      if (activeSessionId) {
        completeSessionMutation.mutate(
          {
            sessionId: activeSessionId,
            duration: summary.duration,
            accuracy: summary.accuracy,
            wordsRecited: summary.wordsRecited,
            mistakeCount: summary.mistakes.length,
            mistakes: mistakeData,
          },
          { onSuccess: onGamification, onError: () => onGamification() }
        );
      } else {
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
          { onSuccess: onGamification, onError: () => onGamification() }
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
    haptic,
  ]);

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
        onError: () => {
          // Session may already be completed/discarded — still clean up locally
          state.discardSession();
          router.push("/sessions");
        },
      }
    );
  }, [pauseSessionMutation, router]);

  // --- Navigation handlers ---

  const isCrossSurah = session.verseList.length > 0;
  const isMushafActive = memorizeMode === "mushaf" && session.isActive;

  // Mushaf word data
  const mushafOriginalWords = mushafWordTexts;
  const fullSpokenText = finalText + (interimText ? " " + interimText : "");

  // Live tracking results
  const liveResult = useMemo(
    () =>
      computeLiveTracking(mushafOriginalWords, mushafWordKeys, fullSpokenText),
    [mushafOriginalWords, mushafWordKeys, fullSpokenText]
  );

  const confirmedResult = useMemo(
    () => computeLiveTracking(mushafOriginalWords, mushafWordKeys, finalText),
    [mushafOriginalWords, mushafWordKeys, finalText]
  );

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
      // Non-mushaf: reset transition gate so voice input works on new ayah
      if (memorizeMode !== "mushaf") {
        isTransitioningRef.current = false;
      }
    } else {
      const nextAyahNum = Math.min(session.currentAyah + 1, session.endAyah);
      session.nextAyah();
      if (memorizeMode === "mushaf") {
        const currentState = useSessionStore.getState();
        const merged = new Set(currentState.revealedWordKeys);
        for (const k of confirmedResult.correctKeys) merged.add(k);
        const isLastOnPage = nextAyahFirstWordRef.current === null;
        const nextPage = getPageForAyah(session.surahNumber, nextAyahNum);
        if (isLastOnPage || nextPage > currentState.currentPageNumber) {
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
      } else {
        // Non-mushaf: reset transition gate so voice input works on new ayah
        isTransitioningRef.current = false;
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
      if (memorizeMode !== "mushaf") {
        isTransitioningRef.current = false;
      }
    } else {
      const prevAyahNum = Math.max(session.currentAyah - 1, session.startAyah);
      session.previousAyah();
      if (memorizeMode === "mushaf") {
        const currentState = useSessionStore.getState();
        const merged = new Set(currentState.revealedWordKeys);
        for (const k of confirmedResult.correctKeys) merged.add(k);
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
      } else {
        isTransitioningRef.current = false;
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
      useSessionStore.getState().setCurrentAyah(ayah);
      resetVoice();
      setComparisonResult(null);
      isTransitioningRef.current = false;
    },
    [resetVoice]
  );

  const handleRetryAyah = useCallback(() => {
    resetVoice();
    setComparisonResult(null);
  }, [resetVoice]);

  // Surah selection handler for sidebar
  const handleSurahSelect = useCallback(
    (surahNumber: number) => {
      if (session.isActive) {
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

  const voiceReset = useCallback(() => {
    resetVoice();
    setComparisonResult(null);
  }, [resetVoice]);

  const handleAyahRate = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      const key = `${session.surahNumber}:${session.currentAyah}`;
      session.setFSRSRating(key, rating);

      // Persist to server - fire and forget
      const attempt = session.ayahHistory[key];
      const accuracy =
        completionCard?.accuracy ??
        attempt?.lastAccuracy ??
        (rating >= 3 ? 90 : rating === 2 ? 60 : 30);
      fetch("/api/progress/srs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surahNumber: session.surahNumber,
          ayahNumber: session.currentAyah,
          accuracy,
          rating,
        }),
      }).catch(console.error);
    },
    [session, completionCard]
  );

  const handleCompletionNext = useCallback(() => {
    setCompletionCard(null);
    setComparisonResult(null);
    ayahStartTimeRef.current = timestamp();
    resetVoice();
    setAutoStartMic(true);
    handleNextAyahRef.current();
  }, [resetVoice]);

  const handleCompletionRetry = useCallback(() => {
    setCompletionCard(null);
    setComparisonResult(null);
    ayahStartTimeRef.current = timestamp();
    resetVoice();
  }, [resetVoice]);

  // Wrapper to clear autoStartMic once recording starts
  const handleRecordingChange = useCallback((recording: boolean) => {
    setIsRecording(recording);
    if (recording) setAutoStartMic(false);
  }, []);

  // Continue to next surah handler
  const handleContinueNextSurah = useCallback(() => {
    const nextSurah = session.surahNumber + 1;
    if (nextSurah > 114) return;
    const nextAyahCount = getAyahCount(nextSurah) || 7;

    setCompletionCard(null);
    setComparisonResult(null);
    resetVoice();
    ayahStartTimeRef.current = timestamp();

    session.navigateToVerse(nextSurah, 1);
    useSessionStore.setState({
      endAyah: nextAyahCount,
      startAyah: 1,
      ayahHistory: {},
      combo: 0,
    });
    setAutoStartMic(true);
  }, [session, resetVoice]);

  // --- Mid-session navigation handler ---
  const handleNavigateToVerse = useCallback(
    (surah: number, ayah: number) => {
      isTransitioningRef.current = true;
      muteUntilRef.current = timestamp() + 600;
      resetVoice();
      setComparisonResult(null);
      setCompletionCard(null);

      session.navigateToVerse(surah, ayah);

      // For mushaf mode: update page number
      if (memorizeMode === "mushaf") {
        const page = getPageForAyah(surah, ayah);
        useSessionStore.setState({
          currentPageNumber: page,
          mushafCurrentAyahKey: `${surah}:${ayah}`,
          revealedWordKeys: new Set<string>(),
        });
      } else {
        // Non-mushaf: reset transition gate so voice input works on new ayah
        isTransitioningRef.current = false;
      }
    },
    [session, resetVoice, memorizeMode]
  );

  // --- Ayah completion tracking + auto-advance ---

  const handleNextAyahRef = useRef(handleNextAyah);
  // eslint-disable-next-line react-hooks/immutability -- intentional ref-sync pattern for stable effect callback
  handleNextAyahRef.current = handleNextAyah;

  // Track ayah completion: record attempt, update combo, fire feedback
  // Works for BOTH mushaf mode (via confirmedResult) and non-mushaf modes (via comparisonResult)
  const ayahCompletionTrackedRef = useRef(false);

  // Derive completion state from either mode
  const isAyahComplete = isMushafActive
    ? confirmedResult.isComplete
    : comparisonResult !== null && session.isActive;
  const ayahAccuracy = isMushafActive
    ? confirmedResult.accuracy
    : (comparisonResult?.accuracy ?? 0);
  const ayahWordCount = isMushafActive
    ? confirmedResult.totalWords
    : (comparisonResult?.totalWords ?? 0);

  useEffect(() => {
    if (
      isAyahComplete &&
      !ayahCompletionTrackedRef.current &&
      session.isActive
    ) {
      ayahCompletionTrackedRef.current = true;
      const acc = ayahAccuracy;
      const timeMs = timestamp() - ayahStartTimeRef.current;
      const key = `${session.surahNumber}:${session.currentAyah}`;

      // Record in store
      session.recordAyahAttempt(key, acc, timeMs);

      // Combo + feedback
      const combo = registerCorrectAyah(acc);
      setComboState({
        combo: combo.combo,
        multiplier: combo.multiplier,
        milestone: combo.milestone,
      });

      // XP: base 10 per ayah * multiplier
      const xpGain = Math.round(10 * combo.multiplier);
      setSessionXP((prev) => prev + xpGain);

      // Haptic/sound
      if (acc >= 70) {
        haptic.onCorrectAyah();
        if (combo.milestone) haptic.onComboUp(combo.combo);
      } else {
        haptic.onMistake();
        if (combo.combo === 0) haptic.onComboBreak();
      }

      // Show completion card
      setCompletionCard({
        surah: session.surahNumber,
        ayah: session.currentAyah,
        accuracy: acc,
        wordCount: ayahWordCount,
      });
    }
    if (!isAyahComplete) {
      ayahCompletionTrackedRef.current = false;
    }
  }, [
    isAyahComplete,
    ayahAccuracy,
    ayahWordCount,
    session,
    registerCorrectAyah,
    haptic,
  ]);

  // Auto-advance (mushaf mode only): advance after completion with delay
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
      const timer = setTimeout(() => {
        setCompletionCard(null);
        ayahStartTimeRef.current = timestamp();
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

  // Auto-expand/collapse overlay
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

  // First-word trigger for next ayah
  const spokenText = fullSpokenText;
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
        if (extraWords.length > 0) {
          firstWordTriggeredRef.current = true;
          const timer = setTimeout(() => {
            handleNextAyahRef.current();
          }, 400);
          return () => clearTimeout(timer);
        }
        return;
      }

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

  // --- Peek auto-re-hide after 3s (improvement #3) ---
  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const prevIsHiddenRef = useRef(session.isHidden);
  useEffect(() => {
    const wasHidden = prevIsHiddenRef.current;
    prevIsHiddenRef.current = session.isHidden;

    // Detect transition from hidden → revealed (user peeked)
    if (wasHidden && !session.isHidden && !isRecording) {
      const timer = setTimeout(() => {
        // Only re-hide if still revealed and not recording
        const state = useSessionStore.getState();
        if (!state.isHidden && !isRecordingRef.current) {
          state.toggleHidden();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [session.isHidden, isRecording]);

  // --- Recovery dialog handlers ---

  const handleResumeSession = useCallback(() => {
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

  const handleDiscardFromDB = useCallback(() => {
    if (!dbRecoverySession) return;
    discardSessionMutation.mutate(dbRecoverySession.id);
    setDbRecoverySession(null);
  }, [dbRecoverySession, discardSessionMutation]);

  // --- Derived values ---

  const accuracy =
    session.wordsRecited > 0
      ? Math.round((session.correctWords / session.wordsRecited) * 100)
      : 0;

  const trackerWords =
    memorizeMode === "mushaf" ? mushafWordTexts : verse.currentWords;

  const navStartAyah = isCrossSurah ? 1 : session.startAyah;
  const navEndAyah = isCrossSurah ? session.verseList.length : session.endAyah;

  const totalAyahs = getAyahCount(session.surahNumber) || 7;
  const masteryPercent = Math.min(100, accuracy);
  const flowerStage = computeFlowerStage(masteryPercent, session.isActive);
  const season = computeSeason(accuracy);

  // ====== RENDER ======

  // DB Recovery Dialog
  if (dbRecoverySession && !session.isActive) {
    return (
      <DBRecoveryDialog
        memorizeMode={memorizeMode}
        onModeChange={setMemorizeMode}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        dbSession={dbRecoverySession}
        onResume={handleResumeFromDB}
        onDiscard={handleDiscardFromDB}
      />
    );
  }

  // LocalStorage Recovery Dialog
  if (sessionRecovered && hydrationChecked && session.isActive) {
    return (
      <LocalRecoveryDialog
        memorizeMode={memorizeMode}
        onModeChange={setMemorizeMode}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        session={session}
        onResume={handleResumeSession}
        onDiscard={handleDiscardSession}
      />
    );
  }

  // Session Summary
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
          <SessionSummaryEnhanced
            summary={sessionSummary}
            detectedMistakes={comparisonResult?.mistakes}
            sessionXP={sessionXP}
            maxCombo={sessionSummary.maxCombo}
            onClose={() => setSessionSummary(null)}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  // Main Layout
  const isFocusMode = session.isFocusMode;

  return (
    <div
      className={`flex flex-col -mt-14 lg:-mt-16 h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-4.125rem)] ${isFocusMode ? "bg-[#0A1210] dark:bg-[#0A1210]" : "bg-[#F8FAF9] dark:bg-[#121E18]"} transition-colors duration-500`}
    >
      {/* Compact Toolbar — fades in focus mode */}
      <div
        className={`transition-opacity duration-300 ${isFocusMode ? "opacity-30 hover:opacity-100" : ""}`}
      >
        <MemorizeToolbar
          memorizeMode={memorizeMode}
          onModeChange={setMemorizeMode}
          isActive={session.isActive}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
          onSaveAndExit={
            session.activeSessionId ? handleSaveAndExit : undefined
          }
          extraActions={
            session.isActive ? (
              <>
                <FocusModeToggle />
                <MidSessionNavigator
                  currentSurah={session.surahNumber}
                  currentAyah={session.currentAyah}
                  onNavigate={handleNavigateToVerse}
                />
                {isMushafActive && (
                  <MushafSidebarMobile
                    surahNumber={session.surahNumber}
                    onSurahSelect={handleSurahSelect}
                    sessionAccuracy={accuracy}
                    masteryPercent={masteryPercent}
                    season={season}
                    flowerStage={flowerStage}
                    totalAyahs={totalAyahs}
                    bloomingAyahs={[]}
                  />
                )}
              </>
            ) : undefined
          }
        />
      </div>

      {/* Progress bar — hidden in focus mode */}
      {session.isActive && !isFocusMode && (
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

      {/* Ayah map — clickable visual timeline (hidden in focus mode) */}
      {session.isActive && !isFocusMode && (
        <SessionMap
          currentSurah={session.surahNumber}
          currentAyah={session.currentAyah}
          startAyah={session.startAyah}
          endAyah={session.endAyah}
          verseList={session.verseList}
          currentVerseIndex={session.currentVerseIndex}
          ayahHistory={session.ayahHistory}
          bookmarkedAyahs={session.bookmarkedAyahs}
          onNavigate={handleNavigateToVerse}
        />
      )}

      {/* Combo overlay — floating badge */}
      {session.isActive && (
        <ComboOverlay
          combo={comboState.combo}
          multiplier={comboState.multiplier}
          milestone={comboState.milestone}
          sessionXP={sessionXP}
        />
      )}

      {/* Ayah completion card — appears between map and content */}
      {completionCard && (
        <AyahCompletionCard
          surahNumber={completionCard.surah}
          ayahNumber={completionCard.ayah}
          accuracy={completionCard.accuracy}
          wordCount={completionCard.wordCount}
          comboCount={comboState.combo}
          multiplier={comboState.multiplier}
          onRate={handleAyahRate}
          onRetry={handleCompletionRetry}
          onNext={handleCompletionNext}
          isLastAyah={
            isCrossSurah
              ? session.currentVerseIndex >= session.verseList.length - 1
              : session.currentAyah >= session.endAyah
          }
          onFinishSession={handleEndSession}
          onContinueNextSurah={
            !isCrossSurah && session.surahNumber < 114
              ? handleContinueNextSurah
              : undefined
          }
          nextSurahName={
            !isCrossSurah && session.surahNumber < 114
              ? (SURAH_NAMES[session.surahNumber + 1] ?? undefined)
              : undefined
          }
        />
      )}

      {/* Content area */}
      {isMushafActive ? (
        <MushafLayout
          surahNumber={session.surahNumber}
          currentAyah={session.currentAyah}
          startAyah={session.startAyah}
          endAyah={session.endAyah}
          hideMode={session.hideMode}
          hideDifficulty={session.hideDifficulty}
          isHidden={session.isHidden}
          isActive={session.isActive}
          activeSessionId={session.activeSessionId}
          liveResult={liveResult}
          confirmedResult={confirmedResult}
          isRecording={isRecording}
          interimText={interimText}
          finalText={finalText}
          overlayCollapsed={overlayCollapsed}
          autoStartMic={autoStartMic}
          onOverlayCollapse={setOverlayCollapsed}
          onTranscript={gatedHandleTranscript}
          onRecordingChange={handleRecordingChange}
          onEngineChange={handleEngineChange}
          onVoiceReset={voiceReset}
          onCheckRecitation={handleCheckRecitation}
          onPrevAyah={handlePreviousAyah}
          onNextAyah={handleNextAyah}
          onRetryAyah={handleRetryAyah}
          autoAdvance={autoAdvance}
          onAutoAdvanceChange={setAutoAdvance}
          comparisonResult={comparisonResult}
          onMushafAyahChange={handleMushafAyahChange}
          onSurahSelect={handleSurahSelect}
          sessionAccuracy={accuracy}
          masteryPercent={masteryPercent}
          season={season}
          flowerStage={flowerStage}
          totalAyahs={totalAyahs}
        />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto bg-[#F2F0ED] dark:bg-[#0A1210]">
          {!session.isActive && (
            <SmartDashboard
              mode={memorizeMode}
              onStartSession={handleStartSession}
            />
          )}

          {session.isActive && (
            <AyahLayout
              currentSurahNumber={verse.currentSurahNumber}
              currentAyahNumber={verse.currentAyahNumber}
              currentWords={verse.currentWords}
              currentText={verse.currentText}
              previousVerse={verse.previousAyah?.text}
              nextVerse={verse.nextAyah?.text}
              startAyah={navStartAyah}
              endAyah={navEndAyah}
              hideMode={session.hideMode}
              hideDifficulty={session.hideDifficulty}
              isHidden={session.isHidden}
              revealedWords={session.revealedWords}
              comparisonResult={comparisonResult}
              isCrossSurah={isCrossSurah}
              currentVerseIndex={session.currentVerseIndex}
              totalVerses={isCrossSurah ? session.verseList.length : undefined}
              interimText={interimText}
              finalText={finalText}
              isRecording={isRecording}
              trackerWords={trackerWords}
              fluencyMetrics={fluencyMetrics}
              isActive={session.isActive}
              autoStartMic={autoStartMic}
              onTranscript={gatedHandleTranscript}
              onRecordingChange={handleRecordingChange}
              onEngineChange={handleEngineChange}
              onVoiceReset={voiceReset}
              onCheckRecitation={handleCheckRecitation}
              onPrevAyah={handlePreviousAyah}
              onNextAyah={handleNextAyah}
              onWordClick={(index) => session.revealWord(index)}
              onToggleHidden={session.toggleHidden}
            />
          )}
        </div>
      )}
    </div>
  );
}
