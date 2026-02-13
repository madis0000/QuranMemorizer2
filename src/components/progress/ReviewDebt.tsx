"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewDebtProps {
  debtRatio: number; // 0-100
  overdue: {
    total: number;
    critical: number;
    warning: number;
    mild: number;
  };
  totalCards: number;
  className?: string;
}

/**
 * Semicircular pressure gauge showing review debt (overdue / total cards).
 * Green (0-25%) → Yellow (25-50%) → Orange (50-75%) → Red (75-100%).
 */
export function ReviewDebt({
  debtRatio,
  overdue,
  totalCards,
  className,
}: ReviewDebtProps) {
  const clampedRatio = Math.min(100, Math.max(0, debtRatio));

  // Semicircle geometry
  const cx = 120;
  const cy = 100;
  const radius = 80;
  const startAngle = Math.PI; // 180 degrees (left)
  const endAngle = 0; // 0 degrees (right)

  // Arc for the filled portion (sweeps from left to current value)
  const filledAngle = startAngle - (clampedRatio / 100) * Math.PI;
  const filledX = cx + radius * Math.cos(filledAngle);
  const filledY = cy - radius * Math.sin(filledAngle);

  const bgX1 = cx + radius * Math.cos(startAngle);
  const bgY1 = cy - radius * Math.sin(startAngle);
  const bgX2 = cx + radius * Math.cos(endAngle);
  const bgY2 = cy - radius * Math.sin(endAngle);

  const bgPath = `M ${bgX1} ${bgY1} A ${radius} ${radius} 0 1 1 ${bgX2} ${bgY2}`;

  const largeArc = clampedRatio > 50 ? 1 : 0;
  const filledPath = `M ${bgX1} ${bgY1} A ${radius} ${radius} 0 ${largeArc} 1 ${filledX} ${filledY}`;

  // Color gradient based on ratio
  const color =
    clampedRatio < 25
      ? "#059669"
      : clampedRatio < 50
        ? "#FFD700"
        : clampedRatio < 75
          ? "#f97316"
          : "#ef4444";

  const label =
    clampedRatio < 25
      ? "Healthy"
      : clampedRatio < 50
        ? "Building Up"
        : clampedRatio < 75
          ? "High"
          : "Critical";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Review Debt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 240 120"
            className="w-full max-w-[240px] h-auto"
            role="img"
            aria-label={`Review debt gauge: ${clampedRatio}%`}
          >
            {/* Background arc */}
            <path
              d={bgPath}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={16}
              strokeLinecap="round"
            />

            {/* Filled arc */}
            {clampedRatio > 0 && (
              <path
                d={filledPath}
                fill="none"
                stroke={color}
                strokeWidth={16}
                strokeLinecap="round"
              />
            )}

            {/* Center text */}
            <text
              x={cx}
              y={cy - 15}
              textAnchor="middle"
              className="fill-foreground"
              fontSize={28}
              fontWeight="700"
            >
              {clampedRatio}%
            </text>
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontSize={11}
              fill={color}
              fontWeight="500"
            >
              {label}
            </text>
          </svg>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-3 w-full mt-2 text-center">
            {overdue.critical > 0 && (
              <div>
                <p className="text-lg font-bold text-red-500">
                  {overdue.critical}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Critical (30d+)
                </p>
              </div>
            )}
            {overdue.warning > 0 && (
              <div>
                <p className="text-lg font-bold text-orange-500">
                  {overdue.warning}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Warning (7-29d)
                </p>
              </div>
            )}
            {overdue.mild > 0 && (
              <div>
                <p className="text-lg font-bold text-yellow-500">
                  {overdue.mild}
                </p>
                <p className="text-[10px] text-muted-foreground">Mild (1-6d)</p>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            {overdue.total} overdue of {totalCards} total cards
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
