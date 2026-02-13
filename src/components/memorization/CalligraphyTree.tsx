"use client";

import { memo, useMemo } from "react";

import type { FlowerStage, Season } from "@/lib/gamification/surah-trees";

// ---------- types ----------

interface CalligraphyTreeProps {
  surahNumber: number;
  totalAyahs: number;
  masteryPercent: number; // 0-100
  sessionAccuracy: number; // 0-100
  bloomingAyahs?: number[]; // ayahs just completed — trigger bloom
  season: Season;
  flowerStage: FlowerStage;
  compact?: boolean;
}

// ---------- seeded PRNG ----------

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- season / stage palette ----------

const SEASON_PALETTE: Record<
  Season,
  {
    leaf: string;
    leafDark: string;
    trunk: string;
    flower: string;
    soil: string;
  }
> = {
  spring: {
    leaf: "#059669",
    leafDark: "#00E5A0",
    trunk: "#8B6914",
    flower: "#FFD700",
    soil: "#7C6C4F",
  },
  summer: {
    leaf: "#047857",
    leafDark: "#34d399",
    trunk: "#8B6914",
    flower: "#FFD700",
    soil: "#7C6C4F",
  },
  autumn: {
    leaf: "#B8860B",
    leafDark: "#FFD700",
    trunk: "#6B4E1B",
    flower: "#FF8C00",
    soil: "#6B5B3C",
  },
  winter: {
    leaf: "#6b7280",
    leafDark: "#9ca3af",
    trunk: "#4B3A1A",
    flower: "#9ca3af",
    soil: "#5C5549",
  },
};

const STAGE_OPACITY: Record<FlowerStage, number> = {
  seed: 0.25,
  sprout: 0.45,
  bud: 0.7,
  bloom: 1.0,
  wilted: 0.5,
};

// ---------- Arabic letter branch curves ----------

type LetterCurve = {
  dx: number;
  dy: number;
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
};

const ARABIC_CURVES: LetterCurve[] = [
  // Ba (ب) — gentle upward sweep
  { dx: 30, dy: -40, cx1: 0, cy1: -30, cx2: 20, cy2: -50 },
  // Nun (ن) — bowl curve
  { dx: 35, dy: 0, cx1: 15, cy1: -20, cx2: 30, cy2: -20 },
  // Lam (ل) — tall ascender with hook
  { dx: 10, dy: -65, cx1: 0, cy1: -60, cx2: 5, cy2: -70 },
  // Seen (س) — wave (simplified)
  { dx: 25, dy: -15, cx1: 8, cy1: -18, cx2: 18, cy2: -5 },
  // Ya (ي) — downward tail
  { dx: 15, dy: 25, cx1: 10, cy1: 5, cx2: 20, cy2: 15 },
  // Kaaf (ك) — shoulder
  { dx: 25, dy: -20, cx1: 0, cy1: -20, cx2: 15, cy2: -30 },
];

// ---------- branch generation ----------

interface Branch {
  id: string;
  path: string; // SVG path d attribute
  tipX: number;
  tipY: number;
  depth: number;
  length: number;
}

interface Leaf {
  cx: number;
  cy: number;
  r: number;
  delay: number; // animation delay
}

interface Flower {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  isNew: boolean; // blooming animation
}

