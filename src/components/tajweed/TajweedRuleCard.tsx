"use client";

import type { TajweedRuleType } from "@/types/quran";
import { BookOpen } from "lucide-react";

import { getRuleInfo } from "@/lib/tajweed/rule-mapper";
import { cn } from "@/lib/utils";
import {
  MASTERY_LEVEL_COLORS,
  MASTERY_LEVEL_LABELS,
  type MasteryLevel,
} from "@/stores/tajweedStore";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TajweedRuleCardProps {
  /** The Tajweed rule type to display */
  ruleType: TajweedRuleType;
  /** Current mastery level for this rule */
  masteryLevel: MasteryLevel;
  /** Whether this card is currently selected/active */
  isActive?: boolean;
  /** Click handler */
  onClick?: (ruleType: TajweedRuleType) => void;
  /** Compact mode for grid layout */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable card showing a single Tajweed rule with its name, color,
 * description, example word, and mastery level badge.
 */
export function TajweedRuleCard({
  ruleType,
  masteryLevel,
  isActive = false,
  onClick,
  compact = false,
  className,
}: TajweedRuleCardProps) {
  const ruleInfo = getRuleInfo(ruleType);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isActive && "ring-2 ring-primary shadow-md",
        compact ? "p-3" : "p-0",
        className
      )}
      onClick={() => onClick?.(ruleType)}
    >
      <CardContent className={cn(compact ? "p-0" : "px-4 py-3")}>
        {/* Header: Color dot + Name + Mastery Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Color indicator */}
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: ruleInfo.color }}
            />
            <div className="min-w-0">
              <h4 className="text-sm font-semibold leading-tight">
                {ruleInfo.name}
              </h4>
              <p
                className="text-xs font-medium leading-tight"
                dir="rtl"
                lang="ar"
              >
                {ruleInfo.nameArabic}
              </p>
            </div>
          </div>

          {/* Mastery Badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  masteryLevel === "NONE" && "bg-muted text-muted-foreground",
                  masteryLevel !== "NONE" && "text-black"
                )}
                style={
                  masteryLevel !== "NONE"
                    ? { backgroundColor: MASTERY_LEVEL_COLORS[masteryLevel] }
                    : undefined
                }
              >
                {MASTERY_LEVEL_LABELS[masteryLevel]}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Mastery: {MASTERY_LEVEL_LABELS[masteryLevel]}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Description */}
        {!compact && (
          <p className="mt-2 text-xs text-muted-foreground">
            {ruleInfo.description}
          </p>
        )}

        {/* Example word */}
        {!compact && (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span
              className="font-arabic text-base leading-relaxed"
              dir="rtl"
              lang="ar"
              style={{ color: ruleInfo.color }}
            >
              {ruleInfo.exampleWord}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {ruleInfo.exampleTransliteration}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TajweedRuleCard;
