import { NextResponse } from "next/server";

import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number: numberStr } = await params;
    const pageNumber = parseInt(numberStr, 10);

    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 604) {
      return NextResponse.json(
        { error: "Invalid page number. Must be 1-604." },
        { status: 400 }
      );
    }

    const data = await getCached(`quran:page:${pageNumber}`, 3600, async () => {
      const pageLayout = await prisma.quranPageLayout.findUnique({
        where: { id: pageNumber },
      });

      if (!pageLayout) return null;

      // Return the stored MushafPage JSON directly
      return pageLayout.layout;
    });

    if (!data) {
      return NextResponse.json(
        { error: "Page layout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch page layout:", error);
    return NextResponse.json(
      { error: "Failed to fetch page layout" },
      { status: 500 }
    );
  }
}
