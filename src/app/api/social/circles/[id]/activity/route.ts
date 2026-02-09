import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/social/circles/[id]/activity
 * Get paginated activity feed (last 50).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    // Check membership or public
    const circle = await prisma.hifzCircle.findUnique({
      where: { id },
      select: { isPublic: true },
    });

    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    if (!circle.isPublic) {
      const membership = await prisma.circleMember.findUnique({
        where: {
          userId_circleId: { userId: session.user.id, circleId: id },
        },
      });
      if (!membership) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    const activities = await prisma.circleActivity.findMany({
      where: { circleId: id },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    // Look up user names for activities
    const userIds = [...new Set(activities.map((a) => a.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, displayName: true, image: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const hasMore = activities.length > limit;
    const items = activities.slice(0, limit);

    return NextResponse.json({
      items: items.map((a) => {
        const user = userMap.get(a.userId);
        return {
          id: a.id,
          userId: a.userId,
          userName: user?.displayName ?? user?.name ?? "Anonymous",
          userImage: user?.image ?? null,
          type: a.type,
          data: a.data,
          createdAt: a.createdAt,
        };
      }),
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    });
  } catch (error) {
    console.error("Activity GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
