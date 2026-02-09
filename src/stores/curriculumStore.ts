import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getPlanProgress,
  type StudyPlan,
} from "@/lib/curriculum/plan-generator";

interface CurriculumState {
  /** Currently active study plan */
  activePlan: StudyPlan | null;
  /** History of completed/abandoned plans */
  planHistory: StudyPlan[];

  // Actions
  setPlan: (plan: StudyPlan) => void;
  completeDailyTarget: (date: string) => void;
  deactivatePlan: () => void;
  deletePlan: (planId: string) => void;
  updatePlan: (plan: StudyPlan) => void;
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set, get) => ({
      activePlan: null,
      planHistory: [],

      setPlan: (plan) => {
        const state = get();
        // If there's an existing active plan, archive it
        const history = state.activePlan
          ? [...state.planHistory, { ...state.activePlan, isActive: false }]
          : state.planHistory;

        set({
          activePlan: plan,
          planHistory: history,
        });
      },

      completeDailyTarget: (date) => {
        const state = get();
        if (!state.activePlan) return;

        const updatedSchedule = state.activePlan.schedule.map((target) =>
          target.date === date ? { ...target, completed: true } : target
        );

        const updatedPlan = {
          ...state.activePlan,
          schedule: updatedSchedule,
        };

        // Check if plan is fully completed
        const progress = getPlanProgress(updatedPlan);
        if (progress >= 100) {
          updatedPlan.isActive = false;
          set({
            activePlan: null,
            planHistory: [...state.planHistory, updatedPlan],
          });
        } else {
          set({ activePlan: updatedPlan });
        }
      },

      deactivatePlan: () => {
        const state = get();
        if (!state.activePlan) return;

        set({
          activePlan: null,
          planHistory: [
            ...state.planHistory,
            { ...state.activePlan, isActive: false },
          ],
        });
      },

      deletePlan: (planId) => {
        const state = get();
        if (state.activePlan?.id === planId) {
          set({ activePlan: null });
        }
        set({
          planHistory: state.planHistory.filter((p) => p.id !== planId),
        });
      },

      updatePlan: (plan) => {
        const state = get();
        if (state.activePlan?.id === plan.id) {
          set({ activePlan: plan });
        }
      },
    }),
    {
      name: "curriculum-store",
      partialize: (state) => ({
        activePlan: state.activePlan,
        planHistory: state.planHistory,
      }),
    }
  )
);
