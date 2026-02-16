/**
 * River to Jannah — Layout utilities, river geometry, biome themes, and positioning math
 *
 * The river replaces the road as the central visual metaphor. Nodes sit on
 * alternating banks of a flowing river that winds from desert (Surah 1) to
 * paradise (Surah 114).
 */

import type { Season, SurahTree } from "@/lib/gamification/surah-trees";

// ============================================================
// Constants
// ============================================================

export const RIVER_SVG_WIDTH = 1200;
export const NODE_SPACING_Y = 120;
export const RIVER_PADDING_TOP = 300;
export const RIVER_PADDING_BOTTOM = 120;
export const RIVER_CENTER_X = RIVER_SVG_WIDTH / 2;
export const RIVER_AMPLITUDE = 200;
export const RIVER_BASE_HALF_WIDTH = 40;
export const RIVER_NODE_POOL_EXTRA = 18;
export const NODE_OFFSET_FROM_RIVER = 120;

export const TOTAL_NODES = 114;
export const SVG_HEIGHT =
  RIVER_PADDING_TOP + TOTAL_NODES * NODE_SPACING_Y + RIVER_PADDING_BOTTOM;

export const NODE_RADIUS = 24;
export const NODE_HIT_RADIUS = 32;

// ============================================================
// Types
// ============================================================

export type NodeState =
  | "seed"
  | "sprouting"
  | "growing"
  | "blooming"
  | "mastered"
  | "wilting";

export type AnimationTier = 1 | 2 | 3 | 4;

export interface NodePosition {
  x: number;
  y: number;
  surahNumber: number;
  bankSide: "left" | "right";
  riverCenterX: number;
}

interface Point {
  x: number;
  y: number;
}

// ============================================================
// Seeded PRNG (deterministic per-node decorations)
// ============================================================

export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ============================================================
// Animation tier detection
// ============================================================

export function detectAnimationTier(): AnimationTier {
  if (typeof window === "undefined") return 1;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 1;

  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 2;

  if (width < 768 || cores <= 2) return 2;
  if (width < 1280 || cores <= 4) return 3;
  return 4;
}

// ============================================================
// Node visual states
// ============================================================

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
// River color palette
// ============================================================

export const RIVER_COLORS = {
  deep: "#0e7490",
  mid: "#06b6d4",
  shallow: "#22d3ee",
  shimmer: "#67e8f9",
  bank: "#8B7355",
  bankGrass: "#4a8c3f",
  bankRich: "#2D7B4F",
};

export const RIVER_COLORS_DARK = {
  deep: "#164e63",
  mid: "#0e7490",
  shallow: "#155e75",
  shimmer: "#0e7490",
  bank: "#3d2b1f",
  bankGrass: "#1a4a1a",
  bankRich: "#1a3d2a",
};

// ============================================================
// Juz → Surah ranges
// ============================================================

