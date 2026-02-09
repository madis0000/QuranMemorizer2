/**
 * XP API Routes
 * GET: Return user's XP data
 * POST: Award XP to user
 */

import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getXPProgress } from "@/lib/gamification/xp";

/**
 * GET /api/gamification/xp
 * Returns user's total XP, weekly XP, level, and progress
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get total XP from all transactions
    const totalXPResult = await prisma.xPTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const totalXP = totalXPResult._sum.amount ?? 0;

    // Get weekly XP (current week)
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weeklyXPResult = await prisma.xPTransaction.aggregate({
      where: {
        userId,
        createdAt: { gte: weekStart },
      },
      _sum: { amount: true },
    });

    const weeklyXP = weeklyXPResult._sum.amount ?? 0;

    // Calculate level and progress
    const progress = getXPProgress(totalXP);

    // Get league standing for current week
    const weekKey = `${now.getFullYear()}-W${String(
      Math.ceil(
        (now.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
      )
    ).padStart(2, "0")}`;

    const leagueStanding = await prisma.leagueStanding.findUnique({
      where: {
        userId_weekKey: {
          userId,
          weekKey,
        },
      },
    });

    return NextResponse.json({
      totalXP,
      weeklyXP,
      level: progress.level,
      currentXP: progress.currentXP,
      nextLevelXP: progress.nextLevelXP,
      progress: progress.progress,
      league: leagueStanding?.league ?? "talib",
      leagueRank: leagueStanding?.rank ?? 0,
    });
  } catch (error) {
    console.error("[XP API] Error fetching XP:", error);
    return NextResponse.json(
      { error: "Failed to fetch XP data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gamification/xp
 * Award XP to user
 * Body: { source, amount, sessionId?, multiplier? }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const { source, amount, sessionId, multiplier = 1.0 } = body;

    if (!source || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid source or amount" },
        { status: 400 }
      );
    }

    // Create XP transaction
    const transaction = await prisma.xPTransaction.create({
      data: {
        userId,
        amount: Math.floor(amount),
        source,
        sessionId: sessionId ?? undefined,
        multiplier,
      },
    });

    // Get updated total XP
    const totalXPResult = await prisma.xPTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const totalXP = totalXPResult._sum.amount ?? 0;

    // Update or create league standing for current week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekKey = `${now.getFullYear()}-W${String(
      Math.ceil(
        (now.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
      )
    ).padStart(2, "0")}`;

    // Get weekly XP
    const weeklyXPResult = await prisma.xPTransaction.aggregate({
      where: {
        userId,
        createdAt: { gte: weekStart },
      },
      _sum: { amount: true },
    });

    const weeklyXP = weeklyXPResult._sum.amount ?? 0;

    // Determine league based on weekly XP
    let league = "talib";
    if (weeklyXP >= 5000) league = "imam";
    else if (weeklyXP >= 3000) league = "sheikh";
    else if (weeklyXP >= 1500) league = "hafiz";
    else if (weeklyXP >= 500) league = "qari";

    // Upsert league standing
    await prisma.leagueStanding.upsert({
      where: {
        userId_weekKey: {
          userId,
          weekKey,
        },
      },
      update: {
        weeklyXP,
        league,
      },
      create: {
        userId,
        weekKey,
        weeklyXP,
        league,
      },
    });

    // Calculate level and progress
    const progress = getXPProgress(totalXP);

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        source: transaction.source,
        multiplier: transaction.multiplier,
      },
      totalXP,
      weeklyXP,
      level: progress.level,
      currentXP: progress.currentXP,
      nextLevelXP: progress.nextLevelXP,
      progress: progress.progress,
      league,
    });
  } catch (error) {
    console.error("[XP API] Error awarding XP:", error);
    return NextResponse.json({ error: "Failed to award XP" }, { status: 500 });
  }
}
