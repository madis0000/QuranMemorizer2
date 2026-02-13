"use client";

import {
  BarChart3,
  Calendar,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { getBadgeByCode } from "@/lib/analytics/badges";
import {
  useBadges,
  useGoals,
  useSessions,
  useStreaks,
} from "@/hooks/use-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Session type from API
interface SessionData {
  id: string;
  createdAt: string;
  duration: number;
  accuracy: number;
  wordsRecited: number;
  mistakeCount: number;
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  mode: string;
}

interface GoalData {
  id: string;
  title: string;
  progress: number;
}

interface BadgeData {
  id: string;
  badgeCode: string;
  earnedAt: string;
}

// Helper functions for data processing
function getWeeklyStats(sessions: SessionData[]) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek =
    sessions?.filter((s) => new Date(s.createdAt) >= weekAgo) || [];

  const totalSeconds = thisWeek.reduce(
    (sum: number, s) => sum + (s.duration || 0),
    0
  );
  const avgAccuracy =
    thisWeek.length > 0
      ? thisWeek.reduce((sum: number, s) => sum + (s.accuracy || 0), 0) /
        thisWeek.length
      : 0;

  return { totalSeconds, avgAccuracy, sessionCount: thisWeek.length };
}

function formatHours(seconds: number): string {
  const hours = seconds / 3600;
  if (hours < 1) {
    const minutes = Math.round(seconds / 60);
    return minutes > 0 ? `${minutes}m` : "0m";
  }
  return `${hours.toFixed(1)}h`;
}

function groupByDay(sessions: SessionData[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const result = days.map((day) => ({
    day,
    minutes: 0,
    accuracy: 0,
    count: 0,
  }));

  sessions?.forEach((session) => {
    const date = new Date(session.createdAt);
    const dayDiff = Math.floor(
      (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (dayDiff < 7) {
      const dayIndex = date.getDay();
      result[dayIndex].minutes += (session.duration || 0) / 60;
      result[dayIndex].accuracy += session.accuracy || 0;
      result[dayIndex].count++;
    }
  });

  // Average accuracy per day
  result.forEach((day) => {
    if (day.count > 0) day.accuracy = day.accuracy / day.count;
  });

  return result;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function ProgressPage() {
  // Fetch data from hooks
  const { data: sessions, isLoading: sessionsLoading } = useSessions({
    limit: 50,
  });
  const { data: streaks, isLoading: streaksLoading } = useStreaks();
  const { data: goals, isLoading: goalsLoading } = useGoals(true);
  const { data: badges, isLoading: badgesLoading } = useBadges();

  // Process data
  const weeklyStats = getWeeklyStats(sessions || []);
  const weeklyProgress = groupByDay(sessions || []);
  const badgeData =
    badges?.map((ub: BadgeData) => {
      const def = getBadgeByCode(ub.badgeCode);
      return {
        name: def?.name || ub.badgeCode,
        description: def?.description || "",
        date: formatDate(ub.earnedAt),
      };
    }) || [];

  // Loading state
  const isLoading =
    sessionsLoading || streaksLoading || goalsLoading || badgesLoading;

  return (
    <div className="ambient-purple max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-[#059669] dark:text-[#00E5A0]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Your Progress</h1>
          <p className="text-sm text-muted-foreground">
            Track your Quran memorization journey
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#FFD700]/10 dark:bg-[#FFD700]/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-[#FFD700] dark:text-[#FFD700]" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {streaksLoading ? "..." : streaks?.currentStreak || 0}
                </p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#059669]/15 dark:bg-[#00E5A0]/15 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#059669] dark:text-[#00E5A0]" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sessionsLoading
                    ? "..."
                    : formatHours(weeklyStats.totalSeconds)}
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#059669] dark:text-[#00E5A0]" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sessionsLoading
                    ? "..."
                    : weeklyStats.sessionCount > 0
                      ? `${Math.round(weeklyStats.avgAccuracy)}%`
                      : "0%"}
                </p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-[#059669] dark:text-[#00E5A0]" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {badgesLoading ? "..." : badges?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : weeklyStats.sessionCount === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center text-muted-foreground">
                <p>No activity this week yet</p>
                <p className="text-sm mt-1">
                  Start a recitation session to see your progress
                </p>
              </div>
            ) : (
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyProgress.map((day, index) => {
                  const maxMinutes = Math.max(
                    ...weeklyProgress.map((d) => d.minutes),
                    1
                  );
                  const heightPercent = (day.minutes / maxMinutes) * 100;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-primary/20 rounded-t relative"
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      >
                        {day.count > 0 && (
                          <div
                            className="w-full bg-primary rounded-t transition-all"
                            style={{ height: `${day.accuracy}%` }}
                            title={`${Math.round(day.minutes)}min, ${Math.round(day.accuracy)}% accuracy`}
                          />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goalsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : !goals || goals.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No active goals yet</p>
                <p className="text-sm mt-1">
                  Set a goal to track your progress
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 5).map((goal: GoalData) => {
                  const completed = goal.progress >= 100;
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-sm ${
                            completed
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {goal.title}
                        </span>
                        <span className="text-sm font-medium">
                          {Math.round(goal.progress)}%
                        </span>
                      </div>
                      <Progress
                        value={goal.progress}
                        className={completed ? "opacity-50" : ""}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badgesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>
            ) : !badgeData || badgeData.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No badges earned yet</p>
                <p className="text-sm mt-1">
                  Complete sessions to earn your first badge
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {badgeData
                  .slice(0, 5)
                  .map(
                    (badge: { name: string; date: string }, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                      >
                        <div className="h-10 w-10 rounded-full bg-[#059669]/10 dark:bg-[#00E5A0]/10 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-5 w-5 text-[#059669] dark:text-[#00E5A0]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{badge.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {badge.date}
                          </p>
                        </div>
                      </div>
                    )
                  )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Memorization Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Memorization Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Total Sessions</span>
                    <span className="text-sm font-medium">
                      {sessions?.length || 0}
                    </span>
                  </div>
                  <Progress
                    value={Math.min((sessions?.length || 0) * 2, 100)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Current Streak</span>
                    <span className="text-sm font-medium">
                      {streaks?.currentStreak || 0} days
                    </span>
                  </div>
                  <Progress
                    value={Math.min((streaks?.currentStreak || 0) * 3.33, 100)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Longest Streak</span>
                    <span className="text-sm font-medium">
                      {streaks?.longestStreak || 0} days
                    </span>
                  </div>
                  <Progress
                    value={Math.min((streaks?.longestStreak || 0) * 3.33, 100)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Total Active Days</span>
                    <span className="text-sm font-medium">
                      {streaks?.totalDaysActive || 0}
                    </span>
                  </div>
                  <Progress
                    value={Math.min((streaks?.totalDaysActive || 0) * 2, 100)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
