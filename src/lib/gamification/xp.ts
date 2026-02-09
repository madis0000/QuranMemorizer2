/**
 * XP (Experience Points) Economy Engine
 * Handles XP calculations, level progression, and multipliers for gamification
 */

// XP Award Table
export const XP_TABLE = {
  // Practice
  sessionComplete: 10,
  perfectSession: 25, // 100% accuracy bonus
  perVerseRecited: 2,
  perNewVerseMemorized: 5,

  // Streaks
  dailyStreakMaintained: 5,
  weeklyStreakBonus: 20, // 7-day milestone
  monthlyStreakBonus: 100, // 30-day milestone

  // Achievements
  badgeEarned: { common: 10, rare: 25, epic: 50, legendary: 100 },

  // Challenges
  dailyChallengeComplete: 15,

  // Tajweed
  tajweedRuleMastered: 30,
  perfectTajweedSession: 20,
} as const;

// Streak multipliers
export const STREAK_MULTIPLIERS: Record<number, number> = {
  3: 1.2,
  7: 1.5,
  14: 1.8,
  30: 2.0,
  60: 2.5,
  100: 3.0,
};

// Blessed time multipliers
export const BLESSED_TIMES = {
  fajr: { startHour: 4, endHour: 7, multiplier: 2.0, name: "Fajr Time" },
  lastThird: {
    startHour: 2,
    endHour: 4,
    multiplier: 3.0,
    name: "Last Third of Night",
  },
} as const;

export interface SessionXPParams {
  versesRecited: number;
  accuracy: number; // 0-100
  duration: number; // seconds
  isNewMemorization: boolean;
  currentStreak: number;
  sessionHour: number; // 0-23
  tajweedPerfect?: boolean;
  newVersesCount?: number;
}

export interface XPBreakdown {
  source: string;
  amount: number;
}

export interface SessionXPResult {
  baseXP: number;
  streakMultiplier: number;
  timeMultiplier: number;
  totalXP: number;
  breakdown: XPBreakdown[];
}

/**
 * Calculate total XP for a completed session
 */
export function calculateSessionXP(params: SessionXPParams): SessionXPResult {
  const breakdown: XPBreakdown[] = [];
  let baseXP = 0;

  // Session completion bonus
  baseXP += XP_TABLE.sessionComplete;
  breakdown.push({
    source: "Session Complete",
    amount: XP_TABLE.sessionComplete,
  });

  // Verses recited
  const versesXP = params.versesRecited * XP_TABLE.perVerseRecited;
  baseXP += versesXP;
  breakdown.push({
    source: `Verses Recited (${params.versesRecited})`,
    amount: versesXP,
  });

  // New verses memorized
  if (params.isNewMemorization && params.newVersesCount) {
    const newVersesXP = params.newVersesCount * XP_TABLE.perNewVerseMemorized;
    baseXP += newVersesXP;
    breakdown.push({
      source: `New Verses Memorized (${params.newVersesCount})`,
      amount: newVersesXP,
    });
  }

  // Perfect session bonus
  if (params.accuracy >= 100) {
    baseXP += XP_TABLE.perfectSession;
    breakdown.push({
      source: "Perfect Session (100% Accuracy)",
      amount: XP_TABLE.perfectSession,
    });
  }

  // Tajweed bonus
  if (params.tajweedPerfect) {
    baseXP += XP_TABLE.perfectTajweedSession;
    breakdown.push({
      source: "Perfect Tajweed",
      amount: XP_TABLE.perfectTajweedSession,
    });
  }

  // Calculate multipliers
  const streakMultiplier = getStreakMultiplier(params.currentStreak);
  const timeMultiplier = getBlessedTimeMultiplier(params.sessionHour);

  // Add multiplier breakdown
  if (streakMultiplier > 1) {
    breakdown.push({
      source: `Streak Multiplier (${params.currentStreak} days)`,
      amount: Math.floor(baseXP * (streakMultiplier - 1)),
    });
  }

  if (timeMultiplier.multiplier > 1) {
    breakdown.push({
      source: `${timeMultiplier.name} Bonus`,
      amount: Math.floor(
        baseXP * streakMultiplier * (timeMultiplier.multiplier - 1)
      ),
    });
  }

  // Calculate total with all multipliers
  const totalXP = Math.floor(
    baseXP * streakMultiplier * timeMultiplier.multiplier
  );

  return {
    baseXP,
    streakMultiplier,
    timeMultiplier: timeMultiplier.multiplier,
    totalXP,
    breakdown,
  };
}

/**
 * Get streak multiplier based on streak length
 */
export function getStreakMultiplier(streakDays: number): number {
  // Find the highest applicable multiplier
  const applicableStreaks = Object.entries(STREAK_MULTIPLIERS)
    .filter(([days]) => streakDays >= parseInt(days))
    .map(([, multiplier]) => multiplier);

  return applicableStreaks.length > 0 ? Math.max(...applicableStreaks) : 1.0;
}

/**
 * Check if current hour qualifies for blessed time bonus
 */
export function getBlessedTimeMultiplier(hour: number): {
  multiplier: number;
  name: string;
} {
  // Check last third of night (highest priority)
  if (
    hour >= BLESSED_TIMES.lastThird.startHour &&
    hour < BLESSED_TIMES.lastThird.endHour
  ) {
    return {
      multiplier: BLESSED_TIMES.lastThird.multiplier,
      name: BLESSED_TIMES.lastThird.name,
    };
  }

  // Check Fajr time
  if (
    hour >= BLESSED_TIMES.fajr.startHour &&
    hour < BLESSED_TIMES.fajr.endHour
  ) {
    return {
      multiplier: BLESSED_TIMES.fajr.multiplier,
      name: BLESSED_TIMES.fajr.name,
    };
  }

  return { multiplier: 1.0, name: "Regular Time" };
}

/**
 * XP required for each level (exponential curve)
 * Formula: XP needed = 100 * level^1.5
 */
export function getXPForLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Get level from total XP
 */
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let cumulativeXP = 0;

  while (cumulativeXP + getXPForLevel(level) <= totalXP) {
    cumulativeXP += getXPForLevel(level);
    level++;
  }

  return level;
}

/**
 * Get XP progress for current level
 * Returns current level, XP in current level, XP needed for next level, and progress percentage
 */
export function getXPProgress(totalXP: number): {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number; // 0-100
} {
  const level = getLevelFromXP(totalXP);

  // Calculate cumulative XP up to current level
  let cumulativeXP = 0;
  for (let i = 1; i < level; i++) {
    cumulativeXP += getXPForLevel(i);
  }

  const currentXP = totalXP - cumulativeXP;
  const nextLevelXP = getXPForLevel(level);
  const progress =
    nextLevelXP > 0 ? Math.floor((currentXP / nextLevelXP) * 100) : 100;

  return {
    level,
    currentXP,
    nextLevelXP,
    progress: Math.min(progress, 100),
  };
}

/**
 * Calculate XP award for earning a badge
 */
export function getXPForBadge(
  rarity: "common" | "rare" | "epic" | "legendary"
): number {
  return XP_TABLE.badgeEarned[rarity];
}

/**
 * Calculate XP award for maintaining a streak
 */
export function getXPForStreak(streakDays: number): number {
  let xp = XP_TABLE.dailyStreakMaintained;

  // Add milestone bonuses
  if (streakDays % 30 === 0) {
    xp += XP_TABLE.monthlyStreakBonus;
  } else if (streakDays % 7 === 0) {
    xp += XP_TABLE.weeklyStreakBonus;
  }

  return xp;
}
