import { describe, expect, it } from "vitest";

import {
  BADGE_DEFINITIONS,
  evaluateBadges,
  getBadgeByCode,
  type UserActivity,
} from "../badges";

describe("evaluateBadges", () => {
  it("awards first_steps badge after 1 session", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("first_steps");
  });

  it("does not award first_steps if already earned", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
    };
    const newBadges = evaluateBadges(activity, ["first_steps"]);
    expect(newBadges).not.toContain("first_steps");
  });

  it("awards streak_7 badge at 7 day streak", () => {
    const activity: UserActivity = {
      currentStreak: 7,
      totalSessions: 10,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("streak_7");
  });

  it("does not award streak_7 at 6 day streak", () => {
    const activity: UserActivity = {
      currentStreak: 6,
      totalSessions: 6,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).not.toContain("streak_7");
  });

  it("awards streak_30 badge at 30 day streak", () => {
    const activity: UserActivity = {
      currentStreak: 30,
      totalSessions: 50,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("streak_30");
  });

  it("awards streak_100 badge at 100 day streak", () => {
    const activity: UserActivity = {
      currentStreak: 100,
      totalSessions: 150,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("streak_100");
  });

  it("awards perfect_session badge for 100% accuracy", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
      lastSessionAccuracy: 100,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("perfect_session");
  });

  it("does not award perfect_session for 99% accuracy", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
      lastSessionAccuracy: 99,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).not.toContain("perfect_session");
  });

  it("awards night_owl for session at 23:00", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
      lastSessionHour: 23,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("night_owl");
  });

  it("awards night_owl for session at 2 AM (wraps midnight)", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
      lastSessionHour: 2,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("night_owl");
  });

  it("awards early_bird for session at 5 AM", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
      lastSessionHour: 5,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("early_bird");
  });

  it("awards marathon badge for 30+ minute session", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 1,
      lastSessionDuration: 1800, // 30 minutes in seconds
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("marathon");
  });

  it("awards dedicated_50 badge at 50 sessions", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 50,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("dedicated_50");
  });

  it("awards multiple badges in one evaluation", () => {
    const activity: UserActivity = {
      currentStreak: 7,
      totalSessions: 50,
      lastSessionAccuracy: 100,
      lastSessionDuration: 2000,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("first_steps");
    expect(newBadges).toContain("streak_7");
    expect(newBadges).toContain("dedicated_50");
    expect(newBadges).toContain("perfect_session");
    expect(newBadges).toContain("marathon");
    expect(newBadges.length).toBeGreaterThanOrEqual(5);
  });

  it("does not re-award already earned badges", () => {
    const activity: UserActivity = {
      currentStreak: 100,
      totalSessions: 200,
      lastSessionAccuracy: 100,
    };
    const alreadyEarned = [
      "first_steps",
      "streak_7",
      "streak_30",
      "streak_100",
    ];
    const newBadges = evaluateBadges(activity, alreadyEarned);
    for (const earned of alreadyEarned) {
      expect(newBadges).not.toContain(earned);
    }
  });

  it("surah_complete_1 triggers when 1 surah completed", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 10,
      completedSurahs: 1,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("surah_complete_1");
  });

  it("speed_reader triggers for 10+ pages in session", () => {
    const activity: UserActivity = {
      currentStreak: 1,
      totalSessions: 5,
      pagesInLastSession: 10,
    };
    const newBadges = evaluateBadges(activity, []);
    expect(newBadges).toContain("speed_reader");
  });
});

describe("getBadgeByCode", () => {
  it("returns badge definition for valid code", () => {
    const badge = getBadgeByCode("first_steps");
    expect(badge).toBeDefined();
    expect(badge?.name).toBe("First Steps");
  });

  it("returns undefined for invalid code", () => {
    const badge = getBadgeByCode("nonexistent_badge");
    expect(badge).toBeUndefined();
  });
});

describe("BADGE_DEFINITIONS", () => {
  it("has unique badge codes", () => {
    const codes = BADGE_DEFINITIONS.map((b) => b.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it("all badges have required fields", () => {
    for (const badge of BADGE_DEFINITIONS) {
      expect(badge.code).toBeTruthy();
      expect(badge.name).toBeTruthy();
      expect(badge.description).toBeTruthy();
      expect(badge.icon).toBeTruthy();
      expect(badge.category).toBeTruthy();
      expect(badge.requirement).toBeTruthy();
    }
  });
});
