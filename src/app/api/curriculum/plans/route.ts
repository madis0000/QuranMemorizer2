import { NextResponse, type NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import type { StudyPlan } from "@/lib/curriculum/plan-generator";
import { prisma } from "@/lib/db";

/**
 * GET /api/curriculum/plans
 * Get user's study plans. Returns active plan + history.
 * Query params: ?active=true (only active plan)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

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
    const activePlan = (curriculumData.activePlan ?? null) as StudyPlan | null;
    const planHistory = (curriculumData.planHistory ?? []) as StudyPlan[];

    if (activeOnly) {
      return NextResponse.json({ plan: activePlan });
    }

    return NextResponse.json({
      activePlan,
      planHistory,
    });
  } catch (error) {
    console.error("Error fetching curriculum plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/curriculum/plans
 * Create or save a study plan.
 * Body: StudyPlan object
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = (await request.json()) as StudyPlan;

    if (!plan || !plan.id || !plan.goal || !plan.schedule) {
      return NextResponse.json({ error: "Invalid plan data" }, { status: 400 });
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
    const existingHistory = (curriculumData.planHistory ?? []) as StudyPlan[];
    const existingActive = curriculumData.activePlan as StudyPlan | null;

    // Archive existing active plan if there is one
    const updatedHistory = existingActive
      ? [...existingHistory, { ...existingActive, isActive: false }]
      : existingHistory;

    const updatedSettings = {
      ...settings,
      curriculum: {
        ...curriculumData,
        activePlan: plan,
        planHistory: updatedHistory,
      },
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: updatedSettings as unknown as Prisma.JsonObject,
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Error saving curriculum plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
