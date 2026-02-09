"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { StudyPlan } from "@/lib/curriculum/plan-generator";

// Query keys
export const curriculumKeys = {
  all: ["curriculum"] as const,
  plans: () => [...curriculumKeys.all, "plans"] as const,
  activePlan: () => [...curriculumKeys.all, "activePlan"] as const,
  daily: () => [...curriculumKeys.all, "daily"] as const,
};

/**
 * Fetch all plans (active + history)
 */
export function usePlans() {
  return useQuery({
    queryKey: curriculumKeys.plans(),
    queryFn: async () => {
      const res = await fetch("/api/curriculum/plans");
      if (!res.ok) throw new Error("Failed to fetch plans");
      return res.json() as Promise<{
        activePlan: StudyPlan | null;
        planHistory: StudyPlan[];
      }>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new study plan
 */
export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: StudyPlan) => {
      const res = await fetch("/api/curriculum/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      if (!res.ok) throw new Error("Failed to create plan");
      return res.json() as Promise<{ plan: StudyPlan }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
    },
  });
}

/**
 * Get today's daily target
 */
export function useDailyTarget() {
  return useQuery({
    queryKey: curriculumKeys.daily(),
    queryFn: async () => {
      const res = await fetch("/api/curriculum/daily");
      if (!res.ok) throw new Error("Failed to fetch daily target");
      return res.json() as Promise<{
        target: StudyPlan["schedule"][number] | null;
        plan: StudyPlan | null;
      }>;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Mark today's daily target as complete
 */
export function useCompleteDailyTarget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (date: string) => {
      const res = await fetch("/api/curriculum/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (!res.ok) throw new Error("Failed to complete daily target");
      return res.json() as Promise<{
        completed: boolean;
        planCompleted: boolean;
        message: string;
      }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
    },
  });
}
