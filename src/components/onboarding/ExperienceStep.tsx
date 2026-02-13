"use client";

import { Award, Sprout, TreePine, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ExperienceLevel = "beginner" | "intermediate" | "hafiz";

interface ExperienceOption {
  id: ExperienceLevel;
  nameKey: string;
  descKey: string;
  icon: LucideIcon;
}

const levels: ExperienceOption[] = [
  {
    id: "beginner",
    nameKey: "onboarding.exp_beginner",
    descKey: "onboarding.exp_beginner_desc",
    icon: Sprout,
  },
  {
    id: "intermediate",
    nameKey: "onboarding.exp_intermediate",
    descKey: "onboarding.exp_intermediate_desc",
    icon: TreePine,
  },
  {
    id: "hafiz",
    nameKey: "onboarding.exp_hafiz",
    descKey: "onboarding.exp_hafiz_desc",
    icon: Award,
  },
];

interface ExperienceStepProps {
  selected: ExperienceLevel;
  onSelect: (level: ExperienceLevel) => void;
  title: string;
  t: (key: string) => string;
}

export function ExperienceStep({
  selected,
  onSelect,
  title,
  t,
}: ExperienceStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="grid gap-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start",
              selected === level.id
                ? "border-[#059669] bg-[#059669]/10 dark:border-[#00E5A0] dark:bg-[#00E5A0]/10 shadow-sm"
                : "border-[#D1E0D8] dark:border-[#00E5A0]/10 hover:border-[#059669]/50 dark:hover:border-[#00E5A0]/30"
            )}
          >
            <div
              className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
                selected === level.id
                  ? "bg-[#059669]/15 text-[#059669] dark:bg-[#00E5A0]/15 dark:text-[#00E5A0]"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <level.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{t(level.nameKey)}</p>
              <p className="text-sm text-muted-foreground">
                {t(level.descKey)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
