"use client";

import { useMemo } from "react";

import {
  BIOME_DARK_THEMES,
  getBiomeTheme,
  JUZ_SURAH_RANGES,
  NODE_SPACING_Y,
  ROAD_WIDTH,
  seededRandom,
  type NodePosition,
} from "./road-utils";

// ============================================================
// Terrain decorations (procedural per-biome)
// ============================================================

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
      type: string;
      scale: number;
      flip: boolean;
    }> = [];
    const zoneHeight = yBottom - yTop;
    const count = Math.min(Math.floor(zoneHeight / 100), 5);

    for (let i = 0; i < count; i++) {
      const seed = juzNumber * 100 + i;
      const side = seededRandom(seed) > 0.5 ? "left" : "right";
      items.push({
        x:
          side === "left"
            ? 20 + seededRandom(seed + 1) * 60
            : ROAD_WIDTH - 80 + seededRandom(seed + 2) * 60,
        y: yTop + (i + 0.5) * (zoneHeight / count),
        type: terrain,
        scale: 0.6 + seededRandom(seed + 3) * 0.5,
        flip: seededRandom(seed + 4) > 0.5,
      });
    }
    return items;
  }, [terrain, yTop, yBottom, juzNumber]);

  return (
    <g opacity={0.3}>
      {decorations.map((d, i) => (
        <g
          key={i}
          transform={`translate(${d.x}, ${d.y}) scale(${d.flip ? -d.scale : d.scale}, ${d.scale})`}
        >
          {d.type === "desert" && (
            <>
              {/* Cactus */}
              <rect
                x={-2}
                y={-16}
                width={4}
                height={16}
                rx={2}
                fill="#65a30d"
              />
              <rect x={-8} y={-12} width={4} height={8} rx={2} fill="#65a30d" />
              <rect x={4} y={-10} width={4} height={6} rx={2} fill="#65a30d" />
            </>
          )}
          {d.type === "oasis" && (
            <>
              {/* Palm tree */}
              <rect
                x={-1.5}
                y={-20}
                width={3}
                height={20}
                rx={1}
                fill="#92400e"
              />
              <ellipse
                cx={0}
                cy={-22}
                rx={10}
                ry={5}
                fill="#22c55e"
                opacity={0.7}
              />
            </>
          )}
          {d.type === "savanna" && (
            <>
              {/* Tall grass */}
              <line
                x1={0}
                y1={0}
                x2={-3}
                y2={-12}
                stroke="#84cc16"
                strokeWidth={1.5}
              />
              <line
                x1={3}
                y1={0}
                x2={6}
                y2={-10}
                stroke="#a3e635"
                strokeWidth={1.5}
              />
              <line
                x1={-3}
                y1={0}
                x2={-6}
                y2={-11}
                stroke="#65a30d"
                strokeWidth={1.5}
              />
            </>
          )}
          {d.type === "forest" && (
            <>
              {/* Pine tree */}
              <rect
                x={-1.5}
                y={-5}
                width={3}
                height={8}
                rx={1}
                fill="#713f12"
              />
              <polygon points="0,-20 -8,-5 8,-5" fill="#166534" />
              <polygon points="0,-15 -6,-3 6,-3" fill="#15803d" />
            </>
          )}
          {d.type === "mountain" && (
            <>
              {/* Mountain peak */}
              <polygon points="0,-18 -12,0 12,0" fill="#6366f1" opacity={0.5} />
              <polygon
                points="0,-18 -3,-10 3,-10"
                fill="#e0e7ff"
                opacity={0.6}
              />
            </>
          )}
          {d.type === "highland" && (
            <>
              {/* Rolling hills */}
              <ellipse
                cx={0}
                cy={0}
                rx={15}
                ry={6}
                fill="#0d9488"
                opacity={0.4}
              />
              <ellipse
                cx={8}
                cy={-2}
                rx={10}
                ry={4}
                fill="#14b8a6"
                opacity={0.3}
              />
            </>
          )}
          {d.type === "valley" && (
            <>
              {/* Wildflower */}
              <circle cx={0} cy={-4} r={3} fill="#ec4899" opacity={0.7} />
              <circle cx={6} cy={-2} r={2} fill="#f472b6" opacity={0.5} />
              <line
                x1={0}
                y1={-1}
                x2={0}
                y2={6}
                stroke="#22c55e"
                strokeWidth={1}
              />
            </>
          )}
          {d.type === "garden" && (
            <>
              {/* Hedge */}
              <rect
                x={-10}
                y={-5}
                width={20}
                height={8}
                rx={4}
                fill="#16a34a"
                opacity={0.5}
              />
            </>
          )}
          {d.type === "riverside" && (
            <>
              {/* Reeds */}
              <line
                x1={0}
                y1={0}
                x2={-1}
                y2={-14}
                stroke="#0284c7"
                strokeWidth={1.5}
              />
              <line
                x1={3}
                y1={0}
                x2={4}
                y2={-12}
                stroke="#0369a1"
                strokeWidth={1.5}
              />
              <ellipse
                cx={-1}
                cy={-15}
                rx={2}
                ry={3}
                fill="#7dd3fc"
                opacity={0.6}
              />
            </>
          )}
          {d.type === "golden" && (
            <>
              {/* Crystal */}
              <polygon points="0,-14 -4,-2 4,-2" fill="#fbbf24" opacity={0.6} />
              <polygon points="3,-10 -1,-2 7,-2" fill="#fde68a" opacity={0.4} />
            </>
          )}
        </g>
      ))}
    </g>
  );
}

// ============================================================
// Main component
// ============================================================

interface RoadBackgroundProps {
  positions: NodePosition[];
  isDark?: boolean;
}

export function RoadBackground({ positions, isDark }: RoadBackgroundProps) {
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
      const yTop = Math.min(...ys) - NODE_SPACING_Y / 2;
      const yBottom = Math.max(...ys) + NODE_SPACING_Y / 2;

      zones.push({
        juzNumber: j,
        yTop,
        yBottom,
        theme: getBiomeTheme(j),
      });
    }

    return zones;
  }, [positions]);

  return (
    <g>
      {biomeZones.map((zone) => {
        const gradientId = `biome-grad-${zone.juzNumber}`;
        const height = zone.yBottom - zone.yTop;
        const darkColors = BIOME_DARK_THEMES[zone.theme.terrain];
        const [topColor, bottomColor] =
          isDark && darkColors ? darkColors : zone.theme.bgGradient;

        return (
          <g key={zone.juzNumber}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={topColor} />
                <stop offset="100%" stopColor={bottomColor} />
              </linearGradient>
            </defs>
            <rect
              x={0}
              y={zone.yTop}
              width={ROAD_WIDTH}
              height={height}
              fill={`url(#${gradientId})`}
              opacity={isDark ? 0.4 : 0.25}
            />
            {/* Biome label */}
            <text
              x={ROAD_WIDTH - 8}
              y={zone.yBottom - 8}
              textAnchor="end"
              fontSize={10}
              fill={isDark ? "#9ca3af" : "#6b7280"}
              opacity={0.5}
            >
              Juz {zone.juzNumber} — {zone.theme.name}
            </text>
            <TerrainDecorations
              terrain={zone.theme.terrain}
              yTop={zone.yTop}
              yBottom={zone.yBottom}
              juzNumber={zone.juzNumber}
            />
          </g>
        );
      })}
    </g>
  );
}
