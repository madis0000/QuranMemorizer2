"use client";

import { useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Mic,
  MicOff,
  RefreshCw,
} from "lucide-react";

import { useSessionStore } from "@/stores/sessionStore";
import { AyahPlayButton } from "@/components/audio/AyahPlayButton";
import { Button } from "@/components/ui/button";

import type { LiveTrackingResult } from "../_lib/live-tracking";

interface LiveTrackerBarProps {
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

export function LiveTrackerBar({
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
}: LiveTrackerBarProps) {
  const isFocusMode = useSessionStore((s) => s.isFocusMode);
  const dotsRef = useRef<HTMLDivElement>(null);

  const {
    wordStates,
    progress,
    accuracy,
    wordsCompleted,
    totalWords,
    streak,
    isComplete,
  } = liveResult;

  // Auto-scroll word dots to the current word
  useEffect(() => {
    if (!dotsRef.current) return;
    const currentIdx = wordStates.findIndex((ws) => ws.status === "current");
    if (currentIdx < 0) return;
    const dot = dotsRef.current.children[currentIdx] as HTMLElement | undefined;
    dot?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [wordStates]);

  if (isFocusMode) return null;

  const wrongCount = isComplete
    ? wordStates.filter((ws) => ws.status === "wrong").length
    : 0;

  const accuracyColor =
    accuracy >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : accuracy >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="shrink-0 border-b border-[#D1E0D8]/40 dark:border-[#1E3228] bg-[#F8FAF9]/80 dark:bg-[#121E18]/80 backdrop-blur-sm px-3 py-1">
      {/* Row 1: Nav + Word dots + Stats + Actions */}
      <div className="flex items-center gap-2 h-7">
        {/* Ayah nav cluster */}
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onPrevAyah}
            disabled={isFirstAyah}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-semibold tabular-nums whitespace-nowrap">
            {surahNumber}:{ayahNumber}
          </span>
          <AyahPlayButton
            surahNumber={surahNumber}
            ayahNumber={ayahNumber}
            className="h-5 w-5"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onNextAyah}
            disabled={isLastAyah}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-[#D1E0D8]/60 dark:bg-[#1E3228] shrink-0" />

        {/* Word progress dots — horizontal scroll */}
        <div
          ref={dotsRef}
          className="flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto scrollbar-none"
        >
          {wordStates.map((ws, i) => (
            <div
              key={i}
              className={`h-2 rounded-full shrink-0 transition-all duration-300 ${
                ws.status === "correct"
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : ws.status === "wrong"
                    ? "bg-red-500 dark:bg-red-400 animate-pulse"
                    : ws.status === "current"
                      ? "bg-primary/60 animate-pulse ring-2 ring-primary/30"
                      : "bg-muted-foreground/20"
              }`}
              style={{
                width: `${Math.max(6, Math.min(16, ws.originalWord.length * 2))}px`,
              }}
              title={
                ws.status === "correct" || ws.status === "wrong"
                  ? ws.originalWord
                  : "???"
              }
            />
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-[#D1E0D8]/60 dark:bg-[#1E3228] shrink-0" />

        {/* Stats + actions cluster */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-xs font-bold tabular-nums ${accuracyColor}`}>
            {accuracy}%
          </span>
          {streak > 0 && (
            <span className="hidden sm:flex items-center gap-0.5 text-xs font-semibold tabular-nums text-orange-500">
              <Flame className="h-3 w-3" />
              {streak}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRetryAyah}
            title="Retry ayah"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <label className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => onAutoAdvanceChange(e.target.checked)}
              className="rounded border-muted-foreground/30 h-3 w-3"
            />
            Auto
          </label>
        </div>
      </div>

      {/* Row 2: Mic status + progress bar + completion hint (only when tracking) */}
      {totalWords > 0 && (
        <div className="flex items-center gap-2 h-4 mt-0.5">
          {/* Mic indicator */}
          <div
            className={`flex items-center gap-1 text-[10px] shrink-0 ${
              isRecording ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {isRecording ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <Mic className="h-2.5 w-2.5" />
              </>
            ) : (
              <MicOff className="h-2.5 w-2.5" />
            )}
          </div>

          {/* Progress bar */}
          <div className="flex-1 min-w-0 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-primary to-emerald-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress text or completion message */}
          <span className="text-[10px] tabular-nums text-muted-foreground shrink-0 whitespace-nowrap">
            {isComplete ? (
              <span
                className={`font-semibold ${
                  accuracy >= 90
                    ? "text-emerald-600 dark:text-emerald-400"
                    : accuracy >= 70
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {accuracy >= 90
                  ? "Excellent!"
                  : accuracy >= 70
                    ? "Good!"
                    : `${wrongCount} wrong`}
              </span>
            ) : (
              `${wordsCompleted}/${totalWords}`
            )}
          </span>
        </div>
      )}
    </div>
  );
}
