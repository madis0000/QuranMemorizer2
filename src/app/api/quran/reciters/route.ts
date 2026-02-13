import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const reciters = await getCached("quran:reciters", 86400, () =>
      prisma.quranReciter.findMany({
        orderBy: { name: "asc" },
      })
    );

    return NextResponse.json(reciters);
  } catch (error) {
    console.error("Failed to fetch reciters:", error);
    return NextResponse.json(
      { error: "Failed to fetch reciters" },
      { status: 500 }
    );
  }
}
