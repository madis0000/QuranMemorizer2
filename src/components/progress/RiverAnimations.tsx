"use client";

import { useMemo } from "react";

import {
  getRiverCenterXAtY,
  RIVER_PADDING_BOTTOM,
  RIVER_PADDING_TOP,
  seededRandom,
  SVG_HEIGHT,
  type AnimationTier,
  type NodePosition,
} from "./river-utils";

// ============================================================
// Floating particles (sparkles on water surface)
// ============================================================

function FloatingParticles({
  count,
  isDark,
}: {
  count: number;
  isDark?: boolean;
}) {
  const particles = useMemo(() => {
    const yMin = RIVER_PADDING_TOP;
    const yMax = SVG_HEIGHT - RIVER_PADDING_BOTTOM;

    return Array.from({ length: count }, (_, i) => {
      const seed = i * 17 + 3;
      const y = yMin + seededRandom(seed) * (yMax - yMin);
      const cx = getRiverCenterXAtY(y);
      const offsetX = (seededRandom(seed + 1) - 0.5) * 50;
      return {
        x: cx + offsetX,
        y,
        r: 1 + seededRandom(seed + 2) * 1.5,
        dur: 2 + seededRandom(seed + 3) * 3,
        delay: seededRandom(seed + 4) * 4,
        drift: (seededRandom(seed + 5) - 0.5) * 10,
      };
    });
  }, [count]);

  const color = isDark ? "#67e8f9" : "#ffffff";

  return (
    <g>
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={color} opacity={0}>
          <animate
            attributeName="opacity"
            values="0;0.6;0"
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${p.y};${p.y - 8};${p.y}`}
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cx"
            values={`${p.x};${p.x + p.drift};${p.x}`}
            dur={`${p.dur + 1}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

// ============================================================
// Falling leaves (forest biomes only, tier 3+)
// ============================================================

function FallingLeaves({ count, isDark }: { count: number; isDark?: boolean }) {
  const leaves = useMemo(() => {
    // Forest biomes roughly juz 10-13, map to Y range ~ 6600-8400
    const yMin = 6000;
    const yMax = 9000;

    return Array.from({ length: count }, (_, i) => {
      const seed = i * 23 + 7;
      const startX = 100 + seededRandom(seed) * 1000;
      const startY = yMin + seededRandom(seed + 1) * (yMax - yMin);
      return {
        startX,
        startY,
        dur: 6 + seededRandom(seed + 2) * 6,
        delay: seededRandom(seed + 3) * 8,
        driftX: (seededRandom(seed + 4) - 0.5) * 60,
        size: 2 + seededRandom(seed + 5) * 2,
      };
    });
  }, [count]);

  const color = isDark ? "#166534" : "#22c55e";

  return (
    <g opacity={0.4}>
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.startX}
          cy={l.startY}
          rx={l.size}
          ry={l.size * 0.6}
          fill={color}
          opacity={0}
        >
          <animate
            attributeName="opacity"
            values="0;0.5;0.3;0"
            dur={`${l.dur}s`}
            begin={`${l.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${l.startY};${l.startY + 80}`}
            dur={`${l.dur}s`}
            begin={`${l.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cx"
            values={`${l.startX};${l.startX + l.driftX}`}
            dur={`${l.dur}s`}
            begin={`${l.delay}s`}
            repeatCount="indefinite"
          />
        </ellipse>
      ))}
    </g>
  );
}

// ============================================================
// Main animations component
// ============================================================

interface RiverAnimationsProps {
  positions: NodePosition[];
  isDark?: boolean;
  animTier: AnimationTier;
}

export function RiverAnimations({ isDark, animTier }: RiverAnimationsProps) {
  if (animTier < 2) return null;

  const particleCount = animTier >= 4 ? 50 : animTier >= 3 ? 30 : 15;
  const leafCount = animTier >= 4 ? 12 : animTier >= 3 ? 6 : 0;

  return (
    <g>
      {/* Water surface particles */}
      <FloatingParticles count={particleCount} isDark={isDark} />

      {/* Falling leaves in forest zones (tier 3+) */}
      {leafCount > 0 && <FallingLeaves count={leafCount} isDark={isDark} />}

      {/* Animated water turbulence filter (tier 4 only) */}
      {animTier >= 4 && (
        <defs>
          <filter
            id="river-flow-anim"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.003"
              numOctaves={2}
              seed={42}
              result="flowNoise"
            >
              <animate
                attributeName="seed"
                values="42;84;42"
                dur="8s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feSpecularLighting
              surfaceScale={2}
              specularConstant={0.5}
              specularExponent={20}
              in="flowNoise"
              result="specular"
            >
              <fePointLight x={600} y={-200} z={300} />
            </feSpecularLighting>
            <feComposite
              in="SourceGraphic"
              in2="specular"
              operator="arithmetic"
              k1={0}
              k2={1}
              k3={0.3}
              k4={0}
            />
          </filter>
        </defs>
      )}
    </g>
  );
}
