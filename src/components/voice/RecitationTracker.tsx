"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

// ===== Types =====

export type WordTrackingStatus =
  | "pending"
  | "current"
  | "correct"
  | "incorrect"
  | "skipped";

interface RecitationTrackerProps {
  interimText: string;
  finalText: string;
  isListening: boolean;
  /** The original verse words to track against (optional for backward compat). */
  originalWords?: string[];
  className?: string;
}

// ===== Helpers =====

/**
 * Remove common Arabic diacritics (tashkeel) for loose comparison.
 */
function stripDiacritics(text: string): string {
  // Unicode range for Arabic diacritical marks: 0x064B - 0x065F, plus tatweel 0x0640
  return text.replace(/[\u064B-\u065F\u0640\u0670]/g, "");
}

/**
 * Determine the tracking status for each original word given the recognised text.
 * Words in finalText are compared; the first unmatched word in interimText
 * is marked as "current".
 */
function computeWordStatuses(
  originalWords: string[],
  finalText: string,
  interimText: string
): WordTrackingStatus[] {
  const statuses: WordTrackingStatus[] = new Array<WordTrackingStatus>(
    originalWords.length
  ).fill("pending");

  // Split the recited text into words
  const finalWords = finalText.split(/\s+/).filter((w) => w.length > 0);
  const interimWords = interimText.split(/\s+/).filter((w) => w.length > 0);

  // Walk through original words and match against final words
  let recitedIdx = 0;
  let wordIdx = 0;

  while (wordIdx < originalWords.length && recitedIdx < finalWords.length) {
    const origStripped = stripDiacritics(originalWords[wordIdx]);
    const recStripped = stripDiacritics(finalWords[recitedIdx]);

    if (origStripped === recStripped) {
      statuses[wordIdx] = "correct";
      recitedIdx++;
      wordIdx++;
    } else {
      // Check if the recited word matches a later original word (skip detection)
      const lookAhead = findNextMatch(
        originalWords,
        wordIdx + 1,
        finalWords[recitedIdx]
      );

      if (lookAhead >= 0) {
        // Mark skipped words
        for (let s = wordIdx; s < lookAhead; s++) {
          statuses[s] = "skipped";
        }
        statuses[lookAhead] = "correct";
        wordIdx = lookAhead + 1;
        recitedIdx++;
      } else {
        // The recited word doesn't match: mark as incorrect
        statuses[wordIdx] = "incorrect";
        wordIdx++;
        recitedIdx++;
      }
    }
  }

  // Mark the "current" word: the first pending word if we have interim text
  if (interimWords.length > 0) {
    const firstPending = statuses.indexOf("pending");
    if (firstPending >= 0) {
      statuses[firstPending] = "current";
    }
  }

  return statuses;
}

/**
 * Look ahead in originalWords starting from `fromIdx` to find a match for `recitedWord`.
 * Returns the index if found within a small window, or -1.
 */
function findNextMatch(
  originalWords: string[],
  fromIdx: number,
  recitedWord: string
): number {
  const maxLookAhead = 3;
  const stripped = stripDiacritics(recitedWord);
  const limit = Math.min(fromIdx + maxLookAhead, originalWords.length);

  for (let i = fromIdx; i < limit; i++) {
    if (stripDiacritics(originalWords[i]) === stripped) {
      return i;
    }
  }
  return -1;
}

// ===== Style maps =====

const STATUS_CLASSES: Record<WordTrackingStatus, string> = {
  pending: "text-muted-foreground/40",
  current: "text-blue-600 dark:text-blue-400 font-semibold animate-pulse",
  correct: "text-green-600 dark:text-green-400",
  incorrect: "text-red-600 dark:text-red-400 underline decoration-wavy",
  skipped: "text-orange-500 dark:text-orange-400 line-through",
};

// ===== Component =====

export function RecitationTracker({
  interimText,
  finalText,
  isListening,
  originalWords,
  className,
}: RecitationTrackerProps) {
  const hasText = finalText || interimText;
  const hasWordTracking =
    originalWords !== undefined && originalWords.length > 0;

  const wordStatuses = useMemo(() => {
    if (!hasWordTracking) return [];
    return computeWordStatuses(originalWords, finalText, interimText);
  }, [hasWordTracking, originalWords, finalText, interimText]);

  // Progress calculation
  const resolvedCount = wordStatuses.filter(
    (s) => s === "correct" || s === "incorrect" || s === "skipped"
  ).length;
  const totalCount = originalWords?.length ?? 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Your Recitation</h4>
        {isListening && (
          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Listening
          </span>
        )}
        {hasWordTracking && resolvedCount > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {resolvedCount} / {totalCount} words
          </span>
        )}
      </div>

      {/* Word-level tracking view */}
      {hasWordTracking && (
        <div
          className={cn(
            "min-h-[60px] rounded-lg border p-3 font-arabic text-xl leading-loose transition-colors",
            isListening
              ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10"
              : "border-border bg-muted/30"
          )}
          dir="rtl"
          aria-live="polite"
          aria-label="Word-level recitation tracking"
        >
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {originalWords.map((word, idx) => (
              <span
                key={`${idx}-${word}`}
                className={cn(
                  "inline-block rounded px-1 py-0.5 transition-colors",
                  STATUS_CLASSES[wordStatuses[idx] ?? "pending"]
                )}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Transcript fallback (when no originalWords provided) */}
      {!hasWordTracking && (
        <div
          className={cn(
            "min-h-[60px] rounded-lg border p-3 font-arabic text-xl leading-relaxed transition-colors",
            isListening
              ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/10"
              : "border-border bg-muted/30"
          )}
          dir="rtl"
          aria-live="polite"
          aria-label="Recitation transcript"
        >
          {hasText ? (
            <>
              {finalText && (
                <span className="text-foreground">{finalText} </span>
              )}
              {interimText && (
                <span className="text-muted-foreground/70">{interimText}</span>
              )}
            </>
          ) : (
            <span className="text-base text-muted-foreground/50">
              {isListening
                ? "Start reciting the verse..."
                : "Press the microphone button to begin"}
            </span>
          )}
        </div>
      )}

      {/* Progress bar (word tracking mode) */}
      {hasWordTracking && totalCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${Math.round((resolvedCount / totalCount) * 100)}%`,
              }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {Math.round((resolvedCount / totalCount) * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
