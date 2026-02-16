"use client";

import { useEffect, useRef, useState } from "react";
import { SURAH_NAMES } from "@/data/hizb-data";
import { ChevronRight, RefreshCw, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AyahCompletionCardProps {
  surahNumber: number;
  ayahNumber: number;
  accuracy: number;
  wordCount: number;
  comboCount: number;
  multiplier: number;
  /** Called with the user's FSRS self-rating */
  onRate: (rating: 1 | 2 | 3 | 4) => void;
  onRetry: () => void;
  onNext: () => void;
  /** Whether this is the last ayah in the session */
  isLastAyah: boolean;
}

const RATINGS = [
  {
    value: 1 as const,
    label: "Again",
    color: "bg-red-500 hover:bg-red-600 text-white",
    desc: "Didn't know it",
  },
  {
    value: 2 as const,
    label: "Hard",
    color: "bg-amber-500 hover:bg-amber-600 text-white",
    desc: "Struggled",
  },
  {
    value: 3 as const,
    label: "Good",
    color: "bg-emerald-600 hover:bg-emerald-700 text-white",
    desc: "Got it",
  },
  {
    value: 4 as const,
    label: "Easy",
    color: "bg-cyan-500 hover:bg-cyan-600 text-white",
    desc: "Effortless",
  },
] as const;

function getAutoRating(accuracy: number): 1 | 2 | 3 | 4 {
  if (accuracy >= 95) return 4;
  if (accuracy >= 80) return 3;
  if (accuracy >= 60) return 2;
  return 1;
}

export function AyahCompletionCard({
  surahNumber,
  ayahNumber,
  accuracy,
  wordCount,
  comboCount,
  multiplier,
  onRate,
  onRetry,
  onNext,
  isLastAyah,
}: AyahCompletionCardProps) {
  const [dismissed, setDismissed] = useState(false);
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 1.5s if accuracy >= 90%, with "Good" as default rating
  useEffect(() => {
    if (accuracy >= 90) {
      autoDismissRef.current = setTimeout(() => {
        onRate(getAutoRating(accuracy));
        setDismissed(true);
        onNext();
      }, 1500);
      return () => {
        if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
      };
    }
  }, [accuracy, onRate, onNext]);

  const handleRate = (rating: 1 | 2 | 3 | 4) => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    onRate(rating);
    setDismissed(true);
    onNext();
  };

  const handleRetry = () => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    onRate(1); // "Again" for retries
    setDismissed(true);
    onRetry();
  };

  if (dismissed) return null;

  const isPerfect = accuracy >= 95;
  const isWeak = accuracy < 70;
  const surahName = SURAH_NAMES[surahNumber] ?? `Surah ${surahNumber}`;
  const highlightedRating = getAutoRating(accuracy);

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 mx-2 lg:mx-4 mb-2">
      <div
        className={`rounded-xl border shadow-lg overflow-hidden backdrop-blur-md ${
          isPerfect
            ? "bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
            : isWeak
              ? "bg-red-50/90 dark:bg-red-950/50 border-red-200 dark:border-red-800"
              : "bg-white/90 dark:bg-[#0F1A14]/90 border-[#D1E0D8]/60 dark:border-[#1E3228]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            {isPerfect ? (
              <div className="h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <Star className="h-4 w-4 text-white fill-white" />
              </div>
            ) : (
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  isWeak ? "bg-red-500" : "bg-amber-500"
                }`}
              >
                {accuracy}%
              </div>
            )}
            <div>
              <div className="text-sm font-semibold">
                {surahName} {surahNumber}:{ayahNumber}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {wordCount} words · {accuracy}% accuracy
                {comboCount >= 3 && ` · ${comboCount}x combo`}
                {multiplier > 1 && ` · ${multiplier}x XP`}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
            {!isLastAyah && (
              <Button
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleRate(highlightedRating)}
              >
                Next
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            )}
          </div>
        </div>

        {/* FSRS Rating Row */}
        <div className="px-4 pb-3">
          <div className="text-[10px] text-muted-foreground mb-1.5">
            How well did you know this?
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {RATINGS.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => handleRate(value)}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${color} ${
                  value === highlightedRating
                    ? "ring-2 ring-offset-1 ring-current scale-105"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Auto-dismiss progress for high accuracy */}
        {accuracy >= 90 && (
          <div className="h-0.5 bg-emerald-500/20">
            <div className="h-full bg-emerald-500 animate-shrink-bar" />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-shrink-bar {
          animation: shrink-bar 1.5s linear forwards;
        }
      `}</style>
    </div>
  );
}
