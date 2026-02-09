"use client";

import Link from "next/link";
import { BookOpen, Calendar, Target, TrendingUp } from "lucide-react";

import { SURAH_NAMES } from "@/lib/curriculum/plan-generator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { MasteryLevel, PageMasteryData } from "./PageMasteryGrid";

interface PageDetailProps {
  page: PageMasteryData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Approximate mapping of page -> surah(s) for the Madinah Mushaf */
function getSurahsOnPage(page: number): number[] {
  // This is an approximation based on Madinah Mushaf layout.
  // Page 1-2: Fatiha (1), Page 2-49: Baqarah (2), etc.
  // For a more accurate mapping, use the mushaf layout data.
  // Here we provide a rough estimate.
  const SURAH_START_PAGES = [
    1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267,
    282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 411,
    415, 418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489, 496, 499, 502,
    507, 511, 515, 518, 520, 523, 526, 528, 531, 534, 537, 542, 545, 549, 551,
    553, 554, 556, 558, 559, 561, 564, 566, 568, 570, 572, 574, 575, 577, 578,
    580, 582, 583, 585, 586, 587, 587, 589, 590, 591, 591, 592, 593, 594, 595,
    595, 596, 596, 597, 597, 598, 598, 599, 599, 600, 600, 601, 601, 601, 602,
    602, 602, 603, 603, 603, 604, 604, 604, 604,
  ];

  const surahs: number[] = [];
  for (let i = 0; i < 114; i++) {
    const surahStartPage = SURAH_START_PAGES[i];
    const surahEndPage = i < 113 ? SURAH_START_PAGES[i + 1] - 1 : 604;
    if (page >= surahStartPage && page <= surahEndPage) {
      surahs.push(i + 1);
    }
  }

  return surahs.length > 0 ? surahs : [1];
}

/** Get the juz number for a page */
function getJuzForPage(page: number): number {
  const JUZ_PAGE_BOUNDARIES = [
    1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302,
    322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
  ];
  for (let i = JUZ_PAGE_BOUNDARIES.length - 1; i >= 0; i--) {
    if (page >= JUZ_PAGE_BOUNDARIES[i]) return i + 1;
  }
  return 1;
}

const LEVEL_DESCRIPTIONS: Record<
  MasteryLevel,
  { label: string; color: string }
> = {
  not_started: { label: "Not Started", color: "text-muted-foreground" },
  weak: { label: "Weak", color: "text-red-500" },
  learning: { label: "Learning", color: "text-orange-500" },
  moderate: { label: "Moderate", color: "text-yellow-500" },
  strong: { label: "Strong", color: "text-green-500" },
  mastered: { label: "Mastered", color: "text-amber-500" },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export function PageDetail({ page, open, onOpenChange }: PageDetailProps) {
  if (!page) return null;

  const surahs = getSurahsOnPage(page.page);
  const juz = getJuzForPage(page.page);
  const levelInfo = LEVEL_DESCRIPTIONS[page.level];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Page {page.page}
          </DialogTitle>
          <DialogDescription>
            Juz {juz}
            {" - "}
            {surahs.map((s) => SURAH_NAMES[s - 1]).join(", ")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mastery Level */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
            <span className="text-sm font-medium">Mastery Level</span>
            <span className={cn("text-sm font-semibold", levelInfo.color)}>
              {levelInfo.label}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">
                  {page.accuracy > 0 ? `${Math.round(page.accuracy)}%` : "--"}
                </p>
                <p className="text-xs text-muted-foreground">Avg Accuracy</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">{page.sessionsCount}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">
                  {formatDate(page.lastPracticed)}
                </p>
                <p className="text-xs text-muted-foreground">Last Practiced</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">
                  {page.retention > 0 ? `${Math.round(page.retention)}%` : "--"}
                </p>
                <p className="text-xs text-muted-foreground">Retention</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/quran?page=${page.page}`}>Practice This Page</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
