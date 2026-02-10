"use client";

import { useMemo } from "react";

import { getSchedulingOptions } from "@/lib/memorization/srs";
import { cn } from "@/lib/utils";
import type { SRSCardResponse } from "@/hooks/use-srs";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

interface RatingButtonsProps {
  card: SRSCardResponse;
  onRate: (rating: 1 | 2 | 3 | 4) => void;
  disabled?: boolean;
}

const RATING_CONFIG = [
  {
    rating: 1 as const,
    key: "again",
    label: "Again",
    color: "bg-red-500 hover:bg-red-600 text-white",
  },
  {
    rating: 2 as const,
    key: "hard",
    label: "Hard",
    color: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  {
    rating: 3 as const,
    key: "good",
    label: "Good",
    color:
      "bg-[#059669] hover:bg-[#047857] text-white dark:bg-[#00E5A0] dark:hover:bg-[#00E5A0]/80 dark:text-[#0F1A14]",
  },
  {
    rating: 4 as const,
    key: "easy",
    label: "Easy",
    color: "bg-[#00E5A0] hover:bg-[#00E5A0]/80 text-[#0F1A14]",
  },
] as const;

function formatInterval(days: number): string {
  if (days < 1) {
    const minutes = Math.round(days * 24 * 60);
    return minutes <= 1 ? "<1m" : `${minutes}m`;
  }
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

export function RatingButtons({ card, onRate, disabled }: RatingButtonsProps) {
  const { t } = useTranslation();

  const options = useMemo(() => {
    const srsCard = {
      id: card.id,
      surahNumber: card.surahNumber,
      ayahNumber: card.ayahNumber,
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: card.elapsed_days,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      last_review: card.last_review,
      totalReviews: card.totalReviews,
      averageAccuracy: card.averageAccuracy,
      category: card.category,
    };
    return getSchedulingOptions(srsCard);
  }, [card]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {RATING_CONFIG.map(({ rating, key, label, color }) => {
        const interval = options ? options[key].interval : 0;
        return (
          <Button
            key={rating}
            onClick={() => onRate(rating)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-1 py-3 h-auto rounded-lg font-medium",
              color
            )}
          >
            <span className="text-sm">{t(`review.${key}`) || label}</span>
            {options && (
              <span className="text-xs opacity-80">
                {formatInterval(interval)}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
