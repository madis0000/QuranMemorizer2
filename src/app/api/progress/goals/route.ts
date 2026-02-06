import { NextResponse, type NextRequest } from "next/server";
import type { GoalFrequency, GoalType } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/progress/goals - Fetch user's goals
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const activeParam = searchParams.get("active");

    const where: Record<string, unknown> = { userId };
    if (activeParam !== null) {
      where.isActive = activeParam === "true";
    }

    const goals = await prisma.goal.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/progress/goals - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const {
      title,
      type,
      target,
      frequency,
      targetValue,
      reminderTime,
      daysOfWeek,
    } = body;

    // Validate required fields
    if (
      !title ||
      !type ||
      target == null ||
      !frequency ||
      targetValue == null
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, type, target, frequency, targetValue",
        },
        { status: 400 }
      );
    }

    // Validate type enum
    const validTypes: GoalType[] = [
      "MEMORIZE",
      "REVISE",
      "READ",
      "LISTEN",
      "AYAH_COUNT",
      "TIME_SPENT",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate frequency enum
    const validFrequencies: GoalFrequency[] = [
      "DAILY",
      "WEEKLY",
      "MONTHLY",
      "CUSTOM",
      "ONE_TIME",
    ];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        {
          error: `Invalid frequency. Must be one of: ${validFrequencies.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate targetValue is a positive number
    if (typeof targetValue !== "number" || targetValue <= 0) {
      return NextResponse.json(
        { error: "targetValue must be a positive number" },
        { status: 400 }
      );
    }

    // Validate reminderTime format if provided (HH:mm)
    if (reminderTime && !/^\d{2}:\d{2}$/.test(reminderTime)) {
      return NextResponse.json(
        { error: "reminderTime must be in HH:mm format" },
        { status: 400 }
      );
    }

    // Validate daysOfWeek if provided
    if (daysOfWeek) {
      if (
        !Array.isArray(daysOfWeek) ||
        !daysOfWeek.every(
          (d: unknown) => typeof d === "number" && d >= 0 && d <= 6
        )
      ) {
        return NextResponse.json(
          {
            error:
              "daysOfWeek must be an array of numbers between 0 (Sunday) and 6 (Saturday)",
          },
          { status: 400 }
        );
      }
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        type,
        target,
        frequency,
        targetValue,
        reminderTime: reminderTime ?? null,
        daysOfWeek: daysOfWeek ?? [],
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/progress/goals - Update a goal's progress
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { goalId, currentValue, isActive, progress } = body;

    if (!goalId) {
      return NextResponse.json(
        { error: "Missing required field: goalId" },
        { status: 400 }
      );
    }

    // Verify goal exists and belongs to the user
    const existingGoal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Build the update data
    const updateData: Record<string, unknown> = {};

    if (currentValue !== undefined) {
      updateData.currentValue = currentValue;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (progress !== undefined) {
      updateData.progress = progress;

      // Auto-set completedAt when progress reaches 100
      if (progress >= 100 && !existingGoal.completedAt) {
        updateData.completedAt = new Date();
        updateData.isActive = false;
      }
    }

    // If currentValue is being updated, auto-calculate progress
    if (currentValue !== undefined && progress === undefined) {
      const calculatedProgress = Math.min(
        Math.round((currentValue / existingGoal.targetValue) * 100),
        100
      );
      updateData.progress = calculatedProgress;

      if (calculatedProgress >= 100 && !existingGoal.completedAt) {
        updateData.completedAt = new Date();
        updateData.isActive = false;
      }
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
