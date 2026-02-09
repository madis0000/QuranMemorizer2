import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/social/leaderboard
 * Get leaderboard rankings: XP, streak, accuracy, sessions, and circle-scoped.
 * Query params: ?limit=20&circleId=...
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
    const circleId = searchParams.get("circleId");

    // Circle-scoped leaderboard
    if (circleId) {
      // Verify membership
      const membership = await prisma.circleMember.findUnique({
        where: {
          userId_circleId: { userId: session.user.id, circleId },
        },
      });

      if (!membership) {
        return NextResponse.json(
          { error: "Not a member of this circle" },
          { status: 403 }
        );
      }

      const members = await prisma.circleMember.findMany({
        where: { circleId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              displayName: true,
              image: true,
              streakCount: true,
            },
          },
        },
        orderBy: { weeklyXP: "desc" },
        take: limit,
      });

      return NextResponse.json({
        circleLeaders: members.map((m, index) => ({
          rank: index + 1,
          userId: m.userId,
          name: m.user.displayName ?? m.user.name ?? "Anonymous",
          image: m.user.image,
          value: m.weeklyXP,
          label: `${m.weeklyXP} XP`,
          role: m.role,
          streakCount: m.user.streakCount,
        })),
      });
    }

    // Global leaderboards

    // 1. Streak leaders
    const streakLeaders = await prisma.user.findMany({
      where: {
        streakCount: { gt: 0 },
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

    // 2. Sessions leaders (by total session count)
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

    // 3. XP leaders (aggregate from XPTransaction)
    const xpAggregations = await prisma.xPTransaction.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: limit,
    });

    const xpUserIds = xpAggregations.map((a) => a.userId);
    const xpUsers = await prisma.user.findMany({
      where: { id: { in: xpUserIds } },
      select: {
        id: true,
        name: true,
        displayName: true,
        image: true,
      },
    });
    const xpUserMap = new Map(xpUsers.map((u) => [u.id, u]));

    const xpLeaders = xpAggregations.map((a, index) => {
      const user = xpUserMap.get(a.userId);
      const totalXP = a._sum.amount ?? 0;
      return {
        rank: index + 1,
        userId: a.userId,
        name: user?.displayName ?? user?.name ?? "Anonymous",
        image: user?.image ?? null,
        value: totalXP,
        label: `${totalXP} XP`,
      };
    });

    // 4. Accuracy leaders (users with 5+ sessions, ordered by avg accuracy)
    const accuracyAggregations = await prisma.recitationSession.groupBy({
      by: ["userId"],
      _avg: { accuracy: true },
      _count: { accuracy: true },
      having: {
        accuracy: { _count: { gte: 5 } },
      },
      orderBy: { _avg: { accuracy: "desc" } },
      take: limit,
    });

    const accuracyUserIds = accuracyAggregations.map((a) => a.userId);
    const accuracyUsers = await prisma.user.findMany({
      where: { id: { in: accuracyUserIds } },
      select: {
        id: true,
        name: true,
        displayName: true,
        image: true,
      },
    });
    const accuracyUserMap = new Map(accuracyUsers.map((u) => [u.id, u]));

    const accuracyLeaders = accuracyAggregations.map((a, index) => {
      const user = accuracyUserMap.get(a.userId);
      const avgAcc = Math.round(a._avg.accuracy ?? 0);
      return {
        rank: index + 1,
        userId: a.userId,
        name: user?.displayName ?? user?.name ?? "Anonymous",
        image: user?.image ?? null,
        value: avgAcc,
        label: `${avgAcc}% avg`,
        sessionCount: a._count.accuracy,
      };
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
      xpLeaders,
      streakLeaders: streakLeaders.map(formatStreakEntry),
      accuracyLeaders,
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
