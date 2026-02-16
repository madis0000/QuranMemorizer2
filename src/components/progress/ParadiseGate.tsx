"use client";

import {
  RIVER_CENTER_X,
  RIVER_PADDING_TOP,
  RIVER_SVG_WIDTH,
} from "./river-utils";

interface ParadiseGateProps {
  isUnlocked: boolean;
  isDark?: boolean;
}

/**
 * Full-width grand entrance — twin minarets, ogee arch, crescent finials,
 * Arabic calligraphy, and animated light rays when unlocked.
 */
export function ParadiseGate({ isUnlocked, isDark }: ParadiseGateProps) {
  const y = RIVER_PADDING_TOP / 2;
  const cx = RIVER_CENTER_X;
  const goldPrimary = isUnlocked ? "#fbbf24" : isDark ? "#4b5563" : "#9ca3af";
  const goldSecondary = isUnlocked ? "#f59e0b" : isDark ? "#374151" : "#d1d5db";
  const goldHighlight = isUnlocked ? "#fde68a" : isDark ? "#6b7280" : "#e5e7eb";

  const archWidth = 160;
  const minaretSpacing = archWidth + 30;
  const minaretHeight = 80;
  const domeRadius = 10;

  return (
    <g>
      {/* Background glow (unlocked only) */}
      {isUnlocked && (
        <ellipse
          cx={cx}
          cy={y}
          rx={RIVER_SVG_WIDTH * 0.3}
          ry={120}
          fill="#fbbf24"
          opacity={0.08}
        >
          <animate
            attributeName="opacity"
            values="0.05;0.1;0.05"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      {/* Light rays (unlocked only) */}
      {isUnlocked && (
        <g opacity={0.2}>
          {Array.from({ length: 10 }, (_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const r = 120;
            return (
              <line
                key={i}
                x1={cx}
                y1={y}
                x2={cx + Math.cos(angle) * r}
                y2={y + Math.sin(angle) * r}
                stroke="#fbbf24"
                strokeWidth={1.5}
                opacity={0.3}
              >
                <animate
                  attributeName="opacity"
                  values="0.15;0.4;0.15"
                  dur={`${2.5 + i * 0.25}s`}
                  repeatCount="indefinite"
                />
              </line>
            );
          })}
        </g>
      )}

      {/* Left minaret */}
      <g transform={`translate(${cx - minaretSpacing / 2}, ${y})`}>
        {/* Tower */}
        <rect
          x={-6}
          y={-minaretHeight}
          width={12}
          height={minaretHeight}
          rx={2}
          fill={goldPrimary}
        />
        {/* Balcony */}
        <rect
          x={-9}
          y={-minaretHeight * 0.6}
          width={18}
          height={4}
          rx={1}
          fill={goldHighlight}
        />
        {/* Dome */}
        <ellipse
          cx={0}
          cy={-minaretHeight}
          rx={domeRadius}
          ry={domeRadius * 0.65}
          fill={goldPrimary}
        />
        {/* Crescent finial */}
        <circle
          cx={0}
          cy={-minaretHeight - domeRadius * 0.65 - 5}
          r={3}
          fill={goldPrimary}
        />
        <circle
          cx={1.5}
          cy={-minaretHeight - domeRadius * 0.65 - 5}
          r={2}
          fill={isDark ? "#1f2937" : "#f9fafb"}
        />
      </g>

      {/* Right minaret */}
      <g transform={`translate(${cx + minaretSpacing / 2}, ${y})`}>
        <rect
          x={-6}
          y={-minaretHeight}
          width={12}
          height={minaretHeight}
          rx={2}
          fill={goldPrimary}
        />
        <rect
          x={-9}
          y={-minaretHeight * 0.6}
          width={18}
          height={4}
          rx={1}
          fill={goldHighlight}
        />
        <ellipse
          cx={0}
          cy={-minaretHeight}
          rx={domeRadius}
          ry={domeRadius * 0.65}
          fill={goldPrimary}
        />
        <circle
          cx={0}
          cy={-minaretHeight - domeRadius * 0.65 - 5}
          r={3}
          fill={goldPrimary}
        />
        <circle
          cx={1.5}
          cy={-minaretHeight - domeRadius * 0.65 - 5}
          r={2}
          fill={isDark ? "#1f2937" : "#f9fafb"}
        />
      </g>

      {/* Outer arch — pointed ogee shape */}
      <path
        d={`M ${cx - archWidth / 2} ${y + 20}
            L ${cx - archWidth / 2} ${y - 30}
            Q ${cx - archWidth / 2} ${y - 60} ${cx} ${y - 70}
            Q ${cx + archWidth / 2} ${y - 60} ${cx + archWidth / 2} ${y - 30}
            L ${cx + archWidth / 2} ${y + 20}`}
        fill="none"
        stroke={goldPrimary}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Inner arch */}
      <path
        d={`M ${cx - archWidth / 2 + 12} ${y + 20}
            L ${cx - archWidth / 2 + 12} ${y - 25}
            Q ${cx - archWidth / 2 + 12} ${y - 50} ${cx} ${y - 58}
            Q ${cx + archWidth / 2 - 12} ${y - 50} ${cx + archWidth / 2 - 12} ${y - 25}
            L ${cx + archWidth / 2 - 12} ${y + 20}`}
        fill="none"
        stroke={goldSecondary}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Decorative keystone at arch apex */}
      <circle cx={cx} cy={y - 70} r={4} fill={goldHighlight} />

      {/* Arabic calligraphy label */}
      <text
        x={cx}
        y={y - 35}
        textAnchor="middle"
        fontSize={16}
        fontWeight={700}
        fill={isUnlocked ? "#92400e" : isDark ? "#6b7280" : "#9ca3af"}
        className="font-arabic"
      >
        {isUnlocked ? "الجنة" : "بوابة الجنة"}
      </text>

      {/* English subtitle */}
      <text
        x={cx}
        y={y - 18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={isUnlocked ? "#b45309" : isDark ? "#6b7280" : "#9ca3af"}
      >
        {isUnlocked ? "Paradise — Unlocked!" : "Paradise Gate"}
      </text>

      {/* Lock indicator (when locked) */}
      {!isUnlocked && (
        <g transform={`translate(${cx}, ${y})`}>
          <rect
            x={-7}
            y={-2}
            width={14}
            height={12}
            rx={2}
            fill={isDark ? "#4b5563" : "#9ca3af"}
          />
          <path
            d="M -4 -2 L -4 -7 Q -4 -12 0 -12 Q 4 -12 4 -7 L 4 -2"
            fill="none"
            stroke={isDark ? "#4b5563" : "#9ca3af"}
            strokeWidth={2.5}
          />
        </g>
      )}
    </g>
  );
}
