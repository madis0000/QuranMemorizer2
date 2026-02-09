/**
 * Gamification Store
 * Manages XP, levels, achievements, and league standings
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type League = "talib" | "qari" | "hafiz" | "sheikh" | "imam";

interface GamificationState {
  // XP
  totalXP: number;
  weeklyXP: number;
  level: number;

  // League
  currentLeague: League;
  leagueRank: number;

  // Achievements
  earnedAchievements: string[]; // achievement codes
  recentAchievement: string | null; // for popup notification

  // Actions
  addXP: (amount: number, source: string) => void;
  resetWeeklyXP: () => void;
  earnAchievement: (code: string) => void;
  dismissAchievement: () => void;
  setLeague: (league: League) => void;
  setLeagueRank: (rank: number) => void;
  setTotalXP: (xp: number) => void;
  setLevel: (level: number) => void;
  setWeeklyXP: (xp: number) => void;
  setEarnedAchievements: (achievements: string[]) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      // Initial state
      totalXP: 0,
      weeklyXP: 0,
      level: 1,
      currentLeague: "talib",
      leagueRank: 0,
      earnedAchievements: [],
      recentAchievement: null,

      // Actions
      addXP: (amount: number, source: string) =>
        set((state) => {
          const newTotalXP = state.totalXP + amount;
          const newWeeklyXP = state.weeklyXP + amount;

          // Calculate new level (simple formula: level = floor(totalXP / 100) + 1)
          // This will be replaced by getXPProgress from xp.ts in the API
          const newLevel = Math.floor(newTotalXP / 100) + 1;

          console.log(`[XP] Earned ${amount} XP from ${source}`);

          return {
            totalXP: newTotalXP,
            weeklyXP: newWeeklyXP,
            level: newLevel,
          };
        }),

      resetWeeklyXP: () =>
        set(() => {
          console.log("[XP] Weekly XP reset");
          return { weeklyXP: 0 };
        }),

      earnAchievement: (code: string) =>
        set((state) => {
          if (state.earnedAchievements.includes(code)) {
            return state; // Already earned
          }

          console.log(`[Achievement] Earned: ${code}`);

          return {
            earnedAchievements: [...state.earnedAchievements, code],
            recentAchievement: code,
          };
        }),

      dismissAchievement: () =>
        set(() => ({
          recentAchievement: null,
        })),

      setLeague: (league: League) =>
        set(() => {
          console.log(`[League] Changed to: ${league}`);
          return { currentLeague: league };
        }),

      setLeagueRank: (rank: number) =>
        set(() => ({
          leagueRank: rank,
        })),

      setTotalXP: (xp: number) =>
        set(() => ({
          totalXP: xp,
        })),

      setLevel: (level: number) =>
        set(() => ({
          level,
        })),

      setWeeklyXP: (xp: number) =>
        set(() => ({
          weeklyXP: xp,
        })),

      setEarnedAchievements: (achievements: string[]) =>
        set(() => ({
          earnedAchievements: achievements,
        })),
    }),
    {
      name: "gamification-storage",
      partialize: (state) => ({
        totalXP: state.totalXP,
        weeklyXP: state.weeklyXP,
        level: state.level,
        currentLeague: state.currentLeague,
        leagueRank: state.leagueRank,
        earnedAchievements: state.earnedAchievements,
      }),
    }
  )
);

// League thresholds (weekly XP required)
export const LEAGUE_THRESHOLDS: Record<League, number> = {
  talib: 0, // Starting league
  qari: 500, // 500+ weekly XP
  hafiz: 1500, // 1500+ weekly XP
  sheikh: 3000, // 3000+ weekly XP
  imam: 5000, // 5000+ weekly XP
};

/**
 * Determine league based on weekly XP
 */
export function getLeagueFromWeeklyXP(weeklyXP: number): League {
  if (weeklyXP >= LEAGUE_THRESHOLDS.imam) return "imam";
  if (weeklyXP >= LEAGUE_THRESHOLDS.sheikh) return "sheikh";
  if (weeklyXP >= LEAGUE_THRESHOLDS.hafiz) return "hafiz";
  if (weeklyXP >= LEAGUE_THRESHOLDS.qari) return "qari";
  return "talib";
}

/**
 * Get XP needed for next league
 */
export function getXPForNextLeague(currentLeague: League): number | null {
  const leagues: League[] = ["talib", "qari", "hafiz", "sheikh", "imam"];
  const currentIndex = leagues.indexOf(currentLeague);

  if (currentIndex === leagues.length - 1) {
    return null; // Already at max league
  }

  return LEAGUE_THRESHOLDS[leagues[currentIndex + 1]];
}
