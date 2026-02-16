"use client";

import { useMemo } from "react";

import {
  BankGrass,
  Cactus,
  Crystal,
  DuneMound,
  FlowerCluster,
  GrassTuft,
  Hedge,
  MountainPeak,
  PalmTree,
  PineTree,
  Reeds,
  RockFormation,
  RollingHill,
  WildflowerPatch,
} from "./BiomeVegetation";
import {
  BIOME_DARK_OVERRIDES,
  getBiomeTheme,
  getRiverCenterXAtY,
  JUZ_SURAH_RANGES,
  NODE_SPACING_Y,
  RIVER_SVG_WIDTH,
  seededRandom,
  type NodePosition,
} from "./river-utils";

// ============================================================
// Terrain decorations (procedural per-biome)
// ============================================================

function getDecorationComponent(terrain: string, seed: number) {
  switch (terrain) {
    case "desert":
      return seed > 0.5 ? <Cactus /> : <DuneMound />;
    case "oasis":
      return seed > 0.5 ? <PalmTree /> : <Reeds />;
    case "savanna":
      return seed > 0.5 ? (
        <GrassTuft />
      ) : (
        <GrassTuft colors={["#65a30d", "#84cc16", "#4d7c0f"]} />
      );
    case "forest":
      return seed > 0.5 ? <PineTree /> : <PineTree canopyColor="#15803d" />;
    case "mountain":
      return seed > 0.5 ? <MountainPeak /> : <RockFormation />;
    case "highland":
      return <RollingHill />;
    case "valley":
      return seed > 0.5 ? <FlowerCluster /> : <WildflowerPatch />;
    case "garden":
      return seed > 0.5 ? (
        <Hedge />
      ) : (
        <FlowerCluster colors={["#fbbf24", "#f472b6", "#22c55e"]} />
      );
    case "riverside":
      return <Reeds />;
    case "golden":
      return <Crystal />;
    default:
      return <GrassTuft />;
  }
}

function TerrainDecorations({
  terrain,
  yTop,
  yBottom,
  juzNumber,
}: {
  terrain: string;
  yTop: number;
  yBottom: number;
  juzNumber: number;
}) {
  const decorations = useMemo(() => {
    const items: Array<{
      x: number;
      y: number;
      seed: number;
      scale: number;
      flip: boolean;
    }> = [];
    const zoneHeight = yBottom - yTop;
    const count = Math.min(Math.floor(zoneHeight / 80), 7);

    for (let i = 0; i < count; i++) {
      const seed = juzNumber * 100 + i;
      const side = seededRandom(seed) > 0.5 ? "left" : "right";
      const riverCX = getRiverCenterXAtY(
        yTop + (i + 0.5) * (zoneHeight / count)
      );

      // Place decorations away from the river, in the landscape margins
      const margin = side === "left" ? 40 : RIVER_SVG_WIDTH - 40;
      const toward = side === "left" ? riverCX - 200 : riverCX + 200;
      const x = margin + (toward - margin) * seededRandom(seed + 1);

      items.push({
        x: Math.max(20, Math.min(RIVER_SVG_WIDTH - 20, x)),
        y: yTop + (i + 0.5) * (zoneHeight / count),
        seed: seededRandom(seed + 5),
        scale: 0.7 + seededRandom(seed + 3) * 0.5,
        flip: seededRandom(seed + 4) > 0.5,
      });
    }
    return items;
  }, [yTop, yBottom, juzNumber]);

  return (
    <g opacity={0.35}>
      {decorations.map((d, i) => (
        <g
          key={i}
          transform={`translate(${d.x}, ${d.y}) scale(${d.flip ? -d.scale : d.scale}, ${d.scale})`}
        >
          {getDecorationComponent(terrain, d.seed)}
        </g>
      ))}
    </g>
  );
}

// ============================================================
// Bank-edge vegetation (along river banks)
// ============================================================

function BankVegetation({
  yTop,
  yBottom,
  juzNumber,
}: {
  yTop: number;
  yBottom: number;
  juzNumber: number;
}) {
  const items = useMemo(() => {
    const result: Array<{ x: number; y: number; side: "left" | "right" }> = [];
    const step = 50;
    for (let y = yTop; y <= yBottom; y += step) {
      const seed = juzNumber * 1000 + Math.floor(y);
      if (seededRandom(seed) > 0.6) continue; // sparse placement
      const cx = getRiverCenterXAtY(y);
      const side: "left" | "right" =
        seededRandom(seed + 1) > 0.5 ? "left" : "right";
      const offset = 45 + seededRandom(seed + 2) * 15;
      const x = side === "left" ? cx - offset : cx + offset;
      result.push({ x, y, side });
    }
    return result;
  }, [yTop, yBottom, juzNumber]);

  return (
    <g>
      {items.map((item, i) => (
        <g key={i} transform={`translate(${item.x}, ${item.y})`}>
          <BankGrass side={item.side} />
        </g>
      ))}
    </g>
  );
}

// ============================================================
// Distant hill silhouettes
// ============================================================

