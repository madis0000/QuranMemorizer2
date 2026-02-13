import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

interface ScatterPoint {
  verseKey: string;
  x: number; // effort (total review time in minutes)
  y: number; // retention (FSRS retrievability 0-100)
  surahNumber: number;
  ayahNumber: number;
  quadrant: "easy_win" | "well_earned" | "stubborn" | "at_risk";
  totalReviews: number;
}

/**
 * GET /api/progress/scatter?limit=500
 * Returns effort vs retention data for every studied verse.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "500", 10),
      1000
    );

    const data = await getCached<ScatterPoint[]>(
      `scatter:${userId}:${limit}`,
      600, // 10 min TTL
      async () => computeScatter(userId, limit)
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Scatter error:", error);
    return NextResponse.json(
      { error: "Failed to compute scatter" },
      { status: 500 }
    );
  }
}

async function computeScatter(
  userId: string,
  limit: number
): Promise<ScatterPoint[]> {
  const now = new Date();

  // Get FSRS cards with review data
  const cards = await prisma.fSRSCard.findMany({
    where: { userId, reps: { gt: 0 } },
    select: {
      surahNumber: true,
      ayahNumber: true,
      stability: true,
      elapsedDays: true,
      due: true,
      reps: true,
      totalReviews: true,
      lastReview: true,
    },
    take: limit,
    orderBy: { updatedAt: "desc" },
  });

  // Get session durations to estimate per-verse effort
  const sessions = await prisma.recitationSession.findMany({
    where: { userId, status: "COMPLETED" },
    select: {
      surahNumber: true,
      startAyah: true,
      endAyah: true,
      duration: true,
    },
  });

  // Build effort map: verse key → total seconds spent
  const effortMap = new Map<string, number>();
  for (const s of sessions) {
    const ayahCount = s.endAyah - s.startAyah + 1;
    const perAyahDuration = s.duration / ayahCount;
    for (let a = s.startAyah; a <= s.endAyah; a++) {
      const key = `${s.surahNumber}:${a}`;
      effortMap.set(key, (effortMap.get(key) ?? 0) + perAyahDuration);
    }
  }

  // Compute scatter points
  const points: ScatterPoint[] = [];

  // Find max effort for normalization
  let maxEffort = 0;
  for (const card of cards) {
    const key = `${card.surahNumber}:${card.ayahNumber}`;
    const effort = effortMap.get(key) ?? 0;
    if (effort > maxEffort) maxEffort = effort;
  }
  if (maxEffort === 0) maxEffort = 1;

  for (const card of cards) {
    const key = `${card.surahNumber}:${card.ayahNumber}`;
    const effortSeconds = effortMap.get(key) ?? 0;

    // Normalize effort to 0-100
    const x = Math.round((effortSeconds / maxEffort) * 100);

    // Compute retention
    let y = 100;
    if (card.stability > 0) {
      const daysSinceReview = card.lastReview
        ? Math.max(
            0,
            (now.getTime() - new Date(card.lastReview).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : card.elapsedDays;
      y = Math.round(
        Math.exp((Math.log(0.9) * daysSinceReview) / card.stability) * 100
      );
    }

    // Classify quadrant
    const highEffort = x > 50;
    const highRetention = y > 50;
    const quadrant: ScatterPoint["quadrant"] = highRetention
      ? highEffort
        ? "well_earned"
        : "easy_win"
      : highEffort
        ? "stubborn"
        : "at_risk";

    points.push({
      verseKey: key,
      x,
      y,
      surahNumber: card.surahNumber,
      ayahNumber: card.ayahNumber,
      quadrant,
      totalReviews: card.totalReviews,
    });
  }

  return points;
}
