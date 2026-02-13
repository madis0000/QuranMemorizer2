"use client";

import { Flame, Shield, Star } from "lucide-react";

import { getXPProgress } from "@/lib/gamification/xp";
import { cn } from "@/lib/utils";
import { useGamificationStore, type League } from "@/stores/gamificationStore";
import { useUserStore } from "@/stores/userStore";

const LEAGUE_CONFIG: Record<
  League,
  { label: string; abbr: string; color: string }
> = {
  talib: { label: "Talib", abbr: "Tlb", color: "#CD7F32" },
  qari: { label: "Qari", abbr: "Qri", color: "#C0C0C0" },
  hafiz: { label: "Hafiz", abbr: "Hfz", color: "#FFD700" },
  sheikh: { label: "Sheikh", abbr: "Shk", color: "#50C878" },
  imam: { label: "Imam", abbr: "Imm", color: "#00B8D4" },
};

export function GamificationStrip({ compact = false }: { compact?: boolean }) {
  const streak = useUserStore((s) => s.streak);
  const totalXP = useGamificationStore((s) => s.totalXP);
  const currentLeague = useGamificationStore((s) => s.currentLeague);
  const xpProgress = getXPProgress(totalXP);
  const league = LEAGUE_CONFIG[currentLeague];

  return (
    <div className={cn("flex items-center", compact ? "gap-2" : "gap-3")}>
      {/* Streak */}
      <div
        className="flex items-center gap-1"
        title={`${streak.currentStreak} day streak`}
      >
        <Flame
          className={cn(
            "h-4 w-4",
            streak.currentStreak > 0
              ? "text-[#FFD700] animate-streak-flame"
              : "text-muted-foreground"
          )}
          style={
            streak.currentStreak > 0
              ? { filter: "drop-shadow(0 0 4px rgba(255,215,0,0.5))" }
              : undefined
          }
        />
        <span className="text-xs font-semibold tabular-nums">
          {streak.currentStreak}
        </span>
        {!compact && (
          <span className="text-[10px] text-muted-foreground hidden xl:inline">
            day
          </span>
        )}
      </div>

      <div className="h-3 w-px bg-border" />

      {/* XP Level */}
      <div
        className="flex items-center gap-1.5"
        title={`Level ${xpProgress.level} — ${xpProgress.currentXP}/${xpProgress.nextLevelXP} XP`}
      >
        <Star className="h-3.5 w-3.5 text-[#059669] dark:text-[#00E5A0] fill-[#059669] dark:fill-[#00E5A0]" />
        <span className="text-xs font-semibold">Lvl {xpProgress.level}</span>
        {!compact && (
          <div className="relative h-1.5 w-10 rounded-full bg-[#D1E0D8] dark:bg-[#00E5A0]/10 overflow-hidden hidden sm:block">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#059669] to-[#047857] dark:from-[#00E5A0] dark:to-[#00E5A0]/70 transition-all duration-500 xp-bar"
              style={{ width: `${xpProgress.progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="h-3 w-px bg-border" />

      {/* League */}
      <div className="flex items-center gap-1" title={`${league.label} League`}>
        <Shield className="h-3.5 w-3.5" style={{ color: league.color }} />
        <span className="text-xs font-semibold" style={{ color: league.color }}>
          {compact ? league.abbr : league.label}
        </span>
      </div>
    </div>
  );
}
