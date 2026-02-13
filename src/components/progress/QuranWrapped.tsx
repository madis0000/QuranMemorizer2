"use client";

import { useCallback, useRef, useState } from "react";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { WrappedCard } from "./WrappedCard";

interface WrappedData {
  period: string;
  periodLabel: string;
  totalSessions: number;
  totalMinutes: number;
  versesMemorized: number;
  strongestSurah: {
    surahNumber: number;
    name: string;
    accuracy: number;
    sessions: number;
  } | null;
  mostImproved: {
    surahNumber: number;
    name: string;
    improvement: number;
  } | null;
  totalXP: number;
  league: string | null;
  longestStreak: number;
  badgesEarned: number;
  favoriteDay: string;
}

interface QuranWrappedProps {
  data: WrappedData;
  className?: string;
}

const GRADIENTS = [
  "bg-gradient-to-br from-emerald-600 to-teal-800",
  "bg-gradient-to-br from-violet-600 to-purple-800",
  "bg-gradient-to-br from-amber-500 to-orange-700",
  "bg-gradient-to-br from-cyan-600 to-blue-800",
  "bg-gradient-to-br from-rose-500 to-pink-700",
  "bg-gradient-to-br from-emerald-500 to-green-800",
];

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function QuranWrapped({ data, className }: QuranWrappedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const cards: Array<{
    title: string;
    value: string;
    subtitle?: string;
    gradient: string;
  }> = [];

  // Card 1: Total time
  if (data.totalMinutes > 0) {
    cards.push({
      title: "Time With The Quran",
      value: formatMinutes(data.totalMinutes),
      subtitle: `Across ${data.totalSessions} sessions`,
      gradient: GRADIENTS[0],
    });
  }

  // Card 2: Verses memorized
  if (data.versesMemorized > 0) {
    cards.push({
      title: "Verses Memorized",
      value: data.versesMemorized.toString(),
      subtitle: "New verses entered your heart",
      gradient: GRADIENTS[1],
    });
  }

  // Card 3: Strongest surah
  if (data.strongestSurah) {
    cards.push({
      title: "Strongest Surah",
      value: data.strongestSurah.name,
      subtitle: `${data.strongestSurah.accuracy}% accuracy`,
      gradient: GRADIENTS[2],
    });
  }

  // Card 4: Most improved
  if (data.mostImproved) {
    cards.push({
      title: "Most Improved",
      value: data.mostImproved.name,
      subtitle: `+${data.mostImproved.improvement}% improvement`,
      gradient: GRADIENTS[3],
    });
  }

  // Card 5: Streak & badges
  if (data.longestStreak > 0 || data.badgesEarned > 0) {
    cards.push({
      title: "Consistency",
      value: `${data.longestStreak}-day streak`,
      subtitle:
        data.badgesEarned > 0
          ? `${data.badgesEarned} badge${data.badgesEarned > 1 ? "s" : ""} earned`
          : `Favorite day: ${data.favoriteDay}`,
      gradient: GRADIENTS[4],
    });
  }

  // Card 6: Summary
  if (data.totalXP > 0) {
    cards.push({
      title: data.periodLabel,
      value: `${data.totalXP.toLocaleString()} XP`,
      subtitle: data.league ? `League: ${data.league}` : "Keep going!",
      gradient: GRADIENTS[5],
    });
  }

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      // Try Web Share API first
      if (navigator.share) {
        await navigator.share({
          title: `My Quran ${data.periodLabel} Wrapped`,
          text: `I spent ${formatMinutes(data.totalMinutes)} with the Quran and memorized ${data.versesMemorized} verses this ${data.period}!`,
        });
      }
    } catch {
      // User cancelled or API not available — silently ignore
    } finally {
      setSharing(false);
    }
  }, [data]);

  if (cards.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Quran Wrapped</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Keep practicing to unlock your Quran Wrapped summary.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Quran Wrapped - {data.periodLabel}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={sharing}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
        >
          {cards.map((card, i) => (
            <div key={i} className="snap-center">
              <WrappedCard
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                gradient={card.gradient}
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Swipe to explore your journey
        </p>
      </CardContent>
    </Card>
  );
}
