"use client";

import { useMemo } from "react";

import type { SurahTree } from "@/lib/gamification/surah-trees";

import {
  computeNodeState,
  getRiverCenterXAtY,
  NODE_STATE_COLORS,
  RIVER_SVG_WIDTH,
  SVG_HEIGHT,
  type NodePosition,
} from "./river-utils";

const MINIMAP_WIDTH = 44;
const MINIMAP_HEIGHT = 220;

interface RiverMinimapProps {
  positions: NodePosition[];
  trees: SurahTree[];
  scrollTop: number;
  containerHeight: number;
  scrollHeight: number;
  onScrollTo: (fraction: number) => void;
}

export function RiverMinimap({
  positions,
  trees,
  scrollTop,
  containerHeight,
  scrollHeight,
  onScrollTo,
}: RiverMinimapProps) {
  const treeMap = useMemo(
    () => new Map(trees.map((t) => [t.surahNumber, t])),
    [trees]
  );

  // River path in minimap space
  const miniRiverPath = useMemo(() => {
    const step = 40;
    const points: string[] = [];
    for (let y = 0; y <= SVG_HEIGHT; y += step) {
      const cx = getRiverCenterXAtY(y);
      const mx = (cx / RIVER_SVG_WIDTH) * MINIMAP_WIDTH;
      const my = (y / SVG_HEIGHT) * MINIMAP_HEIGHT;
      points.push(`${mx.toFixed(1)},${my.toFixed(1)}`);
    }
    return `M ${points[0]} L ${points.slice(1).join(" L ")}`;
  }, []);

  // Node dots
  const dots = useMemo(() => {
    return positions.map((pos) => {
      const tree = treeMap.get(pos.surahNumber);
      const state = tree ? computeNodeState(tree) : "seed";
      return {
        mx: (pos.x / RIVER_SVG_WIDTH) * MINIMAP_WIDTH,
        my: (pos.y / SVG_HEIGHT) * MINIMAP_HEIGHT,
        color: NODE_STATE_COLORS[state].fill,
        surahNumber: pos.surahNumber,
      };
    });
  }, [positions, treeMap]);

  // Use pixel scrollHeight (not SVG_HEIGHT) for accurate viewport mapping
  const effectiveHeight = scrollHeight > 0 ? scrollHeight : SVG_HEIGHT;
  const viewportFraction = containerHeight / effectiveHeight;
  const viewportTop = (scrollTop / effectiveHeight) * MINIMAP_HEIGHT;
  const viewportHeight = Math.max(viewportFraction * MINIMAP_HEIGHT, 12);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const fraction = clickY / MINIMAP_HEIGHT;
    onScrollTo(fraction);
  };

  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
      <svg
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="cursor-pointer rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-sm"
        onClick={handleClick}
      >
        {/* River path */}
        <path
          d={miniRiverPath}
          fill="none"
          stroke="#06b6d4"
          strokeWidth={2.5}
          opacity={0.4}
          strokeLinecap="round"
        />

        {/* Node dots */}
        {dots.map((d) => (
          <circle
            key={d.surahNumber}
            cx={d.mx}
            cy={d.my}
            r={1.5}
            fill={d.color}
            opacity={0.8}
          />
        ))}

        {/* Viewport indicator */}
        <rect
          x={0}
          y={viewportTop}
          width={MINIMAP_WIDTH}
          height={viewportHeight}
          rx={2}
          fill="currentColor"
          className="text-primary"
          opacity={0.15}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeOpacity={0.3}
        />

        {/* Current position pulsing dot */}
        <circle
          cx={MINIMAP_WIDTH / 2}
          cy={viewportTop + viewportHeight / 2}
          r={2.5}
          fill="#059669"
          opacity={0.8}
        >
          <animate
            attributeName="r"
            values="2;3.5;2"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.4;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
