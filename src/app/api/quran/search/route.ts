import { NextResponse, type NextRequest } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

function removeArabicDiacritics(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670]/g, "");
}

function normalizeForSearch(text: string): string {
  return removeArabicDiacritics(text)
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0629/g, "\u0647")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0640/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const normalizedQuery = normalizeForSearch(query);

    // Cache key based on normalized query hash
    const cacheKey = `quran:search:${Buffer.from(normalizedQuery).toString("base64").slice(0, 32)}`;

    const results = await getCached(cacheKey, 300, async () => {
      // Use ILIKE for partial matching on diacritics-stripped text
      const rows = await prisma.$queryRaw<
        Array<{
          surahNumber: number;
          numberInSurah: number;
          text: string;
          textSimple: string;
        }>
      >`
        SELECT "surahNumber", "numberInSurah", "text", "textSimple"
        FROM "QuranAyah"
        WHERE "textSimple" ILIKE ${"%" + normalizedQuery + "%"}
        ORDER BY "surahNumber" ASC, "numberInSurah" ASC
        LIMIT ${limit}
      `;

      return rows.map((row) => ({
        surahNumber: row.surahNumber,
        ayahNumber: row.numberInSurah,
        text: row.text,
        highlightedText: row.text,
        matchScore: 1.0,
      }));
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to search:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
