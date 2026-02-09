"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { DailyTarget, StudyPlan } from "@/lib/curriculum/plan-generator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarViewProps {
  plan: StudyPlan;
  className?: string;
}

/** Get the year and month from a Date */
function getYearMonth(date: Date): { year: number; month: number } {
  return { year: date.getFullYear(), month: date.getMonth() };
}

/** Get all days in a month as a grid (including empty slots for alignment) */
function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = [];

  // Empty slots before the first day
  for (let i = 0; i < firstDay; i++) {
    grid.push(null);
  }

  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(d);
  }

  return grid;
}

/** Format a date as YYYY-MM-DD */
function formatDateStr(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type DayStatus = "none" | "scheduled" | "completed" | "missed" | "today";

export function CalendarView({ plan, className }: CalendarViewProps) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [viewDate, setViewDate] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));

  // Build a lookup map from date string to DailyTarget
  const targetMap = useMemo(() => {
    const map = new Map<string, DailyTarget>();
    for (const target of plan.schedule) {
      map.set(target.date, target);
    }
    return map;
  }, [plan.schedule]);

  const grid = getMonthGrid(viewDate.year, viewDate.month);

  const goToPrevMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const getDayStatus = (dateStr: string): DayStatus => {
    if (dateStr === todayStr) return "today";
    const target = targetMap.get(dateStr);
    if (!target) return "none";
    if (target.completed) return "completed";
    // If the day is in the past and not completed, it's missed
    if (dateStr < todayStr) return "missed";
    return "scheduled";
  };

  const getDayStyle = (status: DayStatus): string => {
    switch (status) {
      case "today":
        return "ring-2 ring-primary bg-primary/10 font-bold";
      case "completed":
        return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
      case "missed":
        return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
      case "scheduled":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
      default:
        return "text-muted-foreground";
    }
  };

  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {MONTH_NAMES[viewDate.month]} {viewDate.year}
            </span>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-blue-100 dark:bg-blue-900/40" />
            <span className="text-xs text-muted-foreground">Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900/40" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900/40" />
            <span className="text-xs text-muted-foreground">Missed</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_NAMES.map((name) => (
            <div
              key={name}
              className="text-center text-[10px] text-muted-foreground font-medium py-1"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 relative">
          {grid.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const dateStr = formatDateStr(viewDate.year, viewDate.month, day);
            const status = getDayStatus(dateStr);
            const target = targetMap.get(dateStr);
            const isHovered = hoveredDay === dateStr;

            return (
              <div
                key={dateStr}
                className="relative"
                onMouseEnter={() => setHoveredDay(dateStr)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-md text-xs cursor-default transition-colors",
                    getDayStyle(status)
                  )}
                >
                  {day}
                </div>

                {/* Tooltip on hover */}
                {isHovered && target && (
                  <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 p-2 bg-popover border rounded-md shadow-md text-xs whitespace-nowrap">
                    <p className="font-medium">
                      {new Date(dateStr).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {target.newVerses.length > 0 && (
                      <p className="text-muted-foreground">
                        {target.newVerses.reduce((s, v) => s + v.count, 0)} new
                        verse
                        {target.newVerses.reduce((s, v) => s + v.count, 0) > 1
                          ? "s"
                          : ""}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      ~{target.estimatedMinutes} min
                    </p>
                    {target.completed && (
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        Completed
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
