"use client";

import { useMemo } from "react";

import {
  catmullRomToPath,
  ROAD_STROKE_WIDTH,
  type NodePosition,
} from "./road-utils";

// ============================================================
// 3-layer road: shadow, body, dashed center line
// ============================================================

interface RoadPathProps {
  positions: NodePosition[];
  isDark?: boolean;
}

export function RoadPath({ positions, isDark }: RoadPathProps) {
  const pathD = useMemo(() => {
    // Sort by surah number ascending (bottom to top in Y)
    // Positions are already in surah order, but Y is inverted (surah 1 = bottom = high Y)
    const sorted = [...positions].sort((a, b) => a.y - b.y);
    return catmullRomToPath(sorted);
  }, [positions]);

  if (!pathD) return null;

  const bodyColor = isDark ? "#374151" : "#d1d5db";
  const shadowColor = isDark ? "#1f2937" : "#9ca3af";
  const dashColor = isDark ? "#6b7280" : "#f9fafb";

  return (
    <g>
      {/* Shadow layer */}
      <path
        d={pathD}
        fill="none"
        stroke={shadowColor}
        strokeWidth={ROAD_STROKE_WIDTH + 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
      {/* Road body */}
      <path
        d={pathD}
        fill="none"
        stroke={bodyColor}
        strokeWidth={ROAD_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dashed center line */}
      <path
        d={pathD}
        fill="none"
        stroke={dashColor}
        strokeWidth={2}
        strokeDasharray="8 12"
        strokeLinecap="round"
        opacity={0.6}
      />
    </g>
  );
}
