/**
 * Spaced Repetition System (SRS) - FSRS-6 Algorithm
 *
 * Uses the FSRS (Free Spaced Repetition Scheduler) algorithm v6
 * via the ts-fsrs package. FSRS is a modern SRS algorithm that
 * improves upon SM-2 with better interval predictions and difficulty tracking.
 *
 * For Quran memorization, we map recitation accuracy to FSRS ratings:
 * - Again (<50%): Major mistakes, reset learning
 * - Hard (50-69%): Significant mistakes
 * - Good (70-89%): Acceptable performance
 * - Easy (90-100%): Excellent recitation
 */

import {
  createEmptyCard,
  fsrs,
  Card as FSRSCard,
  generatorParameters,
  Rating,
  RecordLog,
  RecordLogItem,
  State,
} from "ts-fsrs";

// Create FSRS instance with optimized parameters
// enable_fuzz adds slight randomness to intervals to avoid review clustering
const f = fsrs(generatorParameters({ enable_fuzz: true }));

/**
 * SRS Card interface - matches Prisma FSRSCard model
 */
export interface SRSCard {
  id: string;
  surahNumber: number;
  ayahNumber: number;

  // FSRS parameters
  due: string; // ISO date - when next review is due
  stability: number; // Memory stability (days)
  difficulty: number; // Item difficulty (0-10)
  elapsed_days: number; // Days since last review
  scheduled_days: number; // Scheduled interval
  reps: number; // Number of reviews
  lapses: number; // Number of lapses (forgetting)
  state: number; // 0=New, 1=Learning, 2=Review, 3=Relearning
  last_review: string | null; // ISO date

  // App-specific tracking
  totalReviews: number;
  averageAccuracy: number;

  // Category for Sabaq/Sabqi/Manzil system
  category?: "sabaq" | "sabqi" | "manzil";
}

/**
 * Review result from user's recitation
 */
export interface ReviewResult {
  accuracy: number; // 0-100 from the recitation comparison
  duration: number; // Seconds spent on this card
}

/**
 * Scheduling options for all 4 rating choices
 */
export interface SchedulingOptions {
  again: {
    rating: Rating;
    interval: number; // days
    nextReview: string; // ISO date
    state: State;
  };
  hard: {
    rating: Rating;
    interval: number;
    nextReview: string;
    state: State;
  };
  good: {
    rating: Rating;
    interval: number;
    nextReview: string;
    state: State;
  };
  easy: {
    rating: Rating;
    interval: number;
    nextReview: string;
    state: State;
  };
}

/**
 * Map recitation accuracy (0-100) to FSRS Rating:
 * - Again (1): <50% - Major mistakes, reset learning
 * - Hard (2): 50-69% - Significant mistakes
 * - Good (3): 70-89% - Acceptable performance
 * - Easy (4): 90-100% - Excellent recitation
 */
export function accuracyToRating(accuracy: number): Rating {
  if (accuracy >= 90) return Rating.Easy;
  if (accuracy >= 70) return Rating.Good;
  if (accuracy >= 50) return Rating.Hard;
  return Rating.Again;
}

/**
 * Convert SRSCard to FSRS Card format for scheduling
 */
function toFSRSCard(card: SRSCard): FSRSCard {
  return {
    due: new Date(card.due),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as State,
    last_review: card.last_review ? new Date(card.last_review) : undefined,
    learning_steps: 0,
  };
}

/**
 * Convert FSRS Card back to SRSCard format
 */
function fromFSRSCard(
  fsrsCard: FSRSCard,
  original: SRSCard,
  totalReviews: number,
  averageAccuracy: number
): SRSCard {
  return {
    id: original.id,
    surahNumber: original.surahNumber,
    ayahNumber: original.ayahNumber,
    due: fsrsCard.due.toISOString(),
    stability: fsrsCard.stability,
    difficulty: fsrsCard.difficulty,
    elapsed_days: fsrsCard.elapsed_days,
    scheduled_days: fsrsCard.scheduled_days,
    reps: fsrsCard.reps,
    lapses: fsrsCard.lapses,
    state: fsrsCard.state,
    last_review: fsrsCard.last_review
      ? fsrsCard.last_review.toISOString()
      : null,
    totalReviews,
    averageAccuracy,
    category: original.category,
  };
}

