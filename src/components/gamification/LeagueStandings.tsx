"use client";

import {
  BookOpen,
  Brain,
  Crown,
  GraduationCap,
  Mic,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LeagueStandingsProps {
  currentLeague: string;
  weeklyXP: number;
  rank?: number;
  className?: string;
}

const LEAGUES = {
  talib: {
    name: "Talib",
    arabicName: "طالب",
    subtitle: "Student",
    bgGradient: "from-[#059669] to-[#047857]",
    icon: BookOpen,
    minXP: 0,
    maxXP: 1000,
  },
  qari: {
    name: "Qari",
    arabicName: "قارئ",
    subtitle: "Reciter",
    bgGradient: "from-[#0d9488] to-[#0f766e]",
    icon: Mic,
    minXP: 1000,
    maxXP: 3000,
  },
  hafiz: {
    name: "Hafiz",
    arabicName: "حافظ",
    subtitle: "Memorizer",
    bgGradient: "from-[#065f46] to-[#064e3b]",
    icon: Brain,
    minXP: 3000,
    maxXP: 7000,
  },
  sheikh: {
    name: "Sheikh",
    arabicName: "شيخ",
    subtitle: "Scholar",
    bgGradient: "from-[#B8860B] to-[#8B6914]",
    icon: GraduationCap,
    minXP: 7000,
    maxXP: 15000,
  },
  imam: {
    name: "Imam",
    arabicName: "إمام",
    subtitle: "Leader",
    bgGradient: "from-[#FFD700] to-[#B8860B]",
    icon: Crown,
    minXP: 15000,
    maxXP: Infinity,
  },
} as const;

export function LeagueStandings({
  currentLeague,
  weeklyXP,
  rank,
  className,
}: LeagueStandingsProps) {
  const league =
    LEAGUES[currentLeague as keyof typeof LEAGUES] || LEAGUES.talib;
  const Icon = league.icon;

  // Calculate progress within current league
  const leagueProgress =
    league.maxXP === Infinity
      ? 100
      : Math.min(
          ((weeklyXP - league.minXP) / (league.maxXP - league.minXP)) * 100,
          100
        );

  // Determine promotion/demotion zone
  const isPromotionZone = rank && rank <= 10;
  const isDemotionZone = rank && rank >= 46; // Assuming 50 players per league

  return (
    <div className={cn("space-y-4", className)}>
      {/* League Badge */}
      <div className="relative">
        <div
          className={cn(
            "bg-gradient-to-br rounded-2xl p-6 shadow-xl",
            league.bgGradient
          )}
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <Icon className="w-10 h-10 text-white" />
            </div>

            {/* League Info */}
            <div className="flex-1 text-white">
              <div className="text-3xl font-bold mb-1" dir="rtl">
                {league.arabicName}
              </div>
              <div className="text-lg font-semibold opacity-90">
                {league.name} League
              </div>
              <div className="text-sm opacity-75">{league.subtitle}</div>
            </div>

            {/* Rank Badge */}
            {rank && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
                <div className="text-xs font-semibold opacity-75 uppercase tracking-wide">
                  Rank
                </div>
                <div className="text-3xl font-bold mt-1">{rank}</div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-white/30 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-white/30 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-white/30 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-white/30 rounded-br-lg" />
      </div>

      {/* Weekly XP Progress */}
      <div className="bg-white dark:bg-[#0F1A14] rounded-xl p-4 shadow-md border border-[#D1E0D8] dark:border-[#00E5A0]/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Weekly XP
          </span>
          <span className="text-lg font-bold text-foreground">
            {weeklyXP.toLocaleString()} XP
          </span>
        </div>

        {league.maxXP !== Infinity && (
          <>
            <Progress value={leagueProgress} className="h-2 mb-2" />
            <div className="text-xs text-muted-foreground text-right">
              {(league.maxXP - weeklyXP).toLocaleString()} XP to next league
            </div>
          </>
        )}
      </div>

      {/* Promotion/Demotion Zone Indicator */}
      {rank && (
        <div className="bg-white dark:bg-[#0F1A14] rounded-xl p-4 shadow-md border border-[#D1E0D8] dark:border-[#00E5A0]/10">
          <div className="text-sm font-semibold text-foreground mb-3">
            Weekly Standing
          </div>

          {isPromotionZone && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="bg-green-500 rounded-full p-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Promotion Zone
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Top 10 advance to next league
                </div>
              </div>
            </div>
          )}

          {isDemotionZone && (
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="bg-red-500 rounded-full p-2">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                  Demotion Zone
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">
                  Bottom 5 move to previous league
                </div>
              </div>
            </div>
          )}

          {!isPromotionZone && !isDemotionZone && (
            <div className="flex items-center gap-3 p-3 bg-[#059669]/5 dark:bg-[#00E5A0]/5 rounded-lg border border-[#D1E0D8] dark:border-[#00E5A0]/10">
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  Safe Zone
                </div>
                <div className="text-xs text-muted-foreground">
                  Keep earning XP to climb the ranks
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* League Tiers */}
      <div className="bg-white dark:bg-[#0F1A14] rounded-xl p-4 shadow-md border border-[#D1E0D8] dark:border-[#00E5A0]/10">
        <div className="text-sm font-semibold text-foreground mb-3">
          All Leagues
        </div>
        <div className="space-y-2">
          {Object.entries(LEAGUES)
            .reverse()
            .map(([key, leagueData]) => {
              const LeagueIcon = leagueData.icon;
              const isCurrent = key === currentLeague;

              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-all",
                    isCurrent
                      ? "bg-[#059669]/5 dark:bg-[#00E5A0]/5 ring-2 ring-offset-2 ring-[#059669]/30 dark:ring-[#00E5A0]/30"
                      : "opacity-50 hover:opacity-75"
                  )}
                >
                  <div
                    className={cn(
                      "bg-gradient-to-br rounded-lg p-2",
                      leagueData.bgGradient
                    )}
                  >
                    <LeagueIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">
                      {leagueData.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {leagueData.subtitle}
                    </div>
                  </div>
                  {isCurrent && (
                    <div className="text-xs font-semibold text-[#059669] dark:text-[#00E5A0] bg-[#059669]/10 dark:bg-[#00E5A0]/10 px-2 py-1 rounded">
                      Current
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
