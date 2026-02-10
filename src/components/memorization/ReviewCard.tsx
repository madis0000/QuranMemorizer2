"use client";

import { BookOpen } from "lucide-react";

import { getRetrievability } from "@/lib/memorization/srs";
import { cn } from "@/lib/utils";
import type { SRSCardResponse } from "@/hooks/use-srs";
import { useTranslation } from "@/hooks/use-translation";

const STATE_LABELS: Record<number, { label: string; color: string }> = {
  0: {
    label: "New",
    color:
      "bg-[#059669]/15 text-[#059669] dark:bg-[#00E5A0]/15 dark:text-[#00E5A0]",
  },
  1: {
    label: "Learning",
    color:
      "bg-[#0d9488]/15 text-[#0d9488] dark:bg-[#2dd4bf]/15 dark:text-[#2dd4bf]",
  },
  2: {
    label: "Review",
    color:
      "bg-[#065f46]/15 text-[#065f46] dark:bg-[#34d399]/15 dark:text-[#34d399]",
  },
  3: {
    label: "Relearning",
    color:
      "bg-[#FFD700]/15 text-[#B8860B] dark:bg-[#FFD700]/15 dark:text-[#FFD700]",
  },
};

interface ReviewCardProps {
  card: SRSCardResponse;
  verseText?: string;
  className?: string;
}

export function ReviewCard({ card, verseText, className }: ReviewCardProps) {
  const { t } = useTranslation();
  const stateInfo = STATE_LABELS[card.state] ?? STATE_LABELS[0];

  // Build an SRSCard-compatible object for retrievability
  const retrievability = getRetrievability({
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
  });

  return (
    <div
      className={cn(
        "rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-6 backdrop-blur-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#059669] dark:text-[#00E5A0]" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("review.surah")} {card.surahNumber}:{card.ayahNumber}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            stateInfo.color
          )}
        >
          {stateInfo.label}
        </span>
      </div>

      {/* Verse Text */}
      <div
        className="text-2xl leading-loose font-amiri text-center py-8 px-4"
        dir="rtl"
        lang="ar"
      >
        {verseText || (
          <span className="text-muted-foreground text-base italic">
            {t("review.loading_verse")}
          </span>
        )}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-[#D1E0D8]/50 dark:border-[#00E5A0]/5">
        <div className="flex items-center gap-4">
          <span>
            {t("review.stability")}: {card.stability.toFixed(1)}d
          </span>
          <span>
            {t("review.difficulty")}: {(card.difficulty * 10).toFixed(0)}/100
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{t("review.retention")}:</span>
          <div className="w-16 h-1.5 bg-[#D1E0D8] dark:bg-[#00E5A0]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#059669] dark:bg-[#00E5A0] rounded-full transition-all"
              style={{ width: `${Math.min(retrievability, 100)}%` }}
            />
          </div>
          <span>{retrievability}%</span>
        </div>
      </div>

      {/* Category badge */}
      {card.category && (
        <div className="mt-3 flex justify-center">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0] capitalize">
            {card.category}
          </span>
        </div>
      )}
    </div>
  );
}
