"use client";

import { useCallback, useRef } from "react";

import { useSessionStore } from "@/stores/sessionStore";

export interface ComboState {
  combo: number;
  maxCombo: number;
  multiplier: number;
  milestone: string | null;
}

const MILESTONES: Record<number, string> = {
  3: "Nice!",
  5: "On Fire!",
  10: "Unstoppable!",
  15: "Legendary!",
  20: "PERFECT RUN!",
};

function getMultiplier(combo: number): number {
  if (combo >= 15) return 3;
  if (combo >= 10) return 2.5;
  if (combo >= 5) return 2;
  if (combo >= 3) return 1.5;
  return 1;
}

/**
 * Hook managing combo counter + XP multiplier.
 * Reads combo/maxCombo from sessionStore, provides increment/reset.
 */
export function useComboSystem() {
  const lastMilestoneRef = useRef(0);

  const registerCorrectAyah = useCallback((accuracy: number): ComboState => {
    const store = useSessionStore.getState();
    if (accuracy >= 70) {
      store.incrementCombo();
      const state = useSessionStore.getState();
      const combo = state.combo;
      const milestone = MILESTONES[combo] ?? null;

      // Only fire milestone once per combo level
      let newMilestone: string | null = null;
      if (milestone && combo > lastMilestoneRef.current) {
        newMilestone = milestone;
        lastMilestoneRef.current = combo;
      }

      return {
        combo,
        maxCombo: state.maxCombo,
        multiplier: getMultiplier(combo),
        milestone: newMilestone,
      };
    } else {
      store.resetCombo();
      lastMilestoneRef.current = 0;
      return {
        combo: 0,
        maxCombo: store.maxCombo,
        multiplier: 1,
        milestone: null,
      };
    }
  }, []);

  const resetCombo = useCallback(() => {
    useSessionStore.getState().resetCombo();
    lastMilestoneRef.current = 0;
  }, []);

  return { registerCorrectAyah, resetCombo, getMultiplier };
}
