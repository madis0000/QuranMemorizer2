"use client";

import { useMemo } from "react";
import { Check, ChevronRight, Lock, Star } from "lucide-react";

import { MASTERY_STAGES } from "@/lib/tajweed/rule-mapper";
import { cn } from "@/lib/utils";
import {
  MASTERY_LEVEL_COLORS,
  MASTERY_LEVEL_LABELS,
  MASTERY_LEVEL_PROGRESS,
  useTajweedStore,
  type MasteryLevel,
} from "@/stores/tajweedStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface TajweedMasteryPathProps {
  /** Called when user clicks to practice a stage */
  onPracticeStage?: (stage: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Learning path with 6 stages, each showing lock/unlock state,
 * mastery progress bar, and a practice button.
 *
 * Stages:
 * 1. Noon Sakinah & Tanween
 * 2. Meem Sakinah
 * 3. Qalqalah
 * 4. Madd
 * 5. Lam Rules
 * 6. Advanced
 */
export function TajweedMasteryPath({
  onPracticeStage,
  className,
}: TajweedMasteryPathProps) {
  const {
    masteryLevels,
    currentStage,
    unlockedStages,
    setCurrentStage,
    unlockStage,
  } = useTajweedStore();

  // Compute the overall mastery for each stage
  const stageProgress = useMemo(() => {
    return MASTERY_STAGES.map((stage) => {
      const ruleLevels = stage.ruleTypes.map((rt) => masteryLevels[rt]);
      // Average of the mastery progress percentages
      const avgProgress =
        ruleLevels.length > 0
          ? ruleLevels.reduce(
              (sum, level) => sum + MASTERY_LEVEL_PROGRESS[level],
              0
            ) / ruleLevels.length
          : 0;

      // Determine the minimum mastery level in this stage
      const minLevel = ruleLevels.reduce<MasteryLevel>((min, level) => {
        const order: MasteryLevel[] = [
          "NONE",
          "BRONZE",
          "SILVER",
          "GOLD",
          "PLATINUM",
          "MASTER",
        ];
        return order.indexOf(level) < order.indexOf(min) ? level : min;
      }, "MASTER" as MasteryLevel);

      // A stage is "complete" when all rules reach at least BRONZE
      const isComplete = ruleLevels.every((l) => l !== "NONE");

      return {
        ...stage,
        avgProgress: Math.round(avgProgress),
        minLevel: ruleLevels.length === 0 ? ("NONE" as MasteryLevel) : minLevel,
        isComplete,
      };
    });
  }, [masteryLevels]);

  // Auto-unlock next stage when current stage reaches Bronze on all rules
  useMemo(() => {
    for (let i = 0; i < stageProgress.length; i++) {
      if (stageProgress[i].isComplete && i + 1 < stageProgress.length) {
        if (i + 2 > unlockedStages) {
          unlockStage(i + 2);
        }
      }
    }
  }, [stageProgress, unlockedStages, unlockStage]);

  return (
    <div className={cn("space-y-3", className)}>
      {stageProgress.map((stage, index) => {
        const isLocked = stage.stage > unlockedStages;
        const isActive = stage.stage === currentStage;
        const stageNum = stage.stage;

        return (
          <Card
            key={stageNum}
            className={cn(
              "transition-all duration-200",
              isActive && "ring-2 ring-primary shadow-md",
              isLocked && "opacity-60",
              !isLocked && "cursor-pointer hover:shadow-md"
            )}
            onClick={() => {
              if (!isLocked) {
                setCurrentStage(stageNum);
              }
            }}
          >
            <CardContent className="flex items-center gap-4 px-4 py-3">
              {/* Stage number / icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  isLocked
                    ? "bg-muted text-muted-foreground"
                    : stage.isComplete
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "bg-primary/10 text-primary"
                )}
              >
                {isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : stage.isComplete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  stageNum
                )}
              </div>

              {/* Stage info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">
                    {stage.name}
                  </h3>
                  {!isLocked && stage.minLevel !== "NONE" && (
                    <span
                      className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                      style={{
                        backgroundColor: MASTERY_LEVEL_COLORS[stage.minLevel],
                        color:
                          stage.minLevel === "SILVER" ||
                          stage.minLevel === "PLATINUM"
                            ? "#1a1a1a"
                            : "#fff",
                      }}
                    >
                      <Star className="h-2 w-2" />
                      {MASTERY_LEVEL_LABELS[stage.minLevel]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stage.nameArabic}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {stage.description}
                </p>

                {/* Progress bar */}
                {!isLocked && (
                  <div className="mt-2">
                    <div className="mb-0.5 flex justify-between text-[10px] text-muted-foreground">
                      <span>
                        {stage.ruleTypes.length} rule
                        {stage.ruleTypes.length !== 1 ? "s" : ""}
                      </span>
                      <span>{stage.avgProgress}%</span>
                    </div>
                    <Progress value={stage.avgProgress} className="h-1.5" />
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0">
                {!isLocked && (
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentStage(stageNum);
                      onPracticeStage?.(stageNum);
                    }}
                  >
                    {isActive ? "Practice" : "Select"}
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
                {isLocked && (
                  <span className="text-xs text-muted-foreground">
                    Complete Stage {index} first
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default TajweedMasteryPath;
