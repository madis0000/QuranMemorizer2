"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

import {
  getPlanProgress,
  getPlanStatus,
  SURAH_NAMES,
  type StudyPlan,
} from "@/lib/curriculum/plan-generator";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StudyPlanCardProps {
  plan: StudyPlan;
  className?: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getGoalDescription(plan: StudyPlan): string {
  switch (plan.goal.type) {
    case "surah":
      return `Memorize Surah ${SURAH_NAMES[plan.goal.target - 1]}`;
    case "juz":
      return `Memorize Juz ${plan.goal.target}`;
    case "pages":
      return `Memorize ${plan.goal.target} pages`;
    case "custom":
      return "Custom memorization goal";
    default:
      return "Study plan";
  }
}

function getMethodLabel(method: string): string {
  return (
    {
      sabaq: "Sabaq Method",
      "3x3": "3x3 Method",
      ottoman: "Ottoman Method",
      adaptive: "Adaptive",
    }[method] ?? method
  );
}

const STATUS_CONFIG = {
  on_track: {
    label: "On Track",
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  behind: {
    label: "Behind Schedule",
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  ahead: {
    label: "Ahead of Schedule",
    icon: CheckCircle2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
} as const;

export function StudyPlanCard({ plan, className }: StudyPlanCardProps) {
  const progress = getPlanProgress(plan);
  const status = getPlanStatus(plan);
  const statusConfig = STATUS_CONFIG[status];
  const StatusIcon = statusConfig.icon;

  const today = new Date();
  const deadline = new Date(plan.deadline);
  const daysRemaining = Math.max(
    0,
    Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  const completedDays = plan.schedule.filter((t) => t.completed).length;
  const totalDays = plan.schedule.length;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getGoalDescription(plan)}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              statusConfig.bg,
              statusConfig.color
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-accent/30">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <p className="text-lg font-semibold">{daysRemaining}</p>
            <p className="text-xs text-muted-foreground">Days Left</p>
          </div>

          <div className="p-2 rounded-lg bg-accent/30">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <p className="text-lg font-semibold">
              {completedDays}/{totalDays}
            </p>
            <p className="text-xs text-muted-foreground">Days Done</p>
          </div>

          <div className="p-2 rounded-lg bg-accent/30">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <p className="text-lg font-semibold">{plan.dailyTimeMinutes}m</p>
            <p className="text-xs text-muted-foreground">Daily</p>
          </div>
        </div>

        {/* Method and dates */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{getMethodLabel(plan.method)}</span>
          <span>
            {formatDate(plan.startDate)} - {formatDate(plan.deadline)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
