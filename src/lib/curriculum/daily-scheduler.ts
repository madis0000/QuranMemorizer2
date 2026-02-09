/**
 * Daily Scheduler - Computes what to study today
 *
 * Integrates FSRS due cards into the daily plan and prioritizes:
 * 1. Overdue reviews (FSRS cards past due date)
 * 2. New learning (from curriculum plan)
 * 3. Ahead-of-schedule review
 */

import type { SRSCard } from "@/lib/memorization/srs";

import {
  getTodayTarget,
  type DailyTarget,
  type StudyPlan,
  type VerseRange,
} from "./plan-generator";

export interface DailySchedule {
  date: string;
  /** New verses to learn (Sabaq) */
  newVerses: VerseRange[];
  /** Recently learned verses to review (Sabqi) */
  recentReview: string[];
  /** Older verses to review (Manzil) */
  distantReview: string[];
  /** FSRS cards that are due today or overdue */
  fsrsDueCards: FsrsDueItem[];
  /** Total estimated time in minutes */
  estimatedMinutes: number;
  /** Whether the daily target from the plan is already completed */
  planTargetCompleted: boolean;
  /** Breakdown of time by section */
  timeBreakdown: {
    newLearning: number;
    recentReview: number;
    distantReview: number;
    fsrsReview: number;
  };
}

export interface FsrsDueItem {
  surahNumber: number;
  ayahNumber: number;
  verseKey: string;
  daysOverdue: number;
  difficulty: number;
  state: number;
}

/** Average time per verse for different activities (in minutes) */
const TIME_PER_VERSE = {
  newLearning: 2.0,
  recentReview: 0.5,
  distantReview: 0.5,
  fsrsReview: 0.75,
} as const;

/**
 * Convert FSRS cards to due items, filtering for cards due today or earlier
 */
function getDueItems(cards: SRSCard[], today: string): FsrsDueItem[] {
  const todayDate = new Date(today);

  return cards
    .filter((card) => {
      const dueDate = card.due.split("T")[0];
      return dueDate <= today;
    })
    .map((card) => {
      const dueDate = new Date(card.due.split("T")[0]);
      const daysOverdue = Math.max(
        0,
        Math.floor(
          (todayDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      return {
        surahNumber: card.surahNumber,
        ayahNumber: card.ayahNumber,
        verseKey: `${card.surahNumber}:${card.ayahNumber}`,
        daysOverdue,
        difficulty: card.difficulty,
        state: card.state,
      };
    })
    .sort((a, b) => {
      // Prioritize most overdue first, then hardest
      if (a.daysOverdue !== b.daysOverdue) return b.daysOverdue - a.daysOverdue;
      return b.difficulty - a.difficulty;
    });
}

/**
 * Compute what to study today by combining the plan target with FSRS due cards
 */
export function getDailySchedule(
  plan: StudyPlan | null,
  fsrsCards: SRSCard[],
  today?: string
): DailySchedule {
  const dateStr = today ?? new Date().toISOString().split("T")[0];

  // Get plan target for today
  const planTarget: DailyTarget | null = plan ? getTodayTarget(plan) : null;

  // Get FSRS due cards
  const fsrsDueCards = getDueItems(fsrsCards, dateStr);

  // Deduplicate: remove FSRS cards that overlap with plan review lists
  const planReviewSet = new Set([
    ...(planTarget?.recentReview ?? []),
    ...(planTarget?.distantReview ?? []),
  ]);
  const filteredFsrsDue = fsrsDueCards.filter(
    (item) => !planReviewSet.has(item.verseKey)
  );

  // Calculate new verses count from plan
  const newVerseCount =
    planTarget?.newVerses.reduce((sum, vr) => sum + vr.count, 0) ?? 0;

  // Calculate time breakdown
  const timeBreakdown = {
    newLearning: newVerseCount * TIME_PER_VERSE.newLearning,
    recentReview:
      (planTarget?.recentReview.length ?? 0) * TIME_PER_VERSE.recentReview,
    distantReview:
      (planTarget?.distantReview.length ?? 0) * TIME_PER_VERSE.distantReview,
    fsrsReview: filteredFsrsDue.length * TIME_PER_VERSE.fsrsReview,
  };

  const estimatedMinutes = Math.ceil(
    timeBreakdown.newLearning +
      timeBreakdown.recentReview +
      timeBreakdown.distantReview +
      timeBreakdown.fsrsReview
  );

  return {
    date: dateStr,
    newVerses: planTarget?.newVerses ?? [],
    recentReview: planTarget?.recentReview ?? [],
    distantReview: planTarget?.distantReview ?? [],
    fsrsDueCards: filteredFsrsDue,
    estimatedMinutes,
    planTargetCompleted: planTarget?.completed ?? false,
    timeBreakdown,
  };
}

/**
 * Get a summary description of what's in a daily schedule
 */
export function getScheduleSummary(schedule: DailySchedule): string {
  const parts: string[] = [];

  const newCount = schedule.newVerses.reduce((sum, vr) => sum + vr.count, 0);
  if (newCount > 0) {
    parts.push(`${newCount} new verse${newCount > 1 ? "s" : ""}`);
  }

  const reviewCount =
    schedule.recentReview.length + schedule.distantReview.length;
  if (reviewCount > 0) {
    parts.push(`${reviewCount} review${reviewCount > 1 ? "s" : ""}`);
  }

  if (schedule.fsrsDueCards.length > 0) {
    parts.push(
      `${schedule.fsrsDueCards.length} SRS card${schedule.fsrsDueCards.length > 1 ? "s" : ""}`
    );
  }

  if (parts.length === 0) return "Rest day";
  return parts.join(", ");
}
