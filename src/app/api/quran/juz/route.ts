import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const juz = await getCached("quran:juz:all", 86400, () =>
      prisma.quranJuz.findMany({
        orderBy: { number: "asc" },
      })
    );

    return NextResponse.json(juz);
  } catch (error) {
    console.error("Failed to fetch juz:", error);
    return NextResponse.json({ error: "Failed to fetch juz" }, { status: 500 });
  }
}
