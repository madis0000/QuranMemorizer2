"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const gardenKeys = {
  all: ["garden"] as const,
  state: () => [...gardenKeys.all, "state"] as const,
};

export function useGarden() {
  return useQuery({
    queryKey: gardenKeys.state(),
    queryFn: async () => {
      const res = await fetch("/api/gamification/garden");
      if (!res.ok) throw new Error("Failed to fetch garden");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateGarden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      state: Record<string, unknown>;
      hasanat?: number;
      gardenLevel?: number;
      isParadise?: boolean;
    }) => {
      const res = await fetch("/api/gamification/garden", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update garden");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all });
    },
  });
}

export function usePurchaseDecoration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (decorationId: string) => {
      const res = await fetch("/api/gamification/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decorationId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to purchase decoration");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gardenKeys.all });
    },
  });
}
