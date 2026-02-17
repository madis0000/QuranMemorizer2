import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/progress/word-feedback
 * Fetch word feedback for a surah+ayah range.
 * Query params: ?surah=2&startAyah=1&endAyah=10
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const surah = parseInt(searchParams.get("surah") || "0");
    const startAyah = parseInt(searchParams.get("startAyah") || "0");
    const endAyah = parseInt(searchParams.get("endAyah") || "0");

    if (!surah || !startAyah || !endAyah) {
      return NextResponse.json(
        { error: "Missing required params: surah, startAyah, endAyah" },
        { status: 400 }
      );
    }

    const feedback = await prisma.wordFeedback.findMany({
      where: {
        userId: session.user.id,
        surahNumber: surah,
        ayahNumber: { gte: startAyah, lte: endAyah },
      },
      select: {
        wordKey: true,
        totalAttempts: true,
        correctCount: true,
        mistakeCount: true,
        successRate: true,
        streak: true,
        lastCorrect: true,
        lastMistake: true,
      },
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("WordFeedback GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress/word-feedback
 * Bulk upsert word results from a session.
 * Body: { words: [{ wordKey, surahNumber, ayahNumber, wordPosition, correct }] }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty words array" },
        { status: 400 }
      );
    }

    // Cap at 2000 words per request
    if (words.length > 2000) {
      return NextResponse.json(
        { error: "Batch size exceeds maximum of 2000 words" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const now = new Date();

    // Build upsert operations
    const upserts = words.map(
      (w: {
        wordKey: string;
        surahNumber: number;
        ayahNumber: number;
        wordPosition: number;
        correct: boolean;
      }) =>
        prisma.wordFeedback.upsert({
          where: { userId_wordKey: { userId, wordKey: w.wordKey } },
          create: {
            userId,
            wordKey: w.wordKey,
            surahNumber: w.surahNumber,
            ayahNumber: w.ayahNumber,
            wordPosition: w.wordPosition,
            totalAttempts: 1,
            correctCount: w.correct ? 1 : 0,
            mistakeCount: w.correct ? 0 : 1,
            successRate: w.correct ? 1.0 : 0.0,
            streak: w.correct ? 1 : 0,
            lastCorrect: w.correct ? now : null,
            lastMistake: w.correct ? null : now,
          },
          update: {
            totalAttempts: { increment: 1 },
            correctCount: w.correct ? { increment: 1 } : undefined,
            mistakeCount: w.correct ? undefined : { increment: 1 },
            streak: w.correct ? { increment: 1 } : 0,
            lastCorrect: w.correct ? now : undefined,
            lastMistake: w.correct ? undefined : now,
            // successRate is recomputed after the transaction
          },
        })
    );

    // Execute all upserts in a transaction
    const results = await prisma.$transaction(upserts);

    // Recompute successRate for all touched words
    const wordKeys = words.map((w: { wordKey: string }) => w.wordKey);
    const updated = await prisma.wordFeedback.findMany({
      where: { userId, wordKey: { in: wordKeys } },
      select: { id: true, correctCount: true, totalAttempts: true },
    });

    const rateUpdates = updated.map((fb) =>
      prisma.wordFeedback.update({
        where: { id: fb.id },
        data: {
          successRate:
            fb.totalAttempts > 0 ? fb.correctCount / fb.totalAttempts : 0,
        },
      })
    );
    await prisma.$transaction(rateUpdates);

    return NextResponse.json({ upserted: results.length }, { status: 200 });
  } catch (error) {
    console.error("WordFeedback POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
