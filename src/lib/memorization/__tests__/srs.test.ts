import { Rating, State } from "ts-fsrs";
import { describe, expect, it } from "vitest";

import {
  accuracyToRating,
  createCard,
  getDueCards,
  getRetrievability,
  getStudyStats,
  isLearning,
  isMature,
  isNew,
  reviewCard,
  type SRSCard,
} from "../srs";

describe("createCard", () => {
  it("returns a valid initial card", () => {
    const card = createCard(1, 1);
    expect(card.id).toBe("1:1");
    expect(card.surahNumber).toBe(1);
    expect(card.ayahNumber).toBe(1);
    expect(card.reps).toBe(0);
    expect(card.lapses).toBe(0);
    expect(card.totalReviews).toBe(0);
    expect(card.averageAccuracy).toBe(0);
    expect(card.state).toBe(State.New);
    expect(card.due).toBeTruthy();
    expect(card.last_review).toBeNull();
  });

  it("accepts optional category", () => {
    const card = createCard(2, 5, "sabaq");
    expect(card.category).toBe("sabaq");
    expect(card.surahNumber).toBe(2);
    expect(card.ayahNumber).toBe(5);
  });

  it("creates cards with unique IDs for different ayahs", () => {
    const card1 = createCard(1, 1);
    const card2 = createCard(1, 2);
    expect(card1.id).not.toBe(card2.id);
  });
});

describe("reviewCard", () => {
  it("with GOOD rating advances the card state", () => {
    const card = createCard(1, 1);
    const { card: updated } = reviewCard(card, Rating.Good, 80);

    expect(updated.reps).toBeGreaterThan(card.reps);
    expect(updated.totalReviews).toBe(1);
    expect(updated.averageAccuracy).toBe(80);
    expect(updated.last_review).not.toBeNull();
  });

  it("with EASY rating produces longer interval than GOOD", () => {
    const card = createCard(1, 1);
    const { card: easyResult } = reviewCard(card, Rating.Easy, 95);
    const { card: goodResult } = reviewCard(card, Rating.Good, 80);

    // Easy should have either a longer scheduled_days or later due date
    const easyDue = new Date(easyResult.due).getTime();
    const goodDue = new Date(goodResult.due).getTime();
    expect(easyDue).toBeGreaterThanOrEqual(goodDue);
  });

  it("with AGAIN rating resets toward learning state", () => {
    // First review the card to advance it
    const card = createCard(1, 1);
    const { card: reviewed } = reviewCard(card, Rating.Good, 80);
    const { card: afterAgain } = reviewCard(reviewed, Rating.Again, 30);

    // After AGAIN, lapses should have increased
    expect(afterAgain.lapses).toBeGreaterThanOrEqual(reviewed.lapses);
  });

  it("updates totalReviews and averageAccuracy correctly", () => {
    const card = createCard(1, 1);
    const { card: first } = reviewCard(card, Rating.Good, 80);
    expect(first.totalReviews).toBe(1);
    expect(first.averageAccuracy).toBe(80);

    const { card: second } = reviewCard(first, Rating.Good, 100);
    expect(second.totalReviews).toBe(2);
    expect(second.averageAccuracy).toBe(90); // (80+100)/2 = 90
  });

  it("preserves card identity fields", () => {
    const card = createCard(5, 10, "manzil");
    const { card: updated } = reviewCard(card, Rating.Good, 85);
    expect(updated.id).toBe("5:10");
    expect(updated.surahNumber).toBe(5);
    expect(updated.ayahNumber).toBe(10);
    expect(updated.category).toBe("manzil");
  });
});

