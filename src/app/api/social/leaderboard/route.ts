import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/social/leaderboard
 * Get leaderboard rankings by streak, accuracy, and total sessions.
 * Query params: ?type=streak|accuracy|sessions&limit=20
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

    // Streak leaders
    const streakLeaders = await prisma.user.findMany({
      where: {
        streakCount: { gt: 0 },
        settings: {
          path: ["showOnLeaderboard"],
          not: false,
        },
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        image: true,
        streakCount: true,
      },
      orderBy: { streakCount: "desc" },
      take: limit,
    });

    // Sessions leaders (by total session count)
    const sessionsLeaders = await prisma.user.findMany({
      where: {
        recitationSessions: { some: {} },
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        image: true,
        _count: {
          select: { recitationSessions: true },
        },
      },
      orderBy: {
        recitationSessions: { _count: "desc" },
      },
      take: limit,
    });

    // Format response
    const formatStreakEntry = (
      user: (typeof streakLeaders)[0],
      rank: number
    ) => ({
      rank: rank + 1,
      userId: user.id,
      name: user.displayName ?? user.name ?? "Anonymous",
      image: user.image,
      value: user.streakCount,
      label: `${user.streakCount} days`,
    });

    const formatSessionsEntry = (
      user: (typeof sessionsLeaders)[0],
      rank: number
    ) => ({
      rank: rank + 1,
      userId: user.id,
      name: user.displayName ?? user.name ?? "Anonymous",
      image: user.image,
      value: user._count.recitationSessions,
      label: `${user._count.recitationSessions} sessions`,
    });

    return NextResponse.json({
      streakLeaders: streakLeaders.map(formatStreakEntry),
      accuracyLeaders: [], // Requires aggregation - computed client-side or via periodic job
      sessionsLeaders: sessionsLeaders.map(formatSessionsEntry),
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
