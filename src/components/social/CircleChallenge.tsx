"use client";

import { Clock, Target, Trophy } from "lucide-react";

import type { CircleChallengeItem } from "@/hooks/use-circles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CircleChallengeProps {
  challenge: CircleChallengeItem;
}

function getTimeRemaining(endDate: string): string {
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h left`;
  }
  if (diffHours > 0) {
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${diffHours}h ${diffMinutes}m left`;
  }
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes}m left`;
}

function getChallengeTypeLabel(type: string): string {
  switch (type) {
    case "collective_recite":
      return "Collective Recitation";
    case "accuracy":
      return "Accuracy Challenge";
    case "streak":
      return "Streak Challenge";
    default:
      return "Challenge";
  }
}

function getTargetLabel(target: Record<string, unknown>): string {
  const parts: string[] = [];
  if (target.surahNumber) {
    parts.push(`Surah ${target.surahNumber}`);
  }
  if (target.totalVerses) {
    parts.push(`${target.totalVerses} verses`);
  }
  if (target.targetAccuracy) {
    parts.push(`${target.targetAccuracy}% accuracy`);
  }
  if (target.targetStreak) {
    parts.push(`${target.targetStreak}-day streak`);
  }
  return parts.length > 0 ? parts.join(" / ") : "Complete the challenge";
}

export function CircleChallenge({ challenge }: CircleChallengeProps) {
  const timeRemaining = getTimeRemaining(challenge.endDate);
  const isEnded = timeRemaining === "Ended";
  const targetTotal = (challenge.target as Record<string, unknown>)
    .totalVerses as number | undefined;
  const progressPercent = targetTotal
    ? Math.min(Math.round((challenge.progress / targetTotal) * 100), 100)
    : challenge.progress;

  return (
    <Card className={isEnded ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {getChallengeTypeLabel(challenge.type)}
              </span>
            </div>
            <CardTitle className="text-base">{challenge.title}</CardTitle>
            {challenge.description && (
              <CardDescription className="mt-1">
                {challenge.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Target info */}
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>
            {getTargetLabel(challenge.target as Record<string, unknown>)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {challenge.progress}
              {targetTotal ? ` / ${targetTotal}` : ""} ({progressPercent}%)
            </span>
          </div>
          <Progress value={progressPercent} />
        </div>
      </CardContent>
    </Card>
  );
}
