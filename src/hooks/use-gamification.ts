"use client";

import { useCallback } from "react";

import {
  evaluateAchievements,
  type AchievementActivity,
} from "@/lib/gamification/achievements";
import {
  calculateSessionXP,
  type SessionXPParams,
} from "@/lib/gamification/xp";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useUserStore } from "@/stores/userStore";

export interface PostSessionParams {
  versesRecited: number;
  accuracy: number;
  duration: number; // seconds
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  isNewMemorization?: boolean;
  newVersesCount?: number;
}

/**
 * Hook that orchestrates the full post-session gamification flow:
 * 1. Calculate XP
 * 2. Award XP to store + persist to server
 * 3. Evaluate achievements + award new ones
 */
export function usePostSessionGamification() {
  const { awardXP, earnAchievement, earnedAchievements } =
    useGamificationStore();
  const { streak, incrementStreak } = useUserStore();

  const processSession = useCallback(
    async (params: PostSessionParams) => {
      // Increment streak first
      incrementStreak();
      const currentStreak = streak.currentStreak + 1;

      // 1. Calculate XP
      const xpParams: SessionXPParams = {
        versesRecited: params.versesRecited,
        accuracy: params.accuracy,
        duration: params.duration,
        isNewMemorization: params.isNewMemorization ?? false,
        currentStreak,
        sessionHour: new Date().getHours(),
        newVersesCount: params.newVersesCount,
      };

      const xpResult = calculateSessionXP(xpParams);

      // 2. Award XP to store (shows toast)
      awardXP(
        xpResult.totalXP,
        "session",
        xpResult.streakMultiplier * xpResult.timeMultiplier
      );

      // 3. Persist XP to server (fire-and-forget)
      fetch("/api/gamification/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "session",
          amount: xpResult.totalXP,
          multiplier: xpResult.streakMultiplier * xpResult.timeMultiplier,
        }),
      }).catch((err) =>
        console.error("[Gamification] Failed to persist XP:", err)
      );

      // 4. Evaluate achievements locally
      const activity: AchievementActivity = {
        currentStreak,
        totalSessions:
          (useGamificationStore.getState().totalXP > 0 ? 1 : 0) + 1,
        lastSessionAccuracy: params.accuracy,
        lastSessionDuration: params.duration,
        lastSessionHour: new Date().getHours(),
        versesInLastSession: params.versesRecited,
        lastSessionMinutes: Math.floor(params.duration / 60),
        lastSessionSurahNumber: params.surahNumber,
        isFriday: new Date().getDay() === 5,
      };

      const newAchievements = evaluateAchievements(
        activity,
        earnedAchievements
      );

      // 5. Award new achievements to store (shows popup one at a time)
      if (newAchievements.length > 0) {
        // Award the first one immediately (popup will show it)
        earnAchievement(newAchievements[0]);

        // Award remaining after a delay to queue popups
        for (let i = 1; i < newAchievements.length; i++) {
          setTimeout(() => {
            earnAchievement(newAchievements[i]);
          }, i * 3000);
        }

        // 6. Persist achievements to server (fire-and-forget)
        fetch("/api/gamification/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activity),
        }).catch((err) =>
          console.error("[Gamification] Failed to persist achievements:", err)
        );
      }

      // 7. Create & review FSRS cards for each ayah (fire-and-forget)
      // This powers the Jannati garden tree growth
      (async () => {
        try {
          // Create cards for the range (skips already-existing ones)
          await fetch("/api/progress/srs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              surahNumber: params.surahNumber,
              startAyah: params.startAyah,
              endAyah: params.endAyah,
              category: "sabaq",
            }),
          });

          // Review each card with the session accuracy
          const reviewPromises = [];
          for (let ayah = params.startAyah; ayah <= params.endAyah; ayah++) {
            reviewPromises.push(
              fetch("/api/progress/srs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  surahNumber: params.surahNumber,
                  ayahNumber: ayah,
                  accuracy: params.accuracy,
                }),
              })
            );
          }
          await Promise.all(reviewPromises);
        } catch (err) {
          console.error("[Gamification] Failed to update FSRS cards:", err);
        }
      })();

      return { xpResult, newAchievements };
    },
    [
      awardXP,
      earnAchievement,
      earnedAchievements,
      streak.currentStreak,
      incrementStreak,
    ]
  );

  return { processSession };
}
