import { NextResponse } from "next/server";
import { SURAH_NAMES } from "@/data/hizb-data";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { computeGardenLevel } from "@/lib/gamification/garden";
import { createSurahTree, getAyahCount } from "@/lib/gamification/surah-trees";

/**
 * GET /api/progress/jannati
 * Computes all 114 surah tree states from FSRS data + river connections.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const data = await getCached(
      `jannati:${userId}`,
      300, // 5 min TTL
      async () => computeJannati(userId)
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Jannati error:", error);
    return NextResponse.json(
      { error: "Failed to compute garden" },
      { status: 500 }
    );
  }
}

async function computeJannati(userId: string) {
  // Fetch all FSRS cards for this user
  const fsrsCards = await prisma.fSRSCard.findMany({
    where: { userId },
    select: {
      surahNumber: true,
      ayahNumber: true,
      stability: true,
      state: true,
      lastReview: true,
    },
  });

  // Group cards by surah number
  const cardsBySurah = new Map<
    number,
    Array<{
      ayahNumber: number;
      state: number;
      stability: number;
      lastReview: string | null;
    }>
  >();

  for (const card of fsrsCards) {
    if (!cardsBySurah.has(card.surahNumber)) {
      cardsBySurah.set(card.surahNumber, []);
    }
    cardsBySurah.get(card.surahNumber)!.push({
      ayahNumber: card.ayahNumber,
      state: card.state,
      stability: card.stability,
      lastReview: card.lastReview?.toISOString() ?? null,
    });
  }

  // Build 114 trees
  let totalBloom = 0;
  let totalAyahs = 0;
  const trees = [];

  for (let s = 1; s <= 114; s++) {
    const surahName = SURAH_NAMES[s] ?? `Surah ${s}`;
    const cards = cardsBySurah.get(s) ?? [];
    const tree = createSurahTree(s, surahName, cards);
    trees.push(tree);
    totalBloom += tree.bloomCount;
    totalAyahs += tree.totalAyahs;
  }

  // Compute garden stats
  const bloomPercentage =
    totalAyahs > 0 ? Math.round((totalBloom / totalAyahs) * 100) : 0;
  const isParadise = bloomPercentage >= 80;

  // Compute garden level from biome-like completion
  // Simple: count how many juz-groups have >80% bloom
  const juzBiomes = buildJuzBiomes(trees);
  const gardenLevel = computeGardenLevel(juzBiomes);

  // Fetch hasanat from GardenState if exists
  const gardenState = await prisma.gardenState.findUnique({
    where: { userId },
    select: { hasanat: true },
  });
  const hasanat = gardenState?.hasanat ?? 0;

  // Fetch similar verse pairs for rivers
  const similarPairs = await prisma.similarVersePair.findMany({
    where: { similarity: { gte: 0.7 } },
    select: {
      verse1Key: true,
      verse2Key: true,
      similarity: true,
    },
    take: 50,
    orderBy: { similarity: "desc" },
  });

  const rivers = similarPairs.map((p) => {
    const [s1, a1] = p.verse1Key.split(":").map(Number);
    const [s2, a2] = p.verse2Key.split(":").map(Number);
    return {
      from: { surah: s1, ayah: a1 },
      to: { surah: s2, ayah: a2 },
      strength: p.similarity,
    };
  });

  return {
    trees,
    gardenStats: {
      totalBloom,
      totalAyahs,
      bloomPercentage,
      gardenLevel,
      isParadise,
      hasanat,
    },
    rivers,
  };
}

// Helper: build juz biome data from trees for garden level computation
function buildJuzBiomes(
  trees: Array<{ surahNumber: number; totalAyahs: number; bloomCount: number }>
) {
  // Juz surah ranges (approximate)
  const JUZ_RANGES: [number, number][] = [
    [1, 2],
    [2, 2],
    [2, 3],
    [3, 4],
    [4, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 11],
    [11, 12],
    [12, 14],
    [15, 16],
    [17, 18],
    [18, 20],
    [21, 22],
    [23, 25],
    [25, 27],
    [27, 29],
    [29, 33],
    [33, 36],
    [36, 39],
    [39, 41],
    [41, 46],
    [46, 51],
    [51, 57],
    [58, 66],
    [67, 77],
    [78, 114],
  ];

  const treeMap = new Map(trees.map((t) => [t.surahNumber, t]));

  return JUZ_RANGES.map(([start, end], idx) => {
    const surahNumbers: number[] = [];
    for (let s = start; s <= end; s++) surahNumbers.push(s);

    let totalAyahs = 0;
    let bloomedAyahs = 0;
    for (const sn of surahNumbers) {
      const tree = treeMap.get(sn);
      if (tree) {
        totalAyahs += tree.totalAyahs;
        bloomedAyahs += tree.bloomCount;
      } else {
        totalAyahs += getAyahCount(sn);
      }
    }

    return {
      juzNumber: idx + 1,
      type: "meadow" as const,
      completionPct:
        totalAyahs > 0 ? Math.round((bloomedAyahs / totalAyahs) * 100) : 0,
      surahNumbers,
    };
  });
}
