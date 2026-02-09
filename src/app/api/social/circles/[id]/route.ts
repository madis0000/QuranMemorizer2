import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/social/circles/[id]
 * Get circle details with members, recent activity, and active challenge.
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

    const circle = await prisma.hifzCircle.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                displayName: true,
                image: true,
                streakCount: true,
              },
            },
          },
          orderBy: [{ role: "asc" }, { weeklyXP: "desc" }],
        },
        challenges: {
          where: { isActive: true },
          orderBy: { startDate: "desc" },
          take: 1,
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: { select: { members: true } },
      },
    });

    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    // Check access: public or member
    const isMember = circle.members.some((m) => m.userId === session.user.id);
    if (!circle.isPublic && !isMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Suppress invite code for non-members
    const inviteCode = isMember ? circle.inviteCode : null;

    return NextResponse.json({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      isPublic: circle.isPublic,
      maxMembers: circle.maxMembers,
      groupStreak: circle.groupStreak,
      inviteCode,
      memberCount: circle._count.members,
      isMember,
      myRole:
        circle.members.find((m) => m.userId === session.user.id)?.role ?? null,
      members: circle.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        name: m.user.displayName ?? m.user.name ?? "Anonymous",
        image: m.user.image,
        role: m.role,
        weeklyXP: m.weeklyXP,
        streakCount: m.user.streakCount,
        joinedAt: m.joinedAt,
        lastActiveAt: m.lastActiveAt,
      })),
      activeChallenge: circle.challenges[0] ?? null,
      recentActivity: circle.activities,
      createdAt: circle.createdAt,
    });
  } catch (error) {
    console.error("Circle GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/social/circles/[id]
 * Update circle (owner/teacher only).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check permission
    const membership = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: { userId: session.user.id, circleId: id },
      },
    });

    if (!membership || membership.role === "MEMBER") {
      return NextResponse.json(
        { error: "Only owners and teachers can update the circle" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, isPublic, maxMembers } = body as {
      name?: string;
      description?: string;
      isPublic?: boolean;
      maxMembers?: number;
    };

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) {
      if (name.trim().length === 0 || name.trim().length > 100) {
        return NextResponse.json(
          { error: "Name must be 1-100 characters" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (maxMembers !== undefined)
      updateData.maxMembers = Math.min(Math.max(maxMembers, 2), 200);

    const circle = await prisma.hifzCircle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      isPublic: circle.isPublic,
      maxMembers: circle.maxMembers,
    });
  } catch (error) {
    console.error("Circle PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/social/circles/[id]
 * Delete circle (owner only).
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const membership = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: { userId: session.user.id, circleId: id },
      },
    });

    if (!membership || membership.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only the owner can delete the circle" },
        { status: 403 }
      );
    }

    await prisma.hifzCircle.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Circle DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
