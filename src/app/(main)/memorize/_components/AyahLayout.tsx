"use client";

import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import type { useVoiceRecognition } from "@/hooks/use-voice-recognition";
import type { HideMode } from "@/stores/sessionStore";
import { AyahModePanel } from "@/components/memorization/AyahModePanel";
import { MistakeList } from "@/components/memorization/MistakeHighlight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EngineType } from "@/components/voice/VoiceRecorder";

import { VoiceSection } from "./VoiceSection";

interface AyahLayoutProps {
  // Verse data
  currentSurahNumber: number;
  currentAyahNumber: number;
  currentWords: string[];
  currentText: string;
  previousVerse?: string;
  nextVerse?: string;

  // Session
  startAyah: number;
  endAyah: number;
  hideMode: HideMode;
  hideDifficulty: number;
  isHidden: boolean;
  revealedWords: number[];
  comparisonResult: ComparisonResult | null;
  isCrossSurah: boolean;
  currentVerseIndex: number;
  totalVerses?: number;

  // Voice
  interimText: string;
  finalText: string;
  isRecording: boolean;
  trackerWords: string[];
  fluencyMetrics: ReturnType<typeof useVoiceRecognition>["fluencyMetrics"];
  isActive: boolean;
  /** Auto-start mic on next ayah */
  autoStartMic?: boolean;
  onTranscript: (text: string, isFinal: boolean) => void;
  onRecordingChange: (recording: boolean) => void;
  onEngineChange: (engine: EngineType) => void;
  onVoiceReset: () => void;
  onCheckRecitation: () => void;

  // Navigation
  onPrevAyah: () => void;
  onNextAyah: () => void;
  onWordClick: (index: number) => void;
  onToggleHidden: () => void;
}

export function AyahLayout({
  currentSurahNumber,
  currentAyahNumber,
  currentWords,
  previousVerse,
  nextVerse,
  startAyah,
  endAyah,
  hideMode,
  hideDifficulty,
  isHidden,
  revealedWords,
  comparisonResult,
  isCrossSurah,
  currentVerseIndex,
  totalVerses,
  interimText,
  finalText,
  isRecording,
  trackerWords,
  fluencyMetrics,
  isActive,
  autoStartMic,
  onTranscript,
  onRecordingChange,
  onEngineChange,
  onVoiceReset,
  onCheckRecitation,
  onPrevAyah,
  onNextAyah,
  onWordClick,
  onToggleHidden,
}: AyahLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Mode-specific verse display */}
      <AyahModePanel
        surahNumber={currentSurahNumber}
        currentAyah={currentAyahNumber}
        startAyah={startAyah}
        endAyah={endAyah}
        currentWords={currentWords}
        hideMode={hideMode}
        hideDifficulty={hideDifficulty}
        isHidden={isHidden}
        revealedWords={revealedWords}
        comparisonResult={comparisonResult}
        previousVerse={previousVerse}
        nextVerse={nextVerse}
        onWordClick={onWordClick}
        onToggleHidden={onToggleHidden}
        onPreviousAyah={onPrevAyah}
        onNextAyah={onNextAyah}
        isCrossSurah={isCrossSurah}
        currentVerseIndex={currentVerseIndex}
        totalVerses={totalVerses}
      />

      {/* Voice Section */}
      <VoiceSection
        interimText={interimText}
        finalText={finalText}
        isRecording={isRecording}
        trackerWords={trackerWords}
        fluencyMetrics={fluencyMetrics}
        isActive={isActive}
        recorderKey={`${currentSurahNumber}:${currentAyahNumber}`}
        autoStart={autoStartMic}
        onTranscript={onTranscript}
        onRecordingChange={onRecordingChange}
        onEngineChange={onEngineChange}
        onReset={onVoiceReset}
        onCheck={onCheckRecitation}
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
  );
}
