"use client";

import { cn } from "@/lib/utils";

interface RecitationTrackerProps {
  interimText: string;
  finalText: string;
  isListening: boolean;
  className?: string;
}

export function RecitationTracker({
  interimText,
  finalText,
  isListening,
  className,
}: RecitationTrackerProps) {
  const hasText = finalText || interimText;

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
      </div>

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
            {finalText && <span className="text-foreground">{finalText} </span>}
            {interimText && (
              <span className="text-muted-foreground/70">{interimText}</span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground/50 text-base">
            {isListening
              ? "Start reciting the verse..."
              : "Press the microphone button to begin"}
          </span>
        )}
      </div>
    </div>
  );
}
