/**
 * Road to Jannah — Layout utilities, biome definitions, and positioning math
 */

import type { Season, SurahTree } from "@/lib/gamification/surah-trees";

// ============================================================
// Constants
// ============================================================

export const ROAD_WIDTH = 500;
export const NODE_SPACING_Y = 120;
export const ROAD_PADDING_TOP = 250; // space for Paradise Gate
export const ROAD_PADDING_BOTTOM = 120;
export const ROAD_CENTER_X = ROAD_WIDTH / 2;
export const ROAD_AMPLITUDE = 130; // sine wave amplitude
export const ROAD_STROKE_WIDTH = 40;

export const TOTAL_NODES = 114;
export const SVG_HEIGHT =
  ROAD_PADDING_TOP + TOTAL_NODES * NODE_SPACING_Y + ROAD_PADDING_BOTTOM;

// Node visual sizes
export const NODE_RADIUS = 22;
export const NODE_HIT_RADIUS = 30;

// ============================================================
// Seeded PRNG (deterministic per-node decorations)
// ============================================================

export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ============================================================
// Node visual states
// ============================================================

export type NodeState =
  | "seed"
  | "sprouting"
  | "growing"
  | "blooming"
  | "mastered"
  | "wilting";

export function computeNodeState(tree: SurahTree): NodeState {
  const mastery = tree.trunkMastery;
  const hasOverdue = tree.flowers.some((f) => f.stage === "wilted");

  if (hasOverdue && mastery > 0) return "wilting";
  if (mastery >= 90) return "mastered";
  if (mastery >= 60) return "blooming";
  if (mastery >= 20) return "growing";
  if (mastery > 0) return "sprouting";
  return "seed";
}

export const NODE_STATE_COLORS: Record<
  NodeState,
  { fill: string; stroke: string; glow?: string }
> = {
  seed: { fill: "#9ca3af", stroke: "#6b7280" },
  sprouting: { fill: "#86efac", stroke: "#22c55e" },
  growing: { fill: "#4ade80", stroke: "#16a34a" },
  blooming: { fill: "#34d399", stroke: "#059669", glow: "#34d39966" },
  mastered: { fill: "#fbbf24", stroke: "#d97706", glow: "#fbbf2466" },
  wilting: { fill: "#fb923c", stroke: "#ea580c" },
};

// ============================================================
// Juz → Surah ranges
// ============================================================

export const JUZ_SURAH_RANGES: [number, number][] = [
  [1, 2], // Juz 1
  [2, 2], // Juz 2  (Al-Baqarah cont.)
  [2, 3], // Juz 3
  [3, 4], // Juz 4
  [4, 4], // Juz 5
  [4, 5], // Juz 6
  [5, 6], // Juz 7
  [6, 7], // Juz 8
  [7, 8], // Juz 9
  [8, 9], // Juz 10
  [9, 11], // Juz 11
  [11, 12], // Juz 12
  [12, 14], // Juz 13
  [15, 16], // Juz 14
  [17, 18], // Juz 15
  [18, 20], // Juz 16
  [21, 22], // Juz 17
  [23, 25], // Juz 18
  [25, 27], // Juz 19
  [27, 29], // Juz 20
  [29, 33], // Juz 21
  [33, 36], // Juz 22
  [36, 39], // Juz 23
  [39, 41], // Juz 24
  [41, 46], // Juz 25
  [46, 51], // Juz 26
  [51, 57], // Juz 27
  [58, 66], // Juz 28
  [67, 77], // Juz 29
  [78, 114], // Juz 30
];

/**
 * Get the primary juz for a surah (first juz that contains it).
 */
export function getJuzForSurah(surahNumber: number): number {
  for (let j = 0; j < JUZ_SURAH_RANGES.length; j++) {
    const [start, end] = JUZ_SURAH_RANGES[j];
    if (surahNumber >= start && surahNumber <= end) return j + 1;
  }
  return 30;
}

// ============================================================
// Biome themes (30 zones progressing desert → paradise)
// ============================================================

export interface BiomeTheme {
  name: string;
  bgGradient: [string, string]; // top, bottom colors
  terrain: string; // short terrain label
  accentColor: string;
}

