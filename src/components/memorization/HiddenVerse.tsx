"use client";

import { cn } from "@/lib/utils";

interface HiddenVerseProps {
  words: string[];
  revealedIndices: number[];
  isHidden: boolean;
  onWordClick: (index: number) => void;
  wordResults?: {
    status: "correct" | "wrong" | "skipped" | "tashkeel" | "pending";
  }[];
  className?: string;
}

const statusColors: Record<string, string> = {
  correct:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  wrong: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  skipped:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  tashkeel:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  pending: "",
};

export function HiddenVerse({
  words,
  revealedIndices,
  isHidden,
  onWordClick,
  wordResults,
  className,
}: HiddenVerseProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose",
        className
      )}
      dir="rtl"
    >
      {words.map((word, index) => {
        const isRevealed = !isHidden || revealedIndices.includes(index);
        const result = wordResults?.[index];
        const statusColor = result ? statusColors[result.status] : "";

        return (
          <button
            key={index}
            onClick={() => onWordClick(index)}
            className={cn(
              "rounded-lg px-2 py-1 transition-all duration-200",
              isRevealed
                ? cn("cursor-default", statusColor || "hover:bg-accent")
                : "cursor-pointer bg-muted/80 hover:bg-muted",
              !isRevealed && "select-none"
            )}
            aria-label={
              isRevealed
                ? `Word: ${word}`
                : `Hidden word ${index + 1}, tap to reveal`
            }
          >
            <span
              className={cn(
                "inline-block transition-all duration-300",
                !isRevealed && "blur-md opacity-30 select-none"
              )}
              aria-hidden={!isRevealed}
            >
              {word}
            </span>
          </button>
        );
      })}
    </div>
  );
}
