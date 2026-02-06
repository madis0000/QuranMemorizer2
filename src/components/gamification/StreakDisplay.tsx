"use client";

import { Calendar, Flame, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  isAtRisk?: boolean;
  className?: string;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  totalDaysActive,
  isAtRisk = false,
  className,
}: StreakDisplayProps) {
  return (
    <Card className={className}>
      <CardContent className="py-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Current Streak */}
          <div className="flex flex-col items-center">
            <Flame
              className={cn(
                "mb-1 h-8 w-8",
                currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"
              )}
            />
            <span className="text-2xl font-bold">{currentStreak}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
            {isAtRisk && currentStreak > 0 && (
              <span className="mt-1 text-[10px] font-medium text-orange-500">
                Don&apos;t lose it!
              </span>
            )}
          </div>

          {/* Longest Streak */}
          <div className="flex flex-col items-center">
            <Trophy className="mb-1 h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold">{longestStreak}</span>
            <span className="text-xs text-muted-foreground">Best Streak</span>
          </div>

          {/* Total Days */}
          <div className="flex flex-col items-center">
            <Calendar className="mb-1 h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{totalDaysActive}</span>
            <span className="text-xs text-muted-foreground">Total Days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
