"use client";

import { memo } from "react";

import type { SurahTree } from "@/lib/gamification/surah-trees";

import {
  computeNodeState,
  NODE_HIT_RADIUS,
  NODE_RADIUS,
  NODE_STATE_COLORS,
  seededRandom,
  SURAH_ARABIC,
  type NodeState,
} from "./river-utils";

// ============================================================
// Ground patch — organic island shape beneath tree
// ============================================================

function GroundPatch({
  state,
  isDark,
}: {
  state: NodeState;
  isDark?: boolean;
}) {
  const baseColor = isDark ? "#2a1f14" : "#8B7355";
  const grassColor = isDark ? "#1a3d1a" : "#4a8c3f";
  const opacity = state === "seed" ? 0.2 : 0.5;

  return (
    <g opacity={opacity}>
      {/* Earth base */}
      <ellipse cx={0} cy={8} rx={32} ry={12} fill={baseColor} opacity={0.6} />
      {/* Grass overlay */}
      <ellipse
        cx={0}
        cy={6}
        rx={28}
        ry={10}
        fill={grassColor}
        opacity={state === "seed" ? 0.2 : 0.4}
      />
    </g>
  );
}

// ============================================================
// Detailed tree icon per node state (15-30 SVG elements each)
// ============================================================

function TreeIcon({
  state,
  surahNumber,
}: {
  state: NodeState;
  surahNumber: number;
}) {
  const colors = NODE_STATE_COLORS[state];

  if (state === "seed") {
    return (
      <g>
        {/* Bare earth with seed */}
        <circle r={4} cy={2} fill={colors.stroke} opacity={0.3} />
        <circle r={2} cy={2} fill={colors.fill} opacity={0.5} />
        {/* Tiny sprout attempt */}
        <line
          x1={0}
          y1={1}
          x2={0}
          y2={-2}
          stroke="#9ca3af"
          strokeWidth={1}
          opacity={0.3}
        />
      </g>
    );
  }

  if (state === "sprouting") {
    return (
      <g>
        {/* Small sprout with roots */}
        <line
          x1={0}
          y1={6}
          x2={-3}
          y2={10}
          stroke="#92400e"
          strokeWidth={1}
          opacity={0.4}
        />
        <line
          x1={0}
          y1={6}
          x2={3}
          y2={9}
          stroke="#92400e"
          strokeWidth={1}
          opacity={0.3}
        />
        {/* Stem */}
        <rect x={-1} y={-4} width={2} height={10} rx={1} fill="#713f12" />
        {/* First leaves */}
        <ellipse
          cx={-4}
          cy={-5}
          rx={4}
          ry={3}
          fill={colors.fill}
          opacity={0.7}
        />
        <ellipse
          cx={3}
          cy={-7}
          rx={3.5}
          ry={2.5}
          fill="#86efac"
          opacity={0.6}
        />
        {/* Tiny bud */}
        <circle cx={0} cy={-9} r={2} fill={colors.fill} opacity={0.5} />
      </g>
    );
  }

  if (state === "growing") {
    return (
      <g>
        {/* Trunk with slight curve */}
        <path
          d="M 0 8 Q -1 0 0 -6"
          fill="none"
          stroke="#92400e"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        {/* Branches */}
        <line
          x1={-1}
          y1={-2}
          x2={-8}
          y2={-8}
          stroke="#92400e"
          strokeWidth={1.5}
        />
        <line
          x1={1}
          y1={-4}
          x2={7}
          y2={-10}
          stroke="#92400e"
          strokeWidth={1.5}
        />
        {/* Canopy layers */}
        <ellipse
          cx={0}
          cy={-10}
          rx={12}
          ry={9}
          fill={colors.fill}
          opacity={0.6}
        />
        <ellipse cx={-4} cy={-12} rx={8} ry={6} fill="#86efac" opacity={0.5} />
        <ellipse
          cx={5}
          cy={-8}
          rx={7}
          ry={5}
          fill={colors.fill}
          opacity={0.4}
        />
        {/* A few leaves */}
        <circle cx={-7} cy={-14} r={2} fill="#4ade80" opacity={0.6} />
        <circle cx={6} cy={-13} r={1.5} fill="#86efac" opacity={0.5} />
      </g>
    );
  }

  if (state === "blooming") {
    const s = seededRandom(surahNumber * 7);
    return (
      <g>
        {/* Glow */}
        {colors.glow && (
          <circle r={NODE_RADIUS + 5} fill={colors.glow} opacity={0.25} />
        )}
        {/* Trunk */}
        <path
          d="M 0 8 Q -2 0 -1 -8"
          fill="none"
          stroke="#713f12"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Main branches */}
        <line
          x1={-2}
          y1={-3}
          x2={-10}
          y2={-10}
          stroke="#713f12"
          strokeWidth={2}
        />
        <line x1={0} y1={-5} x2={8} y2={-12} stroke="#713f12" strokeWidth={2} />
        <line
          x1={-1}
          y1={-7}
          x2={-6}
          y2={-16}
          stroke="#713f12"
          strokeWidth={1.5}
        />
        {/* Rich canopy */}
        <ellipse
          cx={0}
          cy={-12}
          rx={14}
          ry={11}
          fill={colors.fill}
          opacity={0.7}
        />
        <ellipse cx={-5} cy={-14} rx={10} ry={7} fill="#6ee7b7" opacity={0.5} />
        <ellipse
          cx={6}
          cy={-10}
          rx={9}
          ry={7}
          fill={colors.fill}
          opacity={0.5}
        />
        <ellipse cx={-2} cy={-17} rx={7} ry={5} fill="#86efac" opacity={0.4} />
        {/* Flowers */}
        <circle cx={-6} cy={-18} r={2.5} fill="#fbbf24" opacity={0.8} />
        <circle cx={5} cy={-16} r={2} fill="#f472b6" opacity={0.7} />
        <circle cx={-10} cy={-10} r={1.8} fill="#fbbf24" opacity={0.6} />
        <circle cx={9} cy={-7} r={2} fill="#f472b6" opacity={0.6} />
        <circle cx={0} cy={-20} r={1.5} fill="#fbbf24" opacity={0.7} />
        {/* Fruit */}
        <circle cx={-3 + s * 4} cy={-4} r={2} fill="#ef4444" opacity={0.5} />
      </g>
    );
  }

  if (state === "mastered") {
    return (
      <g>
        {/* Warm glow */}
        {colors.glow && (
          <circle r={NODE_RADIUS + 8} fill={colors.glow} opacity={0.35}>
            <animate
              attributeName="opacity"
              values="0.2;0.45;0.2"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        {/* Majestic trunk */}
        <path
          d="M 0 8 Q -2 2 -1 -8 Q 0 -12 1 -8"
          fill="none"
          stroke="#92400e"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* Branches spreading wide */}
        <line
          x1={-2}
          y1={-4}
          x2={-12}
          y2={-10}
          stroke="#92400e"
          strokeWidth={2.5}
        />
        <line
          x1={1}
          y1={-6}
          x2={11}
          y2={-12}
          stroke="#92400e"
          strokeWidth={2.5}
        />
        <line
          x1={-1}
          y1={-8}
          x2={-8}
          y2={-18}
          stroke="#92400e"
          strokeWidth={2}
        />
        <line x1={0} y1={-9} x2={7} y2={-19} stroke="#92400e" strokeWidth={2} />
        {/* Golden canopy */}
        <ellipse
          cx={0}
          cy={-14}
          rx={16}
          ry={13}
          fill={colors.fill}
          opacity={0.8}
        />
        <ellipse cx={-6} cy={-16} rx={11} ry={8} fill="#fde68a" opacity={0.6} />
        <ellipse
          cx={7}
          cy={-12}
          rx={10}
          ry={8}
          fill={colors.fill}
          opacity={0.6}
        />
        <ellipse cx={-2} cy={-20} rx={8} ry={6} fill="#fef3c7" opacity={0.4} />
        {/* Golden flowers */}
        <circle cx={-8} cy={-20} r={2.5} fill="#fbbf24" opacity={0.9} />
        <circle cx={6} cy={-18} r={2.5} fill="#fbbf24" opacity={0.9} />
        <circle cx={-12} cy={-12} r={2} fill="#f59e0b" opacity={0.8} />
        <circle cx={11} cy={-9} r={2} fill="#f59e0b" opacity={0.8} />
        <circle cx={0} cy={-23} r={2} fill="#fbbf24" opacity={0.85} />
        <circle cx={-5} cy={-8} r={1.5} fill="#fde68a" opacity={0.7} />
        <circle cx={8} cy={-5} r={1.5} fill="#fde68a" opacity={0.7} />
        {/* Sparkle crosses */}
        <g opacity={0.8}>
          <line
            x1={10}
            y1={-20}
            x2={13}
            y2={-23}
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
          <line
            x1={13}
            y1={-20}
            x2={10}
            y2={-23}
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
          <line
            x1={-12}
            y1={-18}
            x2={-14}
            y2={-20}
            stroke="#fbbf24"
            strokeWidth={1}
          />
          <line
            x1={-14}
            y1={-18}
            x2={-12}
            y2={-20}
            stroke="#fbbf24"
            strokeWidth={1}
          />
        </g>
      </g>
    );
  }

  // wilting
  return (
    <g>
      {/* Drooping trunk */}
      <path
        d="M 0 8 Q -1 2 0 -6"
        fill="none"
        stroke="#92400e"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {/* Drooping branches */}
      <path
        d="M -1 -2 Q -6 -6 -10 -2"
        fill="none"
        stroke="#92400e"
        strokeWidth={1.5}
      />
      <path
        d="M 1 -4 Q 6 -8 10 -4"
        fill="none"
        stroke="#92400e"
        strokeWidth={1.5}
      />
      {/* Wilting canopy */}
      <ellipse cx={0} cy={-8} rx={12} ry={9} fill={colors.fill} opacity={0.5} />
      <ellipse cx={-4} cy={-10} rx={8} ry={6} fill="#fdba74" opacity={0.4} />
      {/* Falling leaves */}
      <circle cx={-8} cy={2} r={1.5} fill="#ea580c" opacity={0.4} />
      <circle cx={10} cy={4} r={1.5} fill="#f97316" opacity={0.3} />
      <circle cx={-5} cy={6} r={1} fill="#ea580c" opacity={0.3} />
      {/* Droop lines */}
      <path
        d="M -7 -8 Q -10 -4 -12 0"
        fill="none"
        stroke="#ea580c"
        strokeWidth={1}
        opacity={0.4}
      />
      <path
        d="M 7 -8 Q 10 -4 12 0"
        fill="none"
        stroke="#ea580c"
        strokeWidth={1}
        opacity={0.4}
      />
    </g>
  );
}

