"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types for circle data
export interface CircleListItem {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  memberCount: number;
  groupStreak: number;
  myRole?: string | null;
  inviteCode?: string;
  maxMembers?: number;
  createdAt: string;
}

export interface CircleMemberItem {
  id: string;
  userId: string;
  name: string;
  image: string | null;
  role: "OWNER" | "TEACHER" | "MEMBER";
  weeklyXP: number;
  streakCount: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface CircleChallengeItem {
  id: string;
  circleId: string;
  title: string;
  description: string | null;
  type: string;
  target: Record<string, unknown>;
  progress: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface CircleActivityItem {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  type: string;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface CircleDetail {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  maxMembers: number;
  groupStreak: number;
  inviteCode: string | null;
  memberCount: number;
  isMember: boolean;
  myRole: "OWNER" | "TEACHER" | "MEMBER" | null;
  members: CircleMemberItem[];
  activeChallenge: CircleChallengeItem | null;
  recentActivity: CircleActivityItem[];
  createdAt: string;
}

// Query keys
export const circleKeys = {
  all: ["circles"] as const,
  list: (filter?: string, search?: string) =>
    [...circleKeys.all, "list", { filter, search }] as const,
  detail: (id: string) => [...circleKeys.all, "detail", id] as const,
  activity: (id: string) => [...circleKeys.all, "activity", id] as const,
  challenges: (id: string) => [...circleKeys.all, "challenges", id] as const,
};

// List circles
export function useCircles(filter: string = "mine", search: string = "") {
  return useQuery({
    queryKey: circleKeys.list(filter, search),
    queryFn: async (): Promise<CircleListItem[]> => {
      const params = new URLSearchParams({ filter });
      if (search) params.set("search", search);
      const res = await fetch(`/api/social/circles?${params}`);
      if (!res.ok) throw new Error("Failed to fetch circles");
      return res.json();
    },
  });
}

// Single circle detail
export function useCircle(id: string) {
  return useQuery({
    queryKey: circleKeys.detail(id),
    queryFn: async (): Promise<CircleDetail> => {
      const res = await fetch(`/api/social/circles/${id}`);
      if (!res.ok) throw new Error("Failed to fetch circle");
      return res.json();
    },
    enabled: !!id,
  });
}

// Create circle
export function useCreateCircle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      isPublic?: boolean;
      maxMembers?: number;
    }): Promise<CircleListItem> => {
      const res = await fetch("/api/social/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create circle");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
    },
  });
}

// Join circle
export function useJoinCircle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      circleId,
      inviteCode,
    }: {
      circleId: string;
      inviteCode?: string;
    }) => {
      const res = await fetch(`/api/social/circles/${circleId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to join circle");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
    },
  });
}

// Leave circle
export function useLeaveCircle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (circleId: string) => {
      const res = await fetch(`/api/social/circles/${circleId}/members`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to leave circle");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
    },
  });
}

// Kick member
export function useKickMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      circleId,
      userId,
    }: {
      circleId: string;
      userId: string;
    }) => {
      const res = await fetch(
        `/api/social/circles/${circleId}/members?userId=${userId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to remove member");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.detail(variables.circleId),
      });
    },
  });
}

// Activity feed
export function useCircleActivity(id: string) {
  return useQuery({
    queryKey: circleKeys.activity(id),
    queryFn: async (): Promise<{
      items: CircleActivityItem[];
      nextCursor: string | null;
    }> => {
      const res = await fetch(`/api/social/circles/${id}/activity`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
    enabled: !!id,
  });
}

// Challenges
export function useCircleChallenges(id: string) {
  return useQuery({
    queryKey: circleKeys.challenges(id),
    queryFn: async (): Promise<CircleChallengeItem[]> => {
      const res = await fetch(`/api/social/circles/${id}/challenges`);
      if (!res.ok) throw new Error("Failed to fetch challenges");
      return res.json();
    },
    enabled: !!id,
  });
}

// Create challenge
export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      circleId,
      ...data
    }: {
      circleId: string;
      title: string;
      description?: string;
      type: string;
      target: Record<string, unknown>;
      endDate: string;
    }) => {
      const res = await fetch(`/api/social/circles/${circleId}/challenges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create challenge");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.challenges(variables.circleId),
      });
      queryClient.invalidateQueries({
        queryKey: circleKeys.detail(variables.circleId),
      });
    },
  });
}

// Update circle
export function useUpdateCircle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      circleId,
      ...data
    }: {
      circleId: string;
      name?: string;
      description?: string;
      isPublic?: boolean;
      maxMembers?: number;
    }) => {
      const res = await fetch(`/api/social/circles/${circleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update circle");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: circleKeys.detail(variables.circleId),
      });
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
    },
  });
}

// Delete circle
export function useDeleteCircle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (circleId: string) => {
      const res = await fetch(`/api/social/circles/${circleId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete circle");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
    },
  });
}
