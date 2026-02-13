import { NextResponse, type NextRequest } from "next/server";
import { Prisma, type MistakeSeverity, type MistakeType } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH /api/progress/sessions/[id] — pause, resume, or complete a session
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = await params;

    const dbSession = await prisma.recitationSession.findUnique({
      where: { id },
    });

    if (!dbSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (dbSession.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;

    if (!action || !["pause", "resume", "complete"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be one of: pause, resume, complete" },
        { status: 400 }
      );
    }

    // === PAUSE ===
    if (action === "pause") {
      if (dbSession.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Only ACTIVE sessions can be paused" },
          { status: 400 }
        );
      }

      const { stateSnapshot, duration } = body;

      const updated = await prisma.recitationSession.update({
        where: { id },
        data: {
          status: "PAUSED",
          pausedAt: new Date(),
          stateSnapshot: stateSnapshot ?? undefined,
          duration: duration ?? dbSession.duration,
        },
      });

      return NextResponse.json({ id: updated.id, status: updated.status });
    }

    // === RESUME ===
    if (action === "resume") {
      if (dbSession.status !== "PAUSED" && dbSession.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Only PAUSED or ACTIVE sessions can be resumed" },
          { status: 400 }
        );
      }

      const updated = await prisma.recitationSession.update({
        where: { id },
        data: {
          status: "ACTIVE",
          pausedAt: null,
        },
      });

      return NextResponse.json({
        id: updated.id,
        status: updated.status,
        stateSnapshot: updated.stateSnapshot,
        surahNumber: updated.surahNumber,
        startAyah: updated.startAyah,
        endAyah: updated.endAyah,
        pageNumber: updated.pageNumber,
        mode: updated.mode,
        targetType: updated.targetType,
        duration: updated.duration,
        wordsRecited: updated.wordsRecited,
        accuracy: updated.accuracy,
      });
    }

    // === COMPLETE ===
    if (action === "complete") {
      if (dbSession.status !== "ACTIVE" && dbSession.status !== "PAUSED") {
        return NextResponse.json(
          { error: "Only ACTIVE or PAUSED sessions can be completed" },
          { status: 400 }
        );
      }

      const { duration, accuracy, wordsRecited, mistakeCount, mistakes } = body;

      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.recitationSession.update({
          where: { id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            stateSnapshot: Prisma.DbNull,
            pausedAt: null,
            duration: duration ?? dbSession.duration,
            accuracy: accuracy ?? dbSession.accuracy,
            wordsRecited: wordsRecited ?? dbSession.wordsRecited,
            mistakeCount: mistakeCount ?? dbSession.mistakeCount,
          },
        });

        // Create mistakes if provided
        if (mistakes && Array.isArray(mistakes) && mistakes.length > 0) {
          await tx.mistake.createMany({
            data: mistakes.map(
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
                sessionId: id,
                surahNumber: m.surahNumber,
                ayahNumber: m.ayahNumber,
                wordIndex: m.wordIndex,
                type: m.type,
                recitedText: m.recitedText ?? null,
                correctText: m.correctText,
                severity: m.severity ?? "MINOR",
              })
            ),
          });
        }

        // Update user stats
        const sessionDuration =
          (duration ?? dbSession.duration) - dbSession.duration;
        if (sessionDuration > 0) {
          await tx.user.update({
            where: { id: userId },
            data: {
              totalTimeSpent: { increment: sessionDuration },
              lastActiveAt: new Date(),
            },
          });
        } else {
          await tx.user.update({
            where: { id: userId },
            data: { lastActiveAt: new Date() },
          });
        }

        // Upsert streak
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const existingStreak = await tx.streakHistory.findUnique({
          where: { userId_date: { userId, date: today } },
        });

        if (!existingStreak) {
          await tx.streakHistory.create({
            data: { userId, date: today, isActive: true },
          });

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

        return updated;
      });

      return NextResponse.json({ id: result.id, status: result.status });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/progress/sessions/[id] — discard (soft delete) a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = await params;

    const dbSession = await prisma.recitationSession.findUnique({
      where: { id },
    });

    if (!dbSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (dbSession.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (dbSession.status !== "ACTIVE" && dbSession.status !== "PAUSED") {
      return NextResponse.json(
        { error: "Only ACTIVE or PAUSED sessions can be discarded" },
        { status: 400 }
      );
    }

    const updated = await prisma.recitationSession.update({
      where: { id },
      data: {
        status: "DISCARDED",
        stateSnapshot: Prisma.DbNull,
      },
    });

    return NextResponse.json({ id: updated.id, status: updated.status });
  } catch (error) {
    console.error("Error discarding session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
