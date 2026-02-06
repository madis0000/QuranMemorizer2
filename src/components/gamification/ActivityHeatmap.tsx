"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapEntry {
  date: string;
  count: number;
  isActive: boolean;
}

interface ActivityHeatmapProps {
  data: HeatmapEntry[];
  className?: string;
}

const intensityColors = [
  "bg-muted", // 0 - no activity
  "bg-green-200 dark:bg-green-900", // 1 - low
  "bg-green-400 dark:bg-green-700", // 2 - medium
  "bg-green-600 dark:bg-green-500", // 3 - high
  "bg-green-800 dark:bg-green-400", // 4 - max
];

export function ActivityHeatmap({ data, className }: ActivityHeatmapProps) {
  const weeks = useMemo(() => {
    const result: HeatmapEntry[][] = [];
    let currentWeek: HeatmapEntry[] = [];

    // Pad start to align with correct day of week
    if (data.length > 0) {
      const firstDate = new Date(data[0].date + "T00:00:00");
      const startDay = firstDate.getDay();
      for (let i = 0; i < startDay; i++) {
        currentWeek.push({ date: "", count: -1, isActive: false });
      }
    }

    for (const entry of data) {
      currentWeek.push(entry);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [data]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      for (const day of week) {
        if (!day.date) continue;
        const month = new Date(day.date + "T00:00:00").getMonth();
        if (month !== lastMonth) {
          labels.push({
            label: new Date(day.date + "T00:00:00").toLocaleString("en", {
              month: "short",
            }),
            weekIndex,
          });
          lastMonth = month;
        }
        break;
      }
    });

    return labels;
  }, [weeks]);

  const totalActive = data.filter((d) => d.isActive).length;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Activity</span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalActive} active days in the last year
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Month labels */}
          <div className="mb-1 flex text-[10px] text-muted-foreground">
            <div className="w-7" /> {/* Spacer for day labels */}
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{
                  marginLeft:
                    i === 0
                      ? `${m.weekIndex * 14}px`
                      : `${(m.weekIndex - (monthLabels[i - 1]?.weekIndex ?? 0) - 1) * 14}px`,
                }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 pr-1 text-[10px] text-muted-foreground">
              <div className="h-3" />
              <div className="flex h-3 items-center">M</div>
              <div className="h-3" />
              <div className="flex h-3 items-center">W</div>
              <div className="h-3" />
              <div className="flex h-3 items-center">F</div>
              <div className="h-3" />
            </div>

            {/* Grid */}
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-0.5">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-0.5">
                    {week.map((day, dayIdx) => (
                      <Tooltip key={dayIdx}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "h-3 w-3 rounded-sm",
                              day.count === -1
                                ? "bg-transparent"
                                : (intensityColors[day.count] ??
                                    intensityColors[0])
                            )}
                          />
                        </TooltipTrigger>
                        {day.date && (
                          <TooltipContent side="top" className="text-xs">
                            <p>
                              {day.count > 0
                                ? `${day.count} session${day.count > 1 ? "s" : ""}`
                                : "No activity"}
                            </p>
                            <p className="text-muted-foreground">
                              {new Date(
                                day.date + "T00:00:00"
                              ).toLocaleDateString("en", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            {intensityColors.map((color, i) => (
              <div key={i} className={cn("h-3 w-3 rounded-sm", color)} />
            ))}
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
