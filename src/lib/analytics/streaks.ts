/**
 * Streak calculation with timezone handling.
 * Determines current streak, longest streak, and generates heatmap data.
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalDaysActive: number;
}

export interface HeatmapEntry {
  date: string; // YYYY-MM-DD
  count: number; // 0 = no activity, 1-4 = intensity levels
  isActive: boolean;
}

/**
 * Calculate streak from a sorted array of active dates.
 * Dates should be in YYYY-MM-DD format, sorted descending (newest first).
 */
export function calculateStreak(activeDates: string[]): StreakData {
  if (activeDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalDaysActive: 0,
    };
  }

  // Sort descending
  const sorted = [...activeDates].sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().split("T")[0];
  const yesterday = getDateOffset(today, -1);

  // Calculate current streak
  let currentStreak = 0;
  const mostRecent = sorted[0];

  // Current streak only counts if last active was today or yesterday
  if (mostRecent === today || mostRecent === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const expected = getDateOffset(sorted[i - 1], -1);
      if (sorted[i] === expected) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const expected = getDateOffset(sorted[i - 1], -1);
    if (sorted[i] === expected) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    lastActiveDate: sorted[0],
    totalDaysActive: sorted.length,
  };
}

/**
 * Generate heatmap data for the last N days (default 365).
 */
export function generateHeatmap(
  activeDates: string[],
  sessionCounts: Record<string, number>,
  days: number = 365
): HeatmapEntry[] {
  const activeSet = new Set(activeDates);
  const today = new Date();
  const entries: HeatmapEntry[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const count = sessionCounts[dateStr] ?? 0;

    entries.push({
      date: dateStr,
      count: Math.min(count, 4), // Cap at 4 for intensity levels
      isActive: activeSet.has(dateStr),
    });
  }

  return entries;
}

/**
 * Get a date string offset by N days.
 * Uses UTC arithmetic to avoid timezone issues with toISOString().
 */
function getDateOffset(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}

/**
 * Check if a streak would break (no activity today and last active was yesterday).
 */
export function isStreakAtRisk(lastActiveDate: string | null): boolean {
  if (!lastActiveDate) return false;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = getDateOffset(today, -1);
  return lastActiveDate === yesterday;
}

/**
 * Get weekly activity summary for the current week.
 */
export function getWeeklyActivity(
  sessions: { date: string; duration: number; accuracy: number }[]
): {
  day: string;
  sessions: number;
  totalDuration: number;
  avgAccuracy: number;
}[] {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return dayNames.map((day, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const daySessions = sessions.filter((s) => s.date === dateStr);
    const totalDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);
    const avgAccuracy =
      daySessions.length > 0
        ? Math.round(
            daySessions.reduce((sum, s) => sum + s.accuracy, 0) /
              daySessions.length
          )
        : 0;

    return {
      day,
      sessions: daySessions.length,
      totalDuration,
      avgAccuracy,
    };
  });
}
