import { describe, expect, it } from "vitest";

import {
  calculateSessionXP,
  getBlessedTimeMultiplier,
  getLevelFromXP,
  getStreakMultiplier,
  getXPForBadge,
  getXPForLevel,
  getXPForStreak,
  getXPProgress,
  XP_TABLE,
} from "../xp";

describe("getStreakMultiplier", () => {
  it("returns 1.0 for no streak", () => {
    expect(getStreakMultiplier(0)).toBe(1.0);
    expect(getStreakMultiplier(2)).toBe(1.0);
  });

  it("returns 1.2 for 3-day streak", () => {
    expect(getStreakMultiplier(3)).toBe(1.2);
  });

  it("returns 1.5 for 7-day streak", () => {
    expect(getStreakMultiplier(7)).toBe(1.5);
  });

  it("returns highest applicable for long streaks", () => {
    expect(getStreakMultiplier(100)).toBe(3.0);
    expect(getStreakMultiplier(150)).toBe(3.0);
  });
});

describe("getBlessedTimeMultiplier", () => {
  it("returns 3x for last third of night (2-4 AM)", () => {
    expect(getBlessedTimeMultiplier(2).multiplier).toBe(3.0);
    expect(getBlessedTimeMultiplier(3).multiplier).toBe(3.0);
    expect(getBlessedTimeMultiplier(2).name).toBe("Last Third of Night");
  });

  it("returns 2x for Fajr time (4-7 AM)", () => {
    expect(getBlessedTimeMultiplier(4).multiplier).toBe(2.0);
    expect(getBlessedTimeMultiplier(6).multiplier).toBe(2.0);
    expect(getBlessedTimeMultiplier(4).name).toBe("Fajr Time");
  });

  it("returns 1x for regular time", () => {
    expect(getBlessedTimeMultiplier(10).multiplier).toBe(1.0);
    expect(getBlessedTimeMultiplier(14).multiplier).toBe(1.0);
    expect(getBlessedTimeMultiplier(22).multiplier).toBe(1.0);
  });
});

describe("calculateSessionXP", () => {
  it("calculates base XP for a simple session", () => {
    const result = calculateSessionXP({
      versesRecited: 5,
      accuracy: 80,
      duration: 300,
      isNewMemorization: false,
      currentStreak: 0,
      sessionHour: 10,
    });

    expect(result.baseXP).toBe(
      XP_TABLE.sessionComplete + 5 * XP_TABLE.perVerseRecited
    );
    expect(result.totalXP).toBe(result.baseXP); // no multipliers
  });

  it("adds perfect session bonus", () => {
    const result = calculateSessionXP({
      versesRecited: 5,
      accuracy: 100,
      duration: 300,
      isNewMemorization: false,
      currentStreak: 0,
      sessionHour: 10,
    });

    expect(result.baseXP).toBeGreaterThan(
      XP_TABLE.sessionComplete + 5 * XP_TABLE.perVerseRecited
    );
  });

  it("applies streak multiplier", () => {
    const result = calculateSessionXP({
      versesRecited: 5,
      accuracy: 80,
      duration: 300,
      isNewMemorization: false,
      currentStreak: 7,
      sessionHour: 10,
    });

    expect(result.streakMultiplier).toBe(1.5);
    expect(result.totalXP).toBeGreaterThan(result.baseXP);
  });

  it("applies blessed time multiplier", () => {
    const result = calculateSessionXP({
      versesRecited: 5,
      accuracy: 80,
      duration: 300,
      isNewMemorization: false,
      currentStreak: 0,
      sessionHour: 5, // Fajr time
    });

    expect(result.timeMultiplier).toBe(2.0);
    expect(result.totalXP).toBe(result.baseXP * 2);
  });

  it("stacks streak and time multipliers", () => {
    const result = calculateSessionXP({
      versesRecited: 5,
      accuracy: 80,
      duration: 300,
      isNewMemorization: false,
      currentStreak: 7,
      sessionHour: 3, // Last third of night
    });

    expect(result.streakMultiplier).toBe(1.5);
    expect(result.timeMultiplier).toBe(3.0);
    expect(result.totalXP).toBe(Math.floor(result.baseXP * 1.5 * 3.0));
  });
});

describe("level calculations", () => {
  it("getXPForLevel returns positive values", () => {
    expect(getXPForLevel(1)).toBeGreaterThan(0);
    expect(getXPForLevel(10)).toBeGreaterThan(getXPForLevel(1));
  });

  it("getLevelFromXP returns 1 for zero XP", () => {
    expect(getLevelFromXP(0)).toBe(1);
  });

  it("levels increase with XP", () => {
    expect(getLevelFromXP(1000)).toBeGreaterThan(getLevelFromXP(100));
  });

  it("getXPProgress returns valid progress", () => {
    const progress = getXPProgress(500);
    expect(progress.level).toBeGreaterThanOrEqual(1);
    expect(progress.progress).toBeGreaterThanOrEqual(0);
    expect(progress.progress).toBeLessThanOrEqual(100);
    expect(progress.currentXP).toBeLessThanOrEqual(progress.nextLevelXP);
  });
});

describe("utility functions", () => {
  it("getXPForBadge returns correct values", () => {
    expect(getXPForBadge("common")).toBe(10);
    expect(getXPForBadge("rare")).toBe(25);
    expect(getXPForBadge("epic")).toBe(50);
    expect(getXPForBadge("legendary")).toBe(100);
  });

  it("getXPForStreak includes milestone bonuses", () => {
    expect(getXPForStreak(1)).toBe(XP_TABLE.dailyStreakMaintained);
    expect(getXPForStreak(7)).toBe(
      XP_TABLE.dailyStreakMaintained + XP_TABLE.weeklyStreakBonus
    );
    expect(getXPForStreak(30)).toBe(
      XP_TABLE.dailyStreakMaintained + XP_TABLE.monthlyStreakBonus
    );
  });
});