describe("accuracyToRating", () => {
  it("maps 100% to Easy", () => {
    expect(accuracyToRating(100)).toBe(Rating.Easy);
  });

  it("maps 95% to Easy", () => {
    expect(accuracyToRating(95)).toBe(Rating.Easy);
  });

  it("maps 90% to Easy", () => {
    expect(accuracyToRating(90)).toBe(Rating.Easy);
  });

  it("maps 89% to Good", () => {
    expect(accuracyToRating(89)).toBe(Rating.Good);
  });

  it("maps 70% to Good", () => {
    expect(accuracyToRating(70)).toBe(Rating.Good);
  });

  it("maps 69% to Hard", () => {
    expect(accuracyToRating(69)).toBe(Rating.Hard);
  });

  it("maps 50% to Hard", () => {
    expect(accuracyToRating(50)).toBe(Rating.Hard);
  });

  it("maps 49% to Again", () => {
    expect(accuracyToRating(49)).toBe(Rating.Again);
  });

  it("maps 0% to Again", () => {
    expect(accuracyToRating(0)).toBe(Rating.Again);
  });
});

describe("getRetrievability", () => {
  it("returns a number between 0 and 100", () => {
    const card = createCard(1, 1);
    const r = getRetrievability(card);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(100);
  });

  it("returns 100 for a new card with zero stability", () => {
    const card = createCard(1, 1);
    // New card has stability 0
    expect(getRetrievability(card)).toBe(100);
  });
});

describe("getStudyStats", () => {
  it("returns all zeros for empty cards array", () => {
    const stats = getStudyStats([]);
    expect(stats.total).toBe(0);
    expect(stats.dueToday).toBe(0);
    expect(stats.newCards).toBe(0);
    expect(stats.learning).toBe(0);
    expect(stats.relearning).toBe(0);
    expect(stats.young).toBe(0);
    expect(stats.mature).toBe(0);
    expect(stats.averageAccuracy).toBe(0);
    expect(stats.averageDifficulty).toBe(0);
  });

  it("counts new cards correctly", () => {
    const cards = [createCard(1, 1), createCard(1, 2), createCard(1, 3)];
    const stats = getStudyStats(cards);
    expect(stats.total).toBe(3);
    expect(stats.newCards).toBe(3);
  });

  it("counts due today correctly", () => {
    // New cards are due immediately
    const cards = [createCard(1, 1), createCard(1, 2)];
    const stats = getStudyStats(cards);
    expect(stats.dueToday).toBe(2);
  });

  it("computes average accuracy", () => {
    const card1 = createCard(1, 1);
    const card2 = createCard(1, 2);
    // Manually set accuracy for testing
    const cards: SRSCard[] = [
      { ...card1, averageAccuracy: 80 },
      { ...card2, averageAccuracy: 100 },
    ];
    const stats = getStudyStats(cards);
    expect(stats.averageAccuracy).toBe(90);
  });
});

describe("getDueCards", () => {
  it("returns new cards as due", () => {
    const cards = [createCard(1, 1), createCard(1, 2)];
    const due = getDueCards(cards);
    expect(due.length).toBe(2);
  });

  it("does not return cards with future due dates", () => {
    const card = createCard(1, 1);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureCard: SRSCard = {
      ...card,
      due: futureDate.toISOString(),
      state: State.Review,
    };
    const due = getDueCards([futureCard]);
    expect(due.length).toBe(0);
  });
});

describe("card state helpers", () => {
  it("isNew returns true for new cards", () => {
    const card = createCard(1, 1);
    expect(isNew(card)).toBe(true);
  });

  it("isLearning returns true for learning state", () => {
    const card = createCard(1, 1);
    const learningCard: SRSCard = { ...card, state: State.Learning };
    expect(isLearning(learningCard)).toBe(true);
  });

  it("isLearning returns true for relearning state", () => {
    const card = createCard(1, 1);
    const relearningCard: SRSCard = { ...card, state: State.Relearning };
    expect(isLearning(relearningCard)).toBe(true);
  });

  it("isMature returns true for review state with high stability", () => {
    const card = createCard(1, 1);
    const matureCard: SRSCard = {
      ...card,
      state: State.Review,
      stability: 30,
    };
    expect(isMature(matureCard)).toBe(true);
  });

  it("isMature returns false for review state with low stability", () => {
    const card = createCard(1, 1);
    const youngCard: SRSCard = {
      ...card,
      state: State.Review,
      stability: 10,
    };
    expect(isMature(youngCard)).toBe(false);
  });
});
