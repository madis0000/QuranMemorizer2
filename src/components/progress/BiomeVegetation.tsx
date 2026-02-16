/**
 * Reusable SVG micro-components for biome-specific vegetation.
 * All components render at origin — use transform to place them.
 */

// ---- Desert biome ----

export function Cactus({
  color = "#65a30d",
  scale = 1,
}: {
  color?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`}>
      <rect x={-2} y={-20} width={4} height={20} rx={2} fill={color} />
      <rect x={-9} y={-16} width={4} height={10} rx={2} fill={color} />
      <rect x={5} y={-13} width={4} height={8} rx={2} fill={color} />
    </g>
  );
}

export function DuneMound({ color = "#E8C98A" }: { color?: string }) {
  return <ellipse cx={0} cy={0} rx={30} ry={10} fill={color} opacity={0.5} />;
}

// ---- Oasis / Riverside ----

export function PalmTree({
  trunkColor = "#92400e",
  canopyColor = "#22c55e",
  scale = 1,
}: {
  trunkColor?: string;
  canopyColor?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`}>
      <path
        d="M 0 0 Q 1 -10 -1 -22"
        fill="none"
        stroke={trunkColor}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <ellipse
        cx={-1}
        cy={-24}
        rx={12}
        ry={5}
        fill={canopyColor}
        opacity={0.8}
      />
      <ellipse cx={3} cy={-22} rx={8} ry={4} fill={canopyColor} opacity={0.6} />
    </g>
  );
}

export function Reeds({
  color = "#0284c7",
  scale = 1,
}: {
  color?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`} opacity={0.7}>
      <line x1={0} y1={0} x2={-1} y2={-16} stroke={color} strokeWidth={1.5} />
      <line x1={4} y1={0} x2={5} y2={-14} stroke={color} strokeWidth={1.5} />
      <line x1={-3} y1={0} x2={-4} y2={-12} stroke={color} strokeWidth={1.2} />
      <ellipse cx={-1} cy={-17} rx={2} ry={3} fill={color} opacity={0.6} />
      <ellipse cx={5} cy={-15} rx={1.5} ry={2.5} fill={color} opacity={0.5} />
    </g>
  );
}

// ---- Savanna ----

export function GrassTuft({
  colors = ["#84cc16", "#a3e635", "#65a30d"],
  scale = 1,
}: {
  colors?: string[];
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`} opacity={0.6}>
      <line
        x1={0}
        y1={0}
        x2={-3}
        y2={-14}
        stroke={colors[0]}
        strokeWidth={1.5}
      />
      <line
        x1={3}
        y1={0}
        x2={6}
        y2={-12}
        stroke={colors[1]}
        strokeWidth={1.5}
      />
      <line
        x1={-3}
        y1={0}
        x2={-7}
        y2={-11}
        stroke={colors[2]}
        strokeWidth={1.2}
      />
      <line x1={5} y1={0} x2={3} y2={-10} stroke={colors[0]} strokeWidth={1} />
    </g>
  );
}

// ---- Forest ----

export function PineTree({
  trunkColor = "#713f12",
  canopyColor = "#166534",
  scale = 1,
}: {
  trunkColor?: string;
  canopyColor?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`}>
      <rect x={-1.5} y={-6} width={3} height={9} rx={1} fill={trunkColor} />
      <polygon points="0,-24 -9,-6 9,-6" fill={canopyColor} opacity={0.9} />
      <polygon points="0,-20 -7,-8 7,-8" fill={canopyColor} opacity={0.7} />
    </g>
  );
}

// ---- Mountain ----

export function RockFormation({
  color = "#6b7280",
  scale = 1,
}: {
  color?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`} opacity={0.5}>
      <polygon points="0,-12 -8,0 8,0" fill={color} />
      <polygon points="6,-8 0,0 12,0" fill={color} opacity={0.7} />
    </g>
  );
}

