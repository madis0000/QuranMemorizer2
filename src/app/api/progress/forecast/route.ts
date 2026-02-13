import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getCached } from "@/lib/cache";
import { prisma } from "@/lib/db";

interface ForecastDay {
  date: string;
  count: number;
  isToday: boolean;
}

interface OverdueBreakdown {
  total: number;
  critical: number; // 30+ days overdue
  warning: number; // 7-29 days overdue
  mild: number; // 1-6 days overdue
}

/**
 * GET /api/progress/forecast
 * Returns 30-day review forecast + overdue debt gauge.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const data = await getCached(
      `forecast:${userId}`,
      300, // 5 min TTL
      async () => computeForecast(userId)
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Forecast error:", error);
    return NextResponse.json(
      { error: "Failed to compute forecast" },
      { status: 500 }
    );
  }
}

async function computeForecast(userId: string) {
  const cards = await prisma.fSRSCard.findMany({
    where: { userId },
    select: {
      due: true,
      state: true,
    },
  });

  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  // Build 30-day forecast bins
  const forecast: ForecastDay[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(todayStart);
    date.setUTCDate(date.getUTCDate() + i);
    forecast.push({
      date: date.toISOString().split("T")[0],
      count: 0,
      isToday: i === 0,
    });
  }

  // Count overdue cards
  const overdue: OverdueBreakdown = {
    total: 0,
    critical: 0,
    warning: 0,
    mild: 0,
  };

  for (const card of cards) {
    const dueDate = new Date(card.due);
    const daysDiff = Math.floor(
      (dueDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < 0) {
      // Overdue
      overdue.total++;
      const daysPastDue = Math.abs(daysDiff);
      if (daysPastDue >= 30) overdue.critical++;
      else if (daysPastDue >= 7) overdue.warning++;
      else overdue.mild++;

      // Count overdue cards in today's bin
      forecast[0].count++;
    } else if (daysDiff < 30) {
      forecast[daysDiff].count++;
    }
  }

  const totalCards = cards.length;
  const debtRatio =
    totalCards > 0 ? Math.round((overdue.total / totalCards) * 100) : 0;

  const totalForecast = forecast.reduce((sum, d) => sum + d.count, 0);
  const dailyAverage = totalForecast > 0 ? Math.round(totalForecast / 30) : 0;

  return {
    forecast,
    overdue,
    debtRatio,
    dailyAverage,
    totalCards,
  };
}
