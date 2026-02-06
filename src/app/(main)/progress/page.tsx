"use client";

import { useUserStore } from "@/stores";
import {
  BarChart3,
  Calendar,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Sample data
const weeklyProgress = [
  { day: "Mon", minutes: 30, accuracy: 85 },
  { day: "Tue", minutes: 45, accuracy: 90 },
  { day: "Wed", minutes: 20, accuracy: 78 },
  { day: "Thu", minutes: 60, accuracy: 92 },
  { day: "Fri", minutes: 40, accuracy: 88 },
  { day: "Sat", minutes: 35, accuracy: 85 },
  { day: "Sun", minutes: 50, accuracy: 91 },
];

const recentBadges = [
  { name: "7 Day Streak", icon: "🔥", date: "Today" },
  { name: "First Surah", icon: "📖", date: "Yesterday" },
  { name: "Early Bird", icon: "🌅", date: "3 days ago" },
];

const goals = [
  { name: "Memorize Al-Fatihah", progress: 100, completed: true },
  { name: "Daily 15 minutes", progress: 75, completed: false },
  { name: "Complete Juz 30", progress: 45, completed: false },
];

export default function ProgressPage() {
  const { streak } = useUserStore();

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Your Progress
          </h1>
          <p className="text-muted-foreground">
            Track your Quran memorization journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{streak.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.5h</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
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
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyProgress.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-primary/20 rounded-t"
                      style={{ height: `${day.minutes}%` }}
                    >
                      <div
                        className="w-full bg-primary rounded-t transition-all"
                        style={{ height: `${day.accuracy}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm ${
                          goal.completed
                            ? "text-muted-foreground line-through"
                            : ""
                        }`}
                      >
                        {goal.name}
                      </span>
                      <span className="text-sm font-medium">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress
                      value={goal.progress}
                      className={goal.completed ? "opacity-50" : ""}
                    />
                  </div>
                ))}
              </div>
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
              <div className="space-y-3">
                {recentBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {badge.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Memorization Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Memorization Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Surahs Memorized</span>
                    <span className="text-sm font-medium">3 / 114</span>
                  </div>
                  <Progress value={(3 / 114) * 100} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Juz Completed</span>
                    <span className="text-sm font-medium">0 / 30</span>
                  </div>
                  <Progress value={0} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Pages Reviewed</span>
                    <span className="text-sm font-medium">15 / 604</span>
                  </div>
                  <Progress value={(15 / 604) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
