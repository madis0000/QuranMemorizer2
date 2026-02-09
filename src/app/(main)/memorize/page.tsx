"use client";

import { useCallback, useState } from "react";
import { useAyahs, useCreateSession } from "@/hooks";
import type { Ayah } from "@/types/quran";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Settings2,
  Square,
} from "lucide-react";

import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import { usePostSessionGamification } from "@/hooks/use-gamification";
import { useVoiceRecognition } from "@/hooks/use-voice-recognition";
import {
  useSessionStore,
  type HideMode,
  type MistakeSensitivity,
  type RevealMode,
  type SessionSummary as SessionSummaryType,
} from "@/stores/sessionStore";
import {
  MistakeHighlight,
  MistakeList,
} from "@/components/memorization/MistakeHighlight";
import { ProgressiveHideModes } from "@/components/memorization/ProgressiveHideModes";
import { SessionSummary } from "@/components/memorization/SessionSummary";
import { SurahAyahPicker } from "@/components/memorization/SurahAyahPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { FluencyDisplay } from "@/components/voice/FluencyDisplay";
import { RecitationTracker } from "@/components/voice/RecitationTracker";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";

export default function MemorizePage() {
  const session = useSessionStore();
  const createSession = useCreateSession();
  const { processSession } = usePostSessionGamification();

  const [showPicker, setShowPicker] = useState(true);
  const [sessionSummary, setSessionSummary] =
    useState<SessionSummaryType | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Fetch ayahs for current session
  const { data: ayahsData } = useAyahs(
    session.isActive ? session.surahNumber : 0
  );
  const ayahs: Ayah[] = ayahsData ?? [];

  // Get current ayah and surrounding ayahs for context_recall mode
  const currentAyah = ayahs.find(
    (a) => a.numberInSurah === session.currentAyah
  );
  const previousAyah = ayahs.find(
    (a) => a.numberInSurah === session.currentAyah - 1
  );
  const nextAyah = ayahs.find(
    (a) => a.numberInSurah === session.currentAyah + 1
  );
  const currentWords = currentAyah?.text?.split(/\s+/).filter(Boolean) ?? [];
  const currentText = currentAyah?.text ?? "";

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
    originalText: currentText,
    sensitivity: session.mistakeSensitivity,
    onComparisonResult: setComparisonResult,
  });

  const handleStartSession = (
    surahNumber: number,
    startAyah: number,
    endAyah: number
  ) => {
    session.startSession("memorize", surahNumber, startAyah, endAyah);
    setShowPicker(false);
    setSessionSummary(null);
    setComparisonResult(null);
    resetVoice();
  };

  const handleEndSession = useCallback(async () => {
    // Compare what was recited before ending
    if (finalText) {
      await compareAndScore();
    }

    const summary = session.endSession();
    if (summary) {
      setSessionSummary(summary);

      // Persist to server
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
          mistakes: summary.mistakes.map((m) => ({
            surahNumber: m.surahNumber,
            ayahNumber: m.ayahNumber,
            wordIndex: m.wordIndex,
            type: m.type.toUpperCase(),
            recitedText: m.recitedText ?? undefined,
            correctText: m.correctText,
            severity: m.severity.toUpperCase(),
          })),
        },
        {
          onSuccess: () => {
            processSession({
              versesRecited: summary.endAyah - summary.startAyah + 1,
              accuracy: summary.accuracy,
              duration: summary.duration,
              surahNumber: summary.surahNumber,
            });
          },
        }
      );
    }
  }, [finalText, compareAndScore, session, createSession, processSession]);

  const handleNextAyah = async () => {
    // Compare current ayah before moving
    if (finalText) {
      await compareAndScore();
    }
    resetVoice();
    setComparisonResult(null);
    session.nextAyah();
  };

  const handlePreviousAyah = () => {
    resetVoice();
    setComparisonResult(null);
    session.previousAyah();
  };

  const handleCheckRecitation = async () => {
    await compareAndScore();
  };

  const handleRetry = () => {
    setSessionSummary(null);
    setComparisonResult(null);
    resetVoice();
    setShowPicker(true);
  };

  const accuracy =
    session.wordsRecited > 0
      ? Math.round((session.correctWords / session.wordsRecited) * 100)
      : 0;

  // Show session summary
  if (sessionSummary) {
    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <SessionSummary
            summary={sessionSummary}
            detectedMistakes={comparisonResult?.mistakes}
            onClose={() => {
              setSessionSummary(null);
              setShowPicker(true);
            }}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Brain className="h-6 w-6 text-primary" />
              Memorization Mode
            </h1>
            <p className="text-muted-foreground">
              Practice and test your Quran memorization
            </p>
          </div>

          <div className="flex items-center gap-2">
            {session.isActive && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="max-h-[500px] overflow-y-auto"
                >
                  <DropdownMenuLabel>Hide Mode</DropdownMenuLabel>
                  {(
                    [
                      { value: "full_hide", label: "Full Hide" },
                      { value: "first_letter", label: "First Letter" },
                      { value: "random_blank", label: "Random Blank" },
                      { value: "keyword_mode", label: "Keywords Only" },
                      {
                        value: "translation_recall",
                        label: "Translation Recall",
                      },
                      { value: "context_recall", label: "Context Recall" },
                      { value: "reverse_recall", label: "Reverse Recall" },
                      { value: "audio_recall", label: "Audio Recall" },
                    ] as { value: HideMode; label: string }[]
                  ).map((mode) => (
                    <DropdownMenuItem
                      key={mode.value}
                      onClick={() => session.setHideMode(mode.value)}
                      className={
                        session.hideMode === mode.value ? "font-semibold" : ""
                      }
                    >
                      {mode.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />

                  {session.hideMode === "random_blank" && (
                    <>
                      <DropdownMenuLabel>
                        Difficulty (Random Blank)
                      </DropdownMenuLabel>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <DropdownMenuItem
                          key={level}
                          onClick={() => session.setHideDifficulty(level)}
                          className={
                            session.hideDifficulty === level
                              ? "font-semibold"
                              : ""
                          }
                        >
                          Level {level} ({level * 20}% hidden)
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuLabel>Reveal Mode</DropdownMenuLabel>
                  {(["word", "phrase", "ayah", "line"] as RevealMode[]).map(
                    (mode) => (
                      <DropdownMenuItem
                        key={mode}
                        onClick={() => session.setRevealMode(mode)}
                        className={
                          session.revealMode === mode ? "font-semibold" : ""
                        }
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </DropdownMenuItem>
                    )
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sensitivity</DropdownMenuLabel>
                  {(
                    ["strict", "normal", "lenient"] as MistakeSensitivity[]
                  ).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => session.setMistakeSensitivity(s)}
                      className={
                        session.mistakeSensitivity === s ? "font-semibold" : ""
                      }
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!session.isActive ? (
              <Button onClick={() => setShowPicker(true)}>
                <Play className="mr-2 h-4 w-4" />
                Start Session
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleEndSession}>
                <Square className="mr-2 h-4 w-4" />
                End Session
              </Button>
            )}
          </div>
        </div>

        {/* Surah Picker (when not in session) */}
        {!session.isActive && showPicker && (
          <SurahAyahPicker
            onSelect={handleStartSession}
            defaultSurah={session.surahNumber}
            defaultStartAyah={session.startAyah}
            defaultEndAyah={session.endAyah}
          />
        )}

        {/* Active Session */}
        {session.isActive && (
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardContent className="py-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Session Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {accuracy}% Accuracy
                  </span>
                </div>
                <Progress value={accuracy} className="h-2" />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>
                    Ayah {session.currentAyah} of {session.startAyah}-
                    {session.endAyah}
                  </span>
                  <span>
                    {session.wordsRecited} words | {session.correctWords}{" "}
                    correct
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Verse Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Surah {session.surahNumber} : Ayah {session.currentAyah}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviousAyah}
                      disabled={session.currentAyah <= session.startAyah}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={session.toggleHidden}
                    >
                      {session.isHidden ? (
                        <>
                          <Eye className="mr-1 h-4 w-4" />
                          Peek
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-4 w-4" />
                          Hide
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextAyah}
                      disabled={session.currentAyah >= session.endAyah}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hidden Verse / Mistake Highlight */}
                {comparisonResult ? (
                  <MistakeHighlight
                    wordResults={comparisonResult.wordResults}
                  />
                ) : (
                  <ProgressiveHideModes
                    words={currentWords}
                    hideMode={session.hideMode}
                    hideDifficulty={session.hideDifficulty}
                    revealedIndices={session.revealedWords}
                    isHidden={session.isHidden}
                    onWordClick={(index) => session.revealWord(index)}
                    translation={undefined} // TODO: Fetch translation using useTranslation hook
                    previousVerse={previousAyah?.text}
                    nextVerse={nextAyah?.text}
                    onPlayAudio={() => {
                      // TODO: Implement audio playback with audio store
                      console.log(
                        "Play audio for ayah:",
                        currentAyah?.numberInSurah
                      );
                    }}
                    verseKey={`${session.surahNumber}:${session.currentAyah}`}
                  />
                )}

                {/* Comparison Stats */}
                {comparisonResult && (
                  <div className="flex justify-center gap-4 text-sm">
                    <span className="text-[#059669] dark:text-[#00E5A0]">
                      {comparisonResult.correctWords} correct
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      {comparisonResult.mistakes.length} mistakes
                    </span>
                    <span className="font-medium">
                      {comparisonResult.accuracy}% accuracy
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Voice Section */}
            <Card>
              <CardContent className="space-y-4 py-6">
                {/* Recitation Tracker */}
                <RecitationTracker
                  interimText={interimText}
                  finalText={finalText}
                  isListening={isRecording}
                  originalWords={currentWords}
                />

                {/* Fluency Metrics */}
                <FluencyDisplay
                  metrics={fluencyMetrics}
                  isActive={isRecording}
                />

                {/* Voice Recorder */}
                <VoiceRecorder
                  onTranscript={handleTranscript}
                  onRecordingChange={setIsRecording}
                  onEngineChange={handleEngineChange}
                  disabled={!session.isActive}
                />

                {/* Action Buttons */}
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetVoice();
                      setComparisonResult(null);
                    }}
                    disabled={!finalText}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={handleCheckRecitation} disabled={!finalText}>
                    Check Recitation
                  </Button>
                </div>
              </CardContent>
            </Card>

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

        {/* Instructions (when no session and picker is hidden) */}
        {!session.isActive && !showPicker && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                1. Click &quot;Start Session&quot; to select verses to memorize
              </p>
              <p>2. The verse will be hidden - try to recite from memory</p>
              <p>3. Tap on hidden words to peek if you need help</p>
              <p>4. Press the microphone to record your recitation</p>
              <p>5. Click &quot;Check Recitation&quot; to see your accuracy</p>
              <p>6. Navigate between ayahs with the arrow buttons</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
