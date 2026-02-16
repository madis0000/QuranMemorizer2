"use client";

import { useState } from "react";
import { SURAH_NAMES } from "@/data/hizb-data";
import { SUBJECT_THEMES } from "@/data/subject-themes";
import {
  ChevronDown,
  ChevronRight,
  Flame,
  RefreshCw,
  Star,
  Target,
  Zap,
} from "lucide-react";

import type { DetectedMistake } from "@/lib/memorization/mistakeDetector";
import { cn } from "@/lib/utils";
import type {
  AyahAttempt,
  SessionSummary as SessionSummaryType,
} from "@/stores/sessionStore";
import { MistakeList } from "@/components/memorization/MistakeHighlight";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SessionSummaryEnhancedProps {
  summary: SessionSummaryType;
  detectedMistakes?: DetectedMistake[];
  sessionXP: number;
  maxCombo: number;
  onClose: () => void;
  onRetry: () => void;
  onDrillMistakes?: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function getGrade(accuracy: number) {
  if (accuracy >= 95)
    return {
      label: "Excellent",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "from-emerald-500 to-teal-500",
    };
  if (accuracy >= 85)
    return {
      label: "Great",
      color: "text-emerald-500",
      bg: "from-green-500 to-emerald-500",
    };
  if (accuracy >= 70)
    return {
      label: "Good",
      color: "text-amber-500",
      bg: "from-amber-500 to-yellow-500",
    };
  if (accuracy >= 50)
    return {
      label: "Keep Going",
      color: "text-orange-500",
      bg: "from-orange-500 to-amber-500",
    };
  return {
    label: "Try Again",
    color: "text-red-500",
    bg: "from-red-500 to-orange-500",
  };
}

export function SessionSummaryEnhanced({
  summary,
  detectedMistakes = [],
  sessionXP,
  maxCombo,
  onClose,
  onRetry,
  onDrillMistakes,
}: SessionSummaryEnhancedProps) {
  const [expandedAyah, setExpandedAyah] = useState<string | null>(null);
  const grade = getGrade(summary.accuracy);

  const ayahEntries = Object.entries(summary.ayahHistory).sort(([a], [b]) => {
    const [sA, aA] = a.split(":").map(Number);
    const [sB, aB] = b.split(":").map(Number);
    return sA !== sB ? sA - sB : aA - aB;
  });

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div
          className={`bg-gradient-to-br ${grade.bg} p-6 text-white text-center`}
        >
          <div className="text-5xl font-black tabular-nums mb-1">
            {summary.accuracy}%
          </div>
          <div className="text-lg font-semibold opacity-90">{grade.label}</div>
          <div className="text-sm opacity-75 mt-1">
            <SessionTarget summary={summary} />
          </div>
        </div>

        <CardContent className="p-4">
          {/* XP + Combo Row */}
          <div className="flex items-center justify-center gap-6 py-3 border-b mb-4">
            {sessionXP > 0 && (
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  +{sessionXP}
                </span>
                <span className="text-xs text-muted-foreground">XP</span>
              </div>
            )}
            {maxCombo >= 3 && (
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {maxCombo}x
                </span>
                <span className="text-xs text-muted-foreground">max combo</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <Stat label="Duration" value={formatDuration(summary.duration)} />
            <Stat
              label="Verses"
              value={`${summary.versesCompleted}/${summary.totalVerses}`}
            />
            <Stat label="Words" value={String(summary.wordsRecited)} />
            <Stat label="Mistakes" value={String(summary.mistakes.length)} />
          </div>
        </CardContent>
      </Card>

      {/* Ayah-by-Ayah Breakdown */}
      {ayahEntries.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Ayah Breakdown
            </h3>
            <div className="space-y-1">
              {ayahEntries.map(([key, attempt]) => (
                <AyahRow
                  key={key}
                  verseKey={key}
                  attempt={attempt}
                  isExpanded={expandedAyah === key}
                  onToggle={() =>
                    setExpandedAyah(expandedAyah === key ? null : key)
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weak Ayah Highlight */}
      {summary.weakAyahs.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-red-500" />
                Needs More Practice ({summary.weakAyahs.length})
              </h3>
              {onDrillMistakes && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs"
                  onClick={onDrillMistakes}
                >
                  Drill These
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {summary.weakAyahs.map((a) => (
                <span
                  key={`${a.surahNumber}:${a.ayahNumber}`}
                  className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full"
                >
                  {a.surahNumber}:{a.ayahNumber} — {a.bestAccuracy}%
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Perfect Ayahs */}
      {summary.perfectAyahs.length > 0 && (
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-emerald-500" />
              Perfect Recitation ({summary.perfectAyahs.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {summary.perfectAyahs.map((a) => (
                <span
                  key={`${a.surahNumber}:${a.ayahNumber}`}
                  className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full"
                >
                  {a.surahNumber}:{a.ayahNumber}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mistake Details */}
      {detectedMistakes.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Mistake Details</h3>
            <MistakeList mistakes={detectedMistakes} />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-2 pb-6">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Done
        </Button>
        <Button className="flex-1" onClick={onRetry}>
          Practice Again
        </Button>
        {onDrillMistakes && summary.weakAyahs.length > 0 && (
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onDrillMistakes}
          >
            Drill Mistakes
          </Button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function AyahRow({
  verseKey,
  attempt,
  isExpanded,
  onToggle,
}: {
  verseKey: string;
  attempt: AyahAttempt;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [surah, ayah] = verseKey.split(":").map(Number);
  const surahName = SURAH_NAMES[surah] ?? `${surah}`;
  const isPerfect = attempt.bestAccuracy >= 95;
  const isWeak = attempt.bestAccuracy < 70;

  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-sm",
        isExpanded ? "bg-muted/50" : "hover:bg-muted/30"
      )}
    >
      {/* Accuracy dot */}
      <div
        className={cn(
          "w-2 h-2 rounded-full shrink-0",
          isPerfect ? "bg-emerald-500" : isWeak ? "bg-red-500" : "bg-amber-400"
        )}
      />

      {/* Verse ref */}
      <span className="text-xs font-medium w-20 shrink-0">
        {surahName} {ayah}
      </span>

      {/* Accuracy */}
      <span
        className={cn(
          "text-xs font-bold tabular-nums w-10",
          isPerfect
            ? "text-emerald-600 dark:text-emerald-400"
            : isWeak
              ? "text-red-500"
              : "text-amber-500"
        )}
      >
        {attempt.bestAccuracy}%
      </span>

      {/* Attempts + time */}
      <span className="text-[10px] text-muted-foreground flex-1">
        {attempt.attempts} attempt{attempt.attempts !== 1 ? "s" : ""}
        {attempt.totalTime > 0 && ` · ${Math.round(attempt.totalTime / 1000)}s`}
      </span>

      {/* FSRS rating badge */}
      {attempt.fsrsRating && (
        <span
          className={cn(
            "text-[9px] px-1.5 py-0.5 rounded font-medium",
            attempt.fsrsRating === 4
              ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
              : attempt.fsrsRating === 3
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : attempt.fsrsRating === 2
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          )}
        >
          {["", "Again", "Hard", "Good", "Easy"][attempt.fsrsRating]}
        </span>
      )}

      <span className="text-muted-foreground">
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </span>
    </button>
  );
}

function SessionTarget({ summary }: { summary: SessionSummaryType }) {
  const surahName =
    SURAH_NAMES[summary.surahNumber] ?? `Surah ${summary.surahNumber}`;
  switch (summary.targetType) {
    case "mushaf":
      return (
        <>
          {surahName} {summary.startAyah}-{summary.endAyah}
        </>
      );
    case "ayah":
      return (
        <>
          {surahName} {summary.startAyah}-{summary.endAyah}
        </>
      );
    case "surah":
      return <>{surahName}</>;
    case "juz":
      return <>Juz {summary.juzNumber ?? "?"}</>;
    case "hizb":
      return <>Hizb {summary.hizbNumber ?? "?"}</>;
    case "subject": {
      const theme = SUBJECT_THEMES.find((t) => t.id === summary.subjectId);
      return <>{theme?.nameEn ?? "Subject"}</>;
    }
    default:
      return (
        <>
          {surahName} {summary.startAyah}-{summary.endAyah}
        </>
      );
  }
}