// ============================================================
// Surrounding flowers based on bloom ratio
// ============================================================

function SurroundingFlowers({ tree }: { tree: SurahTree }) {
  if (tree.bloomCount === 0) return null;

  const ratio = tree.bloomCount / Math.max(tree.totalAyahs, 1);
  const flowerCount = Math.min(Math.ceil(ratio * 8), 8);

  return (
    <g>
      {Array.from({ length: flowerCount }, (_, i) => {
        const angle = (i / flowerCount) * Math.PI * 2 - Math.PI / 2;
        const radius = 26 + seededRandom(tree.surahNumber * 10 + i) * 8;
        const fx = Math.cos(angle) * radius;
        const fy = Math.sin(angle) * radius + 4;
        const size = 1.5 + seededRandom(tree.surahNumber * 10 + i + 5) * 1.5;
        const hue = seededRandom(tree.surahNumber * 10 + i + 10) > 0.5;

        return (
          <g key={i}>
            <line
              x1={fx}
              y1={fy}
              x2={fx}
              y2={fy + 4}
              stroke="#22c55e"
              strokeWidth={0.6}
              opacity={0.5}
            />
            <circle
              cx={fx}
              cy={fy}
              r={size}
              fill={hue ? "#fbbf24" : "#f472b6"}
              opacity={0.6}
            />
          </g>
        );
      })}
    </g>
  );
}

