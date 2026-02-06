/**
 * Spaced Repetition System (SRS) - Modified SM-2 Algorithm
 *
 * Based on the SuperMemo SM-2 algorithm but adapted for Quran memorization:
 * - Uses recitation accuracy instead of self-assessed quality
 * - Shorter intervals for Quran verses (need more frequent review)
 * - Minimum interval of 1 day
 */

export interface SRSCard {
  id: string;
  surahNumber: number;
  ayahNumber: number;

  // SM-2 parameters
  easeFactor: number; // Starts at 2.5, minimum 1.3
  interval: number; // Days until next review
  repetitions: number; // Consecutive correct reviews

  // Tracking
  nextReviewDate: string; // ISO date string
  lastReviewDate: string | null;
  totalReviews: number;
  averageAccuracy: number;
}

export interface ReviewResult {
  accuracy: number; // 0-100 from the recitation comparison
  duration: number; // Seconds spent on this card
}

/**
 * Map recitation accuracy (0-100) to SM-2 quality (0-5):
 * - 95-100% → 5 (perfect)
 * - 85-94%  → 4 (minor hesitation)
 * - 70-84%  → 3 (correct with difficulty)
 * - 50-69%  → 2 (incorrect, but close)
 * - 25-49%  → 1 (incorrect)
 * - 0-24%   → 0 (complete failure)
 */
function accuracyToQuality(accuracy: number): number {
  if (accuracy >= 95) return 5;
  if (accuracy >= 85) return 4;
  if (accuracy >= 70) return 3;
  if (accuracy >= 50) return 2;
  if (accuracy >= 25) return 1;
  return 0;
}

/**
 * Calculate the next review schedule using modified SM-2.
 */
export function calculateNextReview(
  card: SRSCard,
  result: ReviewResult
): Pick<
  SRSCard,
  | "easeFactor"
  | "interval"
  | "repetitions"
  | "nextReviewDate"
  | "lastReviewDate"
> {
  const quality = accuracyToQuality(result.accuracy);
  const today = new Date();

  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor (SM-2 formula)
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Clamp ease factor
  if (easeFactor < 1.3) easeFactor = 1.3;
  if (easeFactor > 3.0) easeFactor = 3.0;

  // Cap maximum interval at 180 days for Quran (more frequent than typical SRS)
  if (interval > 180) interval = 180;

  const nextReview = new Date(today);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReviewDate: nextReview.toISOString().split("T")[0],
    lastReviewDate: today.toISOString().split("T")[0],
  };
}

/**
 * Create a new SRS card for an ayah.
 */
export function createCard(surahNumber: number, ayahNumber: number): SRSCard {
  const today = new Date().toISOString().split("T")[0];

  return {
    id: `${surahNumber}:${ayahNumber}`,
    surahNumber,
    ayahNumber,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewDate: null,
    totalReviews: 0,
    averageAccuracy: 0,
  };
}

/**
 * Get cards that are due for review today.
 */
export function getDueCards(cards: SRSCard[]): SRSCard[] {
  const today = new Date().toISOString().split("T")[0];
  return cards
    .filter((card) => card.nextReviewDate <= today)
    .sort((a, b) => {
      // Prioritize: new cards first, then by due date, then by ease (harder first)
      if (a.repetitions === 0 && b.repetitions > 0) return -1;
      if (b.repetitions === 0 && a.repetitions > 0) return 1;
      if (a.nextReviewDate !== b.nextReviewDate) {
        return a.nextReviewDate.localeCompare(b.nextReviewDate);
      }
      return a.easeFactor - b.easeFactor;
    });
}

/**
 * Calculate study statistics for a collection of cards.
 */
export function getStudyStats(cards: SRSCard[]) {
  const today = new Date().toISOString().split("T")[0];
  const dueToday = cards.filter((c) => c.nextReviewDate <= today).length;
  const newCards = cards.filter((c) => c.repetitions === 0).length;
  const learning = cards.filter(
    (c) => c.repetitions > 0 && c.interval < 7
  ).length;
  const mature = cards.filter((c) => c.interval >= 7).length;

  const avgAccuracy =
    cards.length > 0
      ? Math.round(
          cards.reduce((sum, c) => sum + c.averageAccuracy, 0) / cards.length
        )
      : 0;

  return {
    total: cards.length,
    dueToday,
    newCards,
    learning,
    mature,
    averageAccuracy: avgAccuracy,
  };
}
