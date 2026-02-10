import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/quran/similar
 * Get similar verse pairs.
 * Query params:
 *   ?verseKey=2:35 → pairs for that verse
 *   ?all=true&page=1&limit=20 → all pairs (paginated)
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const verseKey = searchParams.get("verseKey");
    const all = searchParams.get("all") === "true";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
    const offset = (page - 1) * limit;

    if (verseKey) {
      const pairs = await prisma.similarVersePair.findMany({
        where: {
          OR: [{ verse1Key: verseKey }, { verse2Key: verseKey }],
        },
        orderBy: { similarity: "desc" },
      });

      return NextResponse.json({ pairs, total: pairs.length });
    }

    if (all) {
      const [pairs, total] = await Promise.all([
        prisma.similarVersePair.findMany({
          orderBy: { similarity: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.similarVersePair.count(),
      ]);

      return NextResponse.json({
        pairs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Default: return top 20 by similarity
    const pairs = await prisma.similarVersePair.findMany({
      orderBy: { similarity: "desc" },
      take: 20,
    });

    return NextResponse.json({ pairs });
  } catch (error) {
    console.error("Similar verses GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
