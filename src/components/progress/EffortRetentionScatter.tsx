"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScatterPoint {
  verseKey: string;
  x: number;
  y: number;
  surahNumber: number;
  ayahNumber: number;
  quadrant: "easy_win" | "well_earned" | "stubborn" | "at_risk";
  totalReviews: number;
}

interface EffortRetentionScatterProps {
  data: ScatterPoint[];
  className?: string;
}

const CHART_SIZE = 300;
const PADDING = { top: 20, right: 20, bottom: 35, left: 45 };

const QUADRANT_COLORS = {
  easy_win: "#059669",
  well_earned: "#0d9488",
  stubborn: "#ef4444",
  at_risk: "#f97316",
};

const QUADRANT_LABELS = {
  easy_win: "Easy Wins",
  well_earned: "Well Earned",
  stubborn: "Stubborn",
  at_risk: "At Risk",
};

export function EffortRetentionScatter({
  data,
  className,
}: EffortRetentionScatterProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  const quadrantCounts = useMemo(() => {
    const counts = { easy_win: 0, well_earned: 0, stubborn: 0, at_risk: 0 };
    for (const p of data) counts[p.quadrant]++;
    return counts;
  }, [data]);

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Effort vs Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            No verse data yet. Review some verses to see the scatter plot.
          </div>
        </CardContent>
      </Card>
    );
  }

  const innerW = CHART_SIZE - PADDING.left - PADDING.right;
  const innerH = CHART_SIZE - PADDING.top - PADDING.bottom;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Effort vs Retention</CardTitle>
        {/* Quadrant summary */}
        <div className="flex flex-wrap gap-3 mt-1">
          {(
            Object.keys(QUADRANT_LABELS) as Array<keyof typeof QUADRANT_LABELS>
          ).map((q) => (
            <div key={q} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: QUADRANT_COLORS[q] }}
              />
              <span className="text-[10px] text-muted-foreground">
                {QUADRANT_LABELS[q]} ({quadrantCounts[q]})
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          className="w-full h-auto"
          role="img"
          aria-label="Effort vs retention scatter plot"
        >
          {/* Quadrant backgrounds */}
          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={innerW / 2}
            height={innerH / 2}
            fill="#059669"
            opacity={0.03}
          />
          <rect
            x={PADDING.left + innerW / 2}
            y={PADDING.top}
            width={innerW / 2}
            height={innerH / 2}
            fill="#0d9488"
            opacity={0.03}
          />
          <rect
            x={PADDING.left}
            y={PADDING.top + innerH / 2}
            width={innerW / 2}
            height={innerH / 2}
            fill="#f97316"
            opacity={0.03}
          />
          <rect
            x={PADDING.left + innerW / 2}
            y={PADDING.top + innerH / 2}
            width={innerW / 2}
            height={innerH / 2}
            fill="#ef4444"
            opacity={0.03}
          />

          {/* Quadrant labels */}
          <text
            x={PADDING.left + 5}
            y={PADDING.top + 12}
            className="fill-muted-foreground"
            fontSize={8}
            opacity={0.5}
          >
            Easy Wins
          </text>
          <text
            x={PADDING.left + innerW - 5}
            y={PADDING.top + 12}
            textAnchor="end"
            className="fill-muted-foreground"
            fontSize={8}
            opacity={0.5}
          >
            Well Earned
          </text>
          <text
            x={PADDING.left + 5}
            y={PADDING.top + innerH - 5}
            className="fill-muted-foreground"
            fontSize={8}
            opacity={0.5}
          >
            At Risk
          </text>
          <text
            x={PADDING.left + innerW - 5}
            y={PADDING.top + innerH - 5}
            textAnchor="end"
            className="fill-muted-foreground"
            fontSize={8}
            opacity={0.5}
          >
            Stubborn
          </text>

          {/* Crosshair lines */}
          <line
            x1={PADDING.left + innerW / 2}
            y1={PADDING.top}
            x2={PADDING.left + innerW / 2}
            y2={PADDING.top + innerH}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeDasharray="3 3"
          />
          <line
            x1={PADDING.left}
            y1={PADDING.top + innerH / 2}
            x2={PADDING.left + innerW}
            y2={PADDING.top + innerH / 2}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeDasharray="3 3"
          />

          {/* Data points */}
          {data.map((point) => {
            const cx = PADDING.left + (point.x / 100) * innerW;
            const cy = PADDING.top + innerH - (point.y / 100) * innerH;
            const isHovered = hoveredPoint?.verseKey === point.verseKey;

            return (
              <g key={point.verseKey}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3}
                  fill={QUADRANT_COLORS[point.quadrant]}
                  opacity={isHovered ? 1 : 0.6}
                  stroke="white"
                  strokeWidth={isHovered ? 1.5 : 0}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {isHovered && (
                  <g>
                    <rect
                      x={Math.min(cx - 40, CHART_SIZE - 85)}
                      y={cy - 28}
                      width={80}
                      height={22}
                      rx={4}
                      className="fill-foreground"
                      opacity={0.9}
                    />
                    <text
                      x={Math.min(cx, CHART_SIZE - 45)}
                      y={cy - 13}
                      textAnchor="middle"
                      className="fill-background"
                      fontSize={9}
                      fontWeight="500"
                    >
                      {point.verseKey} ({point.y}%)
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Axes labels */}
          <text
            x={PADDING.left + innerW / 2}
            y={CHART_SIZE - 5}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={10}
          >
            Effort
          </text>
          <text
            x={12}
            y={PADDING.top + innerH / 2}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={10}
            transform={`rotate(-90, 12, ${PADDING.top + innerH / 2})`}
          >
            Retention
          </text>
        </svg>

        {/* Actionable tip */}
        {quadrantCounts.stubborn > 0 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {quadrantCounts.stubborn} stubborn verse
            {quadrantCounts.stubborn > 1 ? "s" : ""} need a different approach.{" "}
            <Link
              href="/memorize"
              className="text-primary underline underline-offset-2"
            >
              Try listening mode
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
