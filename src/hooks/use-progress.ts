"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const progressKeys = {
  all: ["progress"] as const,
  sessions: (params?: Record<string, string>) =>
    [...progressKeys.all, "sessions", params] as const,
  activeSessions: () => [...progressKeys.all, "sessions", "active"] as const,
  streaks: () => [...progressKeys.all, "streaks"] as const,
  goals: (active?: boolean) =>
    [...progressKeys.all, "goals", { active }] as const,
  settings: () => ["user", "settings"] as const,
  bookmarks: (surahNumber?: number) =>
    ["user", "bookmarks", { surahNumber }] as const,
  badges: () => ["user", "badges"] as const,
};

// Session hooks
export function useSessions(params?: {
  limit?: number;
  offset?: number;
  mode?: string;
  status?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());
  if (params?.mode) searchParams.set("mode", params.mode);
  if (params?.status) searchParams.set("status", params.status);

  return useQuery({
    queryKey: progressKeys.sessions(Object.fromEntries(searchParams)),
    queryFn: async () => {
      const res = await fetch(`/api/progress/sessions?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
  });
}

// Fetch ACTIVE/PAUSED sessions for recovery
export function useActiveSessions() {
  return useQuery({
    queryKey: progressKeys.activeSessions(),
    queryFn: async () => {
      const res = await fetch(
        "/api/progress/sessions?status=ACTIVE,PAUSED&limit=5"
      );
      if (!res.ok) throw new Error("Failed to fetch active sessions");
      return res.json() as Promise<{
        sessions: Array<{
          id: string;
          surahNumber: number;
          startAyah: number;
          endAyah: number;
          pageNumber: number | null;
          mode: string;
          duration: number;
          accuracy: number | null;
          wordsRecited: number;
          status: string;
          stateSnapshot: Record<string, unknown> | null;
          targetType: string | null;
          pausedAt: string | null;
          createdAt: string;
        }>;
        total: number;
      }>;
    },
    staleTime: 0,
  });
}

// Pause an active session
export function usePauseSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      stateSnapshot: Record<string, unknown>;
      duration: number;
    }) => {
      const res = await fetch(`/api/progress/sessions/${data.sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pause",
          stateSnapshot: data.stateSnapshot,
          duration: data.duration,
        }),
      });
      if (!res.ok) throw new Error("Failed to pause session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.activeSessions(),
      });
    },
  });
}

// Resume a paused session
export function useResumeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`/api/progress/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume" }),
      });
      if (!res.ok) throw new Error("Failed to resume session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.activeSessions(),
      });
    },
  });
}

// Complete a DB-tracked session
export function useCompleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      duration: number;
      accuracy?: number;
      wordsRecited?: number;
      mistakeCount?: number;
      mistakes?: Array<{
        surahNumber: number;
        ayahNumber: number;
        wordIndex: number;
        type: string;
        recitedText?: string;
        correctText: string;
        severity: string;
      }>;
    }) => {
      const res = await fetch(`/api/progress/sessions/${data.sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          duration: data.duration,
          accuracy: data.accuracy,
          wordsRecited: data.wordsRecited,
          mistakeCount: data.mistakeCount,
          mistakes: data.mistakes,
        }),
      });
      if (!res.ok) throw new Error("Failed to complete session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      queryClient.invalidateQueries({ queryKey: progressKeys.streaks() });
      queryClient.invalidateQueries({
        queryKey: progressKeys.activeSessions(),
      });
    },
  });
}

