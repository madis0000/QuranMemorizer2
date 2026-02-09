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
    "border-[#FFD700]/30 bg-[#FFD700]/5 dark:border-[#FFD700]/30 dark:bg-[#FFD700]/5",
  MEMORIZATION:
    "border-[#0d9488]/30 bg-[#0d9488]/5 dark:border-[#2dd4bf]/30 dark:bg-[#2dd4bf]/5",
  CONSISTENCY:
    "border-[#059669]/30 bg-[#059669]/5 dark:border-[#00E5A0]/30 dark:bg-[#00E5A0]/5",
  MILESTONE:
    "border-[#065f46]/30 bg-[#065f46]/5 dark:border-[#34d399]/30 dark:bg-[#34d399]/5",
  SPECIAL:
    "border-[#B8860B]/30 bg-[#FFD700]/5 dark:border-[#FFD700]/30 dark:bg-[#FFD700]/5",
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
          <Trophy className="h-5 w-5 text-[#059669] dark:text-[#00E5A0]" />
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
                    isEarned
                      ? "text-[#059669] dark:text-[#00E5A0]"
                      : "text-muted-foreground"
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
