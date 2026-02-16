"use client";

import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Mic,
  MicOff,
  RefreshCw,
  Zap,
} from "lucide-react";

import { AyahPlayButton } from "@/components/audio/AyahPlayButton";
import { Button } from "@/components/ui/button";

import type { LiveTrackingResult } from "../_lib/live-tracking";

interface LiveTrackerPanelProps {
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
}

export function LiveTrackerPanel({
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
}: LiveTrackerPanelProps) {
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
