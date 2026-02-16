"use client";

import { RIVER_BASE_HALF_WIDTH } from "./river-utils";

interface JuzGateProps {
  juzNumber: number;
  y: number;
  completionPct: number;
  isDark?: boolean;
  riverCenterX: number;
}

/**
 * Bridge spanning the river between juz zones.
 * Two pillars with Islamic dome caps, a bridge deck, crescent finials.
 */
export function JuzGate({
  juzNumber,
  y,
  completionPct,
  isDark,
  riverCenterX,
}: JuzGateProps) {
  const isComplete = completionPct >= 80;
  const bridgeColor = isComplete ? "#fbbf24" : isDark ? "#4b5563" : "#d1d5db";
  const deckColor = isComplete ? "#f59e0b" : isDark ? "#374151" : "#e5e7eb";
  const textColor = isComplete ? "#92400e" : isDark ? "#9ca3af" : "#6b7280";

  const halfSpan = RIVER_BASE_HALF_WIDTH + 35;
  const leftX = riverCenterX - halfSpan;
  const rightX = riverCenterX + halfSpan;
  const pillarWidth = 8;
  const pillarHeight = 28;
  const domeRadius = 6;

  return (
    <g>
      {/* Bridge deck */}
      <rect
        x={leftX}
        y={y - 4}
        width={rightX - leftX}
        height={8}
        rx={2}
        fill={deckColor}
        opacity={0.9}
      />
      {/* Deck railing lines */}
      <line
        x1={leftX + 4}
        y1={y - 4}
        x2={rightX - 4}
        y2={y - 4}
        stroke={bridgeColor}
        strokeWidth={1.5}
        opacity={0.6}
      />
      <line
        x1={leftX + 4}
        y1={y + 4}
        x2={rightX - 4}
        y2={y + 4}
        stroke={bridgeColor}
        strokeWidth={1.5}
        opacity={0.6}
      />

      {/* Left pillar */}
      <rect
        x={leftX - pillarWidth / 2}
        y={y - pillarHeight / 2}
        width={pillarWidth}
        height={pillarHeight}
        rx={2}
        fill={bridgeColor}
      />
      {/* Left dome cap */}
      <ellipse
        cx={leftX}
        cy={y - pillarHeight / 2}
        rx={domeRadius}
        ry={domeRadius * 0.7}
        fill={bridgeColor}
      />
      {/* Left crescent finial */}
      <circle
        cx={leftX}
        cy={y - pillarHeight / 2 - domeRadius * 0.7 - 3}
        r={2}
        fill={bridgeColor}
      />

      {/* Right pillar */}
      <rect
        x={rightX - pillarWidth / 2}
        y={y - pillarHeight / 2}
        width={pillarWidth}
        height={pillarHeight}
        rx={2}
        fill={bridgeColor}
      />
      {/* Right dome cap */}
      <ellipse
        cx={rightX}
        cy={y - pillarHeight / 2}
        rx={domeRadius}
        ry={domeRadius * 0.7}
        fill={bridgeColor}
      />
      {/* Right crescent finial */}
      <circle
        cx={rightX}
        cy={y - pillarHeight / 2 - domeRadius * 0.7 - 3}
        r={2}
        fill={bridgeColor}
      />

      {/* Juz label on bridge */}
      <text
        x={riverCenterX}
        y={y - 1}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={textColor}
        dominantBaseline="middle"
      >
        Juz {juzNumber}
      </text>

      {/* Completion badge */}
      {completionPct > 0 && (
        <text
          x={riverCenterX}
          y={y + 14}
          textAnchor="middle"
          fontSize={8}
          fill={textColor}
          opacity={0.7}
        >
          {completionPct}%
        </text>
      )}

      {/* Complete star */}
      {isComplete && (
        <text
          x={riverCenterX}
          y={y - pillarHeight / 2 - 8}
          textAnchor="middle"
          fontSize={12}
        >
          ⭐
        </text>
      )}
    </g>
  );
}
