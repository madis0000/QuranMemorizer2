import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const surahs = await getCached("quran:surahs", 86400, () =>
      prisma.quranSurah.findMany({
        orderBy: { number: "asc" },
      })
    );

    return NextResponse.json(surahs);
  } catch (error) {
    console.error("Failed to fetch surahs:", error);
    return NextResponse.json(
      { error: "Failed to fetch surahs" },
      { status: 500 }
    );
  }
}
