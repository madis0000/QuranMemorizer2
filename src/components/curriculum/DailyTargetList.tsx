"use client";

import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import type { DailySchedule } from "@/lib/curriculum/daily-scheduler";
import { SURAH_NAMES } from "@/lib/curriculum/plan-generator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyTargetListProps {
  schedule: DailySchedule;
  onComplete?: () => void;
  isCompletePending?: boolean;
  className?: string;
}

function formatVerseRange(surah: number, ayah: number, count: number): string {
  const name = SURAH_NAMES[surah - 1] ?? `Surah ${surah}`;
  if (count === 1) return `${name} ${surah}:${ayah}`;
  return `${name} ${surah}:${ayah}-${ayah + count - 1}`;
}

function parseVerseKey(key: string): { surah: number; ayah: number } {
  const [s, a] = key.split(":");
  return { surah: parseInt(s, 10), ayah: parseInt(a, 10) };
}

function VerseKeyLabel({ verseKey }: { verseKey: string }) {
  const { surah, ayah } = parseVerseKey(verseKey);
  const name = SURAH_NAMES[surah - 1] ?? `Surah ${surah}`;
  return (
    <span className="text-xs text-muted-foreground">
      {name} {surah}:{ayah}
    </span>
  );
}

export function DailyTargetList({
  schedule,
  onComplete,
  isCompletePending,
  className,
}: DailyTargetListProps) {
  const newVerseCount = schedule.newVerses.reduce(
    (sum, vr) => sum + vr.count,
    0
  );
  const hasContent =
    newVerseCount > 0 ||
    schedule.recentReview.length > 0 ||
    schedule.distantReview.length > 0 ||
    schedule.fsrsDueCards.length > 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Today&apos;s Study
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />~{schedule.estimatedMinutes} min
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasContent ? (
          <div className="py-6 text-center text-muted-foreground text-sm">
            <p>Nothing scheduled for today.</p>
            <p className="mt-1">Enjoy a well-deserved rest day!</p>
          </div>
        ) : (
          <>
            {/* New verses (Sabaq) */}
            {newVerseCount > 0 && (
              <Section
                icon={<Sparkles className="h-4 w-4 text-blue-500" />}
                title="New Verses (Sabaq)"
                badge={`${newVerseCount} verse${newVerseCount > 1 ? "s" : ""}`}
                badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                time={schedule.timeBreakdown.newLearning}
              >
                <div className="space-y-1">
                  {schedule.newVerses.map((vr, i) => (
                    <div
                      key={`new-${i}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Circle className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {formatVerseRange(vr.surah, vr.ayah, vr.count)}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Recent review (Sabqi) */}
            {schedule.recentReview.length > 0 && (
              <Section
                icon={<RefreshCw className="h-4 w-4 text-green-500" />}
                title="Recent Review (Sabqi)"
                badge={`${schedule.recentReview.length} verse${schedule.recentReview.length > 1 ? "s" : ""}`}
                badgeColor="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                time={schedule.timeBreakdown.recentReview}
              >
                <div className="flex flex-wrap gap-1">
                  {schedule.recentReview.map((key) => (
                    <div
                      key={key}
                      className="px-2 py-0.5 rounded bg-accent/50 text-xs"
                    >
                      <VerseKeyLabel verseKey={key} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Distant review (Manzil) */}
            {schedule.distantReview.length > 0 && (
              <Section
                icon={<RotateCcw className="h-4 w-4 text-purple-500" />}
                title="Older Review (Manzil)"
                badge={`${schedule.distantReview.length} verse${schedule.distantReview.length > 1 ? "s" : ""}`}
                badgeColor="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                time={schedule.timeBreakdown.distantReview}
              >
                <div className="flex flex-wrap gap-1">
                  {schedule.distantReview.map((key) => (
                    <div
                      key={key}
                      className="px-2 py-0.5 rounded bg-accent/50 text-xs"
                    >
                      <VerseKeyLabel verseKey={key} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* FSRS due cards */}
            {schedule.fsrsDueCards.length > 0 && (
              <Section
                icon={<RefreshCw className="h-4 w-4 text-orange-500" />}
                title="SRS Reviews Due"
                badge={`${schedule.fsrsDueCards.length} card${schedule.fsrsDueCards.length > 1 ? "s" : ""}`}
                badgeColor="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                time={schedule.timeBreakdown.fsrsReview}
              >
                <div className="flex flex-wrap gap-1">
                  {schedule.fsrsDueCards.slice(0, 10).map((card) => (
                    <div
                      key={card.verseKey}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs",
                        card.daysOverdue > 3
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-accent/50"
                      )}
                    >
                      <span className="text-muted-foreground">
                        {SURAH_NAMES[card.surahNumber - 1]} {card.verseKey}
                        {card.daysOverdue > 0 && (
                          <span className="text-red-500 ml-1">
                            ({card.daysOverdue}d overdue)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                  {schedule.fsrsDueCards.length > 10 && (
                    <span className="text-xs text-muted-foreground px-2 py-0.5">
                      +{schedule.fsrsDueCards.length - 10} more
                    </span>
                  )}
                </div>
              </Section>
            )}
          </>
        )}

        {/* Complete button */}
        {hasContent && !schedule.planTargetCompleted && (
          <Button
            onClick={onComplete}
            disabled={isCompletePending}
            className="w-full"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isCompletePending ? "Completing..." : "Mark Today as Complete"}
          </Button>
        )}

        {schedule.planTargetCompleted && (
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 py-2">
            <CheckCircle2 className="h-4 w-4" />
            Today&apos;s target is complete!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Section wrapper for each study category */
function Section({
  icon,
  title,
  badge,
  badgeColor,
  time,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  badgeColor: string;
  time: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
          <span
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
              badgeColor
            )}
          >
            {badge}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          ~{Math.ceil(time)} min
        </span>
      </div>
      {children}
    </div>
  );
}