/**
 * Calculate the next review schedule using FSRS-6.
 * This function maintains backward compatibility with the SM-2 interface.
 *
 * @param card - The SRS card to review
 * @param result - The review result (accuracy and duration)
 * @returns Updated card fields
 */
export function calculateNextReview(
  card: SRSCard,
  result: ReviewResult
): Pick<
  SRSCard,
  | "due"
  | "stability"
  | "difficulty"
  | "elapsed_days"
  | "scheduled_days"
  | "reps"
  | "lapses"
  | "state"
  | "last_review"
> {
  const rating = accuracyToRating(result.accuracy);
  const fsrsCard = toFSRSCard(card);
  const now = new Date();

  // Schedule the card with FSRS
  const scheduling = f.repeat(fsrsCard, now);
  const recordLog = (scheduling as unknown as RecordLog)[
    rating as keyof RecordLog
  ];

  return {
    due: recordLog.card.due.toISOString(),
    stability: recordLog.card.stability,
    difficulty: recordLog.card.difficulty,
    elapsed_days: recordLog.card.elapsed_days,
    scheduled_days: recordLog.card.scheduled_days,
    reps: recordLog.card.reps,
    lapses: recordLog.card.lapses,
    state: recordLog.card.state,
    last_review: recordLog.card.last_review
      ? recordLog.card.last_review.toISOString()
      : null,
  };
}

/**
 * Review a card and get scheduling information for all 4 rating options.
 * This allows the UI to show the user what will happen for each choice.
 *
 * @param card - The SRS card to review
 * @returns Scheduling options for Again, Hard, Good, Easy
 */
export function getSchedulingOptions(card: SRSCard): SchedulingOptions {
  const fsrsCard = toFSRSCard(card);
  const now = new Date();

  const scheduling = f.repeat(fsrsCard, now) as unknown as RecordLog;

  return {
    again: {
      rating: Rating.Again,
      interval: scheduling[Rating.Again].card.scheduled_days,
      nextReview: scheduling[Rating.Again].card.due.toISOString(),
      state: scheduling[Rating.Again].card.state,
    },
    hard: {
      rating: Rating.Hard,
      interval: scheduling[Rating.Hard].card.scheduled_days,
      nextReview: scheduling[Rating.Hard].card.due.toISOString(),
      state: scheduling[Rating.Hard].card.state,
    },
    good: {
      rating: Rating.Good,
      interval: scheduling[Rating.Good].card.scheduled_days,
      nextReview: scheduling[Rating.Good].card.due.toISOString(),
      state: scheduling[Rating.Good].card.state,
    },
    easy: {
      rating: Rating.Easy,
      interval: scheduling[Rating.Easy].card.scheduled_days,
      nextReview: scheduling[Rating.Easy].card.due.toISOString(),
      state: scheduling[Rating.Easy].card.state,
    },
  };
}

/**
 * Review a card with a specific rating and return the updated card.
 *
 * @param card - The SRS card to review
 * @param rating - The FSRS rating (Again, Hard, Good, Easy)
 * @param accuracy - The recitation accuracy (for tracking)
 * @returns Updated card and review log
 */
export function reviewCard(
  card: SRSCard,
  rating: Rating,
  accuracy: number
): { card: SRSCard; log: RecordLogItem } {
  const fsrsCard = toFSRSCard(card);
  const now = new Date();

  const scheduling = f.repeat(fsrsCard, now) as unknown as RecordLog;
  const recordLog = scheduling[rating as keyof RecordLog];

  const newTotalReviews = card.totalReviews + 1;
  const newAverageAccuracy =
    (card.averageAccuracy * card.totalReviews + accuracy) / newTotalReviews;

  const updatedCard = fromFSRSCard(
    recordLog.card,
    card,
    newTotalReviews,
    Math.round(newAverageAccuracy)
  );

  return { card: updatedCard, log: recordLog };
}