function HillSilhouettes({
  yTop,
  terrain,
  juzNumber,
  isDark,
}: {
  yTop: number;
  terrain: string;
  juzNumber: number;
  isDark?: boolean;
}) {
  const hills = useMemo(() => {
    if (terrain === "desert" || terrain === "golden") return [];
    const result: Array<{ cx: number; cy: number; rx: number; ry: number }> =
      [];
    const count = 3 + Math.floor(seededRandom(juzNumber * 31) * 3);
    for (let i = 0; i < count; i++) {
      const seed = juzNumber * 200 + i;
      result.push({
        cx: seededRandom(seed) * RIVER_SVG_WIDTH,
        cy: yTop + seededRandom(seed + 1) * 60,
        rx: 80 + seededRandom(seed + 2) * 120,
        ry: 20 + seededRandom(seed + 3) * 30,
      });
    }
    return result;
  }, [terrain, yTop, juzNumber]);

  if (hills.length === 0) return null;

  return (
    <g opacity={isDark ? 0.15 : 0.1}>
      {hills.map((h, i) => (
        <ellipse
          key={i}
          cx={h.cx}
          cy={h.cy}
          rx={h.rx}
          ry={h.ry}
          fill="currentColor"
          className="text-foreground"
        />
      ))}
    </g>
  );
}

// ============================================================
// Biome transition fog band
// ============================================================

function FogBand({ y, isDark }: { y: number; isDark?: boolean }) {
  const fogId = `fog-${Math.round(y)}`;
  return (
    <g>
      <defs>
        <linearGradient id={fogId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={isDark ? "#0a0a0a" : "#ffffff"}
            stopOpacity={0}
          />
          <stop
            offset="40%"
            stopColor={isDark ? "#0a0a0a" : "#ffffff"}
            stopOpacity={isDark ? 0.25 : 0.35}
          />
          <stop
            offset="60%"
            stopColor={isDark ? "#0a0a0a" : "#ffffff"}
            stopOpacity={isDark ? 0.25 : 0.35}
          />
          <stop
            offset="100%"
            stopColor={isDark ? "#0a0a0a" : "#ffffff"}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={y - 30}
        width={RIVER_SVG_WIDTH}
        height={60}
        fill={`url(#${fogId})`}
      />
    </g>
  );
}

// ============================================================
// Main landscape component
// ============================================================

interface RiverLandscapeProps {
  positions: NodePosition[];
  isDark?: boolean;
}

export function RiverLandscape({ positions, isDark }: RiverLandscapeProps) {
  const biomeZones = useMemo(() => {
    const zones: Array<{
      juzNumber: number;
      yTop: number;
      yBottom: number;
      theme: ReturnType<typeof getBiomeTheme>;
    }> = [];

    for (let j = 1; j <= 30; j++) {
      const [startSurah, endSurah] = JUZ_SURAH_RANGES[j - 1];
      const juzPositions = positions.filter(
        (p) => p.surahNumber >= startSurah && p.surahNumber <= endSurah
      );
      if (juzPositions.length === 0) continue;

      const ys = juzPositions.map((p) => p.y);
      zones.push({
        juzNumber: j,
        yTop: Math.min(...ys) - NODE_SPACING_Y / 2,
        yBottom: Math.max(...ys) + NODE_SPACING_Y / 2,
        theme: getBiomeTheme(j),
      });
    }
    return zones;
  }, [positions]);

  return (
    <g>
      {biomeZones.map((zone, zoneIdx) => {
        const height = zone.yBottom - zone.yTop;
        const bgGradId = `river-biome-bg-${zone.juzNumber}`;
        const skyGradId = `river-biome-sky-${zone.juzNumber}`;

        const darkOverride = BIOME_DARK_OVERRIDES[zone.theme.terrain];
        const [bgTop, bgBottom] =
          isDark && darkOverride ? darkOverride.bg : zone.theme.bgGradient;
        const [skyTop, skyBottom] =
          isDark && darkOverride ? darkOverride.sky : zone.theme.skyGradient;

        return (
          <g key={zone.juzNumber}>
            <defs>
              <linearGradient id={bgGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={bgTop} />
                <stop offset="100%" stopColor={bgBottom} />
              </linearGradient>
              <linearGradient id={skyGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={skyTop} />
                <stop offset="100%" stopColor={skyBottom} />
              </linearGradient>
            </defs>

            {/* Sky layer (soft gradient at top portion of zone) */}
            <rect
              x={0}
              y={zone.yTop}
              width={RIVER_SVG_WIDTH}
              height={Math.min(height * 0.4, 80)}
              fill={`url(#${skyGradId})`}
              opacity={isDark ? 0.2 : 0.15}
            />

            {/* Ground layer (full zone) */}
            <rect
              x={0}
              y={zone.yTop}
              width={RIVER_SVG_WIDTH}
              height={height}
              fill={`url(#${bgGradId})`}
              opacity={isDark ? 0.35 : 0.2}
            />

            {/* Distant hill silhouettes */}
            <HillSilhouettes
              yTop={zone.yTop}
              terrain={zone.theme.terrain}
              juzNumber={zone.juzNumber}
              isDark={isDark}
            />

            {/* Terrain decorations (landscape margins) */}
            <TerrainDecorations
              terrain={zone.theme.terrain}
              yTop={zone.yTop}
              yBottom={zone.yBottom}
              juzNumber={zone.juzNumber}
            />

            {/* Bank-edge vegetation (along river) */}
            <BankVegetation
              yTop={zone.yTop}
              yBottom={zone.yBottom}
              juzNumber={zone.juzNumber}
            />

            {/* Biome label */}
            <text
              x={RIVER_SVG_WIDTH - 12}
              y={zone.yBottom - 10}
              textAnchor="end"
              fontSize={11}
              fill={isDark ? "#9ca3af" : "#6b7280"}
              opacity={0.4}
            >
              Juz {zone.juzNumber} — {zone.theme.name}
            </text>

            {/* Fog band at biome transition (except first zone) */}
            {zoneIdx > 0 && <FogBand y={zone.yTop} isDark={isDark} />}
          </g>
        );
      })}
    </g>
  );
}
