"use client";

import {
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  Star,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Milestone {
  date: string;
  type: string;
  title: string;
  subtitle?: string;
  isPast: boolean;
  confidence?: {
    optimistic: string;
    conservative: string;
  };
}

interface PredictiveTimelineProps {
  milestones: Milestone[];
  className?: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  first_session: <BookOpen className="h-4 w-4" />,
  streak_record: <Flame className="h-4 w-4" />,
  badge: <Award className="h-4 w-4" />,
  surah_complete: <CheckCircle2 className="h-4 w-4" />,
  surah_predicted: <Star className="h-4 w-4" />,
  verse_milestone: <Trophy className="h-4 w-4" />,
};

function formatTimelineDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < -365) {
    return date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  }
  if (diffDays < -30) {
    return date.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
  }
  if (diffDays < 0) {
    return `${Math.abs(diffDays)}d ago`;
  }
  if (diffDays === 0) return "Today";
  if (diffDays < 7) return `In ${diffDays}d`;
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)}w`;
  if (diffDays < 365) {
    return date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  }
  return date.toLocaleDateString("default", {
    month: "short",
    year: "numeric",
  });
}

function formatConfidence(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("default", {
    month: "short",
    year: "numeric",
  });
}

export function PredictiveTimeline({
  milestones,
  className,
}: PredictiveTimelineProps) {
  if (milestones.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Your Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Start memorizing to see your predicted journey.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Find the "now" marker position
  const pastMilestones = milestones.filter((m) => m.isPast);
  const futureMilestones = milestones.filter((m) => !m.isPast);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Your Journey</CardTitle>
        <p className="text-xs text-muted-foreground">
          {pastMilestones.length} achieved
          {futureMilestones.length > 0 &&
            ` / ${futureMilestones.length} predicted`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto pb-2">
          <div className="flex items-start gap-0 min-w-max">
            {milestones.map((milestone, index) => {
              const icon = TYPE_ICONS[milestone.type] ?? (
                <Circle className="h-4 w-4" />
              );

              // Insert "NOW" marker between past and future
              const isNowBoundary =
                milestone.isPast &&
                index < milestones.length - 1 &&
                !milestones[index + 1].isPast;

              return (
                <div
                  key={`${milestone.type}-${index}`}
                  className="flex items-start"
                >
                  {/* Milestone node */}
                  <div className="flex flex-col items-center w-28">
                    {/* Dot/Icon */}
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        milestone.isPast
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30"
                      )}
                    >
                      {icon}
                    </div>

                    {/* Title & subtitle */}
                    <p
                      className={cn(
                        "text-xs font-medium mt-2 text-center leading-tight",
                        !milestone.isPast && "text-muted-foreground"
                      )}
                    >
                      {milestone.title}
                    </p>
                    {milestone.subtitle && (
                      <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                        {milestone.subtitle}
                      </p>
                    )}

                    {/* Date */}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatTimelineDate(milestone.date)}
                    </p>

                    {/* Confidence range for predictions */}
                    {milestone.confidence && (
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                        {formatConfidence(milestone.confidence.optimistic)} -{" "}
                        {formatConfidence(milestone.confidence.conservative)}
                      </p>
                    )}
                  </div>

                  {/* Connector line */}
                  {index < milestones.length - 1 && (
                    <div className="flex items-center mt-4">
                      <div
                        className={cn(
                          "h-[2px] w-8",
                          milestone.isPast
                            ? "bg-primary"
                            : "bg-muted-foreground/20 border-dashed"
                        )}
                        style={
                          !milestone.isPast
                            ? {
                                backgroundImage:
                                  "repeating-linear-gradient(90deg, currentColor 0, currentColor 4px, transparent 4px, transparent 8px)",
                                backgroundColor: "transparent",
                                color: "var(--muted-foreground)",
                                opacity: 0.3,
                              }
                            : undefined
                        }
                      />
                    </div>
                  )}

                  {/* NOW marker */}
                  {isNowBoundary && (
                    <div className="flex flex-col items-center w-16 mt-0">
                      <div className="h-8 w-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-yellow-500/30">
                        NOW
                      </div>
                      <div className="h-[2px] w-4 bg-yellow-500 mt-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
