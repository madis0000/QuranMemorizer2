import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * POST /api/social/circles/[id]/members
 * Join a circle (by invite code or public).
 * Body: { inviteCode?: string }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { inviteCode } = body as { inviteCode?: string };

    // Get circle
    const circle = await prisma.hifzCircle.findUnique({
      where: { id },
      include: {
        _count: { select: { members: true } },
      },
    });

    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    // Check if already a member
    const existing = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: { userId: session.user.id, circleId: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already a member of this circle" },
        { status: 400 }
      );
    }

    // Check capacity
    if (circle._count.members >= circle.maxMembers) {
      return NextResponse.json({ error: "Circle is full" }, { status: 400 });
    }

    // Check access: public or valid invite code
    if (!circle.isPublic) {
      if (!inviteCode || inviteCode !== circle.inviteCode) {
        return NextResponse.json(
          { error: "Invalid invite code" },
          { status: 403 }
        );
      }
    }

    // Add member
    const member = await prisma.circleMember.create({
      data: {
        userId: session.user.id,
        circleId: id,
        role: "MEMBER",
      },
    });

    // Create activity
    await prisma.circleActivity.create({
      data: {
        circleId: id,
        userId: session.user.id,
        type: "joined",
      },
    });

    return NextResponse.json(
      { id: member.id, role: member.role, joinedAt: member.joinedAt },
      { status: 201 }
    );
  } catch (error) {
    console.error("Members POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/social/circles/[id]/members
 * Leave circle or kick member (owner/teacher can kick).
 * Query params: ?userId=... (to kick another member; omit to leave)
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
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId") ?? session.user.id;

    // Self-leave
    if (targetUserId === session.user.id) {
      const membership = await prisma.circleMember.findUnique({
        where: {
          userId_circleId: { userId: session.user.id, circleId: id },
        },
      });

      if (!membership) {
        return NextResponse.json(
          { error: "Not a member of this circle" },
          { status: 400 }
        );
      }

      if (membership.role === "OWNER") {
        // Count other members
        const memberCount = await prisma.circleMember.count({
          where: { circleId: id },
        });
        if (memberCount > 1) {
          return NextResponse.json(
            {
              error:
                "Owner cannot leave while other members exist. Transfer ownership or delete the circle.",
            },
            { status: 400 }
          );
        }
        // Last member leaving = delete circle
        await prisma.hifzCircle.delete({ where: { id } });
        return NextResponse.json({ success: true, circleDeleted: true });
      }

      await prisma.circleMember.delete({
        where: {
          userId_circleId: { userId: session.user.id, circleId: id },
        },
      });
      return NextResponse.json({ success: true });
    }

    // Kick another member - check permission
    const callerMembership = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: { userId: session.user.id, circleId: id },
      },
    });

    if (!callerMembership || callerMembership.role === "MEMBER") {
      return NextResponse.json(
        { error: "Only owners and teachers can remove members" },
        { status: 403 }
      );
    }

    const targetMembership = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: { userId: targetUserId, circleId: id },
      },
    });

    if (!targetMembership) {
      return NextResponse.json(
        { error: "User is not a member" },
        { status: 404 }
      );
    }

    // Teacher cannot kick owner or other teachers
    if (
      callerMembership.role === "TEACHER" &&
      targetMembership.role !== "MEMBER"
    ) {
      return NextResponse.json(
        { error: "Teachers can only remove regular members" },
        { status: 403 }
      );
    }

    // Owner cannot kick themselves via this path
    if (targetMembership.role === "OWNER") {
      return NextResponse.json(
        { error: "Cannot remove the owner" },
        { status: 400 }
      );
    }

    await prisma.circleMember.delete({
      where: {
        userId_circleId: { userId: targetUserId, circleId: id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Members DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
