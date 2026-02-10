/**
 * Challenge Generation & Scoring Engine
 *
 * Generates daily challenges deterministically from date seed.
 * Scores challenge attempts with star ratings.
 */

export interface ChallengeConfig {
  type: "speed" | "accuracy" | "endurance" | "random_verse" | "daily";
  title: string;
  description?: string;
  surahNumber?: number;
  startAyah?: number;
  endAyah?: number;
  timeLimit?: number; // seconds
  accuracyThreshold?: number; // 0-100
  verseCount?: number;
  xpReward: number;
}

export interface ChallengeResult {
  accuracy: number;
  duration: number; // seconds
  versesCompleted: number;
  mistakes: number;
}

export interface ChallengeScore {
  passed: boolean;
  score: number; // 0-1000
  xpEarned: number;
  stars: 1 | 2 | 3;
}

// Daily challenge templates rotate through these
const DAILY_TEMPLATES: Omit<ChallengeConfig, "xpReward">[] = [
  {
    type: "daily",
    title: "Speed Reciter",
    description: "Recite 5 verses as fast as possible with 70%+ accuracy",
    verseCount: 5,
    timeLimit: 120,
    accuracyThreshold: 70,
  },
  {
    type: "daily",
    title: "Perfect Page",
    description: "Recite a page with perfect accuracy",
    verseCount: 15,
    accuracyThreshold: 95,
  },
  {
    type: "daily",
    title: "Memory Sprint",
    description: "Complete 10 review cards in under 5 minutes",
    verseCount: 10,
    timeLimit: 300,
  },
  {
    type: "daily",
    title: "Surah Challenge",
    description: "Recite an entire short surah from memory",
    surahNumber: 0, // computed dynamically
    accuracyThreshold: 80,
  },
  {
    type: "daily",
    title: "Endurance Test",
    description: "Recite as many verses as you can without a mistake",
    verseCount: 20,
    accuracyThreshold: 90,
  },
  {
    type: "daily",
    title: "Random Verse Recall",
    description: "Identify and recite 3 random verses",
    verseCount: 3,
    timeLimit: 180,
    accuracyThreshold: 75,
  },
  {
    type: "daily",
    title: "Tajweed Master",
    description: "Recite with perfect Tajweed for 5 verses",
    verseCount: 5,
    accuracyThreshold: 90,
  },
];

// Short surahs for daily surah challenges (87-114)
const SHORT_SURAHS = [
  87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104,
  105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
];

/**
 * Deterministic hash for date-based seed
 */
function dateSeed(date: Date): number {
  const dateStr = date.toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Generate today's daily challenge.
 * Deterministic — all users get the same challenge for a given date.
 */
export function generateDailyChallenge(
  date: Date = new Date()
): ChallengeConfig {
  const seed = dateSeed(date);
  const templateIndex = seed % DAILY_TEMPLATES.length;
  const template = { ...DAILY_TEMPLATES[templateIndex] };

  // Fill in dynamic surah if needed
  if (template.surahNumber === 0) {
    const surahIndex = seed % SHORT_SURAHS.length;
    template.surahNumber = SHORT_SURAHS[surahIndex];
    template.title = `Surah ${template.surahNumber} Challenge`;
  }

  return {
    ...template,
    xpReward: 50,
  };
}

/**
 * Score a challenge attempt
 */
export function scoreChallengeAttempt(
  config: ChallengeConfig,
  result: ChallengeResult
): ChallengeScore {
  let score = 0;

  // Accuracy component (0-400 points)
  const accuracyScore = Math.min(result.accuracy / 100, 1) * 400;
  score += accuracyScore;

  // Completion component (0-300 points)
  const targetVerses = config.verseCount ?? 10;
  const completionRatio = Math.min(result.versesCompleted / targetVerses, 1);
  score += completionRatio * 300;

  // Time component (0-200 points) — faster is better, if time limit exists
  if (config.timeLimit) {
    const timeRatio = Math.max(0, 1 - result.duration / config.timeLimit);
    score += timeRatio * 200;
  } else {
    score += 100; // flat bonus when no time limit
  }

  // Mistake penalty
  score -= result.mistakes * 10;

  score = Math.max(0, Math.round(score));

  // Check pass condition
  const accuracyPassed = config.accuracyThreshold
    ? result.accuracy >= config.accuracyThreshold
    : true;
  const timePassed = config.timeLimit
    ? result.duration <= config.timeLimit
    : true;
  const passed = accuracyPassed && timePassed && completionRatio >= 0.8;

  // Star rating
  let stars: 1 | 2 | 3 = 1;
  if (score >= 700) stars = 3;
  else if (score >= 500) stars = 2;

  // XP earned
  const xpEarned = passed
    ? Math.round(config.xpReward * (stars / 3) * (1 + completionRatio))
    : Math.round(config.xpReward * 0.2); // consolation XP

  return { passed, score, xpEarned, stars };
}
