"use client";

import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import type { RevealMode } from "@/stores/sessionStore";
import { Button } from "@/components/ui/button";

interface ProgressiveRevealProps {
  words: string[];
  revealMode: RevealMode;
  onRevealProgress: (revealedCount: number, totalWords: number) => void;
  className?: string;
}

export function ProgressiveReveal({
  words,
  revealMode,
  onRevealProgress,
  className,
}: ProgressiveRevealProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  const getStepSize = useCallback(() => {
    switch (revealMode) {
      case "word":
        return 1;
      case "phrase":
        return 3;
      case "ayah":
        return words.length;
      case "line":
        return Math.min(8, words.length);
      default:
        return 1;
    }
  }, [revealMode, words.length]);

  const revealNext = () => {
    const step = getStepSize();
    const newCount = Math.min(revealedCount + step, words.length);
    setRevealedCount(newCount);
    onRevealProgress(newCount, words.length);
  };

  const revealAll = () => {
    setRevealedCount(words.length);
    onRevealProgress(words.length, words.length);
  };

  const hideAll = () => {
    setRevealedCount(0);
    onRevealProgress(0, words.length);
  };

  const isFullyRevealed = revealedCount >= words.length;
  const progress = words.length > 0 ? (revealedCount / words.length) * 100 : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {revealedCount} / {words.length} words
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-green-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Words display */}
      <div
        className="flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose"
        dir="rtl"
      >
        {words.map((word, index) => {
          const isRevealed = index < revealedCount;
          return (
            <span
              key={index}
              className={cn(
                "rounded-lg px-2 py-1 transition-all duration-500",
                isRevealed ? "opacity-100" : "bg-muted/60 opacity-0 select-none"
              )}
            >
              {isRevealed ? word : "\u00A0".repeat(word.length)}
            </span>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={hideAll}
          disabled={revealedCount === 0}
        >
          Hide All
        </Button>
        <Button size="sm" onClick={revealNext} disabled={isFullyRevealed}>
          Reveal{" "}
          {revealMode === "word"
            ? "Word"
            : revealMode === "phrase"
              ? "Phrase"
              : revealMode === "line"
                ? "Line"
                : "All"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={revealAll}
          disabled={isFullyRevealed}
        >
          Show All
        </Button>
      </div>
    </div>
  );
}
