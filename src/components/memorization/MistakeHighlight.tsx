"use client";

import type {
  DetectedMistake,
  WordResult,
} from "@/lib/memorization/mistakeDetector";
import { cn } from "@/lib/utils";

interface MistakeHighlightProps {
  wordResults: WordResult[];
  className?: string;
}

const statusStyles: Record<string, { bg: string; label: string }> = {
  correct: {
    bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700",
    label: "Correct",
  },
  wrong: {
    bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700",
    label: "Wrong word",
  },
  skipped: {
    bg: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700",
    label: "Skipped",
  },
  tashkeel: {
    bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
    label: "Diacritical error",
  },
};

export function MistakeHighlight({
  wordResults,
  className,
}: MistakeHighlightProps) {
  if (wordResults.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Color-coded verse display */}
      <div
        className="flex flex-wrap justify-center gap-1.5 font-arabic text-2xl leading-loose"
        dir="rtl"
      >
        {wordResults.map((result, index) => {
          const style = statusStyles[result.status] ?? statusStyles.correct;
          return (
            <span
              key={index}
              className={cn(
                "rounded border px-2 py-0.5 transition-colors",
                style.bg
              )}
              title={`${style.label}${result.recitedWord && result.status !== "correct" ? ` — You said: ${result.recitedWord}` : ""}`}
            >
              {result.originalWord}
            </span>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        {Object.entries(statusStyles).map(([key, style]) => (
          <span key={key} className="flex items-center gap-1">
            <span className={cn("inline-block h-3 w-3 rounded", style.bg)} />
            {style.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface MistakeListProps {
  mistakes: DetectedMistake[];
  className?: string;
}

export function MistakeList({ mistakes, className }: MistakeListProps) {
  if (mistakes.length === 0) return null;

  const majorMistakes = mistakes.filter((m) => m.severity === "major");
  const minorMistakes = mistakes.filter((m) => m.severity === "minor");

  return (
    <div className={cn("space-y-2", className)}>
      {majorMistakes.length > 0 && (
        <div>
          <h4 className="mb-1 text-sm font-medium text-red-600 dark:text-red-400">
            Major Mistakes ({majorMistakes.length})
          </h4>
          <ul className="space-y-1">
            {majorMistakes.map((mistake, i) => (
              <li
                key={i}
                className="rounded-md bg-red-50 px-3 py-1.5 text-sm dark:bg-red-900/20"
              >
                <span className="font-medium capitalize">
                  {mistake.type.replace("_", " ")}
                </span>
                {" at word "}
                <span className="font-arabic">{mistake.correctText}</span>
                {mistake.recitedText && (
                  <>
                    {" — you said: "}
                    <span className="font-arabic">{mistake.recitedText}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {minorMistakes.length > 0 && (
        <div>
          <h4 className="mb-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
            Minor Mistakes ({minorMistakes.length})
          </h4>
          <ul className="space-y-1">
            {minorMistakes.map((mistake, i) => (
              <li
                key={i}
                className="rounded-md bg-yellow-50 px-3 py-1.5 text-sm dark:bg-yellow-900/20"
              >
                <span className="font-medium capitalize">
                  {mistake.type.replace("_", " ")}
                </span>
                {" at word "}
                <span className="font-arabic">{mistake.correctText}</span>
                {mistake.recitedText && (
                  <>
                    {" — you said: "}
                    <span className="font-arabic">{mistake.recitedText}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
