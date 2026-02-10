"use client";

import { GitCompareArrows } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SimilarPairResponse } from "@/hooks/use-similar-verses";
import { useTranslation } from "@/hooks/use-translation";

interface SimilarVerseComparisonProps {
  pair: SimilarPairResponse;
  verse1Text?: string;
  verse2Text?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  near_identical: "bg-red-500/15 text-red-600 dark:text-red-400",
  similar_opening: "bg-[#059669]/15 text-[#059669] dark:text-[#00E5A0]",
  similar_ending: "bg-[#0d9488]/15 text-[#0d9488] dark:text-[#2dd4bf]",
  thematic: "bg-[#FFD700]/15 text-[#B8860B] dark:text-[#FFD700]",
};

export function SimilarVerseComparison({
  pair,
  verse1Text,
  verse2Text,
}: SimilarVerseComparisonProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-5 backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="w-4 h-4 text-[#059669] dark:text-[#00E5A0]" />
          <span className="text-sm font-medium">
            {pair.verse1Key} ↔ {pair.verse2Key}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
              CATEGORY_COLORS[pair.category] ?? CATEGORY_COLORS.thematic
            )}
          >
            {pair.category.replace("_", " ")}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("similar.similarity")}: {Math.round(pair.similarity * 100)}%
          </span>
        </div>
      </div>

      {/* Side by side verses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verse 1 */}
        <div className="rounded-lg border border-[#D1E0D8]/50 dark:border-[#00E5A0]/5 p-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {pair.verse1Key}
          </div>
          <div className="text-lg leading-loose font-amiri" dir="rtl" lang="ar">
            {verse1Text || "..."}
          </div>
        </div>

        {/* Verse 2 */}
        <div className="rounded-lg border border-[#D1E0D8]/50 dark:border-[#00E5A0]/5 p-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {pair.verse2Key}
          </div>
          <div className="text-lg leading-loose font-amiri" dir="rtl" lang="ar">
            {verse2Text || "..."}
          </div>
        </div>
      </div>

      {/* Diff words */}
      {pair.diffWords && (
        <div className="flex flex-wrap gap-2 text-xs">
          {pair.diffWords.verse1Only?.map((word: string, i: number) => (
            <span
              key={`v1-${i}`}
              className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-amiri"
              dir="rtl"
            >
              {word}
            </span>
          ))}
          {pair.diffWords.verse2Only?.map((word: string, i: number) => (
            <span
              key={`v2-${i}`}
              className="px-2 py-0.5 rounded bg-[#059669]/10 text-[#059669] dark:text-[#00E5A0] font-amiri"
              dir="rtl"
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
