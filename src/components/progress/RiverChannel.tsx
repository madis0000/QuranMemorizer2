"use client";

import { useMemo } from "react";

import {
  computeBankStrokePath,
  computeRiverCenterPath,
  computeRiverFillPath,
  RIVER_COLORS,
  RIVER_COLORS_DARK,
  type AnimationTier,
  type NodePosition,
} from "./river-utils";

interface RiverChannelProps {
  positions: NodePosition[];
  isDark?: boolean;
  animTier: AnimationTier;
}

export function RiverChannel({
  positions,
  isDark,
  animTier,
}: RiverChannelProps) {
  const nodeYs = useMemo(() => positions.map((p) => p.y), [positions]);

  const fillPath = useMemo(() => computeRiverFillPath(positions), [positions]);

  const centerPath = useMemo(() => computeRiverCenterPath(), []);
  const leftBankPath = useMemo(
    () => computeBankStrokePath("left", nodeYs),
    [nodeYs]
  );
  const rightBankPath = useMemo(
    () => computeBankStrokePath("right", nodeYs),
    [nodeYs]
  );

  const colors = isDark ? RIVER_COLORS_DARK : RIVER_COLORS;

  return (
    <g>
      {/* ----- Defs for river gradients & filters ----- */}
      <defs>
        {/* Cross-axis water gradient */}
        <linearGradient id="river-water-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.deep} stopOpacity={0.9} />
          <stop offset="30%" stopColor={colors.mid} stopOpacity={0.85} />
          <stop offset="70%" stopColor={colors.mid} stopOpacity={0.85} />
          <stop offset="100%" stopColor={colors.deep} stopOpacity={0.9} />
        </linearGradient>

        {/* Shimmer highlight gradient */}
        <linearGradient id="river-shimmer-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.shimmer} stopOpacity={0} />
          <stop offset="20%" stopColor={colors.shimmer} stopOpacity={0.4} />
          <stop offset="50%" stopColor={colors.shimmer} stopOpacity={0.6} />
          <stop offset="80%" stopColor={colors.shimmer} stopOpacity={0.4} />
          <stop offset="100%" stopColor={colors.shimmer} stopOpacity={0} />
        </linearGradient>

        {/* Soft blur for bed shadow */}
        <filter id="river-bed-blur">
          <feGaussianBlur stdDeviation="4" />
        </filter>

        {/* Water texture — only for tier 3+ */}
        {animTier >= 3 && (
          <filter id="river-texture" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.003"
              numOctaves={2}
              seed={42}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={4}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        )}
      </defs>

      {/* Layer 1: Bed shadow (dark, blurred path under water) */}
      <path
        d={fillPath}
        fill={isDark ? "#0a2a3a" : "#0e4a5a"}
        opacity={0.3}
        filter="url(#river-bed-blur)"
        transform="translate(3, 3)"
      />

      {/* Layer 2: Water fill */}
      <path
        d={fillPath}
        fill="url(#river-water-grad)"
        filter={animTier >= 3 ? "url(#river-texture)" : undefined}
      />

      {/* Layer 3: Left bank edge (earthy/grassy) */}
      <path
        d={leftBankPath}
        fill="none"
        stroke={isDark ? colors.bank : colors.bankGrass}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* Layer 4: Right bank edge */}
      <path
        d={rightBankPath}
        fill="none"
        stroke={isDark ? colors.bank : colors.bankRich}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* Layer 5: Shimmer highlight (bright center stroke) */}
      <path
        d={centerPath}
        fill="none"
        stroke="url(#river-shimmer-grad)"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={animTier >= 2 ? 0.5 : 0.3}
      >
        {animTier >= 2 && (
          <animate
            attributeName="opacity"
            values="0.3;0.6;0.3"
            dur="4s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Layer 6: Ripple lines */}
      <path
        d={centerPath}
        fill="none"
        stroke={colors.shallow}
        strokeWidth={1.5}
        strokeDasharray="12 20"
        strokeLinecap="round"
        opacity={0.35}
      >
        {animTier >= 2 && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-64"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Secondary ripple (offset) */}
      <path
        d={centerPath}
        fill="none"
        stroke={colors.shimmer}
        strokeWidth={1}
        strokeDasharray="8 28"
        strokeLinecap="round"
        opacity={0.2}
        transform="translate(-8, 0)"
      >
        {animTier >= 2 && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-72"
            dur="5s"
            repeatCount="indefinite"
          />
        )}
      </path>
    </g>
  );
}
