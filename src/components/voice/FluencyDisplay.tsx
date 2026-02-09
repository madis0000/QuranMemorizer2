"use client";

import type { FluencyMetrics } from "@/lib/speech/fluency";
import { cn } from "@/lib/utils";

// ===== Types =====

interface FluencyDisplayProps {
  metrics: FluencyMetrics | null;
  isActive: boolean;
  className?: string;
}

// ===== Helpers =====

/**
 * Map a fluency score (0--100) to a qualitative label and colour class.
 */
function getScoreDisplay(score: number): { label: string; colorClass: string } {
  if (score >= 80)
    return {
      label: "Excellent",
      colorClass: "text-green-600 dark:text-green-400",
    };
  if (score >= 60)
    return { label: "Good", colorClass: "text-blue-600 dark:text-blue-400" };
  if (score >= 40)
    return {
      label: "Fair",
      colorClass: "text-yellow-600 dark:text-yellow-400",
    };
  if (score >= 20)
    return {
      label: "Needs work",
      colorClass: "text-orange-600 dark:text-orange-400",
    };
  return { label: "Keep trying", colorClass: "text-red-600 dark:text-red-400" };
}

/**
 * Compute the SVG stroke-dashoffset for a circular gauge.
 * Circumference is based on a radius of 28 (the gauge circle).
 */
const GAUGE_RADIUS = 28;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function gaugeOffset(score: number): number {
  const clampedScore = Math.max(0, Math.min(100, score));
  return GAUGE_CIRCUMFERENCE * (1 - clampedScore / 100);
}

// ===== Component =====

export function FluencyDisplay({
  metrics,
  isActive,
  className,
}: FluencyDisplayProps) {
  if (!metrics && !isActive) return null;

  const score = metrics?.fluencyScore ?? 0;
  const wpm = metrics?.wordsPerMinute ?? 0;
  const pauseCount = metrics?.pauseCount ?? 0;
  const { label: scoreLabel, colorClass: scoreColor } = getScoreDisplay(score);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors",
        isActive
          ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10"
          : "border-border bg-muted/30",
        className
      )}
    >
      {/* Fluency score gauge */}
      <div className="relative flex-shrink-0">
        <svg
          width="68"
          height="68"
          viewBox="0 0 68 68"
          className="-rotate-90"
          aria-label={`Fluency score: ${score}`}
        >
          {/* Background circle */}
          <circle
            cx="34"
            cy="34"
            r={GAUGE_RADIUS}
            fill="none"
            strokeWidth="5"
            className="stroke-muted"
          />
          {/* Score arc */}
          <circle
            cx="34"
            cy="34"
            r={GAUGE_RADIUS}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={GAUGE_CIRCUMFERENCE}
            strokeDashoffset={gaugeOffset(score)}
            className={cn(
              "transition-all duration-500",
              score >= 60
                ? "stroke-green-500"
                : score >= 30
                  ? "stroke-yellow-500"
                  : "stroke-red-500"
            )}
          />
        </svg>
        {/* Score number in centre */}
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
          {score}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-sm font-semibold", scoreColor)}>
            {scoreLabel}
          </span>
          {isActive && (
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
          )}
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground">
          {/* WPM */}
          <div className="flex items-center gap-1">
            <span className="font-medium tabular-nums">{wpm}</span>
            <span>WPM</span>
          </div>

          {/* Pause count */}
          <div className="flex items-center gap-1">
            <span className="font-medium tabular-nums">{pauseCount}</span>
            <span>{pauseCount === 1 ? "pause" : "pauses"}</span>
          </div>

          {/* Longest pause */}
          {metrics && metrics.longestPause > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium tabular-nums">
                {(metrics.longestPause / 1000).toFixed(1)}s
              </span>
              <span>longest</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
