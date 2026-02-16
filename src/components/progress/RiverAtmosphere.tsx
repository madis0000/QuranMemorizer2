"use client";

import { useMemo } from "react";

import {
  RIVER_PADDING_TOP,
  RIVER_SVG_WIDTH,
  seededRandom,
  SVG_HEIGHT,
  type AnimationTier,
  type NodePosition,
} from "./river-utils";

// ============================================================
// Drifting cloud groups
// ============================================================

function DriftingClouds({ isDark }: { isDark?: boolean }) {
  const clouds = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const seed = i * 37 + 11;
      return {
        y: RIVER_PADDING_TOP + seededRandom(seed) * (SVG_HEIGHT - 800),
        rx: 40 + seededRandom(seed + 1) * 50,
        ry: 12 + seededRandom(seed + 2) * 10,
        dur: 40 + seededRandom(seed + 3) * 30,
        startX: -100 - seededRandom(seed + 4) * 200,
      };
    });
  }, []);

  const cloudColor = isDark ? "#374151" : "#ffffff";
  const opacity = isDark ? 0.08 : 0.12;

  return (
    <g opacity={opacity}>
      {clouds.map((c, i) => (
        <g key={i}>
          <ellipse cx={c.startX} cy={c.y} rx={c.rx} ry={c.ry} fill={cloudColor}>
            <animate
              attributeName="cx"
              values={`${c.startX};${RIVER_SVG_WIDTH + 200};${c.startX}`}
              dur={`${c.dur}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Secondary cloud puff */}
          <ellipse
            cx={c.startX + c.rx * 0.6}
            cy={c.y - c.ry * 0.5}
            rx={c.rx * 0.6}
            ry={c.ry * 0.8}
            fill={cloudColor}
          >
            <animate
              attributeName="cx"
              values={`${c.startX + c.rx * 0.6};${RIVER_SVG_WIDTH + 200 + c.rx * 0.6};${c.startX + c.rx * 0.6}`}
              dur={`${c.dur}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        </g>
      ))}
    </g>
  );
}

// ============================================================
// Golden light near Paradise (top of map)
// ============================================================

function ParadiseGlow({ isDark }: { isDark?: boolean }) {
  const color = isDark ? "#92400e" : "#fbbf24";
  return (
    <g>
      <defs>
        <radialGradient id="paradise-glow-grad" cx="50%" cy="0%" r="60%">
          <stop
            offset="0%"
            stopColor={color}
            stopOpacity={isDark ? 0.08 : 0.12}
          />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect
        x={0}
        y={0}
        width={RIVER_SVG_WIDTH}
        height={RIVER_PADDING_TOP + 200}
        fill="url(#paradise-glow-grad)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="5s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
  );
}

// ============================================================
// Main atmosphere component
// ============================================================

interface RiverAtmosphereProps {
  positions: NodePosition[];
  isDark?: boolean;
  animTier: AnimationTier;
}

export function RiverAtmosphere({ isDark, animTier }: RiverAtmosphereProps) {
  if (animTier < 2) return null;

  return (
    <g>
      {/* Drifting clouds */}
      <DriftingClouds isDark={isDark} />

      {/* Golden glow near Paradise gate */}
      <ParadiseGlow isDark={isDark} />
    </g>
  );
}
