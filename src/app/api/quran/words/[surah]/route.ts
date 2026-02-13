import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surah: string }> }
) {
  try {
    const { surah } = await params;
    const surahNumber = parseInt(surah, 10);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: "Invalid surah number (1-114)" },
        { status: 400 }
      );
    }

    const words = await getCached(
      `quran:words:surah:${surahNumber}`,
      86400,
      () =>
        prisma.quranWord.findMany({
          where: { surahNumber },
          orderBy: [{ ayahNumber: "asc" }, { position: "asc" }],
        })
    );

    return NextResponse.json(words);
  } catch (error) {
    console.error("Failed to fetch words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