const BIOME_THEMES: BiomeTheme[] = [
  // Juz 1-3: Desert
  {
    name: "Sandy Dunes",
    bgGradient: ["#fef3c7", "#fde68a"],
    terrain: "desert",
    accentColor: "#d97706",
  },
  {
    name: "Golden Sands",
    bgGradient: ["#fde68a", "#fcd34d"],
    terrain: "desert",
    accentColor: "#b45309",
  },
  {
    name: "Desert Dawn",
    bgGradient: ["#fcd34d", "#fbbf24"],
    terrain: "desert",
    accentColor: "#92400e",
  },
  // Juz 4-6: Oasis
  {
    name: "First Oasis",
    bgGradient: ["#d1fae5", "#a7f3d0"],
    terrain: "oasis",
    accentColor: "#059669",
  },
  {
    name: "Palm Springs",
    bgGradient: ["#a7f3d0", "#6ee7b7"],
    terrain: "oasis",
    accentColor: "#047857",
  },
  {
    name: "Cool Waters",
    bgGradient: ["#6ee7b7", "#34d399"],
    terrain: "oasis",
    accentColor: "#065f46",
  },
  // Juz 7-9: Savanna
  {
    name: "Tall Grass",
    bgGradient: ["#ecfccb", "#d9f99d"],
    terrain: "savanna",
    accentColor: "#65a30d",
  },
  {
    name: "Acacia Fields",
    bgGradient: ["#d9f99d", "#bef264"],
    terrain: "savanna",
    accentColor: "#4d7c0f",
  },
  {
    name: "Sunset Plains",
    bgGradient: ["#bef264", "#a3e635"],
    terrain: "savanna",
    accentColor: "#3f6212",
  },
  // Juz 10-13: Forest
  {
    name: "Pine Woods",
    bgGradient: ["#bbf7d0", "#86efac"],
    terrain: "forest",
    accentColor: "#16a34a",
  },
  {
    name: "Deep Forest",
    bgGradient: ["#86efac", "#4ade80"],
    terrain: "forest",
    accentColor: "#15803d",
  },
  {
    name: "Oak Grove",
    bgGradient: ["#4ade80", "#22c55e"],
    terrain: "forest",
    accentColor: "#166534",
  },
  {
    name: "Ancient Woods",
    bgGradient: ["#22c55e", "#16a34a"],
    terrain: "forest",
    accentColor: "#14532d",
  },
  // Juz 14-17: Mountain
  {
    name: "Foothills",
    bgGradient: ["#e0e7ff", "#c7d2fe"],
    terrain: "mountain",
    accentColor: "#6366f1",
  },
  {
    name: "Rocky Peaks",
    bgGradient: ["#c7d2fe", "#a5b4fc"],
    terrain: "mountain",
    accentColor: "#4f46e5",
  },
  {
    name: "Snow Caps",
    bgGradient: ["#a5b4fc", "#818cf8"],
    terrain: "mountain",
    accentColor: "#4338ca",
  },
  {
    name: "Summit View",
    bgGradient: ["#818cf8", "#6366f1"],
    terrain: "mountain",
    accentColor: "#3730a3",
  },
  // Juz 18-20: Highland
  {
    name: "Green Hills",
    bgGradient: ["#d1fae5", "#99f6e4"],
    terrain: "highland",
    accentColor: "#0d9488",
  },
  {
    name: "Misty Meadow",
    bgGradient: ["#99f6e4", "#5eead4"],
    terrain: "highland",
    accentColor: "#0f766e",
  },
  {
    name: "Rolling Hills",
    bgGradient: ["#5eead4", "#2dd4bf"],
    terrain: "highland",
    accentColor: "#115e59",
  },
  // Juz 21-23: Valley
  {
    name: "Wildflowers",
    bgGradient: ["#fce7f3", "#fbcfe8"],
    terrain: "valley",
    accentColor: "#db2777",
  },
  {
    name: "Stream Valley",
    bgGradient: ["#fbcfe8", "#f9a8d4"],
    terrain: "valley",
    accentColor: "#be185d",
  },
  {
    name: "Blossom Dale",
    bgGradient: ["#f9a8d4", "#f472b6"],
    terrain: "valley",
    accentColor: "#9d174d",
  },
  // Juz 24-26: Garden
  {
    name: "Flower Beds",
    bgGradient: ["#fef9c3", "#fef08a"],
    terrain: "garden",
    accentColor: "#ca8a04",
  },
  {
    name: "Rose Garden",
    bgGradient: ["#fef08a", "#fde047"],
    terrain: "garden",
    accentColor: "#a16207",
  },
  {
    name: "Hedge Maze",
    bgGradient: ["#fde047", "#facc15"],
    terrain: "garden",
    accentColor: "#854d0e",
  },
  // Juz 27-28: Riverside
  {
    name: "River Banks",
    bgGradient: ["#bae6fd", "#7dd3fc"],
    terrain: "riverside",
    accentColor: "#0284c7",
  },
  {
    name: "Crystal Bridges",
    bgGradient: ["#7dd3fc", "#38bdf8"],
    terrain: "riverside",
    accentColor: "#0369a1",
  },
  // Juz 29-30: Golden/Ethereal
  {
    name: "Golden Light",
    bgGradient: ["#fef3c7", "#fde68a"],
    terrain: "golden",
    accentColor: "#d97706",
  },
  {
    name: "Crystal Paradise",
    bgGradient: ["#fde68a", "#fbbf24"],
    terrain: "golden",
    accentColor: "#b45309",
  },
];

