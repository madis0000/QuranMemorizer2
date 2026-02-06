"use client";

import {
  Award,
  BookOpen,
  Crown,
  Flame,
  Footprints,
  GraduationCap,
  Heart,
  Languages,
  Moon,
  Shield,
  Star,
  Sunrise,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Badge {
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt?: string;
}

interface BadgeSystemProps {
  badges: Badge[];
  earnedCodes: string[];
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  footprints: Footprints,
  flame: Flame,
  crown: Crown,
  trophy: Trophy,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  star: Star,
  moon: Moon,
  sunrise: Sunrise,
  zap: Zap,
  heart: Heart,
  shield: Shield,
  timer: Timer,
  languages: Languages,
  award: Award,
};

const categoryColors: Record<string, string> = {
  STREAK:
    "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20",
  MEMORIZATION:
    "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20",
  CONSISTENCY:
    "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20",
  MILESTONE:
    "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20",
  SPECIAL:
    "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20",
};

export function BadgeSystem({
  badges,
  earnedCodes,
  className,
}: BadgeSystemProps) {
  const earnedSet = new Set(earnedCodes);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {badges.map((badge) => {
            const isEarned = earnedSet.has(badge.code);
            const Icon = iconMap[badge.icon] ?? Trophy;

            return (
              <div
                key={badge.code}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all",
                  isEarned
                    ? (categoryColors[badge.category] ?? "border-border")
                    : "border-border bg-muted/30 opacity-40 grayscale"
                )}
                title={
                  isEarned
                    ? `${badge.name}: ${badge.description}`
                    : `Locked: ${badge.description}`
                }
              >
                <Icon
                  className={cn(
                    "h-8 w-8",
                    isEarned ? "text-yellow-500" : "text-muted-foreground"
                  )}
                />
                <span className="text-xs font-medium leading-tight">
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {earnedCodes.length} of {badges.length} badges earned
        </div>
      </CardContent>
    </Card>
  );
}
