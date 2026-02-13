"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreData {
  score: number;
  label: string;
  trend: "up" | "down" | "stable";
  delta: number;
}

interface DualScoreProps {
  hifdh: ScoreData;
  itqan: ScoreData;
  totalVerses: number;
  matureVerses: number;
  className?: string;
}

function ScoreRing({
  score,
  label,
  title,
  color,
  trend,
  delta,
}: {
  score: number;
  label: string;
  title: string;
  color: string;
  trend: "up" | "down" | "stable";
  delta: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  const trendIcon = trend === "up" ? "^" : trend === "down" ? "v" : "-";
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="128" height="128" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={10}
          />
          {/* Animated progress */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 64 64)"
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{animatedScore}</span>
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{title}</p>
        {delta !== 0 && (
          <p className={cn("text-xs", trendColor)}>
            {trendIcon} {Math.abs(delta)} pts
          </p>
        )}
      </div>
    </div>
  );
}

export function DualScore({
  hifdh,
  itqan,
  totalVerses,
  matureVerses,
  className,
}: DualScoreProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Your Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-8">
          <ScoreRing
            score={hifdh.score}
            label={hifdh.label}
            title="Hifdh"
            color="#059669"
            trend={hifdh.trend}
            delta={hifdh.delta}
          />
          <ScoreRing
            score={itqan.score}
            label={itqan.label}
            title="Itqan"
            color="#0d9488"
            trend={itqan.trend}
            delta={itqan.delta}
          />
        </div>

        <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{totalVerses}</strong> verses
            studied
          </span>
          <span>
            <strong className="text-foreground">{matureVerses}</strong> mature
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
