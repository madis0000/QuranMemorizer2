/**
 * Achievements System (50+ badges)
 * Expanded from the original 15 badges with rarity tiers and new categories
 */

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";
export type AchievementCategory =
  | "practice"
  | "streak"
  | "memorization"
  | "tajweed"
  | "speed"
  | "special"
  | "secret";

export interface AchievementRequirement {
  type: string;
  value?: number;
  startHour?: number;
  endHour?: number;
  dayOfWeek?: number;
  isRamadan?: boolean;
  count?: number;
  surahNumber?: number;
  min?: number;
  minutes?: number;
  verses?: number;
  accuracy?: number;
  daysBreak?: number;
  sessionsAfter?: number;
}

export interface Achievement {
  code: string;
  name: string;
  arabicName?: string;
  description: string;
  icon: string; // lucide icon name
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  requirement: AchievementRequirement;
  secret?: boolean; // Hidden until earned
}

/**
 * All 50+ achievement definitions
 */
export const ACHIEVEMENTS: Achievement[] = [
  // ===== PRACTICE (10) =====
  {
    code: "first_steps",
    name: "First Steps",
    arabicName: "الخطوات الأولى",
    description: "Complete your first recitation session",
    icon: "footprints",
    category: "practice",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "first_session" },
  },
  {
    code: "sessions_10",
    name: "Getting Started",
    arabicName: "البداية",
    description: "Complete 10 recitation sessions",
    icon: "book",
    category: "practice",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "total_sessions", count: 10 },
  },
  {
    code: "sessions_50",
    name: "Dedicated Learner",
    arabicName: "المتعلم المتفاني",
    description: "Complete 50 recitation sessions",
    icon: "heart",
    category: "practice",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "total_sessions", count: 50 },
  },
  {
    code: "sessions_100",
    name: "Centurion",
    arabicName: "المائة",
    description: "Complete 100 recitation sessions",
    icon: "shield",
    category: "practice",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "total_sessions", count: 100 },
  },
  {
    code: "sessions_500",
    name: "Master of Practice",
    arabicName: "سيد الممارسة",
    description: "Complete 500 recitation sessions",
    icon: "crown",
    category: "practice",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "total_sessions", count: 500 },
  },
  {
    code: "perfect_session",
    name: "Perfect Session",
    arabicName: "جلسة مثالية",
    description: "Achieve 100% accuracy in a session",
    icon: "star",
    category: "practice",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "accuracy", min: 100 },
  },
  {
    code: "perfect_5",
    name: "Consistency Master",
    arabicName: "سيد الاتساق",
    description: "Achieve 100% accuracy in 5 sessions",
    icon: "sparkles",
    category: "practice",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "perfect_sessions", count: 5 },
  },
  {
    code: "perfect_page",
    name: "Page Perfect",
    arabicName: "صفحة كاملة",
    description: "Recite an entire page with 100% accuracy",
    icon: "file-check",
    category: "practice",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "perfect_page" },
  },
  {
    code: "perfect_surah",
    name: "Surah Perfect",
    arabicName: "سورة كاملة",
    description: "Recite an entire surah with 100% accuracy",
    icon: "award",
    category: "practice",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "perfect_surah" },
  },
  {
    code: "marathon_30min",
    name: "Marathon",
    arabicName: "الماراثون",
    description: "Complete a session lasting 30+ minutes",
    icon: "timer",
    category: "practice",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "session_duration", minutes: 30 },
  },

  // ===== STREAKS (8) =====
  {
    code: "streak_3",
    name: "Building Momentum",
    arabicName: "بناء الزخم",
    description: "Maintain a 3-day streak",
    icon: "flame",
    category: "streak",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "streak", value: 3 },
  },
  {
    code: "streak_7",
    name: "Week Warrior",
    arabicName: "محارب الأسبوع",
    description: "Maintain a 7-day streak",
    icon: "flame",
    category: "streak",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "streak", value: 7 },
  },
  {
    code: "streak_14",
    name: "Two Week Champion",
    arabicName: "بطل الأسبوعين",
    description: "Maintain a 14-day streak",
    icon: "zap",
    category: "streak",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "streak", value: 14 },
  },
  {
    code: "streak_30",
    name: "Monthly Master",
    arabicName: "سيد الشهر",
    description: "Maintain a 30-day streak",
    icon: "trophy",
    category: "streak",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "streak", value: 30 },
  },
  {
    code: "streak_60",
    name: "Two Month Titan",
    arabicName: "عملاق الشهرين",
    description: "Maintain a 60-day streak",
    icon: "gem",
    category: "streak",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "streak", value: 60 },
  },
  {
    code: "streak_100",
    name: "Century",
    arabicName: "القرن",
    description: "Maintain a 100-day streak",
    icon: "crown",
    category: "streak",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "streak", value: 100 },
  },
  {
    code: "streak_200",
    name: "Unwavering Dedication",
    arabicName: "التفاني الثابت",
    description: "Maintain a 200-day streak",
    icon: "medal",
    category: "streak",
    rarity: "legendary",
    xpReward: 100,
    requirement: { type: "streak", value: 200 },
  },
  {
    code: "streak_365",
    name: "Year of Quran",
    arabicName: "سنة القرآن",
    description: "Maintain a 365-day streak - an entire year!",
    icon: "award",
    category: "streak",
    rarity: "legendary",
    xpReward: 100,
    requirement: { type: "streak", value: 365 },
  },

  // ===== MEMORIZATION (10) =====
  {
    code: "first_verse",
    name: "First Verse",
    arabicName: "الآية الأولى",
    description: "Memorize your first verse",
    icon: "bookmark",
    category: "memorization",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "verses_memorized", count: 1 },
  },
  {
    code: "first_page",
    name: "First Page",
    arabicName: "الصفحة الأولى",
    description: "Memorize your first complete page",
    icon: "file",
    category: "memorization",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "pages_memorized", count: 1 },
  },
  {
    code: "first_surah",
    name: "First Surah",
    arabicName: "السورة الأولى",
    description: "Memorize your first complete surah",
    icon: "book-open",
    category: "memorization",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "surahs_memorized", count: 1 },
  },
  {
    code: "first_juz",
    name: "First Juz",
    arabicName: "الجزء الأول",
    description: "Memorize your first complete juz",
    icon: "book-marked",
    category: "memorization",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "juz_memorized", count: 1 },
  },
  {
    code: "surahs_5",
    name: "Five Surahs",
    arabicName: "خمس سور",
    description: "Memorize 5 complete surahs",
    icon: "layers",
    category: "memorization",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "surahs_memorized", count: 5 },
  },
  {
    code: "surahs_10",
    name: "Hafiz in Training",
    arabicName: "حافظ في التدريب",
    description: "Memorize 10 complete surahs",
    icon: "graduation-cap",
    category: "memorization",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "surahs_memorized", count: 10 },
  },
  {
    code: "surahs_30",
    name: "Juz Amma Master",
    arabicName: "سيد جزء عم",
    description: "Memorize all 30 surahs of Juz Amma",
    icon: "stars",
    category: "memorization",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "juz_amma_complete" },
  },
  {
    code: "half_quran",
    name: "Halfway Hafiz",
    arabicName: "نصف حافظ",
    description: "Memorize 15 complete juz (half the Quran)",
    icon: "battery",
    category: "memorization",
    rarity: "legendary",
    xpReward: 100,
    requirement: { type: "juz_memorized", count: 15 },
  },
  {
    code: "full_quran",
    name: "Hafiz",
    arabicName: "حافظ القرآن",
    description: "Memorize the entire Quran - all 30 juz!",
    icon: "trophy",
    category: "memorization",
    rarity: "legendary",
    xpReward: 100,
    requirement: { type: "full_quran" },
  },
  {
    code: "fatihah_perfect",
    name: "Al-Fatihah Master",
    arabicName: "سيد الفاتحة",
    description: "Recite Surah Al-Fatihah with 100% accuracy 10 times",
    icon: "key",
    category: "memorization",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "surah_perfect_count", surahNumber: 1, count: 10 },
  },

  // ===== TAJWEED (6) =====
  {
    code: "first_tajweed_rule",
    name: "Tajweed Beginner",
    arabicName: "مبتدئ التجويد",
    description: "Master your first tajweed rule",
    icon: "wand",
    category: "tajweed",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "tajweed_rules", count: 1 },
  },
  {
    code: "tajweed_rules_3",
    name: "Tajweed Student",
    arabicName: "طالب التجويد",
    description: "Master 3 tajweed rules",
    icon: "wand-2",
    category: "tajweed",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "tajweed_rules", count: 3 },
  },
  {
    code: "tajweed_basic_complete",
    name: "Basic Tajweed Master",
    arabicName: "سيد التجويد الأساسي",
    description: "Master all basic tajweed rules (10 rules)",
    icon: "scroll",
    category: "tajweed",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "tajweed_rules", count: 10 },
  },
  {
    code: "tajweed_advanced",
    name: "Advanced Tajweed Scholar",
    arabicName: "عالم التجويد المتقدم",
    description: "Master advanced tajweed rules",
    icon: "scroll-text",
    category: "tajweed",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "tajweed_advanced" },
  },
  {
    code: "perfect_tajweed_session",
    name: "Perfect Tajweed",
    arabicName: "التجويد المثالي",
    description: "Complete a session with perfect tajweed application",
    icon: "sparkle",
    category: "tajweed",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "perfect_tajweed" },
  },
  {
    code: "tajweed_master",
    name: "Tajweed Master",
    arabicName: "أستاذ التجويد",
    description: "Master all tajweed rules and apply them perfectly 50 times",
    icon: "sparkles",
    category: "tajweed",
    rarity: "legendary",
    xpReward: 100,
    requirement: { type: "tajweed_master" },
  },

  // ===== SPEED (4) =====
  {
    code: "quick_learner",
    name: "Quick Learner",
    arabicName: "المتعلم السريع",
    description: "Memorize 10 verses in under 15 minutes",
    icon: "rabbit",
    category: "speed",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "speed_memorization", verses: 10, minutes: 15 },
  },
  {
    code: "speed_reader",
    name: "Speed Reader",
    arabicName: "القارئ السريع",
    description: "Read 10 pages in a single session",
    icon: "zap",
    category: "speed",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "pages_in_session", count: 10 },
  },
  {
    code: "lightning_round",
    name: "Lightning Round",
    arabicName: "جولة البرق",
    description: "Recite 50 verses in under 10 minutes with 90%+ accuracy",
    icon: "bolt",
    category: "speed",
    rarity: "epic",
    xpReward: 50,
    requirement: {
      type: "speed_recitation",
      verses: 50,
      minutes: 10,
      accuracy: 90,
    },
  },
  {
    code: "speed_demon",
    name: "Speed Demon",
    arabicName: "شيطان السرعة",
    description: "Complete a full juz in one session",
    icon: "rocket",
    category: "speed",
    rarity: "legendary",
    xpReward: 100,
    requirement: { type: "juz_in_session" },
  },

  // ===== SPECIAL (8) =====
  {
    code: "early_bird",
    name: "Early Bird",
    arabicName: "الطائر الباكر",
    description: "Complete a session during Fajr time (4-7 AM)",
    icon: "sunrise",
    category: "special",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "session_time", startHour: 4, endHour: 7 },
  },
  {
    code: "night_owl",
    name: "Night Owl",
    arabicName: "بومة الليل",
    description: "Complete a session in the last third of the night (2-4 AM)",
    icon: "moon",
    category: "special",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "session_time", startHour: 2, endHour: 4 },
  },
  {
    code: "friday_scholar",
    name: "Friday Scholar",
    arabicName: "عالم الجمعة",
    description: "Recite Surah Al-Kahf on Friday",
    icon: "calendar",
    category: "special",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "friday_kahf", surahNumber: 18, dayOfWeek: 5 },
  },
  {
    code: "ramadan_warrior",
    name: "Ramadan Warrior",
    arabicName: "محارب رمضان",
    description: "Complete sessions on 20+ days during Ramadan",
    icon: "moon-star",
    category: "special",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "ramadan_sessions", count: 20 },
  },
  {
    code: "similar_verses_master",
    name: "Similar Verses Master",
    arabicName: "سيد الآيات المتشابهة",
    description: "Correctly distinguish between 50 similar verses",
    icon: "git-compare",
    category: "special",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "similar_verses", count: 50 },
  },
  {
    code: "social_butterfly",
    name: "Social Butterfly",
    arabicName: "الفراشة الاجتماعية",
    description: "Join a group and complete 10 group challenges",
    icon: "users",
    category: "special",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "group_challenges", count: 10 },
  },
  {
    code: "teachers_pet",
    name: "Teacher's Pet",
    arabicName: "محبوب المعلم",
    description: "Help 5 other users by sharing notes or corrections",
    icon: "heart-handshake",
    category: "special",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "help_users", count: 5 },
  },
  {
    code: "explorer",
    name: "Explorer",
    arabicName: "المستكشف",
    description:
      "Try all memorization methods (hide, progressive reveal, etc.)",
    icon: "compass",
    category: "special",
    rarity: "common",
    xpReward: 10,
    requirement: { type: "all_methods" },
  },

  // ===== SECRET (4) =====
  {
    code: "night_warrior",
    name: "Night Warrior",
    arabicName: "محارب الليل",
    description: "Complete 100 sessions after midnight",
    icon: "moon-star",
    category: "secret",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "midnight_sessions", count: 100 },
    secret: true,
  },
  {
    code: "polyglot",
    name: "Polyglot",
    arabicName: "متعدد اللغات",
    description: "Use translations in 5 or more languages",
    icon: "languages",
    category: "secret",
    rarity: "rare",
    xpReward: 25,
    requirement: { type: "translations_used", count: 5 },
    secret: true,
  },
  {
    code: "comeback_kid",
    name: "Comeback Kid",
    arabicName: "عودة البطل",
    description:
      "Return after a 30+ day break and complete 7 consecutive sessions",
    icon: "repeat",
    category: "secret",
    rarity: "epic",
    xpReward: 50,
    requirement: { type: "comeback", daysBreak: 30, sessionsAfter: 7 },
    secret: true,
  },
  {
    code: "perfectionist",
    name: "Perfectionist",
    arabicName: "الكمالي",
    description: "Achieve 100% accuracy in 100 sessions",
    icon: "diamond",
    category: "secret",
    rarity: "legendary",
    xpReward: 100,
    requirement: { type: "perfect_sessions", count: 100 },
    secret: true,
  },
];

