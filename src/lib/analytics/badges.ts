/**
 * Badge definitions and evaluation logic.
 * Checks user activity against badge conditions and awards earned badges.
 */

export interface BadgeDefinition {
  code: string;
  name: string;
  description: string;
  icon: string;
  category: "STREAK" | "MEMORIZATION" | "CONSISTENCY" | "MILESTONE" | "SPECIAL";
  requirement: BadgeRequirement;
}

type BadgeRequirement =
  | { type: "streak"; days: number }
  | { type: "total_sessions"; count: number }
  | { type: "accuracy"; min: number }
  | { type: "session_duration"; minutes: number }
  | { type: "surah_complete"; count: number }
  | { type: "session_time"; startHour: number; endHour: number }
  | { type: "pages_in_session"; count: number }
  | { type: "first_session" }
  | { type: "translations_used"; count: number };

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    code: "first_steps",
    name: "First Steps",
    description: "Complete your first recitation session",
    icon: "footprints",
    category: "MILESTONE",
    requirement: { type: "first_session" },
  },
  {
    code: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "flame",
    category: "STREAK",
    requirement: { type: "streak", days: 7 },
  },
  {
    code: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "crown",
    category: "STREAK",
    requirement: { type: "streak", days: 30 },
  },
  {
    code: "streak_100",
    name: "Century",
    description: "Maintain a 100-day streak",
    icon: "trophy",
    category: "STREAK",
    requirement: { type: "streak", days: 100 },
  },
  {
    code: "surah_complete_1",
    name: "Surah Scholar",
    description: "Memorize a complete surah",
    icon: "book-open",
    category: "MEMORIZATION",
    requirement: { type: "surah_complete", count: 1 },
  },
  {
    code: "surah_complete_10",
    name: "Hafiz in Training",
    description: "Memorize 10 complete surahs",
    icon: "graduation-cap",
    category: "MEMORIZATION",
    requirement: { type: "surah_complete", count: 10 },
  },
  {
    code: "perfect_session",
    name: "Perfect Session",
    description: "Achieve 100% accuracy in a memorization session",
    icon: "star",
    category: "MEMORIZATION",
    requirement: { type: "accuracy", min: 100 },
  },
  {
    code: "night_owl",
    name: "Night Owl",
    description: "Complete a session between 10 PM and 4 AM",
    icon: "moon",
    category: "SPECIAL",
    requirement: { type: "session_time", startHour: 22, endHour: 4 },
  },
  {
    code: "early_bird",
    name: "Early Bird",
    description: "Complete a session between 4 AM and 7 AM (Fajr time)",
    icon: "sunrise",
    category: "SPECIAL",
    requirement: { type: "session_time", startHour: 4, endHour: 7 },
  },
  {
    code: "speed_reader",
    name: "Speed Reader",
    description: "Read 10 pages in a single session",
    icon: "zap",
    category: "MILESTONE",
    requirement: { type: "pages_in_session", count: 10 },
  },
  {
    code: "dedicated_50",
    name: "Dedicated",
    description: "Complete 50 total sessions",
    icon: "heart",
    category: "CONSISTENCY",
    requirement: { type: "total_sessions", count: 50 },
  },
  {
    code: "centurion_100",
    name: "Centurion",
    description: "Complete 100 total sessions",
    icon: "shield",
    category: "CONSISTENCY",
    requirement: { type: "total_sessions", count: 100 },
  },
  {
    code: "marathon",
    name: "Marathon",
    description: "Complete a single session lasting over 30 minutes",
    icon: "timer",
    category: "MILESTONE",
    requirement: { type: "session_duration", minutes: 30 },
  },
  {
    code: "polyglot",
    name: "Polyglot",
    description: "Use translations in 3 or more languages",
    icon: "languages",
    category: "SPECIAL",
    requirement: { type: "translations_used", count: 3 },
  },
  {
    code: "streak_365",
    name: "Year of Quran",
    description: "Maintain a 365-day streak - an entire year!",
    icon: "award",
    category: "STREAK",
    requirement: { type: "streak", days: 365 },
  },
];

export interface UserActivity {
  currentStreak: number;
  totalSessions: number;
  lastSessionAccuracy?: number;
  lastSessionDuration?: number; // seconds
  lastSessionHour?: number; // 0-23
  pagesInLastSession?: number;
  completedSurahs?: number;
  translationsUsed?: number;
}

/**
 * Evaluate which new badges a user has earned based on their activity.
 * Returns badge codes that the user doesn't already have.
 */
export function evaluateBadges(
  activity: UserActivity,
  alreadyEarned: string[]
): string[] {
  const earnedSet = new Set(alreadyEarned);
  const newBadges: string[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (earnedSet.has(badge.code)) continue;

    if (checkRequirement(badge.requirement, activity)) {
      newBadges.push(badge.code);
    }
  }

  return newBadges;
}

function checkRequirement(
  req: BadgeRequirement,
  activity: UserActivity
): boolean {
  switch (req.type) {
    case "first_session":
      return activity.totalSessions >= 1;
    case "streak":
      return activity.currentStreak >= req.days;
    case "total_sessions":
      return activity.totalSessions >= req.count;
    case "accuracy":
      return (activity.lastSessionAccuracy ?? 0) >= req.min;
    case "session_duration":
      return (activity.lastSessionDuration ?? 0) >= req.minutes * 60;
    case "session_time": {
      const hour = activity.lastSessionHour;
      if (hour === undefined) return false;
      if (req.startHour > req.endHour) {
        // Wraps around midnight (e.g., 22-4)
        return hour >= req.startHour || hour < req.endHour;
      }
      return hour >= req.startHour && hour < req.endHour;
    }
    case "pages_in_session":
      return (activity.pagesInLastSession ?? 0) >= req.count;
    case "surah_complete":
      return (activity.completedSurahs ?? 0) >= req.count;
    case "translations_used":
      return (activity.translationsUsed ?? 0) >= req.count;
    default:
      return false;
  }
}

/**
 * Get badge definition by code.
 */
export function getBadgeByCode(code: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.code === code);
}
