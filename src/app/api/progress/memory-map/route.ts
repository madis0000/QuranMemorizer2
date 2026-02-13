import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";
import {
  computeMasteryLevel,
  type PageMasteryData,
} from "@/components/progress/PageMasteryGrid";

/**
 * GET /api/progress/memory-map
 * Returns 604-page memory map with FSRS retrievability for each page.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const pages = await getCached<PageMasteryData[]>(
      `memory-map:${userId}`,
      900, // 15 min TTL
      async () => computeMemoryMap(userId)
    );

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Memory map error:", error);
    return NextResponse.json(
      { error: "Failed to compute memory map" },
      { status: 500 }
    );
  }
}

async function computeMemoryMap(userId: string): Promise<PageMasteryData[]> {
  // 1. Get all FSRS cards with their ayah→page mapping
  const cards = await prisma.fSRSCard.findMany({
    where: { userId },
    select: {
      surahNumber: true,
      ayahNumber: true,
      stability: true,
      difficulty: true,
      elapsedDays: true,
      due: true,
      state: true,
      reps: true,
      averageAccuracy: true,
      lastReview: true,
    },
  });

  // 2. Get page numbers for each card's ayah from QuranAyah table
  const ayahPages = await prisma.quranAyah.findMany({
    where: {
      OR: cards.map((c) => ({
        surahNumber: c.surahNumber,
        numberInSurah: c.ayahNumber,
      })),
    },
    select: {
      surahNumber: true,
      numberInSurah: true,
      page: true,
    },
  });

  // Build ayah→page lookup
  const ayahPageMap = new Map<string, number>();
  for (const a of ayahPages) {
    ayahPageMap.set(`${a.surahNumber}:${a.numberInSurah}`, a.page);
  }

  // 3. Get session data grouped by page
  const sessions = await prisma.recitationSession.findMany({
    where: { userId, status: "COMPLETED" },
    select: {
      surahNumber: true,
      startAyah: true,
      endAyah: true,
      pageNumber: true,
      accuracy: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 4. Build page-level aggregation
  const pageStats = new Map<
    number,
    {
      retentions: number[];
      accuracies: number[];
      sessionsCount: number;
      lastPracticed: Date | null;
    }
  >();

  const ensurePage = (page: number) => {
    if (!pageStats.has(page)) {
      pageStats.set(page, {
        retentions: [],
        accuracies: [],
        sessionsCount: 0,
        lastPracticed: null,
      });
    }
    return pageStats.get(page)!;
  };

  // Add FSRS retention data per page
  const now = new Date();
  for (const card of cards) {
    const page = ayahPageMap.get(`${card.surahNumber}:${card.ayahNumber}`);
    if (!page) continue;

    const stats = ensurePage(page);

    // Compute retrievability using FSRS formula
    let retention = 100;
    if (card.stability > 0 && card.reps > 0) {
      const daysSinceReview = card.lastReview
        ? Math.max(
            0,
            (now.getTime() - new Date(card.lastReview).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : card.elapsedDays;
      retention = Math.round(
        Math.exp((Math.log(0.9) * daysSinceReview) / card.stability) * 100
      );
    } else if (card.reps === 0) {
      retention = 0; // New card, never reviewed
    }

    stats.retentions.push(retention);
    if (card.averageAccuracy > 0) {
      stats.accuracies.push(card.averageAccuracy);
    }
  }

  // Add session data per page
  for (const s of sessions) {
    if (s.pageNumber) {
      const stats = ensurePage(s.pageNumber);
      stats.sessionsCount++;
      if (s.accuracy !== null) stats.accuracies.push(s.accuracy);
      if (!stats.lastPracticed || s.createdAt > stats.lastPracticed) {
        stats.lastPracticed = s.createdAt;
      }
    }
  }

  // 5. Build result for all 604 pages
  const pages: PageMasteryData[] = [];
  for (let i = 1; i <= 604; i++) {
    const stats = pageStats.get(i);

    if (
      !stats ||
      (stats.retentions.length === 0 && stats.sessionsCount === 0)
    ) {
      pages.push({
        page: i,
        level: "not_started",
        accuracy: 0,
        sessionsCount: 0,
        lastPracticed: null,
        retention: 0,
      });
      continue;
    }

    const avgRetention =
      stats.retentions.length > 0
        ? stats.retentions.reduce((a, b) => a + b, 0) / stats.retentions.length
        : 0;
    const avgAccuracy =
      stats.accuracies.length > 0
        ? stats.accuracies.reduce((a, b) => a + b, 0) / stats.accuracies.length
        : 0;

    const level = computeMasteryLevel(
      avgAccuracy,
      stats.sessionsCount,
      avgRetention
    );

    pages.push({
      page: i,
      level,
      accuracy: Math.round(avgAccuracy * 10) / 10,
      sessionsCount: stats.sessionsCount,
      lastPracticed: stats.lastPracticed?.toISOString() ?? null,
      retention: Math.round(avgRetention * 10) / 10,
    });
  }

  return pages;
}
