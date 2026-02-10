import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/social/circles/[id]/students
 * Get progress data for all members in a circle.
 * Only accessible to OWNER or TEACHER roles.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: circleId } = await params;

    // Check that the requester is a teacher or owner
    const membership = await prisma.circleMember.findUnique({
      where: {
        userId_circleId: {
          userId: session.user.id,
          circleId,
        },
      },
    });

    if (!membership || membership.role === "MEMBER") {
      return NextResponse.json(
        { error: "Only teachers and owners can view student progress" },
        { status: 403 }
      );
    }

    // Get all members
    const members = await prisma.circleMember.findMany({
      where: { circleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true,
            streakCount: true,
            longestStreak: true,
            lastActiveAt: true,
          },
        },
      },
    });

    // Get session data for each member
    const studentProgress = await Promise.all(
      members.map(async (member) => {
        const [recentSessions, totalSessions, avgAccuracy] = await Promise.all([
          prisma.recitationSession.findMany({
            where: { userId: member.userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              surahNumber: true,
              accuracy: true,
              duration: true,
              mode: true,
              createdAt: true,
            },
          }),
          prisma.recitationSession.count({
            where: { userId: member.userId },
          }),
          prisma.recitationSession.aggregate({
            where: { userId: member.userId },
            _avg: { accuracy: true },
          }),
        ]);

        // Find weak surahs (lowest accuracy)
        const surahAccuracies = await prisma.recitationSession.groupBy({
          by: ["surahNumber"],
          where: { userId: member.userId },
          _avg: { accuracy: true },
          _count: true,
          orderBy: { _avg: { accuracy: "asc" } },
          take: 3,
        });

        return {
          userId: member.userId,
          role: member.role,
          joinedAt: member.joinedAt,
          weeklyXP: member.weeklyXP,
          user: member.user,
          stats: {
            totalSessions,
            avgAccuracy: Math.round(avgAccuracy._avg.accuracy ?? 0),
            streak: member.user.streakCount,
            longestStreak: member.user.longestStreak,
            lastActive: member.user.lastActiveAt,
          },
          recentSessions,
          weakSurahs: surahAccuracies.map((s) => ({
            surahNumber: s.surahNumber,
            avgAccuracy: Math.round(s._avg.accuracy ?? 0),
            sessionCount: s._count,
          })),
        };
      })
    );

    return NextResponse.json({
      circleId,
      students: studentProgress,
      totalMembers: members.length,
    });
  } catch (error) {
    console.error("Students API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
