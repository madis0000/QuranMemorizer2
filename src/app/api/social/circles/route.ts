import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/social/circles
 * List circles: my circles, public circles, or discover new ones.
 * Query params: ?filter=mine|public|discover&search=...
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") ?? "mine";
    const search = searchParams.get("search") ?? "";
    const userId = session.user.id;

    if (filter === "mine") {
      const circles = await prisma.hifzCircle.findMany({
        where: {
          members: { some: { userId } },
          ...(search
            ? { name: { contains: search, mode: "insensitive" as const } }
            : {}),
        },
        include: {
          _count: { select: { members: true } },
          members: {
            where: { userId },
            select: { role: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json(
        circles.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          isPublic: c.isPublic,
          memberCount: c._count.members,
          groupStreak: c.groupStreak,
          myRole: c.members[0]?.role ?? null,
          inviteCode: c.inviteCode,
          createdAt: c.createdAt,
        }))
      );
    }

    // Public / discover
    const circles = await prisma.hifzCircle.findMany({
      where: {
        isPublic: true,
        ...(filter === "discover" ? { members: { none: { userId } } } : {}),
        ...(search
          ? { name: { contains: search, mode: "insensitive" as const } }
          : {}),
      },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(
      circles.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        isPublic: c.isPublic,
        memberCount: c._count.members,
        groupStreak: c.groupStreak,
        maxMembers: c.maxMembers,
        createdAt: c.createdAt,
      }))
    );
  } catch (error) {
    console.error("Circles GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/social/circles
 * Create a new Hifz circle. Auto-adds creator as OWNER.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, isPublic, maxMembers } = body as {
      name: string;
      description?: string;
      isPublic?: boolean;
      maxMembers?: number;
    };

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Circle name is required" },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Circle name must be 100 characters or less" },
        { status: 400 }
      );
    }

    const circle = await prisma.hifzCircle.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isPublic: isPublic ?? true,
        maxMembers: Math.min(Math.max(maxMembers ?? 50, 2), 200),
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        _count: { select: { members: true } },
      },
    });

    return NextResponse.json(
      {
        id: circle.id,
        name: circle.name,
        description: circle.description,
        isPublic: circle.isPublic,
        maxMembers: circle.maxMembers,
        memberCount: circle._count.members,
        groupStreak: circle.groupStreak,
        inviteCode: circle.inviteCode,
        createdAt: circle.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Circles POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
