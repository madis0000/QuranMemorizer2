"use client";

import { Clock, Loader2, Star, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { useDailyChallenge } from "@/hooks/use-challenges";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

interface DailyChallengeProps {
  onStart?: (challengeId: string) => void;
}

export function DailyChallenge({ onStart }: DailyChallengeProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useDailyChallenge();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/5 to-[#B8860B]/5 p-6">
        <Loader2 className="w-6 h-6 animate-spin text-[#B8860B] dark:text-[#FFD700] mx-auto" />
      </div>
    );
  }

  const challenge = data?.challenge;
  if (!challenge) return null;

  const config = challenge.config as Record<string, number | undefined>;
  const userAttempt = challenge.attempts?.[0];
  const completed = userAttempt?.completed;

  return (
    <div className="rounded-xl border border-[#FFD700]/30 dark:border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/5 to-[#B8860B]/5 dark:from-[#FFD700]/5 dark:to-transparent p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#B8860B] dark:text-[#FFD700]" />
          <span className="text-sm font-semibold text-[#B8860B] dark:text-[#FFD700]">
            {t("challenges.daily")}
          </span>
        </div>
        {completed && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= (userAttempt?.stars ?? 0)
                    ? "text-[#FFD700] fill-[#FFD700]"
                    : "text-[#D1E0D8] dark:text-[#00E5A0]/20"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Challenge Info */}
      <div>
        <h3 className="text-lg font-bold">{challenge.title}</h3>
        {challenge.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {challenge.description}
          </p>
        )}
      </div>

      {/* Config details */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {config.timeLimit && (
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{Math.floor(config.timeLimit / 60)}min</span>
          </div>
        )}
        {config.verseCount && <span>{config.verseCount} verses</span>}
        {config.accuracyThreshold && (
          <span>{config.accuracyThreshold}%+ accuracy</span>
        )}
        <span className="text-[#B8860B] dark:text-[#FFD700] font-medium">
          +{challenge.xpReward} XP
        </span>
      </div>

      {/* Action */}
      {completed ? (
        <div className="text-center py-2">
          <p className="text-sm font-medium text-[#059669] dark:text-[#00E5A0]">
            {t("challenges.completed")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("challenges.best_score")}: {userAttempt.score}
          </p>
        </div>
      ) : (
        <Button
          onClick={() => onStart?.(challenge.id)}
          className="w-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] hover:from-[#8B6914] hover:to-[#B8860B] text-white dark:text-[#0F1A14] font-semibold"
        >
          {t("challenges.start")}
        </Button>
      )}
    </div>
  );
}
