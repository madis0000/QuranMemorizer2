import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, validationError } from "@/lib/api/errors";
import { withAuth } from "@/lib/api/with-auth";
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

// --- Zod schemas ---

const CreateCardsSchema = z.object({
  surahNumber: z.number().int().min(1).max(114),
  startAyah: z.number().int().min(1),
  endAyah: z.number().int().min(1),
  category: z.enum(["sabaq", "sabqi", "manzil"]).optional(),
});

const ReviewCardSchema = z.object({
  surahNumber: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1),
  accuracy: z.number().min(0).max(100),
  rating: z.number().int().min(1).max(4).optional(),
  showOptions: z.boolean().optional(),
});

/**
 * GET /api/progress/srs
 * Get SRS cards: due cards, all cards, or stats.
 */
export const GET = withAuth(async (request, { userId }) => {
  const { searchParams } = new URL(request.url);
  const dueOnly = searchParams.get("due") === "true";
  const statsOnly = searchParams.get("stats") === "true";
  const category = searchParams.get("category");

  const where = {
    userId,
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
});

/**
 * POST /api/progress/srs
 * Add new SRS cards for ayahs to memorize.
 */
export const POST = withAuth(
  async (request, { userId }) => {
    const body = await request.json();
    const parsed = CreateCardsSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { surahNumber, startAyah, endAyah, category } = parsed.data;

    if (startAyah > endAyah) {
      return apiError("VALIDATION_ERROR", "startAyah must be <= endAyah");
    }

    // Get existing cards for this range to avoid duplicates
    const existingCards = await prisma.fSRSCard.findMany({
      where: {
        userId,
        surahNumber,
        ayahNumber: { gte: startAyah, lte: endAyah },
      },
      select: { ayahNumber: true },
    });

    const existingAyahs = new Set(
      existingCards.map((c: { ayahNumber: number }) => c.ayahNumber)
    );

    const newCardsData = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      if (!existingAyahs.has(ayah)) {
        const card = createCard(surahNumber, ayah, category);
        newCardsData.push({
          userId,
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

    if (newCardsData.length > 0) {
      await prisma.fSRSCard.createMany({ data: newCardsData });
    }

    const totalCards = await prisma.fSRSCard.count({ where: { userId } });

    return NextResponse.json(
      { added: newCardsData.length, total: totalCards },
      { status: 201 }
    );
  },
  { maxRequests: 30, windowSeconds: 60 }
);

/**
 * PATCH /api/progress/srs
 * Review a card and update its schedule.
 */
export const PATCH = withAuth(
  async (request, { userId }) => {
    const body = await request.json();
    const parsed = ReviewCardSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const {
      surahNumber,
      ayahNumber,
      accuracy,
      rating: explicitRating,
      showOptions,
    } = parsed.data;

    // Find the card
    let prismaCard = await prisma.fSRSCard.findUnique({
      where: {
        userId_surahNumber_ayahNumber: { userId, surahNumber, ayahNumber },
      },
    });

    // If card doesn't exist, create it (upsert pattern)
    if (!prismaCard) {
      const newCard = createCard(surahNumber, ayahNumber);
      prismaCard = await prisma.fSRSCard.create({
        data: {
          userId,
          surahNumber: newCard.surahNumber,
          ayahNumber: newCard.ayahNumber,
          due: new Date(newCard.due),
          stability: newCard.stability,
          difficulty: newCard.difficulty,
          elapsedDays: newCard.elapsed_days,
          scheduledDays: newCard.scheduled_days,
          reps: newCard.reps,
          lapses: newCard.lapses,
          state: newCard.state,
          lastReview: null,
          totalReviews: newCard.totalReviews,
          averageAccuracy: newCard.averageAccuracy,
          category: newCard.category,
        },
      });
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

    const rating =
      explicitRating && explicitRating >= 1 && explicitRating <= 4
        ? explicitRating
        : accuracyToRating(accuracy);
    const { card: updatedCard } = reviewCard(card, rating, accuracy);

    await prisma.fSRSCard.update({
      where: {
        userId_surahNumber_ayahNumber: { userId, surahNumber, ayahNumber },
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

    const options = getSchedulingOptions(updatedCard);

    return NextResponse.json({
      card: updatedCard,
      options,
      rating,
      message: `Card reviewed with ${rating === 1 ? "Again" : rating === 2 ? "Hard" : rating === 3 ? "Good" : "Easy"} rating`,
    });
  },
  { maxRequests: 60, windowSeconds: 60 }
);

/**
 * DELETE /api/progress/srs
 * Delete a specific card or all cards for a surah.
 * Requires explicit ?confirm=true for bulk operations.
 */
export const DELETE = withAuth(async (request, { userId }) => {
  const { searchParams } = new URL(request.url);
  const surahNumber = searchParams.get("surahNumber");
  const ayahNumber = searchParams.get("ayahNumber");
  const deleteAll = searchParams.get("all") === "true";
  const confirm = searchParams.get("confirm") === "true";

  if (deleteAll) {
    // Require explicit confirmation for mass deletion
    if (!confirm) {
      return apiError(
        "VALIDATION_ERROR",
        "Deleting all SRS cards requires ?confirm=true"
      );
    }
    const result = await prisma.fSRSCard.deleteMany({
      where: { userId },
    });
    return NextResponse.json({
      deleted: result.count,
      message: "All SRS cards deleted",
    });
  }

  if (!surahNumber) {
    return apiError("VALIDATION_ERROR", "Missing surahNumber parameter");
  }

  if (ayahNumber) {
    const result = await prisma.fSRSCard.deleteMany({
      where: {
        userId,
        surahNumber: parseInt(surahNumber),
        ayahNumber: parseInt(ayahNumber),
      },
    });

    if (result.count === 0) {
      return apiError("NOT_FOUND", "Card not found");
    }

    return NextResponse.json({
      deleted: result.count,
      message: `Deleted card for Surah ${surahNumber}:${ayahNumber}`,
    });
  }

  // Delete all cards for a surah — also require confirm
  if (!confirm) {
    return apiError(
      "VALIDATION_ERROR",
      "Deleting all surah cards requires ?confirm=true"
    );
  }

  const result = await prisma.fSRSCard.deleteMany({
    where: {
      userId,
      surahNumber: parseInt(surahNumber),
    },
  });

  return NextResponse.json({
    deleted: result.count,
    message: `Deleted all cards for Surah ${surahNumber}`,
  });
});
