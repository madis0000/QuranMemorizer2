import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  accuracyToRating,
  createCard,
  getDueCards,
  getSchedulingOptions,
  getStudyStats,
  reviewCard,
  type SRSCard,
} from "@/lib/memorization/srs";

/**
 * Convert Prisma FSRSCard to SRSCard interface
 */
function prismaToSRSCard(prismaCard: {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: Date | null;
  totalReviews: number;
  averageAccuracy: number;
  category: string | null;
}): SRSCard {
  return {
    id: `${prismaCard.surahNumber}:${prismaCard.ayahNumber}`,
    surahNumber: prismaCard.surahNumber,
    ayahNumber: prismaCard.ayahNumber,
    due: prismaCard.due.toISOString(),
    stability: prismaCard.stability,
    difficulty: prismaCard.difficulty,
    elapsed_days: prismaCard.elapsedDays,
    scheduled_days: prismaCard.scheduledDays,
    reps: prismaCard.reps,
    lapses: prismaCard.lapses,
    state: prismaCard.state,
    last_review: prismaCard.lastReview
      ? prismaCard.lastReview.toISOString()
      : null,
    totalReviews: prismaCard.totalReviews,
    averageAccuracy: prismaCard.averageAccuracy,
    category: prismaCard.category as "sabaq" | "sabqi" | "manzil" | undefined,
  };
}

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
    const category = searchParams.get("category");

    // Build query filters
    const where = {
      userId: session.user.id,
      ...(category && { category }),
    };

    const prismaCards = await prisma.fSRSCard.findMany({
      where,
      orderBy: { due: "asc" },
    });

    const cards = prismaCards.map(prismaToSRSCard);

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
 * Body: { surahNumber, startAyah, endAyah, category? }
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { surahNumber, startAyah, endAyah, category } = await request.json();

    if (!surahNumber || !startAyah || !endAyah) {
      return NextResponse.json(
        { error: "Missing required fields: surahNumber, startAyah, endAyah" },
        { status: 400 }
      );
    }

    if (startAyah > endAyah) {
      return NextResponse.json(
        { error: "startAyah must be <= endAyah" },
        { status: 400 }
      );
    }

    // Get existing cards for this range to avoid duplicates
    const existingCards = await prisma.fSRSCard.findMany({
      where: {
        userId: session.user.id,
        surahNumber,
        ayahNumber: {
          gte: startAyah,
          lte: endAyah,
        },
      },
      select: { ayahNumber: true },
    });

    const existingAyahs = new Set(
      existingCards.map((c: { ayahNumber: number }) => c.ayahNumber)
    );

    // Create cards for each ayah in range (skip existing)
    const newCardsData = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      if (!existingAyahs.has(ayah)) {
        const card = createCard(surahNumber, ayah, category);
        newCardsData.push({
          userId: session.user.id,
          surahNumber: card.surahNumber,
          ayahNumber: card.ayahNumber,
          due: new Date(card.due),
          stability: card.stability,
          difficulty: card.difficulty,
          elapsedDays: card.elapsed_days,
          scheduledDays: card.scheduled_days,
          reps: card.reps,
          lapses: card.lapses,
          state: card.state,
          lastReview: null,
          totalReviews: card.totalReviews,
          averageAccuracy: card.averageAccuracy,
          category: card.category,
        });
      }
    }

    // Batch create cards
    if (newCardsData.length > 0) {
      await prisma.fSRSCard.createMany({
        data: newCardsData,
      });
    }

    const totalCards = await prisma.fSRSCard.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json(
      { added: newCardsData.length, total: totalCards },
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
 * Body: { surahNumber, ayahNumber, accuracy, duration?, showOptions? }
 *
 * If showOptions=true, returns scheduling options for all 4 ratings
 * Otherwise, updates the card based on accuracy
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { surahNumber, ayahNumber, accuracy, showOptions } =
      await request.json();

    if (!surahNumber || !ayahNumber || accuracy === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: surahNumber, ayahNumber, accuracy",
        },
        { status: 400 }
      );
    }

    // Find the card
    const prismaCard = await prisma.fSRSCard.findUnique({
      where: {
        userId_surahNumber_ayahNumber: {
          userId: session.user.id,
          surahNumber,
          ayahNumber,
        },
      },
    });

    if (!prismaCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const card = prismaToSRSCard(prismaCard);

    // If user just wants to see options without committing
    if (showOptions) {
      const options = getSchedulingOptions(card);
      return NextResponse.json({
        card,
        options,
        suggestedRating: accuracyToRating(accuracy),
      });
    }

    // Calculate next review using FSRS
    const rating = accuracyToRating(accuracy);
    const { card: updatedCard } = reviewCard(card, rating, accuracy);

    // Update in database
    await prisma.fSRSCard.update({
      where: {
        userId_surahNumber_ayahNumber: {
          userId: session.user.id,
          surahNumber,
          ayahNumber,
        },
      },
      data: {
        due: new Date(updatedCard.due),
        stability: updatedCard.stability,
        difficulty: updatedCard.difficulty,
        elapsedDays: updatedCard.elapsed_days,
        scheduledDays: updatedCard.scheduled_days,
        reps: updatedCard.reps,
        lapses: updatedCard.lapses,
        state: updatedCard.state,
        lastReview: updatedCard.last_review
          ? new Date(updatedCard.last_review)
          : null,
        totalReviews: updatedCard.totalReviews,
        averageAccuracy: updatedCard.averageAccuracy,
      },
    });

    // Return updated card with scheduling options
    const options = getSchedulingOptions(updatedCard);

    return NextResponse.json({
      card: updatedCard,
      options,
      rating,
      message: `Card reviewed with ${rating === 1 ? "Again" : rating === 2 ? "Hard" : rating === 3 ? "Good" : "Easy"} rating`,
    });
  } catch (error) {
    console.error("SRS PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/progress/srs
 * Delete a specific card or all cards for a surah
 * Query params: ?surahNumber=X&ayahNumber=Y (specific card)
 *               ?surahNumber=X (all cards in surah)
 *               ?all=true (all user's cards - use with caution!)
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const surahNumber = searchParams.get("surahNumber");
    const ayahNumber = searchParams.get("ayahNumber");
    const deleteAll = searchParams.get("all") === "true";

    if (deleteAll) {
      // Delete all user's cards
      const result = await prisma.fSRSCard.deleteMany({
        where: { userId: session.user.id },
      });
      return NextResponse.json({
        deleted: result.count,
        message: "All SRS cards deleted",
      });
    }

    if (!surahNumber) {
      return NextResponse.json(
        { error: "Missing surahNumber parameter" },
        { status: 400 }
      );
    }

    if (ayahNumber) {
      // Delete specific card
      const result = await prisma.fSRSCard.deleteMany({
        where: {
          userId: session.user.id,
          surahNumber: parseInt(surahNumber),
          ayahNumber: parseInt(ayahNumber),
        },
      });

      if (result.count === 0) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
      }

      return NextResponse.json({
        deleted: result.count,
        message: `Deleted card for Surah ${surahNumber}:${ayahNumber}`,
      });
    }

    // Delete all cards for a surah
    const result = await prisma.fSRSCard.deleteMany({
      where: {
        userId: session.user.id,
        surahNumber: parseInt(surahNumber),
      },
    });

    return NextResponse.json({
      deleted: result.count,
      message: `Deleted all cards for Surah ${surahNumber}`,
    });
  } catch (error) {
    console.error("SRS DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
