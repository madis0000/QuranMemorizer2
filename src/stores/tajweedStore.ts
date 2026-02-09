import type { TajweedRuleType } from "@/types/quran";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ===== Types =====

export type MasteryLevel =
  | "NONE"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "MASTER";

export interface PracticeRecord {
  ruleType: TajweedRuleType;
  score: number; // 0-100
  timestamp: number;
  verseKey: string; // "surah:ayah"
}

/** Mastery threshold requirements */
export interface MasteryThreshold {
  level: MasteryLevel;
  minScore: number; // Minimum average score
  minSessions: number; // Minimum practice sessions
}

export const MASTERY_THRESHOLDS: MasteryThreshold[] = [
  { level: "NONE", minScore: 0, minSessions: 0 },
  { level: "BRONZE", minScore: 70, minSessions: 3 },
  { level: "SILVER", minScore: 80, minSessions: 5 },
  { level: "GOLD", minScore: 90, minSessions: 7 },
  { level: "PLATINUM", minScore: 95, minSessions: 10 },
  { level: "MASTER", minScore: 98, minSessions: 15 },
];

/** Mastery level colors for display */
export const MASTERY_LEVEL_COLORS: Record<MasteryLevel, string> = {
  NONE: "#9CA3AF", // Gray
  BRONZE: "#CD7F32", // Bronze
  SILVER: "#C0C0C0", // Silver
  GOLD: "#FFD700", // Gold
  PLATINUM: "#E5E4E2", // Platinum
  MASTER: "#B9F2FF", // Diamond blue
};

/** Mastery level labels */
export const MASTERY_LEVEL_LABELS: Record<MasteryLevel, string> = {
  NONE: "Not Started",
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platinum",
  MASTER: "Master",
};

/** Progress percentage for each mastery level (for display) */
export const MASTERY_LEVEL_PROGRESS: Record<MasteryLevel, number> = {
  NONE: 0,
  BRONZE: 20,
  SILVER: 40,
  GOLD: 60,
  PLATINUM: 80,
  MASTER: 100,
};

// ===== Store Interface =====

interface TajweedState {
  /** Mastery level per rule type */
  masteryLevels: Record<TajweedRuleType, MasteryLevel>;

  /** Currently active/selected rule for detail view */
  activeRule: TajweedRuleType | null;

  /** Practice session history (last 100) */
  practiceHistory: PracticeRecord[];

  /** Current stage in the mastery path (1-6) */
  currentStage: number;

  /** Unlocked stages (all stages up to this number are available) */
  unlockedStages: number;

  // ===== Actions =====

  /** Set the active rule for viewing/practicing */
  setActiveRule: (rule: TajweedRuleType | null) => void;

  /** Record a practice session result */
  recordPractice: (record: PracticeRecord) => void;

  /** Recalculate mastery level for a given rule type based on recent history */
  updateMastery: (ruleType: TajweedRuleType) => void;

  /** Unlock the next stage if the current one is sufficiently mastered */
  unlockStage: (stage: number) => void;

  /** Set the current stage */
  setCurrentStage: (stage: number) => void;

  /** Get average score for a rule type from recent history */
  getAverageScore: (ruleType: TajweedRuleType) => number;

  /** Get session count for a rule type */
  getSessionCount: (ruleType: TajweedRuleType) => number;

  /** Reset all progress */
  resetProgress: () => void;
}

// ===== Default mastery levels =====

const DEFAULT_MASTERY: Record<TajweedRuleType, MasteryLevel> = {
  ghunnah: "NONE",
  qalqalah: "NONE",
  madd_normal: "NONE",
  madd_munfasil: "NONE",
  madd_muttasil: "NONE",
  madd_lazim: "NONE",
  idgham_ghunnah: "NONE",
  idgham_no_ghunnah: "NONE",
  ikhfa: "NONE",
  ikhfa_shafawi: "NONE",
  iqlab: "NONE",
  izhar: "NONE",
  izhar_shafawi: "NONE",
};

// ===== Helper: compute mastery level from scores =====

function computeMasteryLevel(
  avgScore: number,
  sessionCount: number
): MasteryLevel {
  // Walk thresholds in reverse to find highest qualifying level
  for (let i = MASTERY_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = MASTERY_THRESHOLDS[i];
    if (
      avgScore >= threshold.minScore &&
      sessionCount >= threshold.minSessions
    ) {
      return threshold.level;
    }
  }
  return "NONE";
}

// ===== Store =====

export const useTajweedStore = create<TajweedState>()(
  persist(
    (set, get) => ({
      masteryLevels: { ...DEFAULT_MASTERY },
      activeRule: null,
      practiceHistory: [],
      currentStage: 1,
      unlockedStages: 1,

      setActiveRule: (rule) => set({ activeRule: rule }),

      recordPractice: (record) => {
        set((state) => {
          const newHistory = [...state.practiceHistory, record];
          // Keep only last 100 records per rule type for memory efficiency
          // But keep overall history at max 500
          const trimmed =
            newHistory.length > 500 ? newHistory.slice(-500) : newHistory;
          return { practiceHistory: trimmed };
        });

        // Auto-update mastery after recording
        get().updateMastery(record.ruleType);
      },

      updateMastery: (ruleType) => {
        const state = get();
        const records = state.practiceHistory.filter(
          (r) => r.ruleType === ruleType
        );

        if (records.length === 0) return;

        // Use last N records for average (where N is the highest threshold requirement)
        const recentRecords = records.slice(-15);
        const avgScore =
          recentRecords.reduce((sum, r) => sum + r.score, 0) /
          recentRecords.length;
        const sessionCount = records.length;

        const newLevel = computeMasteryLevel(avgScore, sessionCount);

        if (newLevel !== state.masteryLevels[ruleType]) {
          set((s) => ({
            masteryLevels: {
              ...s.masteryLevels,
              [ruleType]: newLevel,
            },
          }));
        }
      },

      unlockStage: (stage) => {
        set((state) => ({
          unlockedStages: Math.max(state.unlockedStages, stage),
        }));
      },

      setCurrentStage: (stage) => {
        const state = get();
        if (stage >= 1 && stage <= 6 && stage <= state.unlockedStages) {
          set({ currentStage: stage });
        }
      },

      getAverageScore: (ruleType) => {
        const records = get().practiceHistory.filter(
          (r) => r.ruleType === ruleType
        );
        if (records.length === 0) return 0;
        const recent = records.slice(-15);
        return Math.round(
          recent.reduce((sum, r) => sum + r.score, 0) / recent.length
        );
      },

      getSessionCount: (ruleType) => {
        return get().practiceHistory.filter((r) => r.ruleType === ruleType)
          .length;
      },

      resetProgress: () => {
        set({
          masteryLevels: { ...DEFAULT_MASTERY },
          activeRule: null,
          practiceHistory: [],
          currentStage: 1,
          unlockedStages: 1,
        });
      },
    }),
    {
      name: "tajweed-store",
      partialize: (state) => ({
        masteryLevels: state.masteryLevels,
        practiceHistory: state.practiceHistory,
        currentStage: state.currentStage,
        unlockedStages: state.unlockedStages,
      }),
    }
  )
);
