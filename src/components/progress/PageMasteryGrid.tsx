"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PageDetail } from "./PageDetail";

/** Mastery level thresholds */
export type MasteryLevel =
  | "not_started"
  | "weak"
  | "learning"
  | "moderate"
  | "strong"
  | "mastered";

export interface PageMasteryData {
  page: number;
  level: MasteryLevel;
  accuracy: number;
  sessionsCount: number;
  lastPracticed: string | null;
  retention: number;
}

interface PageMasteryGridProps {
  pages: PageMasteryData[];
  className?: string;
}

/** Juz boundaries by Mushaf page (approximate for Madinah Mushaf) */
const JUZ_PAGE_BOUNDARIES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322,
  342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
] as const;

const MASTERY_COLORS: Record<MasteryLevel, string> = {
  not_started: "bg-[#D1E0D8]/50 dark:bg-[#1a2e23]/50",
  weak: "bg-red-400 dark:bg-red-600",
  learning: "bg-[#B8860B]/60 dark:bg-[#d97706]/60",
  moderate: "bg-[#FFD700]/60 dark:bg-[#FFD700]/50",
  strong: "bg-[#059669]/60 dark:bg-[#00E5A0]/60",
  mastered: "bg-[#059669] dark:bg-[#00E5A0]/80",
};

const MASTERY_LABELS: Record<MasteryLevel, string> = {
  not_started: "Not Started",
  weak: "Weak",
  learning: "Learning",
  moderate: "Moderate",
  strong: "Strong",
  mastered: "Mastered",
};

/**
 * Compute mastery level from page data. Takes accuracy and FSRS retention into account.
 */
export function computeMasteryLevel(
  accuracy: number,
  sessionsCount: number,
  retention: number
): MasteryLevel {
  if (sessionsCount === 0) return "not_started";

  const score = accuracy * 0.5 + retention * 0.5;

  if (score >= 95) return "mastered";
  if (score >= 80) return "strong";
  if (score >= 60) return "moderate";
  if (score >= 40) return "learning";
  return "weak";
}

/**
 * Get the juz number for a given page number
 */
function getJuzForPage(page: number): number {
  for (let i = JUZ_PAGE_BOUNDARIES.length - 1; i >= 0; i--) {
    if (page >= JUZ_PAGE_BOUNDARIES[i]) return i + 1;
  }
  return 1;
}

/**
 * Check if a page is the first page of a juz
 */
function isJuzStart(page: number): boolean {
  return JUZ_PAGE_BOUNDARIES.includes(
    page as (typeof JUZ_PAGE_BOUNDARIES)[number]
  );
}

export function PageMasteryGrid({ pages, className }: PageMasteryGridProps) {
  const [selectedPage, setSelectedPage] = useState<PageMasteryData | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Build a map for quick lookup (default to not_started for missing pages)
  const pageMap = new Map<number, PageMasteryData>();
  for (const p of pages) {
    pageMap.set(p.page, p);
  }

  const allPages: PageMasteryData[] = [];
  for (let i = 1; i <= 604; i++) {
    allPages.push(
      pageMap.get(i) ?? {
        page: i,
        level: "not_started",
        accuracy: 0,
        sessionsCount: 0,
        lastPracticed: null,
        retention: 0,
      }
    );
  }

  const handlePageClick = (pageData: PageMasteryData) => {
    setSelectedPage(pageData);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="text-lg">Page Mastery</CardTitle>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2">
            {(Object.keys(MASTERY_COLORS) as MasteryLevel[]).map((level) => (
              <div key={level} className="flex items-center gap-1.5">
                <div
                  className={cn("h-3 w-3 rounded-sm", MASTERY_COLORS[level])}
                />
                <span className="text-xs text-muted-foreground">
                  {MASTERY_LABELS[level]}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Render grid with juz labels */}
            {Array.from({ length: 30 }, (_, juzIdx) => {
              const juzNumber = juzIdx + 1;
              const startPage = JUZ_PAGE_BOUNDARIES[juzIdx];
              const endPage =
                juzIdx < 29 ? JUZ_PAGE_BOUNDARIES[juzIdx + 1] - 1 : 604;
              const juzPages = allPages.filter(
                (p) => p.page >= startPage && p.page <= endPage
              );

              return (
                <div key={juzNumber} className="flex items-start gap-2">
                  <span className="text-[10px] text-muted-foreground w-8 flex-shrink-0 pt-0.5 text-right">
                    J{juzNumber}
                  </span>
                  <div className="flex flex-wrap gap-[2px]">
                    {juzPages.map((pageData) => (
                      <button
                        key={pageData.page}
                        onClick={() => handlePageClick(pageData)}
                        className={cn(
                          "h-2.5 w-2.5 rounded-[1px] transition-all hover:scale-150 hover:z-10 cursor-pointer",
                          MASTERY_COLORS[pageData.level],
                          isJuzStart(pageData.page) &&
                            "ring-1 ring-foreground/20"
                        )}
                        title={`Page ${pageData.page} - ${MASTERY_LABELS[pageData.level]}`}
                        aria-label={`Page ${pageData.page}, ${MASTERY_LABELS[pageData.level]}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <PageDetail
        page={selectedPage}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
