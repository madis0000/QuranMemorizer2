"use client";

import { ROAD_CENTER_X, ROAD_PADDING_TOP } from "./road-utils";

interface ParadiseGateProps {
  isUnlocked: boolean;
  isDark?: boolean;
}

export function ParadiseGate({ isUnlocked, isDark }: ParadiseGateProps) {
  const y = ROAD_PADDING_TOP / 2;
  const goldPrimary = isUnlocked ? "#fbbf24" : isDark ? "#4b5563" : "#9ca3af";
  const goldSecondary = isUnlocked ? "#f59e0b" : isDark ? "#374151" : "#d1d5db";

  return (
    <g transform={`translate(${ROAD_CENTER_X}, ${y})`}>
      {/* Light rays (only when unlocked) */}
      {isUnlocked && (
        <g opacity={0.3}>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x2 = Math.cos(angle) * 80;
            const y2 = Math.sin(angle) * 80;
            return (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={x2}
                y2={y2}
                stroke="#fbbf24"
                strokeWidth={2}
                opacity={0.4}
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.5;0.2"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </line>
            );
          })}
        </g>
      )}

      {/* Outer glow */}
      {isUnlocked && (
        <ellipse cx={0} cy={0} rx={60} ry={50} fill="#fbbf24" opacity={0.15}>
          <animate
            attributeName="opacity"
            values="0.1;0.2;0.1"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      {/* Main arch - Islamic pointed arch shape */}
      <path
        d={`M -45 30 L -45 -10 Q -45 -50 0 -60 Q 45 -50 45 -10 L 45 30`}
        fill="none"
        stroke={goldPrimary}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Inner arch */}
      <path
        d={`M -35 30 L -35 -5 Q -35 -40 0 -48 Q 35 -40 35 -5 L 35 30`}
        fill="none"
        stroke={goldSecondary}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Gate pillars */}
      <rect x={-48} y={-10} width={6} height={40} rx={2} fill={goldPrimary} />
      <rect x={42} y={-10} width={6} height={40} rx={2} fill={goldPrimary} />

      {/* Pillar caps */}
      <circle cx={-45} cy={-12} r={5} fill={goldPrimary} />
      <circle cx={45} cy={-12} r={5} fill={goldPrimary} />

      {/* Label */}
      <text
        y={-25}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill={isUnlocked ? "#92400e" : isDark ? "#6b7280" : "#9ca3af"}
        className="font-arabic"
      >
        {isUnlocked ? "الجنة" : "بوابة الجنة"}
      </text>

      <text
        y={-10}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill={isUnlocked ? "#b45309" : isDark ? "#6b7280" : "#9ca3af"}
      >
        {isUnlocked ? "Paradise — Unlocked!" : "Paradise Gate"}
      </text>

      {/* Lock/open indicator */}
      {!isUnlocked && (
        <g transform="translate(0, 8)">
          {/* Lock body */}
          <rect
            x={-6}
            y={-2}
            width={12}
            height={10}
            rx={2}
            fill={isDark ? "#4b5563" : "#9ca3af"}
          />
          {/* Lock shackle */}
          <path
            d="M -4 -2 L -4 -6 Q -4 -10 0 -10 Q 4 -10 4 -6 L 4 -2"
            fill="none"
            stroke={isDark ? "#4b5563" : "#9ca3af"}
            strokeWidth={2}
          />
        </g>
      )}
    </g>
  );
}
