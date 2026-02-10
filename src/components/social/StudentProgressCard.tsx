"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface StudentProgressCardProps {
  student: {
    userId: string;
    user: {
      name: string | null;
      displayName: string | null;
      image: string | null;
      streakCount: number;
    };
    stats: {
      totalSessions: number;
      avgAccuracy: number;
      streak: number;
      longestStreak: number;
      lastActive: string | null;
    };
    recentSessions: Array<{
      surahNumber: number;
      accuracy: number | null;
      duration: number;
      createdAt: string;
    }>;
    weakSurahs: Array<{
      surahNumber: number;
      avgAccuracy: number;
      sessionCount: number;
    }>;
  };
}

export function StudentProgressCard({ student }: StudentProgressCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const displayName =
    student.user.displayName ?? student.user.name ?? "Student";
  const lastActiveText = student.stats.lastActive
    ? new Date(student.stats.lastActive).toLocaleDateString()
    : "Never";

  return (
    <div className="rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 backdrop-blur-sm overflow-hidden">
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-start"
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center shrink-0">
            {student.user.image ? (
              <img
                src={student.user.image}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium text-[#059669] dark:text-[#00E5A0]">
                {displayName[0].toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{displayName}</div>
            <div className="text-xs text-muted-foreground">
              {t("teacher.last_active")}: {lastActiveText}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick stats */}
          <div className="text-end">
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="text-sm font-medium">
                {student.stats.streak}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {student.stats.avgAccuracy}% avg
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-[#D1E0D8]/50 dark:border-[#00E5A0]/5 space-y-3">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 pt-3">
            <div className="text-center">
              <div className="text-lg font-bold">
                {student.stats.totalSessions}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {t("progress.total_sessions")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {student.stats.avgAccuracy}%
              </div>
              <div className="text-[10px] text-muted-foreground">
                {t("memorize.accuracy")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {student.stats.longestStreak}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {t("progress.bestStreak")}
              </div>
            </div>
          </div>

          {/* Weak areas */}
          {student.weakSurahs.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1.5">
                {t("teacher.weak_areas")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.weakSurahs.map((s) => (
                  <span
                    key={s.surahNumber}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      s.avgAccuracy < 60
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : "bg-[#FFD700]/10 text-[#B8860B] dark:text-[#FFD700]"
                    )}
                  >
                    Surah {s.surahNumber}: {s.avgAccuracy}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent sessions */}
          {student.recentSessions.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-1.5">Recent Sessions</div>
              <div className="space-y-1">
                {student.recentSessions.map((ses, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs text-muted-foreground"
                  >
                    <span>Surah {ses.surahNumber}</span>
                    <span>
                      {ses.accuracy !== null ? `${ses.accuracy}%` : "—"}{" "}
                      &middot; {Math.floor(ses.duration / 60)}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
