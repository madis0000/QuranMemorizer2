import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/social/circles/[id]/challenges
 * Get active and past challenges for a circle.
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

    // Check membership
    const membership = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: { userId: session.user.id, circleId: id },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Not a member of this circle" },
        { status: 403 }
      );
    }

    const challenges = await prisma.circleChallenge.findMany({
      where: { circleId: id },
      orderBy: [{ isActive: "desc" }, { startDate: "desc" }],
      take: 20,
    });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Challenges GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/social/circles/[id]/challenges
 * Create a challenge (owner/teacher only).
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

    // Check permission
    const membership = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: { userId: session.user.id, circleId: id },
      },
    });

    if (!membership || membership.role === "MEMBER") {
      return NextResponse.json(
        { error: "Only owners and teachers can create challenges" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, type, target, endDate } = body as {
      title: string;
      description?: string;
      type: string;
      target: Record<string, unknown>;
      endDate: string;
    };

    if (!title || !type || !target || !endDate) {
      return NextResponse.json(
        { error: "title, type, target, and endDate are required" },
        { status: 400 }
      );
    }

    const parsedEndDate = new Date(endDate);
    if (isNaN(parsedEndDate.getTime()) || parsedEndDate <= new Date()) {
      return NextResponse.json(
        { error: "endDate must be a valid future date" },
        { status: 400 }
      );
    }

    // Deactivate other active challenges
    await prisma.circleChallenge.updateMany({
      where: { circleId: id, isActive: true },
      data: { isActive: false },
    });

    const challenge = await prisma.circleChallenge.create({
      data: {
        circleId: id,
        title: title.trim(),
        description: description?.trim() || null,
        type,
        target: target as unknown as Prisma.JsonObject,
        endDate: parsedEndDate,
        isActive: true,
      },
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error("Challenges POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