export function getBiomeTheme(juzNumber: number): BiomeTheme {
  return BIOME_THEMES[juzNumber - 1] ?? BIOME_THEMES[0];
}

// Dark mode variants
export const BIOME_DARK_THEMES: Record<string, [string, string]> = {
  desert: ["#451a03", "#78350f"],
  oasis: ["#022c22", "#064e3b"],
  savanna: ["#1a2e05", "#365314"],
  forest: ["#052e16", "#14532d"],
  mountain: ["#1e1b4b", "#312e81"],
  highland: ["#042f2e", "#134e4a"],
  valley: ["#500724", "#831843"],
  garden: ["#422006", "#713f12"],
  riverside: ["#0c4a6e", "#075985"],
  golden: ["#451a03", "#78350f"],
};

// ============================================================
// Node positioning — sine wave path
// ============================================================

export interface NodePosition {
  x: number;
  y: number;
  surahNumber: number;
}

/**
 * Compute all 114 node positions along the winding road.
 * Surah 1 at bottom, Surah 114 at top.
 */
export function computeNodePositions(): NodePosition[] {
  const positions: NodePosition[] = [];

  for (let i = 0; i < TOTAL_NODES; i++) {
    const surahNumber = i + 1;
    // Bottom-up: surah 1 is at the bottom, 114 at top
    const reverseIndex = TOTAL_NODES - 1 - i;
    const y = ROAD_PADDING_TOP + reverseIndex * NODE_SPACING_Y;
    const x = ROAD_CENTER_X + Math.sin(i * 0.15 * Math.PI) * ROAD_AMPLITUDE;

    positions.push({ x, y, surahNumber });
  }

  return positions;
}

/**
 * Get the Y range for a juz biome zone.
 */
export function getJuzYRange(
  juzNumber: number,
  positions: NodePosition[]
): { yTop: number; yBottom: number } {
  const [startSurah, endSurah] = JUZ_SURAH_RANGES[juzNumber - 1] ?? [1, 2];

  // Find min and max Y for surahs in this juz
  const juzPositions = positions.filter(
    (p) => p.surahNumber >= startSurah && p.surahNumber <= endSurah
  );

  if (juzPositions.length === 0) {
    return { yTop: 0, yBottom: NODE_SPACING_Y };
  }

  const ys = juzPositions.map((p) => p.y);
  return {
    yTop: Math.min(...ys) - NODE_SPACING_Y / 2,
    yBottom: Math.max(...ys) + NODE_SPACING_Y / 2,
  };
}

// ============================================================
// Catmull-Rom to Cubic Bezier conversion for smooth road path
// ============================================================

