import { NextResponse } from "next/server";
import type { MistakeType, SessionMode, SessionStatus } from "@prisma/client";
import { z } from "zod";

import { validationError } from "@/lib/api/errors";
import { withAuth } from "@/lib/api/with-auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

// --- Zod schemas ---

const MistakeSchema = z.object({
  surahNumber: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1),
  wordIndex: z.number().int().min(0),
  type: z.enum(["WRONG_WORD", "SKIPPED", "ADDED", "TASHKEEL", "ORDER"]),
  recitedText: z.string().nullish(),
  correctText: z.string().min(1),
  severity: z.enum(["MINOR", "MAJOR"]).optional().default("MINOR"),
});

const CreateSessionSchema = z.object({
  surahNumber: z.number().int().min(1).max(114),
  startAyah: z.number().int().min(1),
  endAyah: z.number().int().min(1),
  pageNumber: z.number().int().min(1).max(604).nullish(),
  mode: z.enum(["READ", "MEMORIZE", "LISTEN", "REVIEW"]),
  duration: z.number().int().min(0),
  accuracy: z.number().min(0).max(100).nullish(),
  wordsRecited: z.number().int().min(0).optional().default(0),
  mistakeCount: z.number().int().min(0).optional().default(0),
  mistakes: z.array(MistakeSchema).optional(),
  status: z.enum(["ACTIVE", "COMPLETED"]).optional().default("COMPLETED"),
  stateSnapshot: z.unknown().nullish(),
  targetType: z.string().nullish(),
});

// GET /api/progress/sessions - Fetch user's recitation sessions with pagination
export const GET = withAuth(async (request, { userId }) => {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);
  const mode = searchParams.get("mode") as SessionMode | null;
  const statusParam = searchParams.get("status");

  // Parse status filter: comma-separated list (e.g., "ACTIVE,PAUSED")
  const validStatuses: SessionStatus[] = [
    "ACTIVE",
    "PAUSED",
    "COMPLETED",
    "DISCARDED",
  ];
  let statusFilter: SessionStatus[] | undefined;
  if (statusParam) {
    statusFilter = statusParam
      .split(",")
      .map((s) => s.trim().toUpperCase() as SessionStatus)
      .filter((s) => validStatuses.includes(s));
    if (statusFilter.length === 0) statusFilter = undefined;
  }

  const where = {
    userId,
    ...(mode && { mode }),
    ...(statusFilter
      ? { status: { in: statusFilter } }
      : { status: "COMPLETED" as SessionStatus }),
  };

  const [sessions, total] = await Promise.all([
    prisma.recitationSession.findMany({
      where,
      include: { _count: { select: { mistakes: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.recitationSession.count({ where }),
  ]);

  return NextResponse.json({ sessions, total });
});

// POST /api/progress/sessions - Create a new recitation session
export const POST = withAuth(
  async (request, { userId }) => {
    const body = await request.json();
    const parsed = CreateSessionSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const {
      surahNumber,
      startAyah,
      endAyah,
      pageNumber,
      mode,
      duration,
      accuracy,
      wordsRecited,
      mistakeCount,
      mistakes,
      status: requestedStatus,
      stateSnapshot,
      targetType,
    } = parsed.data;

    // For ACTIVE sessions: save snapshot, skip stats updates
    if (requestedStatus === "ACTIVE") {
      const newSession = await prisma.recitationSession.create({
        data: {
          userId,
          surahNumber,
          startAyah,
          endAyah,
          pageNumber: pageNumber ?? null,
          mode,
          duration: duration ?? 0,
          accuracy: accuracy ?? null,
          wordsRecited: wordsRecited ?? 0,
          mistakeCount: mistakeCount ?? 0,
          status: "ACTIVE",
          stateSnapshot: stateSnapshot ?? null,
          targetType: targetType ?? null,
        },
      });

      return NextResponse.json(
        { id: newSession.id, status: newSession.status },
        { status: 201 }
      );
    }

    // Create COMPLETED session in a transaction with streak updates
    const createdSession = await prisma.$transaction(async (tx) => {
      const newSession = await tx.recitationSession.create({
        data: {
          userId,
          surahNumber,
          startAyah,
          endAyah,
          pageNumber: pageNumber ?? null,
          mode,
          duration,
          accuracy: accuracy ?? null,
          wordsRecited: wordsRecited ?? 0,
          mistakeCount: mistakeCount ?? 0,
          status: "COMPLETED",
          completedAt: new Date(),
          targetType: targetType ?? null,
          ...(mistakes && mistakes.length > 0
            ? {
                mistakes: {
                  create: mistakes.map(
                    (m: z.infer<typeof MistakeSchema>) => ({
                      userId,
                      surahNumber: m.surahNumber,
                      ayahNumber: m.ayahNumber,
                      wordIndex: m.wordIndex,
                      type: m.type as MistakeType,
                      recitedText: m.recitedText ?? null,
                      correctText: m.correctText,
                      severity: m.severity ?? "MINOR",
                    })
                  ),
                },
              }
            : {}),
        },
        include: { mistakes: true },
      });

      // Update user's totalTimeSpent and lastActiveAt (atomic increment)
      await tx.user.update({
        where: { id: userId },
        data: {
          totalTimeSpent: { increment: duration },
          lastActiveAt: new Date(),
        },
      });

      // Upsert today's StreakHistory (UTC date)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const existingStreak = await tx.streakHistory.findUnique({
        where: { userId_date: { userId, date: today } },
      });

      if (!existingStreak) {
        await tx.streakHistory.create({
          data: { userId, date: today, isActive: true },
        });

        // Update streak count — only on first session of the day
        const yesterday = new Date(today);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);

        const yesterdayActive = await tx.streakHistory.findUnique({
          where: { userId_date: { userId, date: yesterday } },
        });

        if (yesterdayActive?.isActive) {
          // Atomic increment — avoids read-increment-write race condition
          const updated = await tx.user.update({
            where: { id: userId },
            data: { streakCount: { increment: 1 } },
            select: { streakCount: true, longestStreak: true },
          });
          if (updated.streakCount > updated.longestStreak) {
            await tx.user.update({
              where: { id: userId },
              data: { longestStreak: updated.streakCount },
            });
          }
        } else {
          // Streak broken — reset to 1
          await tx.user.update({
            where: { id: userId },
            data: { streakCount: 1 },
          });
        }
      }

      return newSession;
    });

    logger.info(
      { userId, sessionId: createdSession.id, surahNumber, mode },
      "Session completed"
    );

    return NextResponse.json(createdSession, { status: 201 });
  },
  { maxRequests: 30, windowSeconds: 60 }
);