function generateTree(
  surahNumber: number,
  totalAyahs: number,
  masteryPercent: number,
  accuracy: number,
  bloomingAyahs: number[]
) {
  const rand = mulberry32(surahNumber * 7919);

  // Tree complexity scales with surah size
  const maxDepth =
    totalAyahs <= 10 ? 2 : totalAyahs <= 50 ? 3 : totalAyahs <= 120 ? 4 : 5;
  const branchCount = Math.min(totalAyahs, 25); // cap visible branches

  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  const flowers: Flower[] = [];

  // Start point (trunk base)
  const startX = 150;
  const startY = 280;
  const trunkHeight = 60 + masteryPercent * 0.4; // taller trunk with mastery

  // Trunk path
  branches.push({
    id: "trunk",
    path: `M ${startX} ${startY} C ${startX - 2} ${startY - trunkHeight * 0.4} ${startX + 2} ${startY - trunkHeight * 0.7} ${startX} ${startY - trunkHeight}`,
    tipX: startX,
    tipY: startY - trunkHeight,
    depth: 0,
    length: trunkHeight,
  });

  // Recursive branch builder
  function addBranch(
    fromX: number,
    fromY: number,
    angle: number,
    depth: number,
    scale: number,
    parentId: string
  ) {
    if (depth > maxDepth || branches.length >= branchCount + 1) return;

    // Pick a letter curve using seeded random
    const curveIdx = Math.floor(rand() * ARABIC_CURVES.length);
    const curve = ARABIC_CURVES[curveIdx];

    // Apply angle rotation and scale
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const s = scale;

    const dx = (curve.dx * cos - curve.dy * sin) * s;
    const dy = (curve.dx * sin + curve.dy * cos) * s;
    const cx1 = (curve.cx1 * cos - curve.cy1 * sin) * s;
    const cy1 = (curve.cx1 * sin + curve.cy1 * cos) * s;
    const cx2 = (curve.cx2 * cos - curve.cy2 * sin) * s;
    const cy2 = (curve.cx2 * sin + curve.cy2 * cos) * s;

    const tipX = fromX + dx;
    const tipY = fromY + dy;
    const id = `${parentId}-${depth}-${branches.length}`;

    branches.push({
      id,
      path: `M ${fromX} ${fromY} C ${fromX + cx1} ${fromY + cy1} ${fromX + cx2} ${fromY + cy2} ${tipX} ${tipY}`,
      tipX,
      tipY,
      depth,
      length: Math.sqrt(dx * dx + dy * dy),
    });

    // Add leaves at branch tips (density based on accuracy)
    const leafCount = Math.round(1 + (accuracy / 100) * 3 + rand() * 2);
    for (let l = 0; l < leafCount; l++) {
      const offsetX = (rand() - 0.5) * 12;
      const offsetY = (rand() - 0.5) * 10;
      leaves.push({
        cx: tipX + offsetX,
        cy: tipY + offsetY,
        r: 2.5 + rand() * 2,
        delay: rand() * 3,
      });
    }

    // Flowers at terminal branches when mastery is high
    if (depth >= maxDepth - 1 && masteryPercent >= 40) {
      const flowerChance = masteryPercent / 100;
      if (rand() < flowerChance) {
        const isNewBloom = bloomingAyahs.length > 0 && rand() < 0.4;
        flowers.push({
          cx: tipX,
          cy: tipY - 3,
          r: 3 + rand() * 2,
          delay: rand() * 2,
          isNew: isNewBloom,
        });
      }
    }

    // Sub-branches
    const numChildren =
      depth < 2 ? 2 + Math.floor(rand() * 2) : 1 + Math.floor(rand() * 2);
    for (let c = 0; c < numChildren; c++) {
      const childAngle = angle + (rand() - 0.5) * 1.4 - 0.3; // bias upward
      const childScale = scale * (0.55 + rand() * 0.2);
      addBranch(tipX, tipY, childAngle, depth + 1, childScale, id);
    }
  }

  // Generate main branches from trunk tip
  const trunkTipX = startX;
  const trunkTipY = startY - trunkHeight;
  const mainBranches = 3 + Math.floor(rand() * 3);

  for (let i = 0; i < mainBranches; i++) {
    const spread = (i / (mainBranches - 1 || 1) - 0.5) * 2; // -1 to 1
    const angle = -Math.PI / 2 + spread * 0.8 + (rand() - 0.5) * 0.3;
    const scale = 0.7 + rand() * 0.3;
    addBranch(trunkTipX, trunkTipY, angle, 1, scale, "trunk");
  }

  return { branches, leaves, flowers, trunkHeight };
}

// ---------- seed / sprout special renders ----------

