/**
 * Achievements API Routes
 * GET: Return all achievements with user's progress
 * POST: Evaluate and award achievements based on activity
 */

import { NextRequest, NextResponse } from "next/server";
import type { BadgeCategory, Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  ACHIEVEMENTS,
  evaluateAchievements,
  getAchievementProgress,
  type AchievementActivity,
} from "@/lib/gamification/achievements";
import { getXPForBadge } from "@/lib/gamification/xp";

/**
 * GET /api/gamification/achievements
 * Returns all achievements with user's earned status
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's earned badges
    const earnedBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });

    const earnedCodes = earnedBadges.map((ub) => ub.badge.code);
    const earnedSet = new Set(earnedCodes);

    // Format achievements with earned status
    const achievements = ACHIEVEMENTS.map((achievement) => {
      const earned = earnedBadges.find(
        (ub) => ub.badge.code === achievement.code
      );

      return {
        ...achievement,
        earned: earnedSet.has(achievement.code),
        earnedAt: earned?.earnedAt ?? null,
        // Hide secret achievements if not earned
        hidden: achievement.secret && !earnedSet.has(achievement.code),
      };
    });

    // Calculate progress
    const progress = getAchievementProgress(earnedCodes);

    return NextResponse.json({
      achievements: achievements.map((a) =>
        a.hidden
          ? {
              code: a.code,
              name: "???",
              description: "Hidden achievement",
              icon: "lock",
              category: a.category,
              rarity: a.rarity,
              xpReward: a.xpReward,
              earned: false,
              hidden: true,
            }
          : a
      ),
      progress,
    });
  } catch (error) {
    console.error("[Achievements API] Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gamification/achievements
 * Evaluate and award new achievements based on user activity
 * Body: AchievementActivity object
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const activity: AchievementActivity = await request.json();

    // Get already earned achievements
    const earnedBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });

    const alreadyEarned = earnedBadges.map((ub) => ub.badge.code);

    // Evaluate which new achievements are earned
    const newAchievementCodes = evaluateAchievements(activity, alreadyEarned);

    if (newAchievementCodes.length === 0) {
      return NextResponse.json({
        newAchievements: [],
        message: "No new achievements earned",
      });
    }

    // Award new achievements
    const awardedAchievements = [];

    for (const code of newAchievementCodes) {
      const achievement = ACHIEVEMENTS.find((a) => a.code === code);
      if (!achievement) continue;

      // Find or create badge in database
      let badge = await prisma.badge.findUnique({
        where: { code },
      });

      if (!badge) {
        // Create badge if it doesn't exist
        badge = await prisma.badge.create({
          data: {
            code: achievement.code,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            category: achievement.category.toUpperCase() as BadgeCategory,
            requirement:
              achievement.requirement as unknown as Prisma.JsonObject,
          },
        });
      }

      // Award badge to user
      const userBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      // Award XP for earning the achievement
      const xpReward = getXPForBadge(achievement.rarity);
      await prisma.xPTransaction.create({
        data: {
          userId,
          amount: xpReward,
          source: `achievement_${code}`,
          multiplier: 1.0,
        },
      });

      awardedAchievements.push({
        ...achievement,
        earnedAt: userBadge.earnedAt,
        xpAwarded: xpReward,
      });
    }

    return NextResponse.json({
      newAchievements: awardedAchievements,
      count: awardedAchievements.length,
      message: `Earned ${awardedAchievements.length} new achievement(s)!`,
    });
  } catch (error) {
    console.error("[Achievements API] Error evaluating achievements:", error);
    return NextResponse.json(
      { error: "Failed to evaluate achievements" },
      { status: 500 }
    );
  }
}
