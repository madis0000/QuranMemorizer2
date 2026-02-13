import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { SURAH_NAMES } from "@/lib/curriculum/plan-generator";
import { prisma } from "@/lib/db";

/**
 * GET /api/progress/wrapped?period=month
 * Returns Quran Wrapped stats for sharing.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    const data = await getCached(
      `wrapped:${userId}:${period}`,
      3600, // 1 hour TTL
      async () => computeWrapped(userId, period)
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Wrapped error:", error);
    return NextResponse.json(
      { error: "Failed to compute wrapped" },
      { status: 500 }
    );
  }
}

async function computeWrapped(userId: string, period: string) {
  const now = new Date();
  const periodDays = period === "year" ? 365 : 30;
  const periodStart = new Date(
    now.getTime() - periodDays * 24 * 60 * 60 * 1000
  );
  const periodLabel =
    period === "year"
      ? now.getFullYear().toString()
      : new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toLocaleString(
          "default",
          { month: "long", year: "numeric" }
        );

  // Get sessions in period
  const sessions = await prisma.recitationSession.findMany({
    where: {
      userId,
      status: "COMPLETED",
      createdAt: { gte: periodStart },
    },
    select: {
      duration: true,
      accuracy: true,
      surahNumber: true,
      wordsRecited: true,
      createdAt: true,
    },
  });

  const totalSessions = sessions.length;
  const totalMinutes = Math.round(
    sessions.reduce((s, r) => s + r.duration, 0) / 60
  );

  // Verses memorized in period
  const versesMemorized = await prisma.fSRSCard.count({
    where: { userId, createdAt: { gte: periodStart } },
  });

  // Strongest surah (highest avg accuracy with >= 3 sessions)
  const surahAccuracies = new Map<number, { total: number; count: number }>();
  for (const s of sessions) {
    const entry = surahAccuracies.get(s.surahNumber) ?? {
      total: 0,
      count: 0,
    };
    entry.total += s.accuracy ?? 0;
    entry.count++;
    surahAccuracies.set(s.surahNumber, entry);
  }

  let strongestSurah = null;
  let strongestAvg = 0;
  for (const [surahNum, data] of surahAccuracies) {
    if (data.count >= 2) {
      const avg = data.total / data.count;
      if (avg > strongestAvg) {
        strongestAvg = avg;
        strongestSurah = {
          surahNumber: surahNum,
          name: SURAH_NAMES[surahNum - 1] ?? `Surah ${surahNum}`,
          accuracy: Math.round(avg),
          sessions: data.count,
        };
      }
    }
  }

  // Most improved surah (compare first half vs second half of period)
  const halfPoint = new Date(
    periodStart.getTime() + (now.getTime() - periodStart.getTime()) / 2
  );

  let mostImproved = null;
  let bestImprovement = 0;

  for (const [surahNum, data] of surahAccuracies) {
    if (data.count >= 4) {
      const firstHalf = sessions.filter(
        (s) => s.surahNumber === surahNum && new Date(s.createdAt) < halfPoint
      );
      const secondHalf = sessions.filter(
        (s) => s.surahNumber === surahNum && new Date(s.createdAt) >= halfPoint
      );

      if (firstHalf.length >= 2 && secondHalf.length >= 2) {
        const firstAvg =
          firstHalf.reduce((s, r) => s + (r.accuracy ?? 0), 0) /
          firstHalf.length;
        const secondAvg =
          secondHalf.reduce((s, r) => s + (r.accuracy ?? 0), 0) /
          secondHalf.length;
        const improvement = secondAvg - firstAvg;

        if (improvement > bestImprovement) {
          bestImprovement = improvement;
          mostImproved = {
            surahNumber: surahNum,
            name: SURAH_NAMES[surahNum - 1] ?? `Surah ${surahNum}`,
            improvement: Math.round(improvement),
          };
        }
      }
    }
  }

  // XP earned in period
  const xpResult = await prisma.xPTransaction.aggregate({
    where: { userId, createdAt: { gte: periodStart } },
    _sum: { amount: true },
  });
  const totalXP = xpResult._sum.amount ?? 0;

  // Current league
  const latestLeague = await prisma.leagueStanding.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { league: true },
  });

  // Longest streak in period
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { longestStreak: true },
  });

  // Badges earned in period
  const badgesEarned = await prisma.userBadge.count({
    where: { userId, earnedAt: { gte: periodStart } },
  });

  // Favorite day of week
  const dayCounts = new Array(7).fill(0);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (const s of sessions) {
    dayCounts[new Date(s.createdAt).getDay()]++;
  }
  const favoriteDay = dayNames[dayCounts.indexOf(Math.max(...dayCounts))];

  return {
    period,
    periodLabel,
    totalSessions,
    totalMinutes,
    versesMemorized,
    strongestSurah,
    mostImproved,
    totalXP,
    league: latestLeague?.league ?? null,
    longestStreak: user?.longestStreak ?? 0,
    badgesEarned,
    favoriteDay,
  };
}
