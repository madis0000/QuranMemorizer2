"use client";

import { Suspense } from "react";
import { Flower2 } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";
import { GardenView } from "@/components/gamification/GardenView";

export default function GardenPage() {
  const { t } = useTranslation();

  return (
    <div className="ambient-gold max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
          <Flower2 className="w-5 h-5 text-[#059669] dark:text-[#00E5A0]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("garden.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("garden.subtitle")}
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-xl bg-[#D1E0D8]/30 dark:bg-[#00E5A0]/5 animate-pulse" />
        }
      >
        <GardenView />
      </Suspense>
    </div>
  );
}
