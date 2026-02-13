"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PageDetail } from "./PageDetail";
import type { MasteryLevel, PageMasteryData } from "./PageMasteryGrid";

interface LivingMushafMapProps {
  pages: PageMasteryData[];
  className?: string;
}

/** Juz boundaries by Mushaf page */
const JUZ_PAGE_BOUNDARIES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322,
  342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
] as const;

const MASTERY_LABELS: Record<MasteryLevel, string> = {
  not_started: "Not Started",
  weak: "Weak",
  learning: "Learning",
  moderate: "Moderate",
  strong: "Strong",
  mastered: "Mastered",
};

/**
 * Get background color based on mastery + retention-based opacity.
 * Pages glow golden when strong, pulse red when weak/overdue.
 */
function getCellStyle(page: PageMasteryData): React.CSSProperties {
  const opacity = Math.max(0.08, page.retention / 100);

  if (page.sessionsCount === 0) {
    return { backgroundColor: "var(--muted)", opacity: 0.3 };
  }

  if (page.retention < 30) {
    // Pulsing red for critically low retention
    return { backgroundColor: "#ef4444", opacity: Math.max(0.4, opacity) };
  }

  if (page.retention > 90) {
    // Golden shimmer for strong retention
    return { backgroundColor: "#059669", opacity };
  }

  if (page.retention > 70) {
    return { backgroundColor: "#0d9488", opacity };
  }

  if (page.retention > 50) {
    return { backgroundColor: "#FFD700", opacity };
  }

  // 30-50 retention
  return { backgroundColor: "#B8860B", opacity };
}

function isJuzStart(page: number): boolean {
  return JUZ_PAGE_BOUNDARIES.includes(
    page as (typeof JUZ_PAGE_BOUNDARIES)[number]
  );
}

export function LivingMushafMap({ pages, className }: LivingMushafMapProps) {
  const [selectedPage, setSelectedPage] = useState<PageMasteryData | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Build a map for quick lookup
  const pageMap = new Map<number, PageMasteryData>();
  for (const p of pages) {
    pageMap.set(p.page, p);
  }

  const allPages: PageMasteryData[] = [];
  for (let i = 1; i <= 604; i++) {
    allPages.push(
      pageMap.get(i) ?? {
        page: i,
        level: "not_started" as MasteryLevel,
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

  // Summary stats
  const studied = pages.filter((p) => p.sessionsCount > 0).length;
  const avgRetention =
    studied > 0
      ? Math.round(
          pages
            .filter((p) => p.sessionsCount > 0)
            .reduce((s, p) => s + p.retention, 0) / studied
        )
      : 0;
  const critical = pages.filter(
    (p) => p.sessionsCount > 0 && p.retention < 30
  ).length;

  return (
    <>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="text-lg">Living Mushaf</CardTitle>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">{studied}</strong>/604 pages
              studied
            </span>
            <span>
              <strong className="text-foreground">{avgRetention}%</strong> avg
              retention
            </span>
            {critical > 0 && (
              <span className="text-red-500">
                <strong>{critical}</strong> pages need review
              </span>
            )}
          </div>
          {/* Retention legend */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-muted-foreground">Low</span>
            <div className="flex gap-[1px]">
              {[10, 30, 50, 70, 90].map((r) => (
                <div
                  key={r}
                  className="h-3 w-5 rounded-[1px]"
                  style={{
                    backgroundColor:
                      r < 30
                        ? "#ef4444"
                        : r < 50
                          ? "#B8860B"
                          : r < 70
                            ? "#FFD700"
                            : r < 90
                              ? "#0d9488"
                              : "#059669",
                    opacity: Math.max(0.2, r / 100),
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
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
                          isJuzStart(pageData.page) &&
                            "ring-1 ring-foreground/20",
                          pageData.sessionsCount > 0 &&
                            pageData.retention < 30 &&
                            "animate-pulse"
                        )}
                        style={getCellStyle(pageData)}
                        title={`Page ${pageData.page} - ${MASTERY_LABELS[pageData.level]} (${Math.round(pageData.retention)}% retention)`}
                        aria-label={`Page ${pageData.page}, ${MASTERY_LABELS[pageData.level]}, ${Math.round(pageData.retention)}% retention`}
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