export interface AchievementActivity {
  currentStreak: number;
  totalSessions: number;
  lastSessionAccuracy?: number;
  lastSessionDuration?: number; // seconds
  lastSessionHour?: number; // 0-23
  pagesInLastSession?: number;
  completedSurahs?: number;
  completedJuz?: number;
  totalVersesMemorized?: number;
  translationsUsed?: number;
  tajweedRulesMastered?: number;
  hideModesUsed?: number;
  isFriday?: boolean;
  isRamadan?: boolean;
  lastSessionSurahNumber?: number;
  perfectSessionCount?: number;
  pagesMemorized?: number;
  versesInLastSession?: number;
  lastSessionMinutes?: number;
  groupChallengesCompleted?: number;
  usersHelped?: number;
  midnightSessions?: number;
  daysInactive?: number;
  sessionsAfterBreak?: number;
  similarVersesCorrect?: number;
  ramadanSessionCount?: number;
  surahPerfectCounts?: Record<number, number>; // surahNumber -> perfect count
  tajweedPerfectSessions?: number;
  speedMemorizations?: Array<{ verses: number; minutes: number }>;
  speedRecitations?: Array<{
    verses: number;
    minutes: number;
    accuracy: number;
  }>;
  juzInSession?: boolean;
}

/**
 * Evaluate which new achievements a user has earned based on their activity.
 * Returns achievement codes that the user doesn't already have.
 */
