"use client";

import Link from "next/link";
import { AlertTriangle, BookOpen, ChevronRight } from "lucide-react";

import { SURAH_NAMES } from "@/lib/curriculum/plan-generator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface MistakeData {
  surahNumber: number;
  ayahNumber: number;
  wordIndex: number;
  type: string;
  count: number;
  lastOccurred: string;
}

export interface WeakArea {
  surahNumber: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  mistakeCount: number;
  dominantType: string;
  lastSession: string;
}

interface WeakAreasProps {
  mistakes: MistakeData[];
  className?: string;
}

/** Map mistake type codes to human-readable labels */
const MISTAKE_TYPE_LABELS: Record<string, string> = {
  WRONG_WORD: "Wrong word",
  SKIPPED: "Skipped word",
  ADDED: "Extra word",
  TASHKEEL: "Diacritical error",
  ORDER: "Word order",
};

/**
 * Group mistakes by surah and identify weak verse ranges
 */
function identifyWeakAreas(mistakes: MistakeData[]): WeakArea[] {
  // Group by surah
  const surahGroups = new Map<number, MistakeData[]>();
  for (const mistake of mistakes) {
    const group = surahGroups.get(mistake.surahNumber) ?? [];
    group.push(mistake);
    surahGroups.set(mistake.surahNumber, group);
  }

  const weakAreas: WeakArea[] = [];

  for (const [surahNumber, surahMistakes] of surahGroups) {
    // Sort by ayah
    const sorted = [...surahMistakes].sort(
      (a, b) => a.ayahNumber - b.ayahNumber
    );

    // Find consecutive ranges of ayahs with mistakes
    let rangeStart = sorted[0].ayahNumber;
    let rangeEnd = sorted[0].ayahNumber;
    let rangeMistakes: MistakeData[] = [sorted[0]];

    const flushRange = () => {
      // Count total mistakes in this range
      const totalCount = rangeMistakes.reduce((sum, m) => sum + m.count, 0);

      // Find dominant mistake type
      const typeCounts = new Map<string, number>();
      for (const m of rangeMistakes) {
        typeCounts.set(m.type, (typeCounts.get(m.type) ?? 0) + m.count);
      }
      let dominantType = "WRONG_WORD";
      let maxCount = 0;
      for (const [type, count] of typeCounts) {
        if (count > maxCount) {
          maxCount = count;
          dominantType = type;
        }
      }

      // Find latest occurrence
      const lastSession = rangeMistakes.reduce((latest, m) => {
        return m.lastOccurred > latest ? m.lastOccurred : latest;
      }, rangeMistakes[0].lastOccurred);

      weakAreas.push({
        surahNumber,
        surahName: SURAH_NAMES[surahNumber - 1] ?? `Surah ${surahNumber}`,
        startAyah: rangeStart,
        endAyah: rangeEnd,
        mistakeCount: totalCount,
        dominantType,
        lastSession,
      });
    };

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].ayahNumber <= rangeEnd + 3) {
        // Within a gap of 3 verses, consider it the same range
        rangeEnd = sorted[i].ayahNumber;
        rangeMistakes.push(sorted[i]);
      } else {
        flushRange();
        rangeStart = sorted[i].ayahNumber;
        rangeEnd = sorted[i].ayahNumber;
        rangeMistakes = [sorted[i]];
      }
    }
    flushRange();
  }

  // Sort by mistake count descending
  return weakAreas.sort((a, b) => b.mistakeCount - a.mistakeCount);
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export function WeakAreas({ mistakes, className }: WeakAreasProps) {
  const weakAreas = identifyWeakAreas(mistakes);

  if (weakAreas.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Weak Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground text-sm">
            <p>No weak areas identified yet.</p>
            <p className="mt-1">
              Practice more to get personalized recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Weak Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weakAreas.slice(0, 5).map((area, index) => {
            const rangeLabel =
              area.startAyah === area.endAyah
                ? `${area.surahNumber}:${area.startAyah}`
                : `${area.surahNumber}:${area.startAyah}-${area.endAyah}`;

            return (
              <div
                key={`${area.surahNumber}-${area.startAyah}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      area.mistakeCount >= 5
                        ? "bg-red-100 dark:bg-red-900/30"
                        : area.mistakeCount >= 3
                          ? "bg-orange-100 dark:bg-orange-900/30"
                          : "bg-yellow-100 dark:bg-yellow-900/30"
                    )}
                  >
                    <BookOpen
                      className={cn(
                        "h-5 w-5",
                        area.mistakeCount >= 5
                          ? "text-red-500"
                          : area.mistakeCount >= 3
                            ? "text-orange-500"
                            : "text-yellow-500"
                      )}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {area.surahName} ({rangeLabel})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {area.mistakeCount} mistake
                    {area.mistakeCount > 1 ? "s" : ""}
                    {" - "}
                    {MISTAKE_TYPE_LABELS[area.dominantType] ??
                      area.dominantType}
                    {" - "}
                    {formatTimeAgo(area.lastSession)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                  asChild
                >
                  <Link
                    href={`/memorize?surah=${area.surahNumber}&ayah=${area.startAyah}`}
                  >
                    <span className="sr-only">Practice</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
