/**
 * Surah Tree System — Visual Growth Metaphor
 *
 * 114 surahs = 114 trees. Tree size determined by ayah count.
 * Each ayah = a flower that blooms when memorized, wilts when FSRS overdue.
 */

// Tree sizes by ayah count thresholds
export type TreeSize =
  | "bonsai"
  | "shrub"
  | "sapling"
  | "tree"
  | "oak"
  | "baobab";

export type FlowerStage = "seed" | "sprout" | "bud" | "bloom" | "wilted";

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface FlowerState {
  ayahNumber: number;
  stage: FlowerStage;
  memorizedAt?: string;
  lastReviewed?: string;
}

export interface SurahTree {
  surahNumber: number;
  surahName: string;
  treeSize: TreeSize;
  totalAyahs: number;
  flowers: FlowerState[];
  season: Season;
  rootStrength: number; // 0-100 (aggregate FSRS stability)
  trunkMastery: number; // 0-100 (overall mastery %)
  bloomCount: number; // number of bloomed flowers
}

// Surah ayah counts (1-indexed, surah 0 unused)
const SURAH_AYAH_COUNTS = [
  0, 7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54,
  45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62,
  55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28,
  20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15,
  21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

/**
 * Determine tree size from ayah count
 */
export function getTreeSize(ayahCount: number): TreeSize {
  if (ayahCount <= 10) return "bonsai";
  if (ayahCount <= 30) return "shrub";
  if (ayahCount <= 60) return "sapling";
  if (ayahCount <= 120) return "tree";
  if (ayahCount <= 200) return "oak";
  return "baobab";
}

/**
 * Map FSRS card state + retrievability to flower stage
 */
export function getFlowerStage(
  fsrsState: number,
  retrievability: number,
  hasCard: boolean
): FlowerStage {
  if (!hasCard) return "seed";

  // State: 0=New, 1=Learning, 2=Review, 3=Relearning
  if (fsrsState === 0) return "sprout";
  if (fsrsState === 1) return "bud";

  // Review state — check retrievability
  if (retrievability >= 70) return "bloom";
  if (retrievability >= 40) return "bud";
  return "wilted";
}

/**
 * Compute season based on recent activity
 */
export function computeSeason(
  recentReviewDays: number,
  bloomRatio: number
): Season {
  if (recentReviewDays <= 3 && bloomRatio >= 0.7) return "summer"; // peak
  if (recentReviewDays <= 7) return "spring"; // active
  if (recentReviewDays <= 30) return "autumn"; // falling behind
  return "winter"; // inactive
}

/**
 * Create a SurahTree from surah data and FSRS cards
 */
export function createSurahTree(
  surahNumber: number,
  surahName: string,
  fsrsCards: Array<{
    ayahNumber: number;
    state: number;
    stability: number;
    lastReview: string | null;
  }>
): SurahTree {
  const totalAyahs = SURAH_AYAH_COUNTS[surahNumber] ?? 7;
  const treeSize = getTreeSize(totalAyahs);

  // Build card lookup
  const cardMap = new Map(fsrsCards.map((c) => [c.ayahNumber, c]));

  // Create flowers for each ayah
  const flowers: FlowerState[] = [];
  let totalStability = 0;
  let cardCount = 0;
  let bloomCount = 0;
  let lastReviewDate: Date | null = null;

  for (let ayah = 1; ayah <= totalAyahs; ayah++) {
    const card = cardMap.get(ayah);
    const hasCard = !!card;

    // Simple retrievability approximation
    let retrievability = 100;
    if (card && card.stability > 0) {
      const daysSinceReview = card.lastReview
        ? (Date.now() - new Date(card.lastReview).getTime()) /
          (1000 * 60 * 60 * 24)
        : 0;
      retrievability = Math.round(
        Math.exp((Math.log(0.9) * daysSinceReview) / card.stability) * 100
      );
    }

    const stage = getFlowerStage(card?.state ?? 0, retrievability, hasCard);

    flowers.push({
      ayahNumber: ayah,
      stage,
      memorizedAt: card?.lastReview ?? undefined,
      lastReviewed: card?.lastReview ?? undefined,
    });

    if (hasCard) {
      totalStability += card.stability;
      cardCount++;
      if (stage === "bloom") bloomCount++;
      if (card.lastReview) {
        const reviewDate = new Date(card.lastReview);
        if (!lastReviewDate || reviewDate > lastReviewDate) {
          lastReviewDate = reviewDate;
        }
      }
    }
  }

  const rootStrength =
    cardCount > 0 ? Math.min(100, Math.round(totalStability / cardCount)) : 0;
  const trunkMastery =
    totalAyahs > 0 ? Math.round((bloomCount / totalAyahs) * 100) : 0;

  const daysSinceLastReview = lastReviewDate
    ? (Date.now() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)
    : 999;
  const bloomRatio = totalAyahs > 0 ? bloomCount / totalAyahs : 0;
  const season = computeSeason(daysSinceLastReview, bloomRatio);

  return {
    surahNumber,
    surahName,
    treeSize,
    totalAyahs,
    flowers,
    season,
    rootStrength,
    trunkMastery,
    bloomCount,
  };
}

/**
 * Get ayah count for a surah
 */
export function getAyahCount(surahNumber: number): number {
  return SURAH_AYAH_COUNTS[surahNumber] ?? 0;
}
