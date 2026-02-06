import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/progress/streaks - Get user's streak data including heatmap history
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Fetch user's streak counts from the User model
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        streakCount: true,
        longestStreak: true,
        lastActiveAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch last 365 days of streak history for the heatmap
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const streakRecords = await prisma.streakHistory.findMany({
      where: {
        userId,
        date: { gte: oneYearAgo },
      },
      orderBy: { date: "asc" },
      select: {
        date: true,
        isActive: true,
      },
    });

    // Build a map of active dates for quick lookup
    const activeDatesMap = new Map<string, boolean>();
    for (const record of streakRecords) {
      const dateKey = record.date.toISOString().split("T")[0];
      activeDatesMap.set(dateKey, record.isActive);
    }

    // Generate the full 365-day history array
    const streakHistory: Array<{ date: string; isActive: boolean }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      streakHistory.push({
        date: dateKey,
        isActive: activeDatesMap.get(dateKey) ?? false,
      });
    }

    // Calculate total days active from all streak history
    const totalDaysActive = await prisma.streakHistory.count({
      where: {
        userId,
        isActive: true,
      },
    });

    // Calculate current streak by counting consecutive active days backwards from today
    let currentStreak = 0;
    for (let i = streakHistory.length - 1; i >= 0; i--) {
      if (streakHistory[i].isActive) {
        currentStreak++;
      } else {
        // If today is not active yet, check if yesterday was the last active day
        // (user might still complete today's session)
        if (i === streakHistory.length - 1) {
          continue;
        }
        break;
      }
    }

    return NextResponse.json({
      currentStreak,
      longestStreak: user.longestStreak,
      lastActiveDate: user.lastActiveAt?.toISOString().split("T")[0] ?? null,
      totalDaysActive,
      streakHistory,
    });
  } catch (error) {
    console.error("Error fetching streak data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
