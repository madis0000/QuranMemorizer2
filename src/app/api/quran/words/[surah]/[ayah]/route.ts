import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surah: string; ayah: string }> }
) {
  try {
    const { surah, ayah } = await params;
    const surahNumber = parseInt(surah, 10);
    const ayahNumber = parseInt(ayah, 10);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: "Invalid surah number (1-114)" },
        { status: 400 }
      );
    }

    if (isNaN(ayahNumber) || ayahNumber < 1) {
      return NextResponse.json(
        { error: "Invalid ayah number" },
        { status: 400 }
      );
    }

    const words = await getCached(
      `quran:words:${surahNumber}:${ayahNumber}`,
      86400,
      () =>
        prisma.quranWord.findMany({
          where: { surahNumber, ayahNumber },
          orderBy: { position: "asc" },
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
