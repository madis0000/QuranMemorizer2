"use client";

import { BookOpen, Mic, RefreshCw, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type GoalType = "memorize" | "review" | "tajweed";

interface GoalOption {
  id: GoalType;
  nameKey: string;
  descKey: string;
  icon: LucideIcon;
}

const goals: GoalOption[] = [
  {
    id: "memorize",
    nameKey: "onboarding.goal_memorize",
    descKey: "onboarding.goal_memorize_desc",
    icon: BookOpen,
  },
  {
    id: "review",
    nameKey: "onboarding.goal_review",
    descKey: "onboarding.goal_review_desc",
    icon: RefreshCw,
  },
  {
    id: "tajweed",
    nameKey: "onboarding.goal_tajweed",
    descKey: "onboarding.goal_tajweed_desc",
    icon: Mic,
  },
];

interface GoalStepProps {
  selected: GoalType;
  onSelect: (goal: GoalType) => void;
  title: string;
  t: (key: string) => string;
}

export function GoalStep({ selected, onSelect, title, t }: GoalStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="grid gap-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start",
              selected === goal.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
                selected === goal.id
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <goal.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{t(goal.nameKey)}</p>
              <p className="text-sm text-muted-foreground">{t(goal.descKey)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
