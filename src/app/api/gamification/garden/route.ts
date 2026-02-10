import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GARDEN_SHOP, initializeGarden } from "@/lib/gamification/garden";

/**
 * GET /api/gamification/garden
 * Get user's garden state (creates default if none exists)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let garden = await prisma.gardenState.findUnique({
      where: { userId: session.user.id },
    });

    if (!garden) {
      const defaultState = initializeGarden();
      garden = await prisma.gardenState.create({
        data: {
          userId: session.user.id,
          state: defaultState as unknown as Prisma.JsonObject,
          hasanat: 0,
          gardenLevel: 0,
          isParadise: false,
        },
      });
    }

    return NextResponse.json({
      garden: {
        ...garden,
        state: garden.state,
      },
    });
  } catch (error) {
    console.error("Garden GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/gamification/garden
 * Update garden state
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { state, hasanat, gardenLevel, isParadise } = await request.json();

    const garden = await prisma.gardenState.upsert({
      where: { userId: session.user.id },
      update: {
        state: state as unknown as Prisma.JsonObject,
        hasanat: hasanat ?? undefined,
        gardenLevel: gardenLevel ?? undefined,
        isParadise: isParadise ?? undefined,
      },
      create: {
        userId: session.user.id,
        state: state as unknown as Prisma.JsonObject,
        hasanat: hasanat ?? 0,
        gardenLevel: gardenLevel ?? 0,
        isParadise: isParadise ?? false,
      },
    });

    return NextResponse.json({ garden });
  } catch (error) {
    console.error("Garden PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gamification/garden
 * Purchase a decoration with hasanat
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { decorationId } = await request.json();

    const decoration = GARDEN_SHOP.find((d) => d.id === decorationId);
    if (!decoration) {
      return NextResponse.json(
        { error: "Decoration not found" },
        { status: 404 }
      );
    }

    const garden = await prisma.gardenState.findUnique({
      where: { userId: session.user.id },
    });

    if (!garden) {
      return NextResponse.json(
        { error: "Garden not found. Create one first." },
        { status: 404 }
      );
    }

    if (garden.hasanat < decoration.cost) {
      return NextResponse.json(
        {
          error: "Not enough hasanat",
          required: decoration.cost,
          current: garden.hasanat,
        },
        { status: 400 }
      );
    }

    // Deduct hasanat and add decoration
    const currentState = garden.state as Record<string, unknown>;
    const decorations =
      (currentState.decorations as Array<Record<string, unknown>>) ?? [];
    decorations.push({
      id: decoration.id,
      type: decoration.type,
      name: decoration.name,
      cost: decoration.cost,
      purchasedAt: new Date().toISOString(),
    });

    const updatedGarden = await prisma.gardenState.update({
      where: { userId: session.user.id },
      data: {
        hasanat: garden.hasanat - decoration.cost,
        state: { ...currentState, decorations } as unknown as Prisma.JsonObject,
      },
    });

    return NextResponse.json({
      garden: updatedGarden,
      purchased: decoration,
    });
  } catch (error) {
    console.error("Garden POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