// Discard a session
export function useDiscardSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`/api/progress/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to discard session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.activeSessions(),
      });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      surahNumber: number;
      startAyah: number;
      endAyah: number;
      pageNumber?: number;
      mode: string;
      duration: number;
      accuracy?: number;
      wordsRecited: number;
      mistakeCount: number;
      mistakes?: Array<{
        surahNumber: number;
        ayahNumber: number;
        wordIndex: number;
        type: string;
        recitedText?: string;
        correctText: string;
        severity: string;
      }>;
    }) => {
      const res = await fetch("/api/progress/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      queryClient.invalidateQueries({ queryKey: progressKeys.streaks() });
    },
  });
}

// Streak hooks
export function useStreaks() {
  return useQuery({
    queryKey: progressKeys.streaks(),
    queryFn: async () => {
      const res = await fetch("/api/progress/streaks");
      if (!res.ok) throw new Error("Failed to fetch streaks");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Goal hooks
export function useGoals(active?: boolean) {
  return useQuery({
    queryKey: progressKeys.goals(active),
    queryFn: async () => {
      const params = active !== undefined ? `?active=${active}` : "";
      const res = await fetch(`/api/progress/goals${params}`);
      if (!res.ok) throw new Error("Failed to fetch goals");
      return res.json();
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      type: string;
      target: Record<string, unknown>;
      frequency: string;
      targetValue: number;
      reminderTime?: string;
      daysOfWeek?: number[];
    }) => {
      const res = await fetch("/api/progress/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create goal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.goals() });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      goalId: string;
      currentValue?: number;
      isActive?: boolean;
      progress?: number;
    }) => {
      const res = await fetch("/api/progress/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update goal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.goals() });
    },
  });
}

// Settings hooks
export function useSettings() {
  return useQuery({
    queryKey: progressKeys.settings(),
    queryFn: async () => {
      const res = await fetch("/api/user/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Record<string, unknown>) => {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.settings() });
    },
  });
}

// Bookmark hooks
export function useBookmarks(surahNumber?: number) {
  return useQuery({
    queryKey: progressKeys.bookmarks(surahNumber),
    queryFn: async () => {
      const params = surahNumber ? `?surahNumber=${surahNumber}` : "";
      const res = await fetch(`/api/user/bookmarks${params}`);
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      return res.json();
    },
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      surahNumber: number;
      ayahNumber: number;
      pageNumber?: number;
      title?: string;
      note?: string;
      color?: string;
    }) => {
      const res = await fetch("/api/user/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create bookmark");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "bookmarks"] });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/user/bookmarks?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete bookmark");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "bookmarks"] });
    },
  });
}

// Badge hooks
export function useBadges() {
  return useQuery({
    queryKey: progressKeys.badges(),
    queryFn: async () => {
      const res = await fetch("/api/user/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ===== Progress Dashboard Hooks =====

export function useMemoryMap() {
  return useQuery({
    queryKey: [...progressKeys.all, "memory-map"],
    queryFn: async () => {
      const res = await fetch("/api/progress/memory-map");
      if (!res.ok) throw new Error("Failed to fetch memory map");
      return res.json() as Promise<{
        pages: Array<{
          page: number;
          level:
            | "not_started"
            | "weak"
            | "learning"
            | "moderate"
            | "strong"
            | "mastered";
          accuracy: number;
          sessionsCount: number;
          lastPracticed: string | null;
          retention: number;
        }>;
      }>;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useReviewForecast() {
  return useQuery({
    queryKey: [...progressKeys.all, "forecast"],
    queryFn: async () => {
      const res = await fetch("/api/progress/forecast");
      if (!res.ok) throw new Error("Failed to fetch forecast");
      return res.json() as Promise<{
        forecast: Array<{ date: string; count: number; isToday: boolean }>;
        overdue: {
          total: number;
          critical: number;
          warning: number;
          mild: number;
        };
        debtRatio: number;
        dailyAverage: number;
        totalCards: number;
      }>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDualScores() {
  return useQuery({
    queryKey: [...progressKeys.all, "scores"],
    queryFn: async () => {
      const res = await fetch("/api/progress/scores");
      if (!res.ok) throw new Error("Failed to fetch scores");
      return res.json() as Promise<{
        hifdh: {
          score: number;
          label: string;
          trend: "up" | "down" | "stable";
          delta: number;
        };
        itqan: {
          score: number;
          label: string;
          trend: "up" | "down" | "stable";
          delta: number;
        };
        totalVerses: number;
        matureVerses: number;
      }>;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCoachInsights() {
  return useQuery({
    queryKey: [...progressKeys.all, "insights"],
    queryFn: async () => {
      const res = await fetch("/api/progress/insights");
      if (!res.ok) throw new Error("Failed to fetch insights");
      return res.json() as Promise<{
        insights: Array<{
          id: string;
          icon: string;
          text: string;
          actionUrl?: string;
          priority: number;
        }>;
      }>;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useEffortRetention(limit = 500) {
  return useQuery({
    queryKey: [...progressKeys.all, "scatter", limit],
    queryFn: async () => {
      const res = await fetch(`/api/progress/scatter?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch scatter data");
      return res.json() as Promise<
        Array<{
          verseKey: string;
          x: number;
          y: number;
          surahNumber: number;
          ayahNumber: number;
          quadrant: "easy_win" | "well_earned" | "stubborn" | "at_risk";
          totalReviews: number;
        }>
      >;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useTimeline() {
  return useQuery({
    queryKey: [...progressKeys.all, "timeline"],
    queryFn: async () => {
      const res = await fetch("/api/progress/timeline");
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json() as Promise<{
        milestones: Array<{
          date: string;
          type: string;
          title: string;
          subtitle?: string;
          isPast: boolean;
          confidence?: {
            optimistic: string;
            conservative: string;
          };
        }>;
      }>;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useWrapped(period: "month" | "year" = "month") {
  return useQuery({
    queryKey: [...progressKeys.all, "wrapped", period],
    queryFn: async () => {
      const res = await fetch(`/api/progress/wrapped?period=${period}`);
      if (!res.ok) throw new Error("Failed to fetch wrapped");
      return res.json() as Promise<{
        period: string;
        periodLabel: string;
        totalSessions: number;
        totalMinutes: number;
        versesMemorized: number;
        strongestSurah: {
          surahNumber: number;
          name: string;
          accuracy: number;
          sessions: number;
        } | null;
        mostImproved: {
          surahNumber: number;
          name: string;
          improvement: number;
        } | null;
        totalXP: number;
        league: string | null;
        longestStreak: number;
        badgesEarned: number;
        favoriteDay: string;
      }>;
    },
    staleTime: 60 * 60 * 1000,
  });
}
