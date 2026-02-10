"use client";

import { BarChart3, BookOpen, Clock, RefreshCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSRSStats } from "@/hooks/use-srs";
import { useTranslation } from "@/hooks/use-translation";

export function ReviewStats() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useSRSStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-[#D1E0D8]/30 dark:bg-[#00E5A0]/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: t("review.due_today"),
      value: stats.dueToday,
      icon: Clock,
      color: "text-[#059669] dark:text-[#00E5A0]",
      bg: "bg-[#059669]/10 dark:bg-[#00E5A0]/10",
    },
    {
      label: t("review.total_cards"),
      value: stats.total,
      icon: BookOpen,
      color: "text-[#0d9488] dark:text-[#2dd4bf]",
      bg: "bg-[#0d9488]/10 dark:bg-[#2dd4bf]/10",
    },
    {
      label: t("review.avg_accuracy"),
      value: `${stats.averageAccuracy}%`,
      icon: BarChart3,
      color: "text-[#065f46] dark:text-[#34d399]",
      bg: "bg-[#065f46]/10 dark:bg-[#34d399]/10",
    },
    {
      label: t("review.mature"),
      value: stats.mature,
      icon: RefreshCcw,
      color: "text-[#B8860B] dark:text-[#FFD700]",
      bg: "bg-[#FFD700]/10 dark:bg-[#FFD700]/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-4 backdrop-blur-sm"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                stat.bg
              )}
            >
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Card Distribution */}
      <div className="rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-4 backdrop-blur-sm">
        <h3 className="text-sm font-medium mb-3">{t("review.distribution")}</h3>
        <div className="flex gap-1 h-6 rounded-full overflow-hidden">
          {[
            {
              count: stats.newCards,
              label: "New",
              color: "bg-[#059669] dark:bg-[#00E5A0]",
            },
            {
              count: stats.learning,
              label: "Learning",
              color: "bg-[#0d9488] dark:bg-[#2dd4bf]",
            },
            {
              count: stats.young,
              label: "Young",
              color: "bg-[#065f46] dark:bg-[#34d399]",
            },
            { count: stats.mature, label: "Mature", color: "bg-[#FFD700]" },
            {
              count: stats.relearning,
              label: "Relearning",
              color: "bg-[#B8860B] dark:bg-[#d97706]",
            },
          ].map((seg) => {
            const pct = stats.total > 0 ? (seg.count / stats.total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={seg.label}
                className={cn("transition-all", seg.color)}
                style={{ width: `${pct}%` }}
                title={`${seg.label}: ${seg.count}`}
              />
            );
          })}
          {stats.total === 0 && (
            <div className="w-full bg-[#D1E0D8]/50 dark:bg-[#00E5A0]/5" />
          )}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            {
              label: t("review.new"),
              count: stats.newCards,
              dot: "bg-[#059669] dark:bg-[#00E5A0]",
            },
            {
              label: t("review.learning"),
              count: stats.learning,
              dot: "bg-[#0d9488] dark:bg-[#2dd4bf]",
            },
            {
              label: t("review.young"),
              count: stats.young,
              dot: "bg-[#065f46] dark:bg-[#34d399]",
            },
            {
              label: t("review.mature_label"),
              count: stats.mature,
              dot: "bg-[#FFD700]",
            },
            {
              label: t("review.relearning"),
              count: stats.relearning,
              dot: "bg-[#B8860B] dark:bg-[#d97706]",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div className={cn("w-2 h-2 rounded-full", item.dot)} />
              <span>
                {item.label}: {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
