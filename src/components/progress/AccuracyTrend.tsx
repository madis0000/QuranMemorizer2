"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SessionPoint {
  id: string;
  date: string;
  accuracy: number;
  surahNumber: number;
  mode: string;
}

interface AccuracyTrendProps {
  sessions: SessionPoint[];
  maxPoints?: number;
  className?: string;
}

const CHART_HEIGHT = 200;
const CHART_PADDING = { top: 20, right: 20, bottom: 30, left: 40 };

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}

/**
 * Interpolate between red (low accuracy) and green (high accuracy)
 */
function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return "#22c55e"; // green-500
  if (accuracy >= 70) return "#84cc16"; // lime-500
  if (accuracy >= 50) return "#eab308"; // yellow-500
  if (accuracy >= 30) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

export function AccuracyTrend({
  sessions,
  maxPoints = 30,
  className,
}: AccuracyTrendProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Take the most recent N sessions sorted by date ascending
  const points = useMemo(() => {
    const sorted = [...sessions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-maxPoints);
    return sorted;
  }, [sessions, maxPoints]);

  if (points.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Accuracy Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            No session data yet. Start practicing to see your trend.
          </div>
        </CardContent>
      </Card>
    );
  }

  const innerWidth = 300 - CHART_PADDING.left - CHART_PADDING.right;
  const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  // Compute positions
  const xStep =
    points.length > 1 ? innerWidth / (points.length - 1) : innerWidth / 2;
  const pointPositions = points.map((point, i) => ({
    x: CHART_PADDING.left + (points.length > 1 ? i * xStep : innerWidth / 2),
    y: CHART_PADDING.top + innerHeight - (point.accuracy / 100) * innerHeight,
    ...point,
  }));

  // Build SVG path
  const pathD = pointPositions
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Build gradient area path
  const areaD =
    pathD +
    ` L ${pointPositions[pointPositions.length - 1].x} ${CHART_PADDING.top + innerHeight}` +
    ` L ${pointPositions[0].x} ${CHART_PADDING.top + innerHeight} Z`;

  // Y-axis labels
  const yLabels = [0, 25, 50, 75, 100];

  // X-axis labels (show a few)
  const xLabelIndices: number[] = [];
  if (points.length <= 5) {
    for (let i = 0; i < points.length; i++) xLabelIndices.push(i);
  } else {
    xLabelIndices.push(0);
    xLabelIndices.push(Math.floor(points.length / 2));
    xLabelIndices.push(points.length - 1);
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Accuracy Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 300 ${CHART_HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="Accuracy trend chart"
        >
          {/* Grid lines */}
          {yLabels.map((val) => {
            const y =
              CHART_PADDING.top + innerHeight - (val / 100) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={CHART_PADDING.left}
                  y1={y}
                  x2={CHART_PADDING.left + innerWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeDasharray="4 4"
                />
                <text
                  x={CHART_PADDING.left - 5}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize={9}
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Gradient area fill */}
          <defs>
            <linearGradient id="accuracy-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#accuracy-gradient)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {pointPositions.map((point, i) => (
            <g key={point.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === i ? 5 : 3}
                fill={getAccuracyColor(point.accuracy)}
                stroke="white"
                strokeWidth={1.5}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Tooltip */}
              {hoveredIndex === i && (
                <g>
                  <rect
                    x={Math.min(point.x - 45, 300 - 95)}
                    y={point.y - 35}
                    width={90}
                    height={26}
                    rx={4}
                    className="fill-foreground"
                    opacity={0.9}
                  />
                  <text
                    x={Math.min(point.x, 300 - 50)}
                    y={point.y - 18}
                    textAnchor="middle"
                    className="fill-background"
                    fontSize={10}
                    fontWeight="500"
                  >
                    {Math.round(point.accuracy)}% -{" "}
                    {formatShortDate(point.date)}
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {xLabelIndices.map((idx) => {
            const p = pointPositions[idx];
            if (!p) return null;
            return (
              <text
                key={idx}
                x={p.x}
                y={CHART_PADDING.top + innerHeight + 15}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={9}
              >
                {formatShortDate(p.date)}
              </text>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}
