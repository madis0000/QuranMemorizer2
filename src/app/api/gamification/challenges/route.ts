import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateDailyChallenge } from "@/lib/gamification/challenges";

/**
 * GET /api/gamification/challenges
 * Query params:
 *   ?type=daily → today's daily challenge
 *   ?history=true → user's attempt history
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const history = searchParams.get("history") === "true";

    if (type === "daily") {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Find or create today's daily challenge
      let challenge = await prisma.challenge.findFirst({
        where: { isDaily: true, activeDate: today },
        include: {
          attempts: {
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!challenge) {
        const config = generateDailyChallenge(today);
        challenge = await prisma.challenge.create({
          data: {
            type: config.type,
            title: config.title,
            description: config.description ?? null,
            config: {
              surahNumber: config.surahNumber,
              timeLimit: config.timeLimit,
              accuracyThreshold: config.accuracyThreshold,
              verseCount: config.verseCount,
            },
            xpReward: config.xpReward,
            isDaily: true,
            activeDate: today,
          },
          include: {
            attempts: {
              where: { userId: session.user.id },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });
      }

      return NextResponse.json({ challenge });
    }

    if (history) {
      const attempts = await prisma.challengeAttempt.findMany({
        where: { userId: session.user.id },
        include: { challenge: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return NextResponse.json({ attempts });
    }

    // Default: return all available challenges
    const challenges = await prisma.challenge.findMany({
      include: {
        attempts: {
          where: { userId: session.user.id },
          orderBy: { score: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Challenges GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gamification/challenges
 * Submit a challenge attempt
 * Body: { challengeId, score, accuracy?, duration, completed, stars? }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId, score, accuracy, duration, completed, stars } =
      await request.json();

    if (!challengeId || score === undefined || !duration) {
      return NextResponse.json(
        { error: "Missing required fields: challengeId, score, duration" },
        { status: 400 }
      );
    }

    // Verify challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const attempt = await prisma.challengeAttempt.create({
      data: {
        userId: session.user.id,
        challengeId,
        score,
        accuracy: accuracy ?? null,
        duration,
        completed: completed ?? false,
        stars: stars ?? 0,
      },
    });

    return NextResponse.json({ attempt }, { status: 201 });
  } catch (error) {
    console.error("Challenges POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
