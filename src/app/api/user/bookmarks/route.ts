import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/user/bookmarks - Fetch user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const surahNumberParam = searchParams.get("surahNumber");

    const where: Record<string, unknown> = { userId };

    if (surahNumberParam) {
      const surahNumber = parseInt(surahNumberParam, 10);
      if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        return NextResponse.json(
          { error: "surahNumber must be between 1 and 114" },
          { status: 400 }
        );
      }
      where.surahNumber = surahNumber;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/user/bookmarks - Create a bookmark
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { surahNumber, ayahNumber, pageNumber, title, note, color } = body;

    // Validate required fields
    if (surahNumber == null || ayahNumber == null) {
      return NextResponse.json(
        { error: "Missing required fields: surahNumber, ayahNumber" },
        { status: 400 }
      );
    }

    // Validate surah number range
    if (surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: "surahNumber must be between 1 and 114" },
        { status: 400 }
      );
    }

    // Validate ayah number is positive
    if (ayahNumber < 1) {
      return NextResponse.json(
        { error: "ayahNumber must be a positive number" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        surahNumber,
        ayahNumber,
        pageNumber: pageNumber ?? null,
        title: title ?? null,
        note: note ?? null,
        color: color ?? null,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/bookmarks - Delete a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("id");

    if (!bookmarkId) {
      return NextResponse.json(
        { error: "Missing required query parameter: id" },
        { status: 400 }
      );
    }

    // Verify bookmark exists and belongs to the user
    const bookmark = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
