import { describe, expect, it } from "vitest";

import {
  computeSeason,
  createSurahTree,
  getAyahCount,
  getFlowerStage,
  getTreeSize,
} from "../surah-trees";

describe("getTreeSize", () => {
  it("returns bonsai for very short surahs", () => {
    expect(getTreeSize(3)).toBe("bonsai");
    expect(getTreeSize(7)).toBe("bonsai");
    expect(getTreeSize(10)).toBe("bonsai");
  });

  it("returns shrub for short surahs", () => {
    expect(getTreeSize(11)).toBe("shrub");
    expect(getTreeSize(30)).toBe("shrub");
  });

  it("returns sapling for medium surahs", () => {
    expect(getTreeSize(45)).toBe("sapling");
  });

  it("returns tree for longer surahs", () => {
    expect(getTreeSize(100)).toBe("tree");
  });

  it("returns oak for long surahs", () => {
    expect(getTreeSize(175)).toBe("oak");
  });

  it("returns baobab for Al-Baqarah length", () => {
    expect(getTreeSize(286)).toBe("baobab");
  });
});

describe("getFlowerStage", () => {
  it("returns seed when no card exists", () => {
    expect(getFlowerStage(0, 100, false)).toBe("seed");
  });

  it("returns sprout for new cards", () => {
    expect(getFlowerStage(0, 100, true)).toBe("sprout");
  });

  it("returns bud for learning cards", () => {
    expect(getFlowerStage(1, 100, true)).toBe("bud");
  });

  it("returns bloom for review cards with high retrievability", () => {
    expect(getFlowerStage(2, 90, true)).toBe("bloom");
  });

  it("returns wilted for review cards with low retrievability", () => {
    expect(getFlowerStage(2, 30, true)).toBe("wilted");
  });

  it("returns bud for review cards with medium retrievability", () => {
    expect(getFlowerStage(2, 50, true)).toBe("bud");
  });
});

describe("computeSeason", () => {
  it("returns summer for active + high bloom", () => {
    expect(computeSeason(1, 0.9)).toBe("summer");
  });

  it("returns spring for recent activity", () => {
    expect(computeSeason(5, 0.5)).toBe("spring");
  });

  it("returns autumn for falling behind", () => {
    expect(computeSeason(15, 0.3)).toBe("autumn");
  });

  it("returns winter for inactive", () => {
    expect(computeSeason(60, 0.1)).toBe("winter");
  });
});

describe("createSurahTree", () => {
  it("creates a tree with correct metadata", () => {
    const tree = createSurahTree(1, "Al-Fatiha", []);
    expect(tree.surahNumber).toBe(1);
    expect(tree.surahName).toBe("Al-Fatiha");
    expect(tree.treeSize).toBe("bonsai");
    expect(tree.totalAyahs).toBe(7);
    expect(tree.flowers).toHaveLength(7);
    expect(tree.flowers.every((f) => f.stage === "seed")).toBe(true);
  });

  it("marks flowers based on FSRS cards", () => {
    const cards = [
      { ayahNumber: 1, state: 0, stability: 0, lastReview: null },
      {
        ayahNumber: 2,
        state: 2,
        stability: 50,
        lastReview: new Date().toISOString(),
      },
    ];

    const tree = createSurahTree(1, "Al-Fatiha", cards);
    expect(tree.flowers[0].stage).toBe("sprout"); // new card
    expect(tree.flowers[1].stage).toBe("bloom"); // review card with recent review
    expect(tree.flowers[2].stage).toBe("seed"); // no card
  });

  it("calculates mastery percentage", () => {
    const cards = Array.from({ length: 7 }, (_, i) => ({
      ayahNumber: i + 1,
      state: 2,
      stability: 50,
      lastReview: new Date().toISOString(),
    }));

    const tree = createSurahTree(1, "Al-Fatiha", cards);
    expect(tree.bloomCount).toBe(7);
    expect(tree.trunkMastery).toBe(100);
  });
});

describe("getAyahCount", () => {
  it("returns correct count for Al-Fatiha", () => {
    expect(getAyahCount(1)).toBe(7);
  });

  it("returns correct count for Al-Baqarah", () => {
    expect(getAyahCount(2)).toBe(286);
  });

  it("returns 0 for invalid surah", () => {
    expect(getAyahCount(0)).toBe(0);
    expect(getAyahCount(115)).toBe(0);
  });
});
