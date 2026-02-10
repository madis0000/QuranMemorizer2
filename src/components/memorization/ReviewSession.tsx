"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  useDueCards,
  useReviewCard,
  type SRSCardResponse,
} from "@/hooks/use-srs";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";

import { RatingButtons } from "./RatingButtons";
import { ReviewCard } from "./ReviewCard";

interface ReviewSessionProps {
  category?: string;
  verseTexts?: Record<string, string>;
}

export function ReviewSession({ category, verseTexts }: ReviewSessionProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useDueCards(category);
  const reviewMutation = useReviewCard();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [sessionComplete, setSessionComplete] = useState(false);

  const cards = data?.cards ?? [];
  const remainingCards = cards.filter(
    (c) => !reviewed.has(`${c.surahNumber}:${c.ayahNumber}`)
  );
  const currentCard = remainingCards[currentIndex] as
    | SRSCardResponse
    | undefined;
  const totalDue = cards.length;
  const reviewedCount = reviewed.size;

  const handleRate = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      if (!currentCard) return;

      // Map rating to approximate accuracy for the PATCH endpoint
      const accuracyMap: Record<number, number> = {
        1: 30,
        2: 60,
        3: 80,
        4: 95,
      };

      reviewMutation.mutate(
        {
          surahNumber: currentCard.surahNumber,
          ayahNumber: currentCard.ayahNumber,
          accuracy: accuracyMap[rating],
        },
        {
          onSuccess: () => {
            const key = `${currentCard.surahNumber}:${currentCard.ayahNumber}`;
            setReviewed((prev) => new Set(prev).add(key));

            if (reviewedCount + 1 >= totalDue) {
              setSessionComplete(true);
            } else {
              setCurrentIndex((prev) =>
                prev >= remainingCards.length - 2 ? 0 : prev
              );
            }
          },
        }
      );
    },
    [
      currentCard,
      reviewMutation,
      reviewedCount,
      totalDue,
      remainingCards.length,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669] dark:text-[#00E5A0]" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
          <span className="text-2xl">&#x2714;</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{t("review.all_done")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("review.no_cards_due")}
        </p>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
          <span className="text-3xl">&#x1F31F;</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {t("review.session_complete")}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {t("review.cards_reviewed")}: {reviewedCount}
        </p>
        <Button
          onClick={() => {
            setSessionComplete(false);
            setReviewed(new Set());
            setCurrentIndex(0);
          }}
          className="bg-[#059669] hover:bg-[#047857] text-white dark:bg-[#00E5A0] dark:hover:bg-[#00E5A0]/80 dark:text-[#0F1A14]"
        >
          {t("review.review_more")}
        </Button>
      </div>
    );
  }

  const verseKey = currentCard
    ? `${currentCard.surahNumber}:${currentCard.ayahNumber}`
    : "";

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {reviewedCount} / {totalDue} {t("review.reviewed")}
          </span>
          <span>
            {remainingCards.length} {t("review.remaining")}
          </span>
        </div>
        <div className="h-2 bg-[#D1E0D8] dark:bg-[#00E5A0]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#059669] dark:bg-[#00E5A0] rounded-full transition-all duration-500"
            style={{
              width:
                totalDue > 0 ? `${(reviewedCount / totalDue) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2">
        {["all", "sabaq", "sabqi", "manzil"].map((cat) => (
          <button
            key={cat}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize",
              (category ?? "all") === cat
                ? "bg-[#059669]/15 text-[#059669] dark:bg-[#00E5A0]/15 dark:text-[#00E5A0]"
                : "text-muted-foreground hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5"
            )}
          >
            {cat === "all" ? t("review.all") : cat}
          </button>
        ))}
      </div>

      {/* Card */}
      {currentCard && (
        <>
          <ReviewCard card={currentCard} verseText={verseTexts?.[verseKey]} />

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {remainingCards.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(remainingCards.length - 1, prev + 1)
                )
              }
              disabled={currentIndex >= remainingCards.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Rating Buttons */}
          <RatingButtons
            card={currentCard}
            onRate={handleRate}
            disabled={reviewMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
