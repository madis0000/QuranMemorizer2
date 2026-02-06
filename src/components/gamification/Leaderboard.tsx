"use client";

import { Clock, Flame, Target, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image?: string | null;
  value: number;
  label: string;
}

interface LeaderboardProps {
  streakLeaders: LeaderboardEntry[];
  accuracyLeaders: LeaderboardEntry[];
  sessionsLeaders: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

export function Leaderboard({
  streakLeaders,
  accuracyLeaders,
  sessionsLeaders,
  currentUserId,
  className,
}: LeaderboardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="streaks">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="streaks" className="text-xs">
              <Flame className="mr-1 h-3 w-3" />
              Streaks
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="text-xs">
              <Target className="mr-1 h-3 w-3" />
              Accuracy
            </TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streaks">
            <LeaderboardList
              entries={streakLeaders}
              currentUserId={currentUserId}
            />
          </TabsContent>
          <TabsContent value="accuracy">
            <LeaderboardList
              entries={accuracyLeaders}
              currentUserId={currentUserId}
            />
          </TabsContent>
          <TabsContent value="sessions">
            <LeaderboardList
              entries={sessionsLeaders}
              currentUserId={currentUserId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function LeaderboardList({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}) {
  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No data yet. Start your journey!
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-1">
      {entries.map((entry) => {
        const isCurrentUser = entry.userId === currentUserId;
        const medalColors: Record<number, string> = {
          1: "text-yellow-500",
          2: "text-gray-400",
          3: "text-amber-600",
        };

        return (
          <div
            key={entry.userId}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
              isCurrentUser ? "bg-primary/10 font-medium" : "hover:bg-muted/50"
            )}
          >
            {/* Rank */}
            <span
              className={cn(
                "w-6 text-center text-sm font-bold",
                medalColors[entry.rank] ?? "text-muted-foreground"
              )}
            >
              {entry.rank <= 3
                ? ["", "🥇", "🥈", "🥉"][entry.rank]
                : entry.rank}
            </span>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {entry.image ? (
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                entry.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Name */}
            <span className="flex-1 truncate text-sm">
              {entry.name}
              {isCurrentUser && (
                <span className="ml-1 text-xs text-muted-foreground">
                  (you)
                </span>
              )}
            </span>

            {/* Value */}
            <span className="text-sm font-semibold">{entry.label}</span>
          </div>
        );
      })}
    </div>
  );
}
