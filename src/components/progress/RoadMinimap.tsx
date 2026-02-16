"use client";

import { useMemo } from "react";

import type { SurahTree } from "@/lib/gamification/surah-trees";

import {
  computeNodeState,
  NODE_STATE_COLORS,
  ROAD_WIDTH,
  SVG_HEIGHT,
  type NodePosition,
} from "./road-utils";

const MINIMAP_WIDTH = 32;
const MINIMAP_HEIGHT = 200;

interface RoadMinimapProps {
  positions: NodePosition[];
  trees: SurahTree[];
  scrollTop: number;
  containerHeight: number;
  onScrollTo: (fraction: number) => void;
}

export function RoadMinimap({
  positions,
  trees,
  scrollTop,
  containerHeight,
  onScrollTo,
}: RoadMinimapProps) {
  const treeMap = useMemo(
    () => new Map(trees.map((t) => [t.surahNumber, t])),
    [trees]
  );

  // Map positions into minimap space
  const dots = useMemo(() => {
    return positions.map((pos) => {
      const tree = treeMap.get(pos.surahNumber);
      const state = tree ? computeNodeState(tree) : "seed";
      const mxFraction = pos.x / ROAD_WIDTH;
      const myFraction = pos.y / SVG_HEIGHT;
      return {
        mx: mxFraction * MINIMAP_WIDTH,
        my: myFraction * MINIMAP_HEIGHT,
        color: NODE_STATE_COLORS[state].fill,
        surahNumber: pos.surahNumber,
      };
    });
  }, [positions, treeMap]);

  // Viewport indicator
  const viewportFraction = containerHeight / SVG_HEIGHT;
  const viewportTop = (scrollTop / SVG_HEIGHT) * MINIMAP_HEIGHT;
  const viewportHeight = Math.max(viewportFraction * MINIMAP_HEIGHT, 10);

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
      </svg>
    </div>
  );
}
