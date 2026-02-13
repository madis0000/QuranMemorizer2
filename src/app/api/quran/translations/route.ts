import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const editions = await getCached("quran:translations:list", 86400, () =>
      prisma.translationEdition.findMany({
        orderBy: [
          { isPopular: "desc" },
          { language: "asc" },
          { englishName: "asc" },
        ],
      })
    );

    return NextResponse.json(editions);
  } catch (error) {
    console.error("Failed to fetch translations:", error);
    return NextResponse.json(
      { error: "Failed to fetch translations" },
      { status: 500 }
    );
  }
}
