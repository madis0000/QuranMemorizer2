"use client";

import { Suspense } from "react";
import { RotateCcw } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";
import { ReviewSession } from "@/components/memorization/ReviewSession";
import { ReviewStats } from "@/components/memorization/ReviewStats";

export default function ReviewPage() {
  const { t } = useTranslation();

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-[#059669] dark:text-[#00E5A0]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("review.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("review.subtitle")}
          </p>
        </div>
      </div>

      {/* Stats */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-[#D1E0D8]/30 dark:bg-[#00E5A0]/5 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <ReviewStats />
      </Suspense>

      {/* Review Session */}
      <Suspense
        fallback={
          <div className="h-64 rounded-xl bg-[#D1E0D8]/30 dark:bg-[#00E5A0]/5 animate-pulse" />
        }
      >
        <ReviewSession />
      </Suspense>
    </div>
  );
}
