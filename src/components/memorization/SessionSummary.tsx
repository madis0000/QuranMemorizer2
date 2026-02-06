"use client";

import type { DetectedMistake } from "@/lib/memorization/mistakeDetector";
import { cn } from "@/lib/utils";
import type { SessionSummary as SessionSummaryType } from "@/stores/sessionStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MistakeList } from "./MistakeHighlight";

interface SessionSummaryProps {
  summary: SessionSummaryType;
  detectedMistakes?: DetectedMistake[];
  onClose: () => void;
  onRetry: () => void;
  className?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function getGrade(accuracy: number): {
  label: string;
  color: string;
  emoji: string;
} {
  if (accuracy >= 95)
    return { label: "Excellent", color: "text-green-600", emoji: "🌟" };
  if (accuracy >= 85)
    return { label: "Great", color: "text-green-500", emoji: "✨" };
  if (accuracy >= 70)
    return { label: "Good", color: "text-yellow-500", emoji: "👍" };
  if (accuracy >= 50)
    return { label: "Keep Practicing", color: "text-orange-500", emoji: "💪" };
  return { label: "Needs Work", color: "text-red-500", emoji: "📖" };
}

export function SessionSummary({
  summary,
  detectedMistakes = [],
  onClose,
  onRetry,
  className,
}: SessionSummaryProps) {
  const grade = getGrade(summary.accuracy);
  const modeLabels: Record<string, string> = {
    read: "Reading",
    memorize: "Memorization",
    listen: "Listening",
    review: "Review",
  };

  return (
    <Card className={cn("mx-auto max-w-lg", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 text-4xl">{grade.emoji}</div>
        <CardTitle className="text-xl">Session Complete</CardTitle>
        <p className={cn("text-lg font-semibold", grade.color)}>
          {grade.label}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Accuracy" value={`${summary.accuracy}%`} />
          <StatCard label="Duration" value={formatDuration(summary.duration)} />
          <StatCard
            label="Words Recited"
            value={summary.wordsRecited.toString()}
          />
          <StatCard
            label="Correct Words"
            value={summary.correctWords.toString()}
          />
        </div>

        {/* Session Info */}
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode</span>
            <span className="font-medium">
              {modeLabels[summary.mode] ?? summary.mode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Surah</span>
            <span className="font-medium">
              {summary.surahNumber}:{summary.startAyah}-{summary.endAyah}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mistakes</span>
            <span className="font-medium">{summary.mistakes.length}</span>
          </div>
        </div>

        {/* Mistakes Detail */}
        {detectedMistakes.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium">Mistake Details</h4>
            <MistakeList mistakes={detectedMistakes} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Done
        </Button>
        <Button className="flex-1" onClick={onRetry}>
          Practice Again
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
