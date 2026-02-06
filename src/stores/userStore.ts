import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "sepia" | "system";

export interface UserSettings {
  // Display
  theme: Theme;
  language: string;

  // Notifications
  dailyReminder: boolean;
  reminderTime: string; // HH:mm format
  streakReminder: boolean;
  goalReminder: boolean;
  soundEnabled: boolean;

  // Privacy
  showOnLeaderboard: boolean;
  shareProgress: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // ISO date string
  totalDaysActive: number;
}

interface UserState {
  // User info (from session)
  userId: string | null;
  name: string | null;
  email: string | null;
  image: string | null;

  // Settings
  settings: UserSettings;

  // Streak data
  streak: StreakData;

  // UI state
  sidebarOpen: boolean;
  isOnboarded: boolean;

  // Actions
  setUser: (user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }) => void;
  clearUser: () => void;

  updateSettings: (settings: Partial<UserSettings>) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;

  updateStreak: (data: Partial<StreakData>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
}

const defaultSettings: UserSettings = {
  theme: "system",
  language: "en",
  dailyReminder: true,
  reminderTime: "08:00",
  streakReminder: true,
  goalReminder: true,
  soundEnabled: true,
  showOnLeaderboard: true,
  shareProgress: false,
};

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalDaysActive: 0,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: null,
      name: null,
      email: null,
      image: null,

      settings: defaultSettings,
      streak: defaultStreak,

      sidebarOpen: true,
      isOnboarded: false,

      // Actions
      setUser: (user) =>
        set({
          userId: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
        }),

      clearUser: () =>
        set({
          userId: null,
          name: null,
          email: null,
          image: null,
        }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),

      setLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),

      updateStreak: (data) =>
        set((state) => ({
          streak: { ...state.streak, ...data },
        })),

      incrementStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();

        // Check if already recorded today
        if (state.streak.lastActiveDate === today) {
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        // Check if streak continues or resets
        const continuesStreak = state.streak.lastActiveDate === yesterdayStr;
        const newStreak = continuesStreak ? state.streak.currentStreak + 1 : 1;

        set({
          streak: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.streak.longestStreak),
            lastActiveDate: today,
            totalDaysActive: state.streak.totalDaysActive + 1,
          },
        });
      },

      resetStreak: () =>
        set((state) => ({
          streak: {
            ...state.streak,
            currentStreak: 0,
          },
        })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        settings: state.settings,
        streak: state.streak,
        sidebarOpen: state.sidebarOpen,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);
