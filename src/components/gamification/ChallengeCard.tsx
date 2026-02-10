"use client";

import { Clock, Star, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

const TYPE_ICONS: Record<string, { color: string; bg: string }> = {
  speed: {
    color: "text-[#059669] dark:text-[#00E5A0]",
    bg: "bg-[#059669]/10 dark:bg-[#00E5A0]/10",
  },
  accuracy: {
    color: "text-[#0d9488] dark:text-[#2dd4bf]",
    bg: "bg-[#0d9488]/10 dark:bg-[#2dd4bf]/10",
  },
  endurance: {
    color: "text-[#065f46] dark:text-[#34d399]",
    bg: "bg-[#065f46]/10 dark:bg-[#34d399]/10",
  },
  random_verse: {
    color: "text-[#B8860B] dark:text-[#FFD700]",
    bg: "bg-[#FFD700]/10",
  },
  daily: { color: "text-[#B8860B] dark:text-[#FFD700]", bg: "bg-[#FFD700]/10" },
};

interface ChallengeCardProps {
  challenge: {
    id: string;
    type: string;
    title: string;
    description?: string | null;
    config: Record<string, number | undefined>;
    xpReward: number;
    attempts?: Array<{ score: number; stars: number; completed: boolean }>;
  };
  onStart?: (id: string) => void;
}

export function ChallengeCard({ challenge, onStart }: ChallengeCardProps) {
  const { t } = useTranslation();
  const typeStyle = TYPE_ICONS[challenge.type] ?? TYPE_ICONS.speed;
  const bestAttempt = challenge.attempts?.[0];

  return (
    <div className="rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-5 backdrop-blur-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              typeStyle.bg
            )}
          >
            <Zap className={cn("w-4 h-4", typeStyle.color)} />
          </div>
          <div>
            <h4 className="text-sm font-semibold">{challenge.title}</h4>
            <span className={cn("text-xs capitalize", typeStyle.color)}>
              {challenge.type.replace("_", " ")}
            </span>
          </div>
        </div>
        <span className="text-xs font-medium text-[#B8860B] dark:text-[#FFD700]">
          +{challenge.xpReward} XP
        </span>
      </div>

      {/* Description */}
      {challenge.description && (
        <p className="text-xs text-muted-foreground">{challenge.description}</p>
      )}

      {/* Config tags */}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {challenge.config.timeLimit && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D1E0D8]/50 dark:bg-[#00E5A0]/5">
            <Clock className="w-3 h-3" />
            <span>{Math.floor(challenge.config.timeLimit / 60)}min</span>
          </div>
        )}
        {challenge.config.verseCount && (
          <span className="px-2 py-0.5 rounded-full bg-[#D1E0D8]/50 dark:bg-[#00E5A0]/5">
            {challenge.config.verseCount} verses
          </span>
        )}
      </div>

      {/* Best score / action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#D1E0D8]/50 dark:border-[#00E5A0]/5">
        {bestAttempt ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "w-3.5 h-3.5",
                    s <= bestAttempt.stars
                      ? "text-[#FFD700] fill-[#FFD700]"
                      : "text-[#D1E0D8] dark:text-[#00E5A0]/20"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {t("challenges.best_score")}: {bestAttempt.score}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not attempted</span>
        )}
        <Button
          size="sm"
          onClick={() => onStart?.(challenge.id)}
          className="bg-[#059669] hover:bg-[#047857] text-white dark:bg-[#00E5A0] dark:hover:bg-[#00E5A0]/80 dark:text-[#0F1A14] text-xs"
        >
          {t("challenges.start")}
        </Button>
      </div>
    </div>
  );
}