function SeedView({
  palette,
  compact,
}: {
  palette: typeof SEASON_PALETTE.spring;
  compact?: boolean;
}) {
  const size = compact ? 60 : 80;
  return (
    <svg viewBox="0 0 300 320" width={size} height={size} className="mx-auto">
      {/* Soil */}
      <ellipse
        cx={150}
        cy={290}
        rx={40}
        ry={8}
        fill={palette.soil}
        opacity={0.5}
      />
      {/* Seed */}
      <ellipse
        cx={150}
        cy={280}
        rx={8}
        ry={5}
        fill="#8B6914"
        className="animate-pulse"
      >
        <animate
          attributeName="ry"
          values="5;6;5"
          dur="2s"
          repeatCount="indefinite"
        />
      </ellipse>
    </svg>
  );
}

function SproutView({
  palette,
  compact,
}: {
  palette: typeof SEASON_PALETTE.spring;
  compact?: boolean;
}) {
  const size = compact ? 80 : 110;
  return (
    <svg viewBox="0 0 300 320" width={size} height={size} className="mx-auto">
      {/* Soil */}
      <ellipse
        cx={150}
        cy={290}
        rx={40}
        ry={8}
        fill={palette.soil}
        opacity={0.5}
      />
      {/* Stem */}
      <path
        d="M 150 290 C 150 270 148 260 150 245"
        stroke={palette.trunk}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      {/* Two small leaves */}
      <ellipse
        cx={143}
        cy={255}
        rx={8}
        ry={4}
        fill={palette.leaf}
        opacity={0.7}
        transform="rotate(-30 143 255)"
      />
      <ellipse
        cx={157}
        cy={250}
        rx={8}
        ry={4}
        fill={palette.leaf}
        opacity={0.8}
        transform="rotate(25 157 250)"
      />
      {/* Tiny bud */}
      <circle cx={150} cy={243} r={3} fill={palette.leaf} opacity={0.6}>
        <animate
          attributeName="r"
          values="3;3.5;3"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

// ---------- main component ----------

export const CalligraphyTree = memo(function CalligraphyTree({
  surahNumber,
  totalAyahs,
  masteryPercent,
  sessionAccuracy,
  bloomingAyahs = [],
  season,
  flowerStage,
  compact = false,
}: CalligraphyTreeProps) {
  const palette = SEASON_PALETTE[season];
  const opacity = STAGE_OPACITY[flowerStage];

  // Always call useMemo (hooks must be unconditional)
  const tree = useMemo(
    () =>
      generateTree(
        surahNumber,
        totalAyahs,
        masteryPercent,
        sessionAccuracy,
        bloomingAyahs
      ),
    // bloomingAyahs array identity changes — use length as proxy
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      surahNumber,
      totalAyahs,
      masteryPercent,
      sessionAccuracy,
      bloomingAyahs.length,
    ]
  );

  // Render seed/sprout stages (simple SVG, don't use tree data)
  if (flowerStage === "seed") {
    return <SeedView palette={palette} compact={compact} />;
  }
  if (flowerStage === "sprout") {
    return <SproutView palette={palette} compact={compact} />;
  }

  const svgSize = compact ? 140 : 220;
  const leafColor = palette.leaf;
  const leafOpacity = 0.3 + (sessionAccuracy / 100) * 0.7; // accuracy drives vibrancy

  // Sparkle particles for high accuracy
  const showSparkle = sessionAccuracy >= 90 && flowerStage === "bloom";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 300 320"
        width={svgSize}
        height={svgSize}
        className="drop-shadow-sm"
        style={{ opacity }}
      >
        <defs>
          {/* Glow filter for blooming flowers */}
          <filter
            id={`glow-${surahNumber}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Leaf gradient */}
          <radialGradient id={`leaf-grad-${surahNumber}`}>
            <stop offset="0%" stopColor={leafColor} stopOpacity={leafOpacity} />
            <stop
              offset="100%"
              stopColor={leafColor}
              stopOpacity={leafOpacity * 0.5}
            />
          </radialGradient>
        </defs>

        {/* Soil mound */}
        <ellipse
          cx={150}
          cy={290}
          rx={60}
          ry={12}
          fill={palette.soil}
          opacity={0.35}
        />

        {/* Roots (visible when mastery > 30%) */}
        {masteryPercent > 30 && (
          <g opacity={Math.min(1, masteryPercent / 80)}>
            <path
              d={`M 150 280 C 140 290 125 295 110 292`}
              stroke={palette.trunk}
              strokeWidth={1.5}
              fill="none"
              opacity={0.4}
            />
            <path
              d={`M 150 280 C 160 292 175 296 190 293`}
              stroke={palette.trunk}
              strokeWidth={1.5}
              fill="none"
              opacity={0.4}
            />
          </g>
        )}

        {/* Branches — drawn with stroke-dashoffset animation */}
        {tree.branches.map((branch, i) => (
          <path
            key={branch.id}
            d={branch.path}
            stroke={palette.trunk}
            strokeWidth={
              branch.depth === 0 ? 4 : Math.max(1, 3 - branch.depth * 0.6)
            }
            fill="none"
            strokeLinecap="round"
            className="calligraphy-branch"
            style={{
              strokeDasharray: branch.length + 20,
              strokeDashoffset: 0,
              animation: `grow-branch 1.2s ease-out ${i * 0.05}s both`,
            }}
          />
        ))}

        {/* Leaves — clustered ellipses at branch tips */}
        {tree.leaves.map((leaf, i) => (
          <circle
            key={`leaf-${i}`}
            cx={leaf.cx}
            cy={leaf.cy}
            r={leaf.r}
            fill={`url(#leaf-grad-${surahNumber})`}
            className="calligraphy-leaf"
            style={{
              animation: `sway 3s ease-in-out ${leaf.delay}s infinite alternate`,
              transformOrigin: `${leaf.cx}px ${leaf.cy}px`,
            }}
          />
        ))}

        {/* Flowers at branch tips */}
        {tree.flowers.map((flower, i) => (
          <g key={`flower-${i}`}>
            {/* Petals (5 around center) */}
            {[0, 1, 2, 3, 4].map((p) => {
              const angle = (p / 5) * Math.PI * 2;
              const px = flower.cx + Math.cos(angle) * flower.r * 0.8;
              const py = flower.cy + Math.sin(angle) * flower.r * 0.8;
              return (
                <circle
                  key={p}
                  cx={px}
                  cy={py}
                  r={flower.r * 0.5}
                  fill={palette.flower}
                  opacity={0.7}
                  className={flower.isNew ? "bloom-flower" : ""}
                  style={
                    flower.isNew
                      ? {
                          animation: `bloom-flower 0.8s ease-out ${flower.delay}s both`,
                        }
                      : undefined
                  }
                />
              );
            })}
            {/* Center */}
            <circle
              cx={flower.cx}
              cy={flower.cy}
              r={flower.r * 0.35}
              fill={palette.flower}
              filter={flower.isNew ? `url(#glow-${surahNumber})` : undefined}
            />
          </g>
        ))}

        {/* Sparkle particles for perfect accuracy */}
        {showSparkle && (
          <g>
            {[0, 1, 2, 3, 4].map((s) => {
              // Deterministic sparkle positions based on surah
              const sx = 80 + ((surahNumber * 37 + s * 53) % 140);
              const sy = 100 + ((surahNumber * 23 + s * 41) % 120);
              return (
                <circle
                  key={`sparkle-${s}`}
                  cx={sx}
                  cy={sy}
                  r={1.5}
                  fill="#FFD700"
                  className="sparkle"
                  style={{
                    animation: `sparkle 2s ease-in-out ${s * 0.4}s infinite`,
                  }}
                />
              );
            })}
          </g>
        )}

        {/* Wilted overlay — desaturated veil */}
        {flowerStage === "wilted" && (
          <rect
            x={0}
            y={0}
            width={300}
            height={320}
            fill="currentColor"
            className="text-[#B8860B]/5 dark:text-[#FFD700]/5"
            opacity={0.3}
          />
        )}
      </svg>

      {/* CSS keyframe styles (scoped via style tag) */}
      <style>{`
        @keyframes grow-branch {
          from { stroke-dashoffset: var(--branch-len, 100); opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes bloom-flower {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes sway {
          from { transform: translateX(-0.5px) translateY(0); }
          to { transform: translateX(0.5px) translateY(-0.5px); }
        }
        .calligraphy-branch {
          stroke-dashoffset: 0;
        }
      `}</style>
    </div>
  );
});
