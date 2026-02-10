"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const srsKeys = {
  all: ["srs"] as const,
  cards: (params?: Record<string, string>) =>
    [...srsKeys.all, "cards", params] as const,
  due: (category?: string) => [...srsKeys.all, "due", { category }] as const,
  stats: (category?: string) =>
    [...srsKeys.all, "stats", { category }] as const,
};

// Fetch all due cards
export function useDueCards(category?: string) {
  const params = new URLSearchParams({ due: "true" });
  if (category) params.set("category", category);

  return useQuery({
    queryKey: srsKeys.due(category),
    queryFn: async () => {
      const res = await fetch(`/api/progress/srs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch due cards");
      return res.json() as Promise<{ cards: SRSCardResponse[] }>;
    },
    refetchInterval: 60 * 1000, // refetch every minute
  });
}

// Fetch SRS stats
export function useSRSStats(category?: string) {
  const params = new URLSearchParams({ stats: "true" });
  if (category) params.set("category", category);

  return useQuery({
    queryKey: srsKeys.stats(category),
    queryFn: async () => {
      const res = await fetch(`/api/progress/srs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch SRS stats");
      return res.json() as Promise<SRSStatsResponse>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Review a card (submit rating based on accuracy)
export function useReviewCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      surahNumber: number;
      ayahNumber: number;
      accuracy: number;
      showOptions?: boolean;
    }) => {
      const res = await fetch("/api/progress/srs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to review card");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: srsKeys.all });
    },
  });
}

// Add new cards for memorization
export function useAddCards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      surahNumber: number;
      startAyah: number;
      endAyah: number;
      category?: "sabaq" | "sabqi" | "manzil";
    }) => {
      const res = await fetch("/api/progress/srs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add cards");
      return res.json() as Promise<{ added: number; total: number }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: srsKeys.all });
    },
  });
}

// Types
export interface SRSCardResponse {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number; // 0=New, 1=Learning, 2=Review, 3=Relearning
  last_review: string | null;
  totalReviews: number;
  averageAccuracy: number;
  category?: "sabaq" | "sabqi" | "manzil";
}

export interface SRSStatsResponse {
  total: number;
  dueToday: number;
  newCards: number;
  learning: number;
  relearning: number;
  young: number;
  mature: number;
  averageAccuracy: number;
  averageDifficulty: number;
}
