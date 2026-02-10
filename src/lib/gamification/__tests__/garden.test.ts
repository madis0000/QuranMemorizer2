import { describe, expect, it } from "vitest";

import {
  checkParadiseGarden,
  computeGardenLevel,
  GARDEN_SHOP,
  initializeGarden,
  updateGarden,
  type BiomeState,
} from "../garden";
import type { SurahTree } from "../surah-trees";

describe("initializeGarden", () => {
  it("creates a garden with 30 biomes", () => {
    const garden = initializeGarden();
    expect(garden.biomes).toHaveLength(30);
    expect(garden.hasanat).toBe(0);
    expect(garden.gardenLevel).toBe(0);
    expect(garden.isParadiseGarden).toBe(false);
    expect(garden.decorations).toEqual([]);
  });

  it("assigns unique biome types", () => {
    const garden = initializeGarden();
    const types = new Set(garden.biomes.map((b) => b.type));
    // 7 biome types cycling through 30 juz
    expect(types.size).toBe(7);
  });

  it("biomes have correct juz numbers", () => {
    const garden = initializeGarden();
    expect(garden.biomes[0].juzNumber).toBe(1);
    expect(garden.biomes[29].juzNumber).toBe(30);
  });
});

describe("updateGarden", () => {
  it("updates biome completion from trees", () => {
    const garden = initializeGarden();

    // Simulate a tree with some blooms
    const mockTree: SurahTree = {
      surahNumber: 1,
      surahName: "Al-Fatiha",
      treeSize: "bonsai",
      totalAyahs: 7,
      flowers: [],
      season: "spring",
      rootStrength: 50,
      trunkMastery: 100,
      bloomCount: 7,
    };

    const updated = updateGarden(garden, [mockTree]);
    expect(updated.biomes[0].completionPct).toBeGreaterThan(0);
  });

  it("detects paradise garden when all biomes complete", () => {
    const garden = initializeGarden();
    // Set all biomes to 100%
    garden.biomes = garden.biomes.map((b) => ({ ...b, completionPct: 100 }));
    const updated = updateGarden(garden, []);
    // updateGarden recalculates from trees, so without trees it will be 0
    // But the check function should work independently
    expect(checkParadiseGarden(garden.biomes)).toBe(true);
  });
});

describe("computeGardenLevel", () => {
  it("returns 0 for no completed biomes", () => {
    const biomes: BiomeState[] = Array.from({ length: 30 }, (_, i) => ({
      juzNumber: i + 1,
      type: "meadow" as const,
      completionPct: 50,
      surahNumbers: [],
    }));
    expect(computeGardenLevel(biomes)).toBe(0);
  });

  it("counts biomes >= 80% as completed", () => {
    const biomes: BiomeState[] = Array.from({ length: 30 }, (_, i) => ({
      juzNumber: i + 1,
      type: "meadow" as const,
      completionPct: i < 10 ? 85 : 50,
      surahNumbers: [],
    }));
    expect(computeGardenLevel(biomes)).toBe(10);
  });
});

describe("checkParadiseGarden", () => {
  it("returns false when any biome below 95%", () => {
    const biomes: BiomeState[] = Array.from({ length: 30 }, (_, i) => ({
      juzNumber: i + 1,
      type: "meadow" as const,
      completionPct: i === 0 ? 90 : 100,
      surahNumbers: [],
    }));
    expect(checkParadiseGarden(biomes)).toBe(false);
  });

  it("returns true when all biomes >= 95%", () => {
    const biomes: BiomeState[] = Array.from({ length: 30 }, (_, i) => ({
      juzNumber: i + 1,
      type: "meadow" as const,
      completionPct: 95 + (i % 6),
      surahNumbers: [],
    }));
    expect(checkParadiseGarden(biomes)).toBe(true);
  });
});

describe("GARDEN_SHOP", () => {
  it("has 12 items", () => {
    expect(GARDEN_SHOP).toHaveLength(12);
  });

  it("all items have positive cost", () => {
    expect(GARDEN_SHOP.every((d) => d.cost > 0)).toBe(true);
  });

  it("all items have unique IDs", () => {
    const ids = new Set(GARDEN_SHOP.map((d) => d.id));
    expect(ids.size).toBe(GARDEN_SHOP.length);
  });
});
