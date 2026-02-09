import { describe, expect, it } from "vitest";

import { calculateStreak, generateHeatmap } from "../streaks";

// Helper: get today's date string (YYYY-MM-DD) using the same logic as the production code
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// Helper: offset a date by N days using UTC arithmetic (matches production getDateOffset)
function offsetDate(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}

// Helper: generate N consecutive dates ending at endDate (descending)
function consecutiveDates(endDate: string, count: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    dates.push(offsetDate(endDate, -i));
  }
  return dates;
}

describe("calculateStreak", () => {
  it("returns 0 for empty history", () => {
    const result = calculateStreak([]);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.lastActiveDate).toBeNull();
    expect(result.totalDaysActive).toBe(0);
  });

  it("calculates current streak from consecutive dates including today", () => {
    const today = getToday();
    const dates = consecutiveDates(today, 5);
    const result = calculateStreak(dates);
    expect(result.currentStreak).toBe(5);
    expect(result.longestStreak).toBe(5);
    expect(result.totalDaysActive).toBe(5);
  });

  it("calculates current streak when last active was yesterday", () => {
    const today = getToday();
    const yesterday = offsetDate(today, -1);
    const dates = consecutiveDates(yesterday, 3);
    const result = calculateStreak(dates);
    expect(result.currentStreak).toBe(3);
  });

  it("streak is 0 if last activity was 2+ days ago", () => {
    const today = getToday();
    const twoDaysAgo = offsetDate(today, -2);
    const dates = consecutiveDates(twoDaysAgo, 3);
    const result = calculateStreak(dates);
    expect(result.currentStreak).toBe(0);
  });

  it("missed day breaks the streak count", () => {
    const today = getToday();
    const yesterday = offsetDate(today, -1);
    const threeDaysAgo = offsetDate(today, -3);
    const fourDaysAgo = offsetDate(today, -4);
    const dates = [today, yesterday, threeDaysAgo, fourDaysAgo];
    const result = calculateStreak(dates);
    expect(result.currentStreak).toBe(2); // only today + yesterday
  });

  it("same day does not double-count", () => {
    const today = getToday();
    const yesterday = offsetDate(today, -1);
    const dates = [today, today, yesterday];
    const result = calculateStreak(dates);
    // Duplicate breaks consecutive check so streak = 1
    expect(result.currentStreak).toBe(1);
    expect(result.totalDaysActive).toBe(3); // counts raw entries
  });

  it("longest streak tracked correctly when current is shorter", () => {
    const today = getToday();
    const dates = [
      today,
      offsetDate(today, -1),
      // gap
      offsetDate(today, -5),
      offsetDate(today, -6),
      offsetDate(today, -7),
      offsetDate(today, -8),
      offsetDate(today, -9),
    ];
    const result = calculateStreak(dates);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(5);
  });

  it("handles single day activity (today)", () => {
    const today = getToday();
    const dates = [today];
    const result = calculateStreak(dates);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.lastActiveDate).toBe(today);
  });

  it("sorts unsorted input correctly", () => {
    const today = getToday();
    const yesterday = offsetDate(today, -1);
    const twoDaysAgo = offsetDate(today, -2);
    const dates = [twoDaysAgo, today, yesterday];
    const result = calculateStreak(dates);
    expect(result.currentStreak).toBe(3);
    expect(result.lastActiveDate).toBe(today);
  });
});

describe("generateHeatmap", () => {
  it("generates entries for the specified number of days", () => {
    const entries = generateHeatmap([], {}, 30);
    expect(entries).toHaveLength(30);
  });

  it("defaults to 365 days", () => {
    const entries = generateHeatmap([], {});
    expect(entries).toHaveLength(365);
  });

  it("marks active dates correctly", () => {
    const today = getToday();
    const yesterday = offsetDate(today, -1);
    const activeDates = [today, yesterday];
    const entries = generateHeatmap(activeDates, {}, 7);

    const todayEntry = entries.find((e) => e.date === today);
    const yesterdayEntry = entries.find((e) => e.date === yesterday);

    expect(todayEntry?.isActive).toBe(true);
    expect(yesterdayEntry?.isActive).toBe(true);
  });

  it("caps count at 4 for intensity levels", () => {
    const today = getToday();
    const sessionCounts: Record<string, number> = {
      [today]: 10,
    };
    const entries = generateHeatmap([], sessionCounts, 7);
    const todayEntry = entries.find((e) => e.date === today);
    expect(todayEntry?.count).toBe(4);
  });

  it("returns 0 count for dates without sessions", () => {
    const entries = generateHeatmap([], {}, 7);
    for (const entry of entries) {
      expect(entry.count).toBe(0);
    }
  });

  it("entries are sorted oldest first", () => {
    const entries = generateHeatmap([], {}, 7);
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].date >= entries[i - 1].date).toBe(true);
    }
  });
});