export const JUZ_SURAH_RANGES: [number, number][] = [
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

export function getJuzForSurah(surahNumber: number): number {
  for (let j = 0; j < JUZ_SURAH_RANGES.length; j++) {
    const [start, end] = JUZ_SURAH_RANGES[j];
    if (surahNumber >= start && surahNumber <= end) return j + 1;
  }
  return 30;
}

// ============================================================
// Biome themes (30 zones — desert → paradise)
// ============================================================

export interface BiomeTheme {
  name: string;
  bgGradient: [string, string];
  skyGradient: [string, string];
  terrain: string;
  accentColor: string;
  vegetationColors: [string, string, string];
}

const BIOME_THEMES: BiomeTheme[] = [
  // Juz 1-3: Desert
  {
    name: "Sandy Dunes",
    bgGradient: ["#fef3c7", "#fde68a"],
    skyGradient: ["#fef9ee", "#fef3c7"],
    terrain: "desert",
    accentColor: "#d97706",
    vegetationColors: ["#D4A574", "#E8C98A", "#C67A4B"],
  },
  {
    name: "Golden Sands",
    bgGradient: ["#fde68a", "#fcd34d"],
    skyGradient: ["#fef3c7", "#fde68a"],
    terrain: "desert",
    accentColor: "#b45309",
    vegetationColors: ["#D4A574", "#E8C98A", "#C67A4B"],
  },
  {
    name: "Desert Dawn",
    bgGradient: ["#fcd34d", "#fbbf24"],
    skyGradient: ["#fde68a", "#fcd34d"],
    terrain: "desert",
    accentColor: "#92400e",
    vegetationColors: ["#D4A574", "#C67A4B", "#92400e"],
  },
  // Juz 4-6: Oasis
  {
    name: "First Oasis",
    bgGradient: ["#d1fae5", "#a7f3d0"],
    skyGradient: ["#ecfdf5", "#d1fae5"],
    terrain: "oasis",
    accentColor: "#059669",
    vegetationColors: ["#059669", "#22c55e", "#86efac"],
  },
  {
    name: "Palm Springs",
    bgGradient: ["#a7f3d0", "#6ee7b7"],
    skyGradient: ["#d1fae5", "#a7f3d0"],
    terrain: "oasis",
    accentColor: "#047857",
    vegetationColors: ["#047857", "#059669", "#34d399"],
  },
  {
    name: "Cool Waters",
    bgGradient: ["#6ee7b7", "#34d399"],
    skyGradient: ["#a7f3d0", "#6ee7b7"],
    terrain: "oasis",
    accentColor: "#065f46",
    vegetationColors: ["#065f46", "#047857", "#22c55e"],
  },
  // Juz 7-9: Savanna
  {
    name: "Tall Grass",
    bgGradient: ["#ecfccb", "#d9f99d"],
    skyGradient: ["#f7fee7", "#ecfccb"],
    terrain: "savanna",
    accentColor: "#65a30d",
    vegetationColors: ["#65a30d", "#84cc16", "#a3e635"],
  },
  {
    name: "Acacia Fields",
    bgGradient: ["#d9f99d", "#bef264"],
    skyGradient: ["#ecfccb", "#d9f99d"],
    terrain: "savanna",
    accentColor: "#4d7c0f",
    vegetationColors: ["#4d7c0f", "#65a30d", "#84cc16"],
  },
  {
    name: "Sunset Plains",
    bgGradient: ["#bef264", "#a3e635"],
    skyGradient: ["#d9f99d", "#bef264"],
    terrain: "savanna",
    accentColor: "#3f6212",
    vegetationColors: ["#3f6212", "#4d7c0f", "#65a30d"],
  },
  // Juz 10-13: Forest
  {
    name: "Pine Woods",
    bgGradient: ["#bbf7d0", "#86efac"],
    skyGradient: ["#dcfce7", "#bbf7d0"],
    terrain: "forest",
    accentColor: "#16a34a",
    vegetationColors: ["#166534", "#15803d", "#22c55e"],
  },
  {
    name: "Deep Forest",
    bgGradient: ["#86efac", "#4ade80"],
    skyGradient: ["#bbf7d0", "#86efac"],
    terrain: "forest",
    accentColor: "#15803d",
    vegetationColors: ["#14532d", "#166534", "#15803d"],
  },
  {
    name: "Oak Grove",
    bgGradient: ["#4ade80", "#22c55e"],
    skyGradient: ["#86efac", "#4ade80"],
    terrain: "forest",
    accentColor: "#166534",
    vegetationColors: ["#14532d", "#166534", "#22c55e"],
  },
  {
    name: "Ancient Woods",
    bgGradient: ["#22c55e", "#16a34a"],
    skyGradient: ["#4ade80", "#22c55e"],
    terrain: "forest",
    accentColor: "#14532d",
    vegetationColors: ["#052e16", "#14532d", "#166534"],
  },
  // Juz 14-17: Mountain
  {
    name: "Foothills",
    bgGradient: ["#e0e7ff", "#c7d2fe"],
    skyGradient: ["#eef2ff", "#e0e7ff"],
    terrain: "mountain",
    accentColor: "#6366f1",
    vegetationColors: ["#6366f1", "#818cf8", "#a5b4fc"],
  },
  {
    name: "Rocky Peaks",
    bgGradient: ["#c7d2fe", "#a5b4fc"],
    skyGradient: ["#e0e7ff", "#c7d2fe"],
    terrain: "mountain",
    accentColor: "#4f46e5",
    vegetationColors: ["#4f46e5", "#6366f1", "#818cf8"],
  },
  {
    name: "Snow Caps",
    bgGradient: ["#a5b4fc", "#818cf8"],
    skyGradient: ["#c7d2fe", "#a5b4fc"],
    terrain: "mountain",
    accentColor: "#4338ca",
    vegetationColors: ["#4338ca", "#4f46e5", "#c7d2fe"],
  },
  {
    name: "Summit View",
    bgGradient: ["#818cf8", "#6366f1"],
    skyGradient: ["#a5b4fc", "#818cf8"],
    terrain: "mountain",
    accentColor: "#3730a3",
    vegetationColors: ["#3730a3", "#4338ca", "#818cf8"],
  },
  // Juz 18-20: Highland
  {
    name: "Green Hills",
    bgGradient: ["#d1fae5", "#99f6e4"],
    skyGradient: ["#ecfdf5", "#d1fae5"],
    terrain: "highland",
    accentColor: "#0d9488",
    vegetationColors: ["#0d9488", "#14b8a6", "#2dd4bf"],
  },
  {
    name: "Misty Meadow",
    bgGradient: ["#99f6e4", "#5eead4"],
    skyGradient: ["#d1fae5", "#99f6e4"],
    terrain: "highland",
    accentColor: "#0f766e",
    vegetationColors: ["#0f766e", "#0d9488", "#14b8a6"],
  },
  {
    name: "Rolling Hills",
    bgGradient: ["#5eead4", "#2dd4bf"],
    skyGradient: ["#99f6e4", "#5eead4"],
    terrain: "highland",
    accentColor: "#115e59",
    vegetationColors: ["#115e59", "#0f766e", "#0d9488"],
  },
  // Juz 21-23: Valley
  {
    name: "Wildflowers",
    bgGradient: ["#fce7f3", "#fbcfe8"],
    skyGradient: ["#fdf2f8", "#fce7f3"],
    terrain: "valley",
    accentColor: "#db2777",
    vegetationColors: ["#db2777", "#ec4899", "#f472b6"],
  },
  {
    name: "Stream Valley",
    bgGradient: ["#fbcfe8", "#f9a8d4"],
    skyGradient: ["#fce7f3", "#fbcfe8"],
    terrain: "valley",
    accentColor: "#be185d",
    vegetationColors: ["#be185d", "#db2777", "#ec4899"],
  },
  {
    name: "Blossom Dale",
    bgGradient: ["#f9a8d4", "#f472b6"],
    skyGradient: ["#fbcfe8", "#f9a8d4"],
    terrain: "valley",
    accentColor: "#9d174d",
    vegetationColors: ["#9d174d", "#be185d", "#db2777"],
  },
  // Juz 24-26: Garden
  {
    name: "Flower Beds",
    bgGradient: ["#fef9c3", "#fef08a"],
    skyGradient: ["#fefce8", "#fef9c3"],
    terrain: "garden",
    accentColor: "#ca8a04",
    vegetationColors: ["#ca8a04", "#eab308", "#facc15"],
  },
  {
    name: "Rose Garden",
    bgGradient: ["#fef08a", "#fde047"],
    skyGradient: ["#fef9c3", "#fef08a"],
    terrain: "garden",
    accentColor: "#a16207",
    vegetationColors: ["#a16207", "#ca8a04", "#eab308"],
  },
  {
    name: "Hedge Maze",
    bgGradient: ["#fde047", "#facc15"],
    skyGradient: ["#fef08a", "#fde047"],
    terrain: "garden",
    accentColor: "#854d0e",
    vegetationColors: ["#854d0e", "#a16207", "#ca8a04"],
  },
  // Juz 27-28: Riverside
  {
    name: "River Banks",
    bgGradient: ["#bae6fd", "#7dd3fc"],
    skyGradient: ["#e0f2fe", "#bae6fd"],
    terrain: "riverside",
    accentColor: "#0284c7",
    vegetationColors: ["#0284c7", "#0ea5e9", "#38bdf8"],
  },
  {
    name: "Crystal Bridges",
    bgGradient: ["#7dd3fc", "#38bdf8"],
    skyGradient: ["#bae6fd", "#7dd3fc"],
    terrain: "riverside",
    accentColor: "#0369a1",
    vegetationColors: ["#0369a1", "#0284c7", "#0ea5e9"],
  },
  // Juz 29-30: Golden/Ethereal
  {
    name: "Golden Light",
    bgGradient: ["#fef3c7", "#fde68a"],
    skyGradient: ["#fffbeb", "#fef3c7"],
    terrain: "golden",
    accentColor: "#d97706",
    vegetationColors: ["#fbbf24", "#f59e0b", "#d97706"],
  },
  {
    name: "Crystal Paradise",
    bgGradient: ["#fde68a", "#fbbf24"],
    skyGradient: ["#fef3c7", "#fde68a"],
    terrain: "golden",
    accentColor: "#b45309",
    vegetationColors: ["#fbbf24", "#f59e0b", "#FFF8E7"],
  },
];

export function getBiomeTheme(juzNumber: number): BiomeTheme {
  return BIOME_THEMES[juzNumber - 1] ?? BIOME_THEMES[0];
}

export const BIOME_DARK_OVERRIDES: Record<
  string,
  { bg: [string, string]; sky: [string, string] }
> = {
  desert: { bg: ["#451a03", "#78350f"], sky: ["#1c1917", "#451a03"] },
  oasis: { bg: ["#022c22", "#064e3b"], sky: ["#0a0a0a", "#022c22"] },
  savanna: { bg: ["#1a2e05", "#365314"], sky: ["#0a0a0a", "#1a2e05"] },
  forest: { bg: ["#052e16", "#14532d"], sky: ["#0a0a0a", "#052e16"] },
  mountain: { bg: ["#1e1b4b", "#312e81"], sky: ["#0a0a0a", "#1e1b4b"] },
  highland: { bg: ["#042f2e", "#134e4a"], sky: ["#0a0a0a", "#042f2e"] },
  valley: { bg: ["#500724", "#831843"], sky: ["#0a0a0a", "#500724"] },
  garden: { bg: ["#422006", "#713f12"], sky: ["#0a0a0a", "#422006"] },
  riverside: { bg: ["#0c4a6e", "#075985"], sky: ["#0a0a0a", "#0c4a6e"] },
  golden: { bg: ["#451a03", "#78350f"], sky: ["#0a0a0a", "#451a03"] },
};

// ============================================================
// River geometry
// ============================================================

/** Get river center X at a given node index (0-based) */
export function getRiverCenterXAtIndex(index: number): number {
  return RIVER_CENTER_X + Math.sin(index * 0.15 * Math.PI) * RIVER_AMPLITUDE;
}

/** Get river center X at an arbitrary Y position (interpolated) */
export function getRiverCenterXAtY(y: number): number {
  const reverseIndex = (y - RIVER_PADDING_TOP) / NODE_SPACING_Y;
  const index = TOTAL_NODES - 1 - reverseIndex;
  return RIVER_CENTER_X + Math.sin(index * 0.15 * Math.PI) * RIVER_AMPLITUDE;
}

/** Get river half-width, widening at node positions */
function getRiverHalfWidth(y: number, nodeYs: number[]): number {
  let hw = RIVER_BASE_HALF_WIDTH;
  for (const ny of nodeYs) {
    const dist = Math.abs(y - ny);
    if (dist < 60) {
      const factor = 1 - dist / 60;
      hw += RIVER_NODE_POOL_EXTRA * factor * factor;
    }
  }
  return hw;
}

/**
 * Compute the river bank edge path for one side.
 * Returns an array of points that trace the bank edge.
 */
export function computeBankPoints(
  side: "left" | "right",
  nodeYs: number[],
  step = 25
): Point[] {
  const yMin = RIVER_PADDING_TOP - 100;
  const yMax = SVG_HEIGHT - RIVER_PADDING_BOTTOM + 60;
  const points: Point[] = [];
  const sign = side === "left" ? -1 : 1;

  for (let y = yMin; y <= yMax; y += step) {
    const cx = getRiverCenterXAtY(y);
    const hw = getRiverHalfWidth(y, nodeYs);
    const seed = Math.floor(y / 30) * (side === "left" ? 7 : 13) + 1;
    const jitter = (seededRandom(seed) - 0.5) * 8;
    points.push({ x: cx + sign * hw + jitter, y });
  }

  return points;
}

/**
 * Compute the filled river polygon path (left bank top→bottom, right bank bottom→top).
 */
export function computeRiverFillPath(nodePositions: NodePosition[]): string {
  const nodeYs = nodePositions.map((p) => p.y);
  const left = computeBankPoints("left", nodeYs, 20);
  const right = computeBankPoints("right", nodeYs, 20);

  if (left.length === 0 || right.length === 0) return "";

  const parts: string[] = [`M ${left[0].x.toFixed(1)} ${left[0].y.toFixed(1)}`];

  // Left bank top→bottom
  for (let i = 1; i < left.length; i++) {
    parts.push(`L ${left[i].x.toFixed(1)} ${left[i].y.toFixed(1)}`);
  }

  // Cross to right bank at bottom
  const lastRight = right[right.length - 1];
  parts.push(`L ${lastRight.x.toFixed(1)} ${lastRight.y.toFixed(1)}`);

  // Right bank bottom→top
  for (let i = right.length - 2; i >= 0; i--) {
    parts.push(`L ${right[i].x.toFixed(1)} ${right[i].y.toFixed(1)}`);
  }

  parts.push("Z");
  return parts.join(" ");
}

/** Compute a smooth center-line path for shimmer/ripple effects */
export function computeRiverCenterPath(step = 30): string {
  const yMin = RIVER_PADDING_TOP - 100;
  const yMax = SVG_HEIGHT - RIVER_PADDING_BOTTOM + 60;
  const points: Point[] = [];

  for (let y = yMin; y <= yMax; y += step) {
    points.push({ x: getRiverCenterXAtY(y), y });
  }

  return catmullRomToPath(points);
}

/**
 * Compute left/right bank stroke paths for earthy bank edges.
 */
export function computeBankStrokePath(
  side: "left" | "right",
  nodeYs: number[]
): string {
  const points = computeBankPoints(side, nodeYs, 20);
  return catmullRomToPath(points);
}

// ============================================================
// Node positioning — alternating river banks
// ============================================================

export function computeNodePositions(): NodePosition[] {
  const positions: NodePosition[] = [];

  for (let i = 0; i < TOTAL_NODES; i++) {
    const surahNumber = i + 1;
    const reverseIndex = TOTAL_NODES - 1 - i;
    const y = RIVER_PADDING_TOP + reverseIndex * NODE_SPACING_Y;
    const riverCX = getRiverCenterXAtIndex(i);
    const bankSide: "left" | "right" = i % 2 === 0 ? "left" : "right";
    const x =
      bankSide === "left"
        ? riverCX - NODE_OFFSET_FROM_RIVER
        : riverCX + NODE_OFFSET_FROM_RIVER;

    positions.push({ x, y, surahNumber, bankSide, riverCenterX: riverCX });
  }

  return positions;
}

// ============================================================
// Juz Y ranges
// ============================================================

export function getJuzYRange(
  juzNumber: number,
  positions: NodePosition[]
): { yTop: number; yBottom: number } {
  const [startSurah, endSurah] = JUZ_SURAH_RANGES[juzNumber - 1] ?? [1, 2];
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
// Catmull-Rom to Cubic Bezier conversion
// ============================================================

export function catmullRomToPath(points: Point[]): string {
  if (points.length < 2) return "";

  const d: string[] = [`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(
      `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    );
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
// Progress helpers
// ============================================================

export function findCurrentProgressIndex(trees: SurahTree[]): number {
  for (let i = 0; i < trees.length; i++) {
    if (trees[i].trunkMastery < 90) return i;
  }
  return trees.length - 1;
}

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