interface Point {
  x: number;
  y: number;
}

/**
 * Convert a sequence of points to a smooth SVG path using Catmull-Rom splines.
 */
export function catmullRomToPath(points: Point[]): string {
  if (points.length < 2) return "";

  const d: string[] = [];
  d.push(`M ${points[0].x} ${points[0].y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Bezier control points
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return d.join(" ");
}

// ============================================================
// Surah Arabic names
// ============================================================

export const SURAH_ARABIC: Record<number, string> = {
  1: "الفاتحة",
  2: "البقرة",
  3: "آل عمران",
  4: "النساء",
  5: "المائدة",
  6: "الأنعام",
  7: "الأعراف",
  8: "الأنفال",
  9: "التوبة",
  10: "يونس",
  11: "هود",
  12: "يوسف",
  13: "الرعد",
  14: "إبراهيم",
  15: "الحجر",
  16: "النحل",
  17: "الإسراء",
  18: "الكهف",
  19: "مريم",
  20: "طه",
  21: "الأنبياء",
  22: "الحج",
  23: "المؤمنون",
  24: "النور",
  25: "الفرقان",
  26: "الشعراء",
  27: "النمل",
  28: "القصص",
  29: "العنكبوت",
  30: "الروم",
  31: "لقمان",
  32: "السجدة",
  33: "الأحزاب",
  34: "سبأ",
  35: "فاطر",
  36: "يس",
  37: "الصافات",
  38: "ص",
  39: "الزمر",
  40: "غافر",
  41: "فصلت",
  42: "الشورى",
  43: "الزخرف",
  44: "الدخان",
  45: "الجاثية",
  46: "الأحقاف",
  47: "محمد",
  48: "الفتح",
  49: "الحجرات",
  50: "ق",
  51: "الذاريات",
  52: "الطور",
  53: "النجم",
  54: "القمر",
  55: "الرحمن",
  56: "الواقعة",
  57: "الحديد",
  58: "المجادلة",
  59: "الحشر",
  60: "الممتحنة",
  61: "الصف",
  62: "الجمعة",
  63: "المنافقون",
  64: "التغابن",
  65: "الطلاق",
  66: "التحريم",
  67: "الملك",
  68: "القلم",
  69: "الحاقة",
  70: "المعارج",
  71: "نوح",
  72: "الجن",
  73: "المزمل",
  74: "المدثر",
  75: "القيامة",
  76: "الإنسان",
  77: "المرسلات",
  78: "النبأ",
  79: "النازعات",
  80: "عبس",
  81: "التكوير",
  82: "الانفطار",
  83: "المطففين",
  84: "الانشقاق",
  85: "البروج",
  86: "الطارق",
  87: "الأعلى",
  88: "الغاشية",
  89: "الفجر",
  90: "البلد",
  91: "الشمس",
  92: "الليل",
  93: "الضحى",
  94: "الشرح",
  95: "التين",
  96: "العلق",
  97: "القدر",
  98: "البينة",
  99: "الزلزلة",
  100: "العاديات",
  101: "القارعة",
  102: "التكاثر",
  103: "العصر",
  104: "الهمزة",
  105: "الفيل",
  106: "قريش",
  107: "الماعون",
  108: "الكوثر",
  109: "الكافرون",
  110: "النصر",
  111: "المسد",
  112: "الإخلاص",
  113: "الفلق",
  114: "الناس",
};

// ============================================================
// Find the "current progress" node — first non-mastered surah
// ============================================================

export function findCurrentProgressIndex(trees: SurahTree[]): number {
  for (let i = 0; i < trees.length; i++) {
    if (trees[i].trunkMastery < 90) return i;
  }
  return trees.length - 1; // all mastered
}

// ============================================================
// Season icon helpers
// ============================================================

export function getSeasonEmoji(season: Season): string {
  switch (season) {
    case "spring":
      return "\u{1F331}";
    case "summer":
      return "\u{2600}\uFE0F";
    case "autumn":
      return "\u{1F342}";
    case "winter":
      return "\u{2744}\uFE0F";
  }
}