export function evaluateAchievements(
  activity: AchievementActivity,
  alreadyEarned: string[]
): string[] {
  const earnedSet = new Set(alreadyEarned);
  const newAchievements: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (earnedSet.has(achievement.code)) continue;

    if (checkAchievementRequirement(achievement.requirement, activity)) {
      newAchievements.push(achievement.code);
    }
  }

  return newAchievements;
}

/**
 * Check if an achievement requirement is met
 */
function checkAchievementRequirement(
  req: AchievementRequirement,
  activity: AchievementActivity
): boolean {
  switch (req.type) {
    case "first_session":
      return activity.totalSessions >= 1;

    case "total_sessions":
      return activity.totalSessions >= (req.count ?? 0);

    case "streak":
      return activity.currentStreak >= (req.value ?? 0);

    case "accuracy":
      return (activity.lastSessionAccuracy ?? 0) >= (req.min ?? 0);

    case "session_duration":
      return (activity.lastSessionDuration ?? 0) >= (req.minutes ?? 0) * 60;

    case "session_time": {
      const hour = activity.lastSessionHour;
      if (hour === undefined) return false;
      const startHour = req.startHour ?? 0;
      const endHour = req.endHour ?? 24;
      if (startHour > endHour) {
        return hour >= startHour || hour < endHour;
      }
      return hour >= startHour && hour < endHour;
    }

    case "pages_in_session":
      return (activity.pagesInLastSession ?? 0) >= (req.count ?? 0);

    case "verses_memorized":
      return (activity.totalVersesMemorized ?? 0) >= (req.count ?? 0);

    case "pages_memorized":
      return (activity.pagesMemorized ?? 0) >= (req.count ?? 0);

    case "surahs_memorized":
      return (activity.completedSurahs ?? 0) >= (req.count ?? 0);

    case "juz_memorized":
      return (activity.completedJuz ?? 0) >= (req.count ?? 0);

    case "juz_amma_complete":
      return (activity.completedSurahs ?? 0) >= 30;

    case "full_quran":
      return (activity.completedJuz ?? 0) >= 30;

    case "perfect_sessions":
      return (activity.perfectSessionCount ?? 0) >= (req.count ?? 0);

    case "perfect_page":
      return (
        (activity.pagesInLastSession ?? 0) >= 1 &&
        (activity.lastSessionAccuracy ?? 0) >= 100
      );

    case "perfect_surah":
      return (activity.lastSessionAccuracy ?? 0) >= 100;

    case "surah_perfect_count": {
      const surahNumber = req.surahNumber ?? 0;
      const count = activity.surahPerfectCounts?.[surahNumber] ?? 0;
      return count >= (req.count ?? 0);
    }

    case "tajweed_rules":
      return (activity.tajweedRulesMastered ?? 0) >= (req.count ?? 0);

    case "tajweed_advanced":
      return (activity.tajweedRulesMastered ?? 0) >= 15;

    case "perfect_tajweed":
      return (activity.tajweedPerfectSessions ?? 0) >= 1;

    case "tajweed_master":
      return (
        (activity.tajweedRulesMastered ?? 0) >= 20 &&
        (activity.tajweedPerfectSessions ?? 0) >= 50
      );

    case "speed_memorization": {
      const speedMems = activity.speedMemorizations ?? [];
      return speedMems.some(
        (s) =>
          s.verses >= (req.verses ?? 0) && s.minutes <= (req.minutes ?? 999)
      );
    }

    case "speed_recitation": {
      const speedRecs = activity.speedRecitations ?? [];
      return speedRecs.some(
        (s) =>
          s.verses >= (req.verses ?? 0) &&
          s.minutes <= (req.minutes ?? 999) &&
          s.accuracy >= (req.accuracy ?? 0)
      );
    }

    case "juz_in_session":
      return activity.juzInSession ?? false;

    case "friday_kahf":
      return (
        activity.isFriday === true &&
        activity.lastSessionSurahNumber === req.surahNumber
      );

    case "ramadan_sessions":
      return (activity.ramadanSessionCount ?? 0) >= (req.count ?? 0);

    case "similar_verses":
      return (activity.similarVersesCorrect ?? 0) >= (req.count ?? 0);

    case "group_challenges":
      return (activity.groupChallengesCompleted ?? 0) >= (req.count ?? 0);

    case "help_users":
      return (activity.usersHelped ?? 0) >= (req.count ?? 0);

    case "all_methods":
      return (activity.hideModesUsed ?? 0) >= 3;

    case "midnight_sessions":
      return (activity.midnightSessions ?? 0) >= (req.count ?? 0);

    case "translations_used":
      return (activity.translationsUsed ?? 0) >= (req.count ?? 0);

    case "comeback":
      return (
        (activity.daysInactive ?? 0) >= (req.daysBreak ?? 0) &&
        (activity.sessionsAfterBreak ?? 0) >= (req.sessionsAfter ?? 0)
      );

    default:
      return false;
  }
}

