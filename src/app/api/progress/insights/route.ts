import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { SURAH_NAMES } from "@/lib/curriculum/plan-generator";
import { prisma } from "@/lib/db";

interface Insight {
  id: string;
  icon: string;
  text: string;
  actionUrl?: string;
  priority: number;
}

/**
 * GET /api/progress/insights
 * Returns AI coach insights generated from user's data patterns.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const insights = await getCached<Insight[]>(
      `insights:${userId}`,
      900, // 15 min TTL
      async () => generateInsights(userId)
    );

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}

async function generateInsights(userId: string): Promise<Insight[]> {
  const now = new Date();
  const insights: Insight[] = [];

  // 1. Best practice time analysis
  const sessions = await prisma.recitationSession.findMany({
    where: { userId, status: "COMPLETED" },
    select: { createdAt: true, accuracy: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  if (sessions.length >= 5) {
    const hourBuckets = new Map<number, { total: number; count: number }>();
    for (const s of sessions) {
      const hour = new Date(s.createdAt).getHours();
      const bucket = hourBuckets.get(hour) ?? { total: 0, count: 0 };
      bucket.total += s.accuracy ?? 0;
      bucket.count++;
      hourBuckets.set(hour, bucket);
    }

    let bestHour = -1;
    let bestAvg = 0;
    for (const [hour, data] of hourBuckets) {
      if (data.count >= 2) {
        const avg = data.total / data.count;
        if (avg > bestAvg) {
          bestAvg = avg;
          bestHour = hour;
        }
      }
    }

    if (bestHour >= 0) {
      const timeLabel =
        bestHour < 7
          ? "Fajr time"
          : bestHour < 12
            ? "morning"
            : bestHour < 17
              ? "afternoon"
              : "evening";
      insights.push({
        id: "best-time",
        icon: "clock",
        text: `Your best time is ${timeLabel} (${bestHour}:00) with ${Math.round(bestAvg)}% accuracy`,
        priority: 3,
      });
    }
  }

  // 2. Urgent review analysis
  const overdueCards = await prisma.fSRSCard.findMany({
    where: {
      userId,
      due: { lt: now },
      reps: { gt: 0 },
    },
    select: { surahNumber: true },
  });

  if (overdueCards.length > 0) {
    // Group by surah
    const surahCounts = new Map<number, number>();
    for (const card of overdueCards) {
      surahCounts.set(
        card.surahNumber,
        (surahCounts.get(card.surahNumber) ?? 0) + 1
      );
    }

    // Find surah with most overdue
    let worstSurah = 0;
    let worstCount = 0;
    for (const [surah, count] of surahCounts) {
      if (count > worstCount) {
        worstCount = count;
        worstSurah = surah;
      }
    }

    if (worstSurah > 0) {
      const surahName = SURAH_NAMES[worstSurah - 1] ?? `Surah ${worstSurah}`;
      insights.push({
        id: "urgent-review",
        icon: "alert-triangle",
        text: `${surahName} has ${worstCount} verse${worstCount > 1 ? "s" : ""} needing urgent review`,
        actionUrl: `/memorize?surah=${worstSurah}&mode=review`,
        priority: 5,
      });
    }

    if (overdueCards.length > 10) {
      insights.push({
        id: "overdue-total",
        icon: "calendar-clock",
        text: `You have ${overdueCards.length} overdue reviews. A 15-minute session can clear the most urgent ones`,
        actionUrl: "/memorize",
        priority: 4,
      });
    }
  }

  // 3. Streak pattern analysis
  const streakHistory = await prisma.streakHistory.findMany({
    where: { userId },
    select: { date: true, isActive: true },
    orderBy: { date: "desc" },
    take: 90,
  });

  if (streakHistory.length >= 14) {
    const dayOfWeekCounts = new Array(7).fill(0);
    const dayOfWeekActive = new Array(7).fill(0);
    for (const entry of streakHistory) {
      const dow = new Date(entry.date).getDay();
      dayOfWeekCounts[dow]++;
      if (entry.isActive) dayOfWeekActive[dow]++;
    }

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let bestDay = 0;
    let bestRate = 0;
    let worstDay = 0;
    let worstRate = 1;

    for (let i = 0; i < 7; i++) {
      if (dayOfWeekCounts[i] > 0) {
        const rate = dayOfWeekActive[i] / dayOfWeekCounts[i];
        if (rate > bestRate) {
          bestRate = rate;
          bestDay = i;
        }
        if (rate < worstRate) {
          worstRate = rate;
          worstDay = i;
        }
      }
    }

    if (bestRate > worstRate + 0.2) {
      insights.push({
        id: "streak-pattern",
        icon: "calendar",
        text: `You're most consistent on ${dayNames[bestDay]}s. Try adding ${dayNames[worstDay]}s to build a stronger habit`,
        priority: 2,
      });
    }
  }

  // 4. Mistake pattern analysis
  const recentMistakes = await prisma.mistake.findMany({
    where: { userId },
    select: { type: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  if (recentMistakes.length >= 10) {
    const typeCounts = new Map<string, number>();
    for (const m of recentMistakes) {
      typeCounts.set(m.type, (typeCounts.get(m.type) ?? 0) + 1);
    }

    let dominantType = "";
    let maxCount = 0;
    for (const [type, count] of typeCounts) {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type;
      }
    }

    const adviceMap: Record<string, string> = {
      WRONG_WORD:
        "Wrong word substitutions are most common — focus on reviewing similar verses",
      SKIPPED:
        "Skipped words are most common — try slowing down your recitation pace",
      ADDED:
        "Extra words are most common — listen to the audio more before reciting",
      TASHKEEL:
        "Diacritical errors are most common — practice with Tajweed mode enabled",
      ORDER:
        "Word order errors are most common — review the structure of longer verses",
    };

    if (dominantType && adviceMap[dominantType]) {
      insights.push({
        id: "mistake-pattern",
        icon: "target",
        text: adviceMap[dominantType],
        priority: 3,
      });
    }
  }

  // 5. Progress milestone prediction
  const totalCards = await prisma.fSRSCard.count({ where: { userId } });
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const recentCards = await prisma.fSRSCard.count({
    where: { userId, createdAt: { gte: fourWeeksAgo } },
  });
  const weeklyRate = recentCards / 4;

  if (weeklyRate > 0 && totalCards > 0) {
    // Predict when they'll reach next major milestone
    const milestones = [50, 100, 200, 500, 1000, 2000, 3000, 6236];
    for (const milestone of milestones) {
      if (totalCards < milestone) {
        const remaining = milestone - totalCards;
        const weeksNeeded = remaining / weeklyRate;
        if (weeksNeeded <= 52) {
          const targetDate = new Date(
            now.getTime() + weeksNeeded * 7 * 24 * 60 * 60 * 1000
          );
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          insights.push({
            id: "milestone-prediction",
            icon: "trending-up",
            text: `At your current pace, you'll reach ${milestone} verses by ${monthNames[targetDate.getMonth()]}`,
            priority: 2,
          });
        }
        break;
      }
    }
  }

  // Sort by priority (highest first) and return top 5
  return insights.sort((a, b) => b.priority - a.priority).slice(0, 5);
}
