import { NextResponse, type NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Tajweed progress is stored in the user's settings JSON field
 * under a "tajweed" key with the following shape:
 *
 * {
 *   tajweed: {
 *     masteryLevels: Record<string, string>,
 *     practiceHistory: Array<{
 *       ruleType: string,
 *       score: number,
 *       timestamp: number,
 *       verseKey: string
 *     }>,
 *     currentStage: number,
 *     unlockedStages: number
 *   }
 * }
 */

interface TajweedProgress {
  masteryLevels: Record<string, string>;
  practiceHistory: Array<{
    ruleType: string;
    score: number;
    timestamp: number;
    verseKey: string;
  }>;
  currentStage: number;
  unlockedStages: number;
}

// GET /api/tajweed/progress - Fetch user's tajweed mastery data
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract tajweed progress from settings
    const settings = user.settings as Record<string, unknown> | null;
    const tajweedProgress = (settings?.tajweed ??
      null) as TajweedProgress | null;

    return NextResponse.json({
      progress: tajweedProgress ?? {
        masteryLevels: {},
        practiceHistory: [],
        currentStage: 1,
        unlockedStages: 1,
      },
    });
  } catch (error) {
    console.error("Error fetching tajweed progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tajweed/progress - Record a practice session and update mastery
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const {
      ruleType,
      score,
      verseKey,
      masteryLevels,
      currentStage,
      unlockedStages,
    } = body;

    // Validate required fields for practice record
    if (ruleType == null || score == null) {
      return NextResponse.json(
        { error: "Missing required fields: ruleType, score" },
        { status: 400 }
      );
    }

    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    // Fetch current settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingSettings = (user.settings as Record<string, unknown>) ?? {};
    const existingTajweed = (existingSettings.tajweed ??
      {}) as Partial<TajweedProgress>;

    // Build the new practice record
    const newRecord = {
      ruleType: String(ruleType),
      score: Number(score),
      timestamp: Date.now(),
      verseKey: String(verseKey ?? "unknown"),
    };

    // Append to practice history (keep last 500)
    const currentHistory = Array.isArray(existingTajweed.practiceHistory)
      ? existingTajweed.practiceHistory
      : [];
    const updatedHistory = [...currentHistory, newRecord].slice(-500);

    // Build updated tajweed progress
    const updatedTajweed: TajweedProgress = {
      masteryLevels:
        masteryLevels && typeof masteryLevels === "object"
          ? (masteryLevels as Record<string, string>)
          : (existingTajweed.masteryLevels ?? {}),
      practiceHistory: updatedHistory,
      currentStage:
        typeof currentStage === "number"
          ? currentStage
          : (existingTajweed.currentStage ?? 1),
      unlockedStages:
        typeof unlockedStages === "number"
          ? unlockedStages
          : (existingTajweed.unlockedStages ?? 1),
    };

    // Merge into user settings
    const updatedSettings = {
      ...existingSettings,
      tajweed: updatedTajweed,
    };

    await prisma.user.update({
      where: { id: userId },
      data: { settings: updatedSettings as unknown as Prisma.JsonObject },
    });

    return NextResponse.json({ progress: updatedTajweed }, { status: 201 });
  } catch (error) {
    console.error("Error recording tajweed practice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