/**
 * Create a new SRS card for an ayah.
 */
export function createCard(
  surahNumber: number,
  ayahNumber: number,
  category?: "sabaq" | "sabqi" | "manzil"
): SRSCard {
  const fsrsCard = createEmptyCard(new Date());

  return {
    id: `${surahNumber}:${ayahNumber}`,
    surahNumber,
    ayahNumber,
    due: fsrsCard.due.toISOString(),
    stability: fsrsCard.stability,
    difficulty: fsrsCard.difficulty,
    elapsed_days: fsrsCard.elapsed_days,
    scheduled_days: fsrsCard.scheduled_days,
    reps: fsrsCard.reps,
    lapses: fsrsCard.lapses,
    state: fsrsCard.state,
    last_review: null,
    totalReviews: 0,
    averageAccuracy: 0,
    category,
  };
}

/**
 * Get cards that are due for review today.
 */
export function getDueCards(cards: SRSCard[]): SRSCard[] {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  return cards
    .filter((card) => {
      const dueDate = card.due.split("T")[0];
      return dueDate <= today;
    })
    .sort((a, b) => {
      // Prioritize: new cards first, then by due date, then by difficulty (harder first)
      if (a.state === State.New && b.state !== State.New) return -1;
      if (b.state === State.New && a.state !== State.New) return 1;

      const aDue = new Date(a.due).getTime();
      const bDue = new Date(b.due).getTime();
      if (aDue !== bDue) return aDue - bDue;

      // Higher difficulty = harder = should review first
      return b.difficulty - a.difficulty;
    });
}

/**
 * Calculate study statistics for a collection of cards.
 */
export function getStudyStats(cards: SRSCard[]) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const dueToday = cards.filter((c) => {
    const dueDate = c.due.split("T")[0];
    return dueDate <= today;
  }).length;

  const newCards = cards.filter((c) => c.state === State.New).length;
  const learning = cards.filter((c) => c.state === State.Learning).length;
  const relearning = cards.filter((c) => c.state === State.Relearning).length;
  const mature = cards.filter(
    (c) => c.state === State.Review && c.stability >= 21
  ).length;
  const young = cards.filter(
    (c) => c.state === State.Review && c.stability < 21
  ).length;

  const avgAccuracy =
    cards.length > 0
      ? Math.round(
          cards.reduce((sum, c) => sum + c.averageAccuracy, 0) / cards.length
        )
      : 0;

  const avgDifficulty =
    cards.length > 0
      ? cards.reduce((sum, c) => sum + c.difficulty, 0) / cards.length
      : 0;

  return {
    total: cards.length,
    dueToday,
    newCards,
    learning,
    relearning,
    young,
    mature,
    averageAccuracy: avgAccuracy,
    averageDifficulty: Math.round(avgDifficulty * 100) / 100,
  };
}

/**
 * Card state helpers
 */
export function isNew(card: SRSCard): boolean {
  return card.state === State.New;
}

export function isLearning(card: SRSCard): boolean {
  return card.state === State.Learning || card.state === State.Relearning;
}

export function isMature(card: SRSCard): boolean {
  return card.state === State.Review && card.stability >= 21;
}

/**
 * Calculate retrievability (retention probability) for a card.
 * Returns a percentage (0-100) indicating likelihood of recall.
 */
export function getRetrievability(card: SRSCard): number {
  const now = new Date();

  // FSRS retrievability formula: R = e^(ln(0.9) * elapsed_days / stability)
  const daysSinceReview = Math.max(
    0,
    (now.getTime() - new Date(card.due).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (card.stability === 0) return 100; // New card

  const retrievability = Math.exp(
    (Math.log(0.9) * (card.elapsed_days + daysSinceReview)) / card.stability
  );

  return Math.round(retrievability * 100);
}
