"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const progressKeys = {
  all: ["progress"] as const,
  sessions: (params?: Record<string, string>) =>
    [...progressKeys.all, "sessions", params] as const,
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
}) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());
  if (params?.mode) searchParams.set("mode", params.mode);

  return useQuery({
    queryKey: progressKeys.sessions(Object.fromEntries(searchParams)),
    queryFn: async () => {
      const res = await fetch(`/api/progress/sessions?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
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
