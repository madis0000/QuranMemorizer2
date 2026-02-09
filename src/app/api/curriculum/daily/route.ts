import { NextResponse, type NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import type { StudyPlan } from "@/lib/curriculum/plan-generator";
import { prisma } from "@/lib/db";

/**
 * GET /api/curriculum/daily
 * Get today's daily target from the active plan.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const settings = (user.settings ?? {}) as Record<string, unknown>;
    const curriculumData = (settings.curriculum ?? {}) as Record<
      string,
      unknown
    >;
    const activePlan = curriculumData.activePlan as StudyPlan | null;

    if (!activePlan) {
      return NextResponse.json({ target: null, plan: null });
    }

    const today = new Date().toISOString().split("T")[0];
    const target = activePlan.schedule.find((t) => t.date === today) ?? null;

    return NextResponse.json({ target, plan: activePlan });
  } catch (error) {
    console.error("Error fetching daily target:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/curriculum/daily
 * Mark today's daily target as complete.
 * Body: { date: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: "Missing required field: date" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const settings = (user.settings ?? {}) as Record<string, unknown>;
    const curriculumData = (settings.curriculum ?? {}) as Record<
      string,
      unknown
    >;
    const activePlan = curriculumData.activePlan as StudyPlan | null;

    if (!activePlan) {
      return NextResponse.json({ error: "No active plan" }, { status: 404 });
    }

    // Mark the date as completed
    const updatedSchedule = activePlan.schedule.map((target) =>
      target.date === date ? { ...target, completed: true } : target
    );

    const updatedPlan: StudyPlan = {
      ...activePlan,
      schedule: updatedSchedule,
    };

    // Check if all days with new verses are completed
    const allComplete = updatedSchedule
      .filter((t) => t.newVerses.length > 0)
      .every((t) => t.completed);

    if (allComplete) {
      // Plan is complete; move to history
      const existingHistory = (curriculumData.planHistory ?? []) as StudyPlan[];
      const updatedSettings = {
        ...settings,
        curriculum: {
          ...curriculumData,
          activePlan: null,
          planHistory: [
            ...existingHistory,
            { ...updatedPlan, isActive: false },
          ],
        },
      };

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          settings: updatedSettings as unknown as Prisma.JsonObject,
        },
      });

      return NextResponse.json({
        completed: true,
        planCompleted: true,
        message: "Plan completed!",
      });
    }

    // Save updated plan
    const updatedSettings = {
      ...settings,
      curriculum: {
        ...curriculumData,
        activePlan: updatedPlan,
      },
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: updatedSettings as unknown as Prisma.JsonObject,
      },
    });

    return NextResponse.json({
      completed: true,
      planCompleted: false,
      message: "Daily target completed!",
    });
  } catch (error) {
    console.error("Error completing daily target:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
