"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const challengeKeys = {
  all: ["challenges"] as const,
  daily: () => [...challengeKeys.all, "daily"] as const,
  history: () => [...challengeKeys.all, "history"] as const,
  list: () => [...challengeKeys.all, "list"] as const,
};

export function useDailyChallenge() {
  return useQuery({
    queryKey: challengeKeys.daily(),
    queryFn: async () => {
      const res = await fetch("/api/gamification/challenges?type=daily");
      if (!res.ok) throw new Error("Failed to fetch daily challenge");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useChallengeHistory() {
  return useQuery({
    queryKey: challengeKeys.history(),
    queryFn: async () => {
      const res = await fetch("/api/gamification/challenges?history=true");
      if (!res.ok) throw new Error("Failed to fetch challenge history");
      return res.json();
    },
  });
}

export function useChallenges() {
  return useQuery({
    queryKey: challengeKeys.list(),
    queryFn: async () => {
      const res = await fetch("/api/gamification/challenges");
      if (!res.ok) throw new Error("Failed to fetch challenges");
      return res.json();
    },
  });
}

export function useSubmitChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      challengeId: string;
      score: number;
      accuracy?: number;
      duration: number;
      completed?: boolean;
      stars?: number;
    }) => {
      const res = await fetch("/api/gamification/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit challenge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.all });
    },
  });
}
