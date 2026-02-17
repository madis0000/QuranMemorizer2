"use client";

import { useQuery } from "@tanstack/react-query";

export interface WordFeedbackData {
  wordKey: string;
  totalAttempts: number;
  correctCount: number;
  mistakeCount: number;
  successRate: number;
  streak: number;
  lastCorrect: string | null;
  lastMistake: string | null;
}

export type WeaknessLevel = "strong" | "moderate" | "weak" | "new";

/**
 * Compute weakness level from word feedback data.
 * - strong: successRate >= 0.85 AND streak >= 2
 * - moderate: successRate >= 0.6
 * - weak: successRate < 0.6
 * - new: totalAttempts === 0
 */
export function computeWeaknessLevel(fb: WordFeedbackData): WeaknessLevel {
  if (fb.totalAttempts === 0) return "new";
  if (fb.successRate >= 0.85 && fb.streak >= 2) return "strong";
  if (fb.successRate >= 0.6) return "moderate";
  return "weak";
}

/**
 * Fetch word feedback for a surah + ayah range.
 * Returns a Map keyed by wordKey for O(1) lookups.
 */
export function useWordFeedback(
  surah: number,
  startAyah: number,
  endAyah: number
) {
  return useQuery({
    queryKey: ["word-feedback", surah, startAyah, endAyah],
    queryFn: async () => {
      const res = await fetch(
        `/api/progress/word-feedback?surah=${surah}&startAyah=${startAyah}&endAyah=${endAyah}`
      );
      if (!res.ok) return new Map<string, WordFeedbackData>();
      const data = await res.json();
      const map = new Map<string, WordFeedbackData>();
      for (const fb of data.feedback ?? []) {
        map.set(fb.wordKey, fb);
      }
      return map;
    },
    enabled: surah > 0 && startAyah > 0 && endAyah > 0,
    staleTime: 60_000, // 1 minute
  });
}
