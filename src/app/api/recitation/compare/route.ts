import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * POST /api/recitation/compare
 * Track per-word accuracy across sessions.
 * Stores individual word accuracy data for long-term analytics.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, surahNumber, ayahNumber, wordResults } = body;

    if (!surahNumber || !ayahNumber || !Array.isArray(wordResults)) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: surahNumber, ayahNumber, wordResults",
        },
        { status: 400 }
      );
    }

    // Store mistakes from the word results
    const mistakes = wordResults
      .filter((wr: { status: string }) => wr.status !== "correct")
      .map(
        (
          wr: {
            originalWord: string;
            recitedWord: string | null;
            status: string;
          },
          index: number
        ) => ({
          userId: session.user!.id,
          sessionId: sessionId || undefined,
          surahNumber,
          ayahNumber,
          wordIndex: index,
          type: mapStatusToMistakeType(wr.status),
          recitedText: wr.recitedWord,
          correctText: wr.originalWord,
          severity:
            wr.status === "tashkeel" ? ("MINOR" as const) : ("MAJOR" as const),
        })
      );

    if (mistakes.length > 0) {
      await prisma.mistake.createMany({
        data: mistakes,
      });
    }

    // Calculate accuracy for this ayah
    const totalWords = wordResults.length;
    const correctWords = wordResults.filter(
      (wr: { status: string }) => wr.status === "correct"
    ).length;
    const accuracy =
      totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;

    return NextResponse.json({
      surahNumber,
      ayahNumber,
      totalWords,
      correctWords,
      accuracy,
      mistakeCount: mistakes.length,
    });
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function mapStatusToMistakeType(status: string) {
  switch (status) {
    case "wrong":
      return "WRONG_WORD" as const;
    case "skipped":
      return "SKIPPED" as const;
    case "tashkeel":
      return "TASHKEEL" as const;
    default:
      return "WRONG_WORD" as const;
  }
}