export function MountainPeak({
  color = "#6366f1",
  snowColor = "#e0e7ff",
  scale = 1,
}: {
  color?: string;
  snowColor?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`} opacity={0.5}>
      <polygon points="0,-22 -14,0 14,0" fill={color} />
      <polygon points="0,-22 -4,-12 4,-12" fill={snowColor} opacity={0.7} />
    </g>
  );
}

// ---- Highland ----

export function RollingHill({
  color = "#0d9488",
  scale = 1,
}: {
  color?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`} opacity={0.35}>
      <ellipse cx={0} cy={0} rx={20} ry={8} fill={color} />
      <ellipse cx={12} cy={-3} rx={14} ry={6} fill={color} opacity={0.7} />
    </g>
  );
}

// ---- Valley / Garden ----

export function FlowerCluster({
  colors = ["#ec4899", "#f472b6", "#22c55e"],
  scale = 1,
}: {
  colors?: string[];
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`}>
      <line x1={0} y1={-2} x2={0} y2={6} stroke={colors[2]} strokeWidth={1} />
      <line x1={6} y1={-1} x2={6} y2={5} stroke={colors[2]} strokeWidth={1} />
      <circle cx={0} cy={-4} r={3} fill={colors[0]} opacity={0.8} />
      <circle cx={6} cy={-3} r={2.5} fill={colors[1]} opacity={0.7} />
      <circle cx={-4} cy={-2} r={2} fill={colors[0]} opacity={0.6} />
    </g>
  );
}

export function WildflowerPatch({
  colors = ["#ec4899", "#fbbf24", "#a855f7", "#22c55e"],
  scale = 1,
}: {
  colors?: string[];
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`}>
      {/* Stems */}
      <line
        x1={-5}
        y1={0}
        x2={-5}
        y2={-8}
        stroke={colors[3]}
        strokeWidth={0.8}
      />
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={-10}
        stroke={colors[3]}
        strokeWidth={0.8}
      />
      <line x1={5} y1={0} x2={5} y2={-7} stroke={colors[3]} strokeWidth={0.8} />
      <line x1={9} y1={0} x2={9} y2={-9} stroke={colors[3]} strokeWidth={0.8} />
      {/* Flower heads */}
      <circle cx={-5} cy={-9} r={2} fill={colors[0]} opacity={0.8} />
      <circle cx={0} cy={-11} r={2.5} fill={colors[1]} opacity={0.7} />
      <circle cx={5} cy={-8} r={1.8} fill={colors[2]} opacity={0.7} />
      <circle cx={9} cy={-10} r={2} fill={colors[0]} opacity={0.6} />
    </g>
  );
}

export function Hedge({
  color = "#16a34a",
  scale = 1,
}: {
  color?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`}>
      <rect
        x={-12}
        y={-6}
        width={24}
        height={9}
        rx={4.5}
        fill={color}
        opacity={0.5}
      />
      <rect
        x={-8}
        y={-9}
        width={16}
        height={6}
        rx={3}
        fill={color}
        opacity={0.4}
      />
    </g>
  );
}

// ---- Golden / Crystal ----

export function Crystal({
  color = "#fbbf24",
  highlightColor = "#fde68a",
  scale = 1,
}: {
  color?: string;
  highlightColor?: string;
  scale?: number;
}) {
  return (
    <g transform={`scale(${scale})`} opacity={0.6}>
      <polygon points="0,-16 -5,-2 5,-2" fill={color} />
      <polygon points="4,-12 -1,-2 9,-2" fill={highlightColor} opacity={0.5} />
    </g>
  );
}

// ---- Bank-edge vegetation (placed along river banks) ----

export function BankGrass({
  side,
  color = "#4a8c3f",
}: {
  side: "left" | "right";
  color?: string;
}) {
  const dir = side === "left" ? 1 : -1;
  return (
    <g opacity={0.4}>
      <line
        x1={0}
        y1={0}
        x2={dir * 6}
        y2={-8}
        stroke={color}
        strokeWidth={1.2}
      />
      <line
        x1={dir * 3}
        y1={0}
        x2={dir * 8}
        y2={-6}
        stroke={color}
        strokeWidth={1}
      />
      <line
        x1={dir * -2}
        y1={0}
        x2={dir * 3}
        y2={-10}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
}
