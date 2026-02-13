"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Insight {
  id: string;
  icon: string;
  text: string;
  actionUrl?: string;
  priority: number;
}

interface CoachInsightsProps {
  insights: Insight[];
  className?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  clock: <Clock className="h-4 w-4" />,
  "alert-triangle": <AlertTriangle className="h-4 w-4" />,
  "calendar-clock": <CalendarClock className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  target: <Target className="h-4 w-4" />,
  "trending-up": <TrendingUp className="h-4 w-4" />,
};

const PRIORITY_COLORS: Record<number, string> = {
  5: "border-l-red-500 bg-red-500/5",
  4: "border-l-orange-500 bg-orange-500/5",
  3: "border-l-yellow-500 bg-yellow-500/5",
  2: "border-l-green-500 bg-green-500/5",
  1: "border-l-blue-500 bg-blue-500/5",
};

export function CoachInsights({ insights, className }: CoachInsightsProps) {
  if (insights.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Coach Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Keep practicing to unlock personalized insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Coach Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {insights.map((insight) => {
            const colorClass =
              PRIORITY_COLORS[insight.priority] ?? PRIORITY_COLORS[1];
            const icon = ICON_MAP[insight.icon] ?? (
              <TrendingUp className="h-4 w-4" />
            );

            const content = (
              <div
                className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${colorClass} transition-colors hover:bg-accent/50`}
              >
                <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                  {icon}
                </div>
                <p className="text-sm leading-relaxed">{insight.text}</p>
              </div>
            );

            if (insight.actionUrl) {
              return (
                <Link
                  key={insight.id}
                  href={insight.actionUrl}
                  className="block"
                >
                  {content}
                </Link>
              );
            }

            return <div key={insight.id}>{content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
