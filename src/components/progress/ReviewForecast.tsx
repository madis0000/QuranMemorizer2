"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForecastDay {
  date: string;
  count: number;
  isToday: boolean;
}

interface ReviewForecastProps {
  forecast: ForecastDay[];
  dailyAverage: number;
  className?: string;
}

const CHART_HEIGHT = 160;
const CHART_PADDING = { top: 15, right: 10, bottom: 25, left: 35 };

export function ReviewForecast({
  forecast,
  dailyAverage,
  className,
}: ReviewForecastProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (forecast.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Review Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] flex items-center justify-center text-muted-foreground text-sm">
            No FSRS cards yet. Start memorizing to see your forecast.
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...forecast.map((d) => d.count), 1);
  const innerWidth = 360 - CHART_PADDING.left - CHART_PADDING.right;
  const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const barWidth = innerWidth / forecast.length - 1;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Review Forecast</span>
          <span className="text-sm font-normal text-muted-foreground">
            ~{dailyAverage}/day avg
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 360 ${CHART_HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="30-day review forecast"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = CHART_PADDING.top + innerHeight * (1 - frac);
            const val = Math.round(maxCount * frac);
            return (
              <g key={frac}>
                <line
                  x1={CHART_PADDING.left}
                  y1={y}
                  x2={CHART_PADDING.left + innerWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeDasharray="3 3"
                />
                <text
                  x={CHART_PADDING.left - 5}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize={8}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Daily average line */}
          {dailyAverage > 0 && (
            <line
              x1={CHART_PADDING.left}
              y1={
                CHART_PADDING.top + innerHeight * (1 - dailyAverage / maxCount)
              }
              x2={CHART_PADDING.left + innerWidth}
              y2={
                CHART_PADDING.top + innerHeight * (1 - dailyAverage / maxCount)
              }
              stroke="#059669"
              strokeOpacity={0.5}
              strokeDasharray="4 2"
              strokeWidth={1}
            />
          )}

          {/* Bars */}
          {forecast.map((day, i) => {
            const x =
              CHART_PADDING.left + i * (innerWidth / forecast.length) + 0.5;
            const barHeight = (day.count / maxCount) * innerHeight;
            const y = CHART_PADDING.top + innerHeight - barHeight;

            const isHovered = hoveredIndex === i;
            const color = day.isToday
              ? "#FFD700"
              : day.count > dailyAverage * 1.5
                ? "#ef4444"
                : "#059669";

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 1)}
                  rx={1}
                  fill={color}
                  opacity={isHovered ? 1 : 0.7}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {isHovered && (
                  <g>
                    <rect
                      x={Math.min(x - 25, 360 - 60)}
                      y={y - 22}
                      width={55}
                      height={18}
                      rx={3}
                      className="fill-foreground"
                      opacity={0.9}
                    />
                    <text
                      x={Math.min(x + barWidth / 2, 360 - 32)}
                      y={y - 9}
                      textAnchor="middle"
                      className="fill-background"
                      fontSize={9}
                      fontWeight="500"
                    >
                      {day.count} reviews
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* X-axis labels (every 7 days) */}
          {forecast
            .filter((_, i) => i % 7 === 0 || i === forecast.length - 1)
            .map((day, idx) => {
              const originalIdx = forecast.indexOf(day);
              const x =
                CHART_PADDING.left +
                originalIdx * (innerWidth / forecast.length) +
                barWidth / 2;
              const label = new Date(day.date).toLocaleDateString("default", {
                month: "short",
                day: "numeric",
              });
              return (
                <text
                  key={idx}
                  x={x}
                  y={CHART_PADDING.top + innerHeight + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize={8}
                >
                  {label}
                </text>
              );
            })}
        </svg>
      </CardContent>
    </Card>
  );
}
