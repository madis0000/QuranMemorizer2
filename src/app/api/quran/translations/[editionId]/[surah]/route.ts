import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ editionId: string; surah: string }> }
) {
  try {
    const { editionId, surah } = await params;
    const surahNumber = parseInt(surah, 10);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: "Invalid surah number (1-114)" },
        { status: 400 }
      );
    }

    const translations = await getCached(
      `quran:trans:${editionId}:${surahNumber}`,
      86400,
      () =>
        prisma.quranTranslation.findMany({
          where: { editionId, surahNumber },
          orderBy: { ayahNumber: "asc" },
          select: {
            surahNumber: true,
            ayahNumber: true,
            text: true,
          },
        })
    );

    return NextResponse.json(translations);
  } catch (error) {
    console.error("Failed to fetch translation:", error);
    return NextResponse.json(
      { error: "Failed to fetch translation" },
      { status: 500 }
    );
  }
}
