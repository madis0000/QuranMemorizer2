import { NextResponse, type NextRequest } from "next/server";
import type {
  MistakeSeverity,
  MistakeType,
  SessionMode,
  SessionStatus,
} from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/progress/sessions - Fetch user's recitation sessions with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100
    );
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const mode = searchParams.get("mode") as SessionMode | null;
    const statusParam = searchParams.get("status");

    // Parse status filter: comma-separated list (e.g., "ACTIVE,PAUSED")
    // Default: COMPLETED only (backward compatible)
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
        include: {
          _count: {
            select: { mistakes: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.recitationSession.count({ where }),
    ]);

    return NextResponse.json({ sessions, total });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/progress/sessions - Create a new recitation session
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
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
    } = body;

    // Validate required fields
    if (
      surahNumber == null ||
      startAyah == null ||
      endAyah == null ||
      !mode ||
      duration == null
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: surahNumber, startAyah, endAyah, mode, duration",
        },
        { status: 400 }
      );
    }

    // Validate mode enum
    const validModes: SessionMode[] = ["READ", "MEMORIZE", "LISTEN", "REVIEW"];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${validModes.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate surah number range
    if (surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: "surahNumber must be between 1 and 114" },
        { status: 400 }
      );
    }

    // Determine status
    const sessionStatus: SessionStatus =
      requestedStatus === "ACTIVE" ? "ACTIVE" : "COMPLETED";

    // For ACTIVE sessions: save snapshot, skip stats updates
    if (sessionStatus === "ACTIVE") {
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

    // Validate mistakes if provided (for COMPLETED sessions)
    if (mistakes && Array.isArray(mistakes)) {
      const validMistakeTypes: MistakeType[] = [
        "WRONG_WORD",
        "SKIPPED",
        "ADDED",
        "TASHKEEL",
        "ORDER",
      ];
      const validSeverities: MistakeSeverity[] = ["MINOR", "MAJOR"];

      for (const mistake of mistakes) {
        if (
          mistake.surahNumber == null ||
          mistake.ayahNumber == null ||
          mistake.wordIndex == null ||
          !mistake.type ||
          !mistake.correctText
        ) {
          return NextResponse.json(
            {
              error:
                "Each mistake must include surahNumber, ayahNumber, wordIndex, type, and correctText",
            },
            { status: 400 }
          );
        }
        if (!validMistakeTypes.includes(mistake.type)) {
          return NextResponse.json(
            {
              error: `Invalid mistake type. Must be one of: ${validMistakeTypes.join(", ")}`,
            },
            { status: 400 }
          );
        }
        if (mistake.severity && !validSeverities.includes(mistake.severity)) {
          return NextResponse.json(
            {
              error: `Invalid mistake severity. Must be one of: ${validSeverities.join(", ")}`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Create COMPLETED session with mistakes in a transaction, and update user stats
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
                    (m: {
                      surahNumber: number;
                      ayahNumber: number;
                      wordIndex: number;
                      type: MistakeType;
                      recitedText?: string;
                      correctText: string;
                      severity?: MistakeSeverity;
                    }) => ({
                      userId,
                      surahNumber: m.surahNumber,
                      ayahNumber: m.ayahNumber,
                      wordIndex: m.wordIndex,
                      type: m.type,
                      recitedText: m.recitedText ?? null,
                      correctText: m.correctText,
                      severity: m.severity ?? "MINOR",
                    })
                  ),
                },
              }
            : {}),
        },
        include: {
          mistakes: true,
        },
      });

      // Update user's totalTimeSpent and lastActiveAt
      await tx.user.update({
        where: { id: userId },
        data: {
          totalTimeSpent: { increment: duration },
          lastActiveAt: new Date(),
        },
      });

      // Upsert today's StreakHistory (UTC date to avoid timezone bugs)
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

        const currentUser = await tx.user.findUniqueOrThrow({
          where: { id: userId },
          select: { streakCount: true, longestStreak: true },
        });

        const newStreak = yesterdayActive?.isActive
          ? currentUser.streakCount + 1
          : 1;

        await tx.user.update({
          where: { id: userId },
          data: {
            streakCount: newStreak,
            longestStreak: Math.max(newStreak, currentUser.longestStreak),
          },
        });
      }

      return newSession;
    });

    return NextResponse.json(createdSession, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
