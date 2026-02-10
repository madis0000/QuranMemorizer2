"use client";

import { useEffect, useState } from "react";
import { BarChart3, Flame, Loader2, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

import { StudentProgressCard } from "./StudentProgressCard";

interface StudentData {
  userId: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    displayName: string | null;
    image: string | null;
    streakCount: number;
    lastActiveAt: string | null;
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
}

interface TeacherDashboardProps {
  circleId: string;
}

type SortBy = "last_active" | "accuracy" | "streak";

export function TeacherDashboard({ circleId }: TeacherDashboardProps) {
  const { t } = useTranslation();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("last_active");

  useEffect(() => {
    fetch(`/api/social/circles/${circleId}/students`)
      .then((res) => res.json())
      .then((data) => setStudents(data.students ?? []))
      .finally(() => setLoading(false));
  }, [circleId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669] dark:text-[#00E5A0]" />
      </div>
    );
  }

  // Sort students
  const sorted = [...students].sort((a, b) => {
    switch (sortBy) {
      case "accuracy":
        return b.stats.avgAccuracy - a.stats.avgAccuracy;
      case "streak":
        return b.stats.streak - a.stats.streak;
      case "last_active":
      default:
        return (
          new Date(b.stats.lastActive ?? 0).getTime() -
          new Date(a.stats.lastActive ?? 0).getTime()
        );
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#059669] dark:text-[#00E5A0]" />
          <h3 className="text-lg font-semibold">{t("teacher.dashboard")}</h3>
          <span className="text-sm text-muted-foreground">
            ({students.length} {t("teacher.students")})
          </span>
        </div>
      </div>

      {/* Sort tabs */}
      <div className="flex gap-2">
        {(
          [
            {
              key: "last_active",
              label: t("teacher.last_active"),
              icon: Loader2,
            },
            { key: "accuracy", label: t("memorize.accuracy"), icon: BarChart3 },
            { key: "streak", label: t("streak.day_streak"), icon: Flame },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSortBy(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              sortBy === tab.key
                ? "bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0]"
                : "text-muted-foreground hover:bg-[#059669]/5"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {sorted.map((student) => (
          <StudentProgressCard key={student.userId} student={student} />
        ))}
      </div>
    </div>
  );
}
