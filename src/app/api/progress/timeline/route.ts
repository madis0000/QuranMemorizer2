import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { SURAH_NAMES } from "@/lib/curriculum/plan-generator";
import { prisma } from "@/lib/db";

interface Milestone {
  date: string;
  type: string;
  title: string;
  subtitle?: string;
  isPast: boolean;
  confidence?: {
    optimistic: string;
    conservative: string;
  };
}

/**
 * GET /api/progress/timeline
 * Returns predictive journey timeline with past and future milestones.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const data = await getCached(
      `timeline:${userId}`,
      900, // 15 min TTL
      async () => computeTimeline(userId)
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Timeline error:", error);
    return NextResponse.json(
      { error: "Failed to compute timeline" },
      { status: 500 }
    );
  }
}

async function computeTimeline(userId: string) {
  const now = new Date();
  const milestones: Milestone[] = [];

  // 1. Past milestones: first session
  const firstSession = await prisma.recitationSession.findFirst({
    where: { userId, status: "COMPLETED" },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true, surahNumber: true },
  });

  if (firstSession) {
    const surahName =
      SURAH_NAMES[firstSession.surahNumber - 1] ??
      `Surah ${firstSession.surahNumber}`;
    milestones.push({
      date: firstSession.createdAt.toISOString(),
      type: "first_session",
      title: "Journey Started",
      subtitle: `First recitation: ${surahName}`,
      isPast: true,
    });
  }

  // 2. Past milestones: streak records
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { longestStreak: true, createdAt: true },
  });

  if (user && user.longestStreak >= 7) {
    milestones.push({
      date: now.toISOString(), // Approximate
      type: "streak_record",
      title: `${user.longestStreak}-Day Streak`,
      subtitle: "Personal best",
      isPast: true,
    });
  }

  // 3. Past milestones: badges earned
  const badges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: { select: { name: true } } },
    orderBy: { earnedAt: "desc" },
    take: 5,
  });

  for (const ub of badges) {
    milestones.push({
      date: ub.earnedAt.toISOString(),
      type: "badge",
      title: ub.badge.name,
      subtitle: "Badge earned",
      isPast: true,
    });
  }

  // 4. Past milestones: surah completions (surahs where all ayahs have FSRS cards)
  const surahCardCounts = await prisma.fSRSCard.groupBy({
    by: ["surahNumber"],
    where: { userId },
    _count: { id: true },
  });

  const surahInfo = await prisma.quranSurah.findMany({
    select: { number: true, numberOfAyahs: true },
  });
  const surahAyahMap = new Map<number, number>();
  for (const s of surahInfo) {
    surahAyahMap.set(s.number, s.numberOfAyahs);
  }

  for (const group of surahCardCounts) {
    const totalAyahs = surahAyahMap.get(group.surahNumber) ?? 0;
    if (totalAyahs > 0 && group._count.id >= totalAyahs) {
      const name =
        SURAH_NAMES[group.surahNumber - 1] ?? `Surah ${group.surahNumber}`;
      milestones.push({
        date: now.toISOString(), // Approximate
        type: "surah_complete",
        title: `${name} Complete`,
        subtitle: `${totalAyahs} verses memorized`,
        isPast: true,
      });
    }
  }

  // 5. Future predictions based on learning velocity
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const recentCardCount = await prisma.fSRSCard.count({
    where: { userId, createdAt: { gte: fourWeeksAgo } },
  });
  const totalCards = await prisma.fSRSCard.count({ where: { userId } });

  const weeklyRate = recentCardCount / 4;

  if (weeklyRate > 0) {
    // Predict next surah completion
    for (const group of surahCardCounts) {
      const totalAyahs = surahAyahMap.get(group.surahNumber) ?? 0;
      const remaining = totalAyahs - group._count.id;
      if (remaining > 0 && remaining < totalAyahs * 0.5) {
        const weeksNeeded = remaining / weeklyRate;
        if (weeksNeeded <= 26) {
          const predictedDate = new Date(
            now.getTime() + weeksNeeded * 7 * 24 * 60 * 60 * 1000
          );
          const optimisticDate = new Date(
            now.getTime() + weeksNeeded * 0.7 * 7 * 24 * 60 * 60 * 1000
          );
          const conservativeDate = new Date(
            now.getTime() + weeksNeeded * 1.5 * 7 * 24 * 60 * 60 * 1000
          );

          const name =
            SURAH_NAMES[group.surahNumber - 1] ?? `Surah ${group.surahNumber}`;
          milestones.push({
            date: predictedDate.toISOString(),
            type: "surah_predicted",
            title: `Complete ${name}`,
            subtitle: `${remaining} verses remaining`,
            isPast: false,
            confidence: {
              optimistic: optimisticDate.toISOString(),
              conservative: conservativeDate.toISOString(),
            },
          });
        }
      }
    }

    // Predict verse milestones
    const verseMilestones = [100, 250, 500, 1000, 2000, 3000, 6236];
    for (const target of verseMilestones) {
      if (totalCards < target) {
        const remaining = target - totalCards;
        const weeksNeeded = remaining / weeklyRate;
        if (weeksNeeded <= 104) {
          const predictedDate = new Date(
            now.getTime() + weeksNeeded * 7 * 24 * 60 * 60 * 1000
          );
          const optimisticDate = new Date(
            now.getTime() + weeksNeeded * 0.7 * 7 * 24 * 60 * 60 * 1000
          );
          const conservativeDate = new Date(
            now.getTime() + weeksNeeded * 1.5 * 7 * 24 * 60 * 60 * 1000
          );

          milestones.push({
            date: predictedDate.toISOString(),
            type: "verse_milestone",
            title: target === 6236 ? "Complete Quran" : `${target} Verses`,
            subtitle:
              target === 6236
                ? "The ultimate achievement"
                : `${remaining} to go`,
            isPast: false,
            confidence: {
              optimistic: optimisticDate.toISOString(),
              conservative: conservativeDate.toISOString(),
            },
          });
        }
        break; // Only show the next milestone
      }
    }
  }

  // Sort by date
  milestones.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return { milestones };
}
