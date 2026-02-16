"use client";

import { ROAD_CENTER_X } from "./road-utils";

interface JuzGateProps {
  juzNumber: number;
  y: number;
  completionPct: number;
  isDark?: boolean;
}

export function JuzGate({ juzNumber, y, completionPct, isDark }: JuzGateProps) {
  const isComplete = completionPct >= 80;
  const archColor = isComplete ? "#fbbf24" : isDark ? "#4b5563" : "#d1d5db";
  const textColor = isComplete ? "#92400e" : isDark ? "#9ca3af" : "#6b7280";

  return (
    <g transform={`translate(${ROAD_CENTER_X}, ${y})`}>
      {/* Arch */}
      <path
        d="M -35 10 L -35 -10 Q -35 -25 0 -28 Q 35 -25 35 -10 L 35 10"
        fill="none"
        stroke={archColor}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Pillars */}
      <rect x={-37} y={-10} width={4} height={20} rx={1} fill={archColor} />
      <rect x={33} y={-10} width={4} height={20} rx={1} fill={archColor} />
      {/* Juz label */}
      <text
        y={-14}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={textColor}
      >
        Juz {juzNumber}
      </text>
      {/* Completion */}
      {completionPct > 0 && (
        <text
          y={0}
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
        <text y={-30} textAnchor="middle" fontSize={12}>
          ⭐
        </text>
      )}
    </g>
  );
}
