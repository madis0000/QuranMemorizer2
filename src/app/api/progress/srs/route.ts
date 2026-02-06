import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  calculateNextReview,
  createCard,
  getDueCards,
  getStudyStats,
  type SRSCard,
} from "@/lib/memorization/srs";

/**
 * GET /api/progress/srs
 * Get SRS cards: due cards, all cards, or stats.
 * Query params: ?due=true (only due cards), ?stats=true (summary only)
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dueOnly = searchParams.get("due") === "true";
    const statsOnly = searchParams.get("stats") === "true";

    // SRS cards are stored in user.settings JSON under "srsCards"
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    const settings = (user?.settings as Record<string, unknown>) ?? {};
    const cards: SRSCard[] = (settings.srsCards as SRSCard[]) ?? [];

    if (statsOnly) {
      return NextResponse.json(getStudyStats(cards));
    }

    if (dueOnly) {
      return NextResponse.json({ cards: getDueCards(cards) });
    }

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("SRS GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress/srs
 * Add new SRS cards for ayahs to memorize.
 * Body: { surahNumber, startAyah, endAyah }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { surahNumber, startAyah, endAyah } = await request.json();

    if (!surahNumber || !startAyah || !endAyah) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    const settings = (user?.settings as Record<string, unknown>) ?? {};
    const cards: SRSCard[] = (settings.srsCards as SRSCard[]) ?? [];

    // Create cards for each ayah in range (skip existing)
    const existingIds = new Set(cards.map((c) => c.id));
    const newCards: SRSCard[] = [];

    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      const id = `${surahNumber}:${ayah}`;
      if (!existingIds.has(id)) {
        newCards.push(createCard(surahNumber, ayah));
      }
    }

    const updatedCards = [...cards, ...newCards];

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: { ...settings, srsCards: updatedCards } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      },
    });

    return NextResponse.json(
      { added: newCards.length, total: updatedCards.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("SRS POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/progress/srs
 * Review a card and update its schedule.
 * Body: { cardId, accuracy, duration }
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cardId, accuracy, duration } = await request.json();

    if (!cardId || accuracy === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: cardId, accuracy" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    const settings = (user?.settings as Record<string, unknown>) ?? {};
    const cards: SRSCard[] = (settings.srsCards as SRSCard[]) ?? [];

    const cardIndex = cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const card = cards[cardIndex];
    const updates = calculateNextReview(card, {
      accuracy,
      duration: duration ?? 0,
    });

    // Update the card
    const updatedCard: SRSCard = {
      ...card,
      ...updates,
      totalReviews: card.totalReviews + 1,
      averageAccuracy: Math.round(
        (card.averageAccuracy * card.totalReviews + accuracy) /
          (card.totalReviews + 1)
      ),
    };

    cards[cardIndex] = updatedCard;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: { ...settings, srsCards: cards } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("SRS PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
