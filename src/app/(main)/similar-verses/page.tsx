"use client";

import { useState } from "react";
import { GitCompareArrows, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAllSimilarPairs } from "@/hooks/use-similar-verses";
import { useTranslation } from "@/hooks/use-translation";
import { SimilarVerseComparison } from "@/components/memorization/SimilarVerseComparison";
import { Button } from "@/components/ui/button";

type Tab = "browse" | "practice" | "weak";

export default function SimilarVersesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAllSimilarPairs(page);

  const tabs: { key: Tab; label: string }[] = [
    { key: "browse", label: t("similar.browse") },
    { key: "practice", label: t("similar.practice") },
    { key: "weak", label: t("similar.weak_pairs") },
  ];

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
          <GitCompareArrows className="w-5 h-5 text-[#059669] dark:text-[#00E5A0]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("similar.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("similar.subtitle")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#D1E0D8] dark:border-[#00E5A0]/10 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab.key
                ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
                : "text-muted-foreground hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === "browse" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#059669] dark:text-[#00E5A0]" />
            </div>
          ) : data?.pairs?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t("similar.no_pairs")}</p>
            </div>
          ) : (
            <>
              {data?.pairs?.map((pair) => (
                <SimilarVerseComparison key={pair.id} pair={pair} />
              ))}

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    {t("common.back")}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page} / {data.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.totalPages}
                  >
                    {t("common.next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Practice Tab - placeholder */}
      {activeTab === "practice" && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
            <span className="text-2xl">&#x1F4AA;</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t("similar.practice")}
          </h3>
          <p className="text-sm text-muted-foreground">
            Start browsing pairs, then practice drills on specific pairs
          </p>
        </div>
      )}

      {/* Weak Pairs Tab - placeholder */}
      {activeTab === "weak" && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
            <span className="text-2xl">&#x1F50D;</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t("similar.weak_pairs")}
          </h3>
          <p className="text-sm text-muted-foreground">
            Your weakest pairs will appear here after practicing
          </p>
        </div>
      )}
    </div>
  );
}
