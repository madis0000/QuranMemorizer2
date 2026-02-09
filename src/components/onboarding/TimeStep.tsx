"use client";

import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

export type DailyTime = 5 | 15 | 30 | 60;

interface TimeOption {
  minutes: DailyTime;
  nameKey: string;
}

const timeOptions: TimeOption[] = [
  { minutes: 5, nameKey: "onboarding.time_5" },
  { minutes: 15, nameKey: "onboarding.time_15" },
  { minutes: 30, nameKey: "onboarding.time_30" },
  { minutes: 60, nameKey: "onboarding.time_60" },
];

interface TimeStepProps {
  selected: DailyTime;
  onSelect: (time: DailyTime) => void;
  title: string;
  t: (key: string) => string;
}

export function TimeStep({ selected, onSelect, title, t }: TimeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {timeOptions.map((option) => (
          <button
            key={option.minutes}
            onClick={() => onSelect(option.minutes)}
            className={cn(
              "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all",
              selected === option.minutes
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <Clock
              className={cn(
                "h-8 w-8",
                selected === option.minutes
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            />
            <p className="font-medium">{t(option.nameKey)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
