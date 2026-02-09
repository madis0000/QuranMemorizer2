"use client";

import { Activity, Award, BookOpen, Flame, UserPlus } from "lucide-react";

import type { CircleActivityItem } from "@/hooks/use-circles";

interface CircleActivityFeedProps {
  activities: CircleActivityItem[];
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const activityConfig: Record<
  string,
  {
    icon: typeof Activity;
    color: string;
    bg: string;
    getMessage: (
      userName: string,
      data: Record<string, unknown> | null
    ) => string;
  }
> = {
  session_complete: {
    icon: BookOpen,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
    getMessage: (userName, data) => {
      const accuracy = data?.accuracy;
      const surah = data?.surahNumber;
      if (accuracy && surah) {
        return `${userName} completed a recitation of Surah ${surah} with ${accuracy}% accuracy`;
      }
      return `${userName} completed a recitation session`;
    },
  },
  badge_earned: {
    icon: Award,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    getMessage: (userName, data) => {
      const badgeName = data?.badgeName;
      if (badgeName) {
        return `${userName} earned the "${badgeName}" badge`;
      }
      return `${userName} earned a new badge`;
    },
  },
  streak_milestone: {
    icon: Flame,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    getMessage: (userName, data) => {
      const streak = data?.streakCount;
      if (streak) {
        return `${userName} reached a ${streak}-day streak`;
      }
      return `${userName} hit a streak milestone`;
    },
  },
  joined: {
    icon: UserPlus,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    getMessage: (userName) => `${userName} joined the circle`,
  },
};

const defaultConfig = {
  icon: Activity,
  color: "text-muted-foreground",
  bg: "bg-muted",
  getMessage: (userName: string) => `${userName} was active`,
};

export function CircleActivityFeed({ activities }: CircleActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No activity yet. Start reciting to share your progress!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity) => {
        const config = activityConfig[activity.type] ?? defaultConfig;
        const Icon = config.icon;
        const message = config.getMessage(activity.userName, activity.data);

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors"
          >
            <div
              className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug">{message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
