import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number: numberStr } = await params;
    const surahNumber = parseInt(numberStr, 10);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: "Invalid surah number. Must be 1-114." },
        { status: 400 }
      );
    }

    const data = await getCached(
      `quran:surah:${surahNumber}`,
      86400,
      async () => {
        const surah = await prisma.quranSurah.findUnique({
          where: { number: surahNumber },
        });

        if (!surah) return null;

        const ayahs = await prisma.quranAyah.findMany({
          where: { surahNumber },
          orderBy: { numberInSurah: "asc" },
        });

        return { surah, ayahs };
      }
    );

    if (!data) {
      return NextResponse.json({ error: "Surah not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch surah:", error);
    return NextResponse.json(
      { error: "Failed to fetch surah" },
      { status: 500 }
    );
  }
}
