"use client";

import {
  BarChart3,
  Calendar,
  Clock,
  Flame,
  Map,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { getBadgeByCode } from "@/lib/analytics/badges";
import {
  useBadges,
  useCoachInsights,
  useDualScores,
  useEffortRetention,
  useGoals,
  useMemoryMap,
  useReviewForecast,
  useSessions,
  useStreaks,
  useTimeline,
  useWrapped,
} from "@/hooks/use-progress";
import {
  AccuracyTrend,
  type SessionPoint,
} from "@/components/progress/AccuracyTrend";
import { CoachInsights } from "@/components/progress/CoachInsights";
import { DualScore } from "@/components/progress/DualScore";
import { EffortRetentionScatter } from "@/components/progress/EffortRetentionScatter";
import { LivingMushafMap } from "@/components/progress/LivingMushafMap";
import { PredictiveTimeline } from "@/components/progress/PredictiveTimeline";
import { QuranWrapped } from "@/components/progress/QuranWrapped";
import { ReviewDebt } from "@/components/progress/ReviewDebt";
import { ReviewForecast } from "@/components/progress/ReviewForecast";
import { WeakAreas, type MistakeData } from "@/components/progress/WeakAreas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  mistakes?: MistakeData[];
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
  // Existing data hooks
  const { data: sessions, isLoading: sessionsLoading } = useSessions({
    limit: 50,
  });
  const { data: streaks, isLoading: streaksLoading } = useStreaks();
  const { data: goals, isLoading: goalsLoading } = useGoals(true);
  const { data: badges, isLoading: badgesLoading } = useBadges();

  // New dashboard hooks
  const { data: scoresData } = useDualScores();
  const { data: insightsData } = useCoachInsights();
  const { data: memoryMapData } = useMemoryMap();
  const { data: forecastData } = useReviewForecast();
  const { data: scatterData } = useEffortRetention();
  const { data: timelineData } = useTimeline();
  const { data: wrappedData } = useWrapped("month");

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

  // Extract mistakes from sessions for WeakAreas
  const allMistakes: MistakeData[] = [];
  if (sessions) {
    for (const s of sessions as SessionData[]) {
      if (s.mistakes) {
        for (const m of s.mistakes) {
          allMistakes.push(m);
        }
      }
    }
  }

  // Convert sessions to AccuracyTrend format
  const sessionPoints: SessionPoint[] = (sessions || []).map(
    (s: SessionData) => ({
      id: s.id,
      date: s.createdAt,
      accuracy: s.accuracy ?? 0,
      surahNumber: s.surahNumber,
      mode: s.mode,
    })
  );

  const isLoading =
    sessionsLoading || streaksLoading || goalsLoading || badgesLoading;

  return (
    <div className="ambient-purple max-w-6xl mx-auto px-6 py-8 space-y-6">
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

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="memory-map">
            <Map className="h-4 w-4 mr-1.5" />
            Memory Map
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="journey">
            <Trophy className="h-4 w-4 mr-1.5" />
            Journey
          </TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Dual Score */}
          {scoresData && (
            <DualScore
              hifdh={scoresData.hifdh}
              itqan={scoresData.itqan}
              totalVerses={scoresData.totalVerses}
              matureVerses={scoresData.matureVerses}
            />
          )}

          {/* Coach Insights */}
          {insightsData && <CoachInsights insights={insightsData.insights} />}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-[#FFD700]" />
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

          {/* Weak Areas */}
          <WeakAreas mistakes={allMistakes} />
        </TabsContent>

        {/* ===== MEMORY MAP TAB ===== */}
        <TabsContent value="memory-map" className="space-y-6 mt-6">
          {memoryMapData ? (
            <LivingMushafMap pages={memoryMapData.pages} />
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Map className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>Loading memory map...</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {forecastData && (
              <ReviewForecast
                forecast={forecastData.forecast}
                dailyAverage={forecastData.dailyAverage}
              />
            )}

            {forecastData && (
              <ReviewDebt
                debtRatio={forecastData.debtRatio}
                overdue={forecastData.overdue}
                totalCards={forecastData.totalCards}
              />
            )}
          </div>
        </TabsContent>

        {/* ===== ANALYTICS TAB ===== */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <AccuracyTrend sessions={sessionPoints} />

          {scatterData && scatterData.length > 0 && (
            <EffortRetentionScatter data={scatterData} />
          )}

          {/* Weekly Activity (moved from Overview) */}
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
                          style={{
                            height: `${Math.max(heightPercent, 5)}%`,
                          }}
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
        </TabsContent>

        {/* ===== JOURNEY TAB ===== */}
        <TabsContent value="journey" className="space-y-6 mt-6">
          {timelineData && (
            <PredictiveTimeline milestones={timelineData.milestones} />
          )}

          {wrappedData && <QuranWrapped data={wrappedData} />}

          {/* Recent Badges (moved from Overview) */}
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
                      (
                        badge: { name: string; date: string },
                        index: number
                      ) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
