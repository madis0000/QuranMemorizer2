import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

function getLabel(score: number): string {
  if (score >= 80) return "Expert";
  if (score >= 60) return "Advanced";
  if (score >= 40) return "Intermediate";
  if (score >= 20) return "Developing";
  return "Beginner";
}

/**
 * GET /api/progress/scores
 * Returns dual score: Hifdh (knowledge) + Itqan (fluency).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const data = await getCached(
      `scores:${userId}`,
      600, // 10 min TTL
      async () => computeScores(userId)
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Scores error:", error);
    return NextResponse.json(
      { error: "Failed to compute scores" },
      { status: 500 }
    );
  }
}

async function computeScores(userId: string) {
  const now = new Date();

  // Get all FSRS cards for Hifdh score
  const cards = await prisma.fSRSCard.findMany({
    where: { userId },
    select: {
      stability: true,
      elapsedDays: true,
      due: true,
      state: true,
      reps: true,
      lastReview: true,
    },
  });

  // Compute Hifdh score = weighted average retrievability
  // Mature cards (stability >= 21) count 1.5x
  let totalWeight = 0;
  let weightedRetention = 0;
  let matureVerses = 0;

  for (const card of cards) {
    if (card.reps === 0) continue; // Skip new/unreviewed cards

    const isMature = card.state === 2 && card.stability >= 21;
    if (isMature) matureVerses++;

    // Compute retrievability
    let retention = 100;
    if (card.stability > 0) {
      const daysSinceReview = card.lastReview
        ? Math.max(
            0,
            (now.getTime() - new Date(card.lastReview).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : card.elapsedDays;
      retention =
        Math.exp((Math.log(0.9) * daysSinceReview) / card.stability) * 100;
    }

    const weight = isMature ? 1.5 : 1.0;
    totalWeight += weight;
    weightedRetention += retention * weight;
  }

  const hifdhScore =
    totalWeight > 0 ? Math.round(weightedRetention / totalWeight) : 0;

  // Get recent 30 sessions for Itqan score
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentSessions = await prisma.recitationSession.findMany({
    where: {
      userId,
      status: "COMPLETED",
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      accuracy: true,
      wordsRecited: true,
      duration: true,
      mistakeCount: true,
    },
  });

  // Compute Itqan score = accuracy * 0.5 + wpmScore * 0.3 + (1 - errorRate) * 0.2
  let itqanScore = 0;
  if (recentSessions.length > 0) {
    const avgAccuracy =
      recentSessions.reduce((s, r) => s + (r.accuracy ?? 0), 0) /
      recentSessions.length;

    // WPM score: normalize to 0-100 (20 WPM = 100)
    const totalWords = recentSessions.reduce((s, r) => s + r.wordsRecited, 0);
    const totalDuration = recentSessions.reduce((s, r) => s + r.duration, 0);
    const wpm = totalDuration > 0 ? (totalWords / totalDuration) * 60 : 0;
    const wpmScore = Math.min(100, (wpm / 20) * 100);

    // Error rate: mistakes per word
    const totalMistakes = recentSessions.reduce(
      (s, r) => s + r.mistakeCount,
      0
    );
    const errorRate = totalWords > 0 ? totalMistakes / totalWords : 0;

    itqanScore = Math.round(
      avgAccuracy * 0.5 + wpmScore * 0.3 + (1 - errorRate) * 100 * 0.2
    );
  }

  // Get previous period scores for trend (60-30 days ago)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const prevSessions = await prisma.recitationSession.findMany({
    where: {
      userId,
      status: "COMPLETED",
      createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
    },
    select: { accuracy: true },
  });

  const prevAvgAccuracy =
    prevSessions.length > 0
      ? prevSessions.reduce((s, r) => s + (r.accuracy ?? 0), 0) /
        prevSessions.length
      : 0;

  const hifdhTrend: "up" | "down" | "stable" = "stable"; // Would need historical cards data
  const itqanDelta =
    recentSessions.length > 0 && prevSessions.length > 0
      ? Math.round(
          recentSessions.reduce((s, r) => s + (r.accuracy ?? 0), 0) /
            recentSessions.length -
            prevAvgAccuracy
        )
      : 0;
  const itqanTrend: "up" | "down" | "stable" =
    itqanDelta > 2 ? "up" : itqanDelta < -2 ? "down" : "stable";

  return {
    hifdh: {
      score: Math.min(100, Math.max(0, hifdhScore)),
      label: getLabel(hifdhScore),
      trend: hifdhTrend,
      delta: 0,
    },
    itqan: {
      score: Math.min(100, Math.max(0, itqanScore)),
      label: getLabel(itqanScore),
      trend: itqanTrend,
      delta: itqanDelta,
    },
    totalVerses: cards.length,
    matureVerses,
  };
}