/**
 * Get achievement by code
 */
export function getAchievementByCode(code: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.code === code);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(
  category: AchievementCategory
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * Get achievements by rarity
 */
export function getAchievementsByRarity(
  rarity: AchievementRarity
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.rarity === rarity);
}

/**
 * Get all non-secret achievements (for display)
 */
export function getVisibleAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.secret);
}

/**
 * Get user's achievement progress (earned vs total)
 */
export function getAchievementProgress(earnedCodes: string[]): {
  total: number;
  earned: number;
  byCategory: Record<AchievementCategory, { total: number; earned: number }>;
  byRarity: Record<AchievementRarity, { total: number; earned: number }>;
} {
  const earnedSet = new Set(earnedCodes);

  const byCategory: Record<
    AchievementCategory,
    { total: number; earned: number }
  > = {
    practice: { total: 0, earned: 0 },
    streak: { total: 0, earned: 0 },
    memorization: { total: 0, earned: 0 },
    tajweed: { total: 0, earned: 0 },
    speed: { total: 0, earned: 0 },
    special: { total: 0, earned: 0 },
    secret: { total: 0, earned: 0 },
  };

  const byRarity: Record<AchievementRarity, { total: number; earned: number }> =
    {
      common: { total: 0, earned: 0 },
      rare: { total: 0, earned: 0 },
      epic: { total: 0, earned: 0 },
      legendary: { total: 0, earned: 0 },
    };

  for (const achievement of ACHIEVEMENTS) {
    byCategory[achievement.category].total++;
    byRarity[achievement.rarity].total++;

    if (earnedSet.has(achievement.code)) {
      byCategory[achievement.category].earned++;
      byRarity[achievement.rarity].earned++;
    }
  }

  return {
    total: ACHIEVEMENTS.length,
    earned: earnedCodes.length,
    byCategory,
    byRarity,
  };
}
