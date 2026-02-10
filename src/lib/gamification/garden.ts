/**
 * Garden of Jannah — State Management
 *
 * 30 juz = 30 biomes. 114 surahs = 114 trees.
 * Full Quran memorized = Paradise Garden.
 */

import type { SurahTree } from "./surah-trees";

export type BiomeType =
  | "meadow"
  | "oasis"
  | "forest"
  | "mountain"
  | "valley"
  | "garden"
  | "riverside";

export interface BiomeState {
  juzNumber: number;
  type: BiomeType;
  completionPct: number; // 0-100
  surahNumbers: number[];
}

export interface RiverConnection {
  fromSurah: number;
  toSurah: number;
  verse1Key: string;
  verse2Key: string;
  strength: number; // 0-1 similarity
}

export interface Decoration {
  id: string;
  type: "fountain" | "bridge" | "bird" | "butterfly" | "lantern" | "gate";
  name: string;
  cost: number; // hasanat
  placedAt?: { biome: number; x: number; y: number };
}

export interface GardenState {
  surahTrees: SurahTree[];
  rivers: RiverConnection[];
  biomes: BiomeState[];
  decorations: Decoration[];
  hasanat: number;
  gardenLevel: number;
  isParadiseGarden: boolean;
}

// Biome type rotation per juz
const BIOME_TYPES: BiomeType[] = [
  "meadow",
  "oasis",
  "forest",
  "mountain",
  "valley",
  "garden",
  "riverside",
];

// Juz to surah mapping (approximate — surah ranges per juz)
const JUZ_SURAH_RANGES: [number, number][] = [
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

/**
 * Initialize an empty garden
 */
export function initializeGarden(): GardenState {
  const biomes: BiomeState[] = JUZ_SURAH_RANGES.map(([start, end], idx) => {
    const surahNumbers: number[] = [];
    for (let s = start; s <= end; s++) surahNumbers.push(s);
    return {
      juzNumber: idx + 1,
      type: BIOME_TYPES[idx % BIOME_TYPES.length],
      completionPct: 0,
      surahNumbers,
    };
  });

  return {
    surahTrees: [],
    rivers: [],
    biomes,
    decorations: [],
    hasanat: 0,
    gardenLevel: 0,
    isParadiseGarden: false,
  };
}

/**
 * Update garden state from surah trees
 */
export function updateGarden(
  state: GardenState,
  trees: SurahTree[]
): GardenState {
  const treeMap = new Map(trees.map((t) => [t.surahNumber, t]));

  // Update biome completion
  const updatedBiomes = state.biomes.map((biome) => {
    let totalAyahs = 0;
    let bloomedAyahs = 0;

    for (const surahNum of biome.surahNumbers) {
      const tree = treeMap.get(surahNum);
      if (tree) {
        totalAyahs += tree.totalAyahs;
        bloomedAyahs += tree.bloomCount;
      }
    }

    return {
      ...biome,
      completionPct:
        totalAyahs > 0 ? Math.round((bloomedAyahs / totalAyahs) * 100) : 0,
    };
  });

  const gardenLevel = computeGardenLevel(updatedBiomes);
  const isParadiseGarden = checkParadiseGarden(updatedBiomes);

  return {
    ...state,
    surahTrees: trees,
    biomes: updatedBiomes,
    gardenLevel,
    isParadiseGarden,
  };
}

/**
 * Compute garden level (0-30) based on biome completion
 */
export function computeGardenLevel(biomes: BiomeState[]): number {
  const completedBiomes = biomes.filter((b) => b.completionPct >= 80).length;
  return completedBiomes;
}

/**
 * Check if the full Quran is memorized (Paradise Garden)
 */
export function checkParadiseGarden(biomes: BiomeState[]): boolean {
  return biomes.every((b) => b.completionPct >= 95);
}

/**
 * Available decorations for the garden shop
 */
export const GARDEN_SHOP: Decoration[] = [
  { id: "fountain_1", type: "fountain", name: "Crystal Fountain", cost: 100 },
  { id: "fountain_2", type: "fountain", name: "Golden Fountain", cost: 500 },
  { id: "bridge_1", type: "bridge", name: "Wooden Bridge", cost: 75 },
  { id: "bridge_2", type: "bridge", name: "Marble Bridge", cost: 300 },
  { id: "bird_1", type: "bird", name: "Nightingale", cost: 50 },
  { id: "bird_2", type: "bird", name: "Peacock", cost: 200 },
  { id: "butterfly_1", type: "butterfly", name: "Emerald Butterfly", cost: 30 },
  { id: "butterfly_2", type: "butterfly", name: "Golden Butterfly", cost: 150 },
  { id: "lantern_1", type: "lantern", name: "Crescent Lantern", cost: 60 },
  { id: "lantern_2", type: "lantern", name: "Star Lantern", cost: 250 },
  { id: "gate_1", type: "gate", name: "Garden Gate", cost: 400 },
  { id: "gate_2", type: "gate", name: "Paradise Gate", cost: 1000 },
];