// ============================================================
// Firefly aura for current progress node
// ============================================================

function FireflyAura() {
  return (
    <g>
      {/* Luminous ground glow */}
      <ellipse cx={0} cy={8} rx={36} ry={14} fill="#059669" opacity={0.15}>
        <animate
          attributeName="opacity"
          values="0.1;0.2;0.1"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </ellipse>
      {/* Orbiting fireflies */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`${i * 72} 0 0`}
            to={`${i * 72 + 360} 0 0`}
            dur={`${3.5 + i * 0.5}s`}
            repeatCount="indefinite"
          />
          <circle
            cx={30 + i * 3}
            cy={0}
            r={1.5 + i * 0.2}
            fill="#fbbf24"
            opacity={0.7}
          >
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur={`${1.5 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </g>
  );
}

// ============================================================
// Simplified node for viewport culling (out-of-view)
// ============================================================

function SimplifiedNode({
  tree,
  x,
  y,
  onClick,
}: {
  tree: SurahTree;
  x: number;
  y: number;
  onClick: (n: number) => void;
}) {
  const state = computeNodeState(tree);
  const colors = NODE_STATE_COLORS[state];

  return (
    <circle
      cx={x}
      cy={y}
      r={6}
      fill={colors.fill}
      stroke={colors.stroke}
      strokeWidth={1}
      opacity={0.6}
      className="cursor-pointer"
      onClick={() => onClick(tree.surahNumber)}
    />
  );
}

// ============================================================
// Main node component
// ============================================================

interface RiverNodeProps {
  tree: SurahTree;
  x: number;
  y: number;
  bankSide: "left" | "right";
  isCurrent: boolean;
  isSimplified?: boolean;
  onClick: (surahNumber: number) => void;
}

export const RiverNode = memo(function RiverNode({
  tree,
  x,
  y,
  bankSide,
  isCurrent,
  isSimplified,
  onClick,
}: RiverNodeProps) {
  if (isSimplified) {
    return <SimplifiedNode tree={tree} x={x} y={y} onClick={onClick} />;
  }

  const state = computeNodeState(tree);
  const arabicName = SURAH_ARABIC[tree.surahNumber] ?? "";

  // Labels on opposite side from river (pointing outward)
  const labelSide = bankSide === "left" ? "left" : "right";
  const labelX =
    labelSide === "left" ? x - NODE_RADIUS - 12 : x + NODE_RADIUS + 12;
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
      {/* Firefly aura for current node */}
      {isCurrent && (
        <g transform={`translate(${x}, ${y})`}>
          <FireflyAura />
        </g>
      )}

      {/* Hit area (invisible, larger) */}
      <circle cx={x} cy={y} r={NODE_HIT_RADIUS} fill="transparent" />

      {/* Ground patch */}
      <g transform={`translate(${x}, ${y})`}>
        <GroundPatch state={state} />
      </g>

      {/* Tree icon */}
      <g transform={`translate(${x}, ${y})`}>
        <TreeIcon state={state} surahNumber={tree.surahNumber} />
      </g>

      {/* Surrounding flowers */}
      <g transform={`translate(${x}, ${y})`}>
        <SurroundingFlowers tree={tree} />
      </g>

      {/* Mastery percentage */}
      {tree.trunkMastery > 0 && (
        <text
          x={x}
          y={y + NODE_RADIUS + 18}
          textAnchor="middle"
          fontSize={9}
          fontWeight={600}
          fill="currentColor"
          className="text-muted-foreground"
        >
          {tree.trunkMastery}%
        </text>
      )}

      {/* Label with halo for readability */}
      <text
        x={labelX}
        y={y - 4}
        textAnchor={textAnchor}
        fontSize={11}
        fontWeight={600}
        fill="currentColor"
        className="text-foreground"
        stroke="currentColor"
        strokeWidth={3}
        strokeOpacity={0.15}
        paintOrder="stroke"
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
        stroke="currentColor"
        strokeWidth={3}
        strokeOpacity={0.1}
        paintOrder="stroke"
      >
        {arabicName}
      </text>
    </g>
  );
});
