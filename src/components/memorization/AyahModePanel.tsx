"use client";

import { SURAH_NAMES } from "@/data/hizb-data";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import type { HideMode } from "@/stores/sessionStore";
import { MistakeHighlight } from "@/components/memorization/MistakeHighlight";
import { ProgressiveHideModes } from "@/components/memorization/ProgressiveHideModes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AyahModePanelProps {
  surahNumber: number;
  currentAyah: number;
  startAyah: number;
  endAyah: number;
  currentWords: string[];
  hideMode: HideMode;
  hideDifficulty: number;
  isHidden: boolean;
  revealedWords: number[];
  comparisonResult: ComparisonResult | null;
  previousVerse?: string;
  nextVerse?: string;
  onWordClick: (index: number) => void;
  onToggleHidden: () => void;
  onPreviousAyah: () => void;
  onNextAyah: () => void;
  /** Cross-surah navigation (juz/hizb/subject) */
  isCrossSurah?: boolean;
  currentVerseIndex?: number;
  totalVerses?: number;
}

export function AyahModePanel({
  surahNumber,
  currentAyah,
  startAyah,
  endAyah,
  currentWords,
  hideMode,
  hideDifficulty,
  isHidden,
  revealedWords,
  comparisonResult,
  previousVerse,
  nextVerse,
  onWordClick,
  onToggleHidden,
  onPreviousAyah,
  onNextAyah,
  isCrossSurah,
  currentVerseIndex,
  totalVerses,
}: AyahModePanelProps) {
  const surahName = SURAH_NAMES[surahNumber] ?? `Surah ${surahNumber}`;

  // For cross-surah: disable based on verseIndex, otherwise based on ayah range
  const isPrevDisabled = isCrossSurah
    ? (currentVerseIndex ?? 0) <= 0
    : currentAyah <= startAyah;
  const isNextDisabled = isCrossSurah
    ? (currentVerseIndex ?? 0) >= (totalVerses ?? 1) - 1
    : currentAyah >= endAyah;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm">
            {isCrossSurah ? (
              <>
                {surahName} : Ayah {currentAyah}
              </>
            ) : (
              <>
                Surah {surahNumber} : Ayah {currentAyah}
              </>
            )}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPreviousAyah}
              disabled={isPrevDisabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleHidden}>
              {isHidden ? (
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
              onClick={onNextAyah}
              disabled={isNextDisabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comparisonResult ? (
          <MistakeHighlight wordResults={comparisonResult.wordResults} />
        ) : (
          <ProgressiveHideModes
            words={currentWords}
            hideMode={hideMode}
            hideDifficulty={hideDifficulty}
            revealedIndices={revealedWords}
            isHidden={isHidden}
            onWordClick={onWordClick}
            translation={undefined}
            previousVerse={previousVerse}
            nextVerse={nextVerse}
            onPlayAudio={() => {
              // TODO: Implement audio playback with audio store
            }}
            verseKey={`${surahNumber}:${currentAyah}`}
          />
        )}

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
  );
}
