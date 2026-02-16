"use client";

import type { SurahTree } from "@/lib/gamification/surah-trees";

import {
  computeNodeState,
  NODE_HIT_RADIUS,
  NODE_RADIUS,
  NODE_STATE_COLORS,
  SURAH_ARABIC,
  type NodeState,
} from "./road-utils";

// ============================================================
// Compact tree icon per node state
// ============================================================

function TreeIcon({ state, x, y }: { state: NodeState; x: number; y: number }) {
  const colors = NODE_STATE_COLORS[state];

  if (state === "seed") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle
          r={NODE_RADIUS}
          fill={colors.fill}
          opacity={0.4}
          stroke={colors.stroke}
          strokeWidth={1.5}
        />
        {/* Tiny seed dot */}
        <circle r={3} fill={colors.stroke} opacity={0.6} />
      </g>
    );
  }

  if (state === "sprouting") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle
          r={NODE_RADIUS}
          fill="#f0fdf4"
          stroke={colors.stroke}
          strokeWidth={2}
        />
        {/* Small sprout */}
        <rect x={-1} y={-2} width={2} height={8} rx={1} fill="#713f12" />
        <ellipse cx={0} cy={-5} rx={5} ry={4} fill={colors.fill} />
      </g>
    );
  }

  if (state === "growing") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle
          r={NODE_RADIUS}
          fill="#f0fdf4"
          stroke={colors.stroke}
          strokeWidth={2}
        />
        {/* Sapling */}
        <rect x={-1.5} y={-1} width={3} height={10} rx={1} fill="#92400e" />
        <ellipse
          cx={0}
          cy={-5}
          rx={8}
          ry={7}
          fill={colors.fill}
          opacity={0.8}
        />
        <ellipse cx={-3} cy={-7} rx={5} ry={4} fill="#86efac" opacity={0.6} />
      </g>
    );
  }

  if (state === "blooming") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        {colors.glow && (
          <circle r={NODE_RADIUS + 4} fill={colors.glow} opacity={0.3} />
        )}
        <circle
          r={NODE_RADIUS}
          fill="#ecfdf5"
          stroke={colors.stroke}
          strokeWidth={2}
        />
        {/* Full tree */}
        <rect x={-2} y={0} width={4} height={10} rx={1.5} fill="#713f12" />
        <ellipse
          cx={0}
          cy={-5}
          rx={10}
          ry={9}
          fill={colors.fill}
          opacity={0.85}
        />
        <ellipse cx={-4} cy={-7} rx={6} ry={5} fill="#6ee7b7" opacity={0.5} />
        {/* Flowers */}
        <circle cx={-5} cy={-8} r={2} fill="#fbbf24" opacity={0.8} />
        <circle cx={4} cy={-4} r={1.5} fill="#f472b6" opacity={0.7} />
        <circle cx={0} cy={-10} r={1.5} fill="#fbbf24" opacity={0.7} />
      </g>
    );
  }

  if (state === "mastered") {
    return (
      <g transform={`translate(${x}, ${y})`}>
        {colors.glow && (
          <circle r={NODE_RADIUS + 6} fill={colors.glow} opacity={0.4}>
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        <circle
          r={NODE_RADIUS}
          fill="#fffbeb"
          stroke={colors.stroke}
          strokeWidth={2.5}
        />
        {/* Golden tree */}
        <rect x={-2} y={0} width={4} height={10} rx={1.5} fill="#92400e" />
        <ellipse
          cx={0}
          cy={-5}
          rx={11}
          ry={10}
          fill={colors.fill}
          opacity={0.9}
        />
        <ellipse cx={-4} cy={-8} rx={7} ry={5} fill="#fde68a" opacity={0.6} />
        {/* Sparkle */}
        <g opacity={0.8}>
          <line
            x1={8}
            y1={-12}
            x2={10}
            y2={-14}
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
          <line
            x1={10}
            y1={-12}
            x2={8}
            y2={-14}
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
          <line
            x1={-9}
            y1={-3}
            x2={-11}
            y2={-5}
            stroke="#fbbf24"
            strokeWidth={1}
          />
          <line
            x1={-11}
            y1={-3}
            x2={-9}
            y2={-5}
            stroke="#fbbf24"
            strokeWidth={1}
          />
        </g>
      </g>
    );
  }

  // wilting
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        r={NODE_RADIUS}
        fill="#fff7ed"
        stroke={colors.stroke}
        strokeWidth={2}
      />
      {/* Wilting tree */}
      <rect x={-1.5} y={0} width={3} height={10} rx={1} fill="#92400e" />
      <ellipse cx={0} cy={-4} rx={9} ry={8} fill={colors.fill} opacity={0.7} />
      {/* Droop indicator */}
      <path
        d="M -6 -6 Q -8 -2 -10 0"
        fill="none"
        stroke="#ea580c"
        strokeWidth={1.5}
        opacity={0.6}
      />
      <path
        d="M 6 -6 Q 8 -2 10 0"
        fill="none"
        stroke="#ea580c"
        strokeWidth={1.5}
        opacity={0.6}
      />
    </g>
  );
}

// ============================================================
// Main node component
// ============================================================

interface RoadNodeProps {
  tree: SurahTree;
  x: number;
  y: number;
  isCurrent: boolean;
  onClick: (surahNumber: number) => void;
}

export function RoadNode({ tree, x, y, isCurrent, onClick }: RoadNodeProps) {
  const state = computeNodeState(tree);
  const arabicName = SURAH_ARABIC[tree.surahNumber] ?? "";

  // Label placement: alternate left/right based on x position
  const labelSide = x > 250 ? "left" : "right";
  const labelX =
    labelSide === "left" ? x - NODE_RADIUS - 8 : x + NODE_RADIUS + 8;
  const textAnchor = labelSide === "left" ? "end" : "start";

  return (
    <g
      className="cursor-pointer"
      onClick={() => onClick(tree.surahNumber)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(tree.surahNumber);
      }}
    >
      {/* Current progress pulse ring */}
      {isCurrent && (
        <circle
          cx={x}
          cy={y}
          r={NODE_RADIUS + 8}
          fill="none"
          stroke="#059669"
          strokeWidth={2}
          opacity={0.6}
        >
          <animate
            attributeName="r"
            values={`${NODE_RADIUS + 6};${NODE_RADIUS + 12};${NODE_RADIUS + 6}`}
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.2;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Hit area (invisible, larger) */}
      <circle cx={x} cy={y} r={NODE_HIT_RADIUS} fill="transparent" />

      {/* Tree icon */}
      <TreeIcon state={state} x={x} y={y} />

      {/* Mastery percentage inside node */}
      {tree.trunkMastery > 0 && (
        <text
          x={x}
          y={y + NODE_RADIUS + 14}
          textAnchor="middle"
          fontSize={9}
          fontWeight={600}
          fill="currentColor"
          className="text-muted-foreground"
        >
          {tree.trunkMastery}%
        </text>
      )}

      {/* Surah label */}
      <text
        x={labelX}
        y={y - 4}
        textAnchor={textAnchor}
        fontSize={11}
        fontWeight={600}
        fill="currentColor"
        className="text-foreground"
      >
        {tree.surahNumber}. {tree.surahName}
      </text>
      <text
        x={labelX}
        y={y + 10}
        textAnchor={textAnchor}
        fontSize={10}
        fill="currentColor"
        className="text-muted-foreground font-arabic"
        direction="rtl"
      >
        {arabicName}
      </text>
    </g>
  );
}
