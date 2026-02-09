/**
 * Smart Study Plan Generator for Quran Memorization
 *
 * Supports multiple memorization methods:
 * - Sabaq: New verses + recent review (Sabqi) + distant review (Manzil)
 * - 3x3: Read 3x, recite 3x, review 3x
 * - Ottoman: Page-by-page memorization
 * - Adaptive: AI-driven based on FSRS performance
 */

// Verse counts for all 114 surahs
export const SURAH_VERSE_COUNTS = [
  7,
  286,
  200,
  176,
  120,
  165,
  206,
  75,
  129,
  109, // 1-10
  123,
  111,
  43,
  52,
  99,
  128,
  111,
  110,
  98,
  135, // 11-20
  112,
  78,
  118,
  64,
  77,
  227,
  93,
  88,
  69,
  60, // 21-30
  34,
  30,
  73,
  54,
  45,
  83,
  182,
  88,
  75,
  85, // 31-40
  54,
  53,
  89,
  59,
  37,
  35,
  38,
  29,
  18,
  45, // 41-50
  60,
  49,
  62,
  55,
  78,
  96,
  29,
  22,
  24,
  13, // 51-60
  14,
  11,
  11,
  18,
  12,
  12,
  30,
  52,
  52,
  44, // 61-70
  28,
  28,
  20,
  56,
  40,
  31,
  50,
  40,
  46,
  42, // 71-80
  29,
  19,
  36,
  25,
  22,
  17,
  19,
  26,
  30,
  20, // 81-90
  15,
  21,
  11,
  8,
  8,
  19,
  5,
  8,
  8,
  11, // 91-100
  11,
  8,
  3,
  9,
  5,
  4,
  7,
  3,
  6,
  3, // 101-110
  5,
  4,
  5,
  6, // 111-114
] as const;

// Surah names (English) for display
export const SURAH_NAMES = [
  "Al-Fatiha",
  "Al-Baqarah",
  "Ali 'Imran",
  "An-Nisa",
  "Al-Ma'idah",
  "Al-An'am",
  "Al-A'raf",
  "Al-Anfal",
  "At-Tawbah",
  "Yunus",
  "Hud",
  "Yusuf",
  "Ar-Ra'd",
  "Ibrahim",
  "Al-Hijr",
  "An-Nahl",
  "Al-Isra",
  "Al-Kahf",
  "Maryam",
  "Ta-Ha",
  "Al-Anbiya",
  "Al-Hajj",
  "Al-Mu'minun",
  "An-Nur",
  "Al-Furqan",
  "Ash-Shu'ara",
  "An-Naml",
  "Al-Qasas",
  "Al-'Ankabut",
  "Ar-Rum",
  "Luqman",
  "As-Sajdah",
  "Al-Ahzab",
  "Saba",
  "Fatir",
  "Ya-Sin",
  "As-Saffat",
  "Sad",
  "Az-Zumar",
  "Ghafir",
  "Fussilat",
  "Ash-Shura",
  "Az-Zukhruf",
  "Ad-Dukhan",
  "Al-Jathiyah",
  "Al-Ahqaf",
  "Muhammad",
  "Al-Fath",
  "Al-Hujurat",
  "Qaf",
  "Adh-Dhariyat",
  "At-Tur",
  "An-Najm",
  "Al-Qamar",
  "Ar-Rahman",
  "Al-Waqi'ah",
  "Al-Hadid",
  "Al-Mujadila",
  "Al-Hashr",
  "Al-Mumtahanah",
  "As-Saff",
  "Al-Jumu'ah",
  "Al-Munafiqun",
  "At-Taghabun",
  "At-Talaq",
  "At-Tahrim",
  "Al-Mulk",
  "Al-Qalam",
  "Al-Haqqah",
  "Al-Ma'arij",
  "Nuh",
  "Al-Jinn",
  "Al-Muzzammil",
  "Al-Muddaththir",
  "Al-Qiyamah",
  "Al-Insan",
  "Al-Mursalat",
  "An-Naba",
  "An-Nazi'at",
  "Abasa",
  "At-Takwir",
  "Al-Infitar",
  "Al-Mutaffifin",
  "Al-Inshiqaq",
  "Al-Buruj",
  "At-Tariq",
  "Al-A'la",
  "Al-Ghashiyah",
  "Al-Fajr",
  "Al-Balad",
  "Ash-Shams",
  "Al-Layl",
  "Ad-Duhaa",
  "Ash-Sharh",
  "At-Tin",
  "Al-'Alaq",
  "Al-Qadr",
  "Al-Bayyinah",
  "Az-Zalzalah",
  "Al-'Adiyat",
  "Al-Qari'ah",
  "At-Takathur",
  "Al-'Asr",
  "Al-Humazah",
  "Al-Fil",
  "Quraysh",
  "Al-Ma'un",
  "Al-Kawthar",
  "Al-Kafirun",
  "An-Nasr",
  "Al-Masad",
  "Al-Ikhlas",
  "Al-Falaq",
  "An-Nas",
] as const;

// Juz boundaries: [surahNumber, ayahNumber] for the start of each Juz (1-indexed)
const JUZ_BOUNDARIES: [number, number][] = [
  [1, 1], // Juz 1
  [2, 142], // Juz 2
  [2, 253], // Juz 3
  [3, 93], // Juz 4
  [4, 24], // Juz 5
  [4, 148], // Juz 6
  [5, 83], // Juz 7
  [6, 111], // Juz 8
  [7, 88], // Juz 9
  [8, 41], // Juz 10
  [9, 93], // Juz 11
  [11, 6], // Juz 12
  [12, 53], // Juz 13
  [15, 2], // Juz 14
  [17, 1], // Juz 15
  [18, 75], // Juz 16
  [21, 1], // Juz 17
  [23, 1], // Juz 18
  [25, 21], // Juz 19
  [27, 56], // Juz 20
  [29, 46], // Juz 21
  [33, 31], // Juz 22
  [36, 28], // Juz 23
  [39, 32], // Juz 24
  [41, 47], // Juz 25
  [46, 1], // Juz 26
  [51, 31], // Juz 27
  [58, 1], // Juz 28
  [67, 1], // Juz 29
  [78, 1], // Juz 30
];

export type StudyMethod = "sabaq" | "3x3" | "ottoman" | "adaptive";

export interface StudyPlanGoal {
  type: "surah" | "juz" | "pages" | "custom";
  target: number;
  startSurah?: number;
  startAyah?: number;
  endSurah?: number;
  endAyah?: number;
}

export interface StudyPlan {
  id: string;
  name: string;
  goal: StudyPlanGoal;
  method: StudyMethod;
  dailyTimeMinutes: number;
  startDate: string;
  deadline: string;
  schedule: DailyTarget[];
  isActive: boolean;
  createdAt: string;
}

export interface DailyTarget {
  date: string;
  newVerses: VerseRange[];
  recentReview: string[];
  distantReview: string[];
  estimatedMinutes: number;
  completed: boolean;
}

export interface VerseRange {
  surah: number;
  ayah: number;
  count: number;
}

/**
 * Generate a unique plan ID
 */
function generatePlanId(): string {
  return `plan_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

/**
 * Create a verse key like "2:255"
 */
function verseKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

/**
 * Get all verse keys for a juz
 */
function getJuzVerses(juzNumber: number): string[] {
  const verses: string[] = [];
  const start = JUZ_BOUNDARIES[juzNumber - 1];
  const end =
    juzNumber < 30 ? JUZ_BOUNDARIES[juzNumber] : ([115, 1] as [number, number]); // sentinel: after last surah

  let [currentSurah, currentAyah] = start;
  const [endSurah, endAyah] = end;

  while (
    currentSurah < endSurah ||
    (currentSurah === endSurah && currentAyah < endAyah)
  ) {
    if (currentSurah > 114) break;
    verses.push(verseKey(currentSurah, currentAyah));
    currentAyah++;
    if (currentAyah > SURAH_VERSE_COUNTS[currentSurah - 1]) {
      currentSurah++;
      currentAyah = 1;
    }
  }

  return verses;
}

/**
 * Get all verse keys for a surah
 */
function getSurahVerses(surahNumber: number): string[] {
  const count = SURAH_VERSE_COUNTS[surahNumber - 1];
  const verses: string[] = [];
  for (let ayah = 1; ayah <= count; ayah++) {
    verses.push(verseKey(surahNumber, ayah));
  }
  return verses;
}

/**
 * Get all verse keys for a custom range
 */
function getCustomVerses(
  startSurah: number,
  startAyah: number,
  endSurah: number,
  endAyah: number
): string[] {
  const verses: string[] = [];
  let currentSurah = startSurah;
  let currentAyah = startAyah;

  while (
    currentSurah < endSurah ||
    (currentSurah === endSurah && currentAyah <= endAyah)
  ) {
    if (currentSurah > 114) break;
    verses.push(verseKey(currentSurah, currentAyah));
    currentAyah++;
    if (currentAyah > SURAH_VERSE_COUNTS[currentSurah - 1]) {
      currentSurah++;
      currentAyah = 1;
    }
  }

  return verses;
}

/**
 * Get all verses for a goal
 */
function getGoalVerses(goal: StudyPlanGoal): string[] {
  switch (goal.type) {
    case "surah":
      return getSurahVerses(goal.target);
    case "juz":
      return getJuzVerses(goal.target);
    case "pages": {
      // Approximate: ~15 lines per page, ~10 words per line, ~1 verse per line
      // Average ~15 verses per page. For pages goal, estimate total verses.
      const estimatedVerses = goal.target * 15;
      // Default to starting from Juz 30 (short surahs) for page-based goals
      const startSurah = goal.startSurah ?? 78;
      const startAyah = goal.startAyah ?? 1;
      const verses: string[] = [];
      let currentSurah = startSurah;
      let currentAyah = startAyah;
      for (let i = 0; i < estimatedVerses; i++) {
        if (currentSurah > 114) break;
        verses.push(verseKey(currentSurah, currentAyah));
        currentAyah++;
        if (currentAyah > SURAH_VERSE_COUNTS[currentSurah - 1]) {
          currentSurah++;
          currentAyah = 1;
        }
      }
      return verses;
    }
    case "custom":
      return getCustomVerses(
        goal.startSurah ?? 1,
        goal.startAyah ?? 1,
        goal.endSurah ?? 114,
        goal.endAyah ?? SURAH_VERSE_COUNTS[(goal.endSurah ?? 114) - 1]
      );
    default:
      return [];
  }
}

/**
 * Estimate learning speed (verses per day) based on daily time commitment
 * Average: ~2 minutes per new verse, ~30 seconds for review verse
 */
function estimateNewVersesPerDay(dailyMinutes: number): number {
  // Reserve 40% of time for reviews
  const learningMinutes = dailyMinutes * 0.6;
  // ~2 minutes per new verse for beginners
  return Math.max(1, Math.floor(learningMinutes / 2));
}

/**
 * Parse a verse key back to surah and ayah
 */
function parseVerseKey(key: string): { surah: number; ayah: number } {
  const [s, a] = key.split(":");
  return { surah: parseInt(s, 10), ayah: parseInt(a, 10) };
}

/**
 * Group consecutive verses into VerseRange objects
 */
function groupConsecutiveVerses(keys: string[]): VerseRange[] {
  if (keys.length === 0) return [];

  const ranges: VerseRange[] = [];
  const parsed = keys.map(parseVerseKey);

  let currentRange: VerseRange = {
    surah: parsed[0].surah,
    ayah: parsed[0].ayah,
    count: 1,
  };

  for (let i = 1; i < parsed.length; i++) {
    const prev = parsed[i - 1];
    const curr = parsed[i];

    const isConsecutive =
      (curr.surah === prev.surah && curr.ayah === prev.ayah + 1) ||
      (curr.surah === prev.surah + 1 &&
        curr.ayah === 1 &&
        prev.ayah === SURAH_VERSE_COUNTS[prev.surah - 1]);

    if (isConsecutive && curr.surah === currentRange.surah) {
      currentRange.count++;
    } else {
      ranges.push(currentRange);
      currentRange = { surah: curr.surah, ayah: curr.ayah, count: 1 };
    }
  }
  ranges.push(currentRange);
  return ranges;
}

/**
 * Generate a descriptive name for a study plan
 */
function generatePlanName(goal: StudyPlanGoal, method: StudyMethod): string {
  const methodName = {
    sabaq: "Sabaq",
    "3x3": "3x3",
    ottoman: "Ottoman",
    adaptive: "Adaptive",
  }[method];

  switch (goal.type) {
    case "surah":
      return `${methodName}: Surah ${SURAH_NAMES[goal.target - 1]}`;
    case "juz":
      return `${methodName}: Juz ${goal.target}`;
    case "pages":
      return `${methodName}: ${goal.target} Pages`;
    case "custom":
      return `${methodName}: Custom Range`;
    default:
      return `${methodName} Plan`;
  }
}

/**
 * Add days to an ISO date string
 */
function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

/**
 * Get the number of days between two ISO date strings
 */
function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Generate a study plan based on the given parameters
 */
export function generateStudyPlan(
  goal: StudyPlanGoal,
  method: StudyMethod,
  dailyMinutes: number,
  startDate: string,
  deadline: string
): StudyPlan {
  const allVerses = getGoalVerses(goal);
  const totalDays = daysBetween(startDate, deadline);
  const newVersesPerDay = estimateNewVersesPerDay(dailyMinutes);

  // Reserve ~10% of days as buffer
  const activeDays = Math.max(1, Math.floor(totalDays * 0.9));
  const versesPerDay = Math.max(
    1,
    Math.min(newVersesPerDay, Math.ceil(allVerses.length / activeDays))
  );

  const schedule: DailyTarget[] = [];
  let verseIndex = 0;
  const learnedVerses: string[] = [];

  for (let day = 0; day < totalDays; day++) {
    const date = addDays(startDate, day);
    const isBufferDay = day >= activeDays && verseIndex >= allVerses.length;

    if (isBufferDay) {
      // Buffer days are pure review
      schedule.push({
        date,
        newVerses: [],
        recentReview: learnedVerses.slice(-20),
        distantReview:
          learnedVerses.length > 20
            ? learnedVerses.slice(0, -20).slice(-30)
            : [],
        estimatedMinutes: Math.min(dailyMinutes, 15),
        completed: false,
      });
      continue;
    }

    // New verses for today
    const todayNewKeys: string[] = [];
    for (let v = 0; v < versesPerDay && verseIndex < allVerses.length; v++) {
      todayNewKeys.push(allVerses[verseIndex]);
      verseIndex++;
    }

    // Sabqi: review verses learned in the last 1-7 days
    const recentReview: string[] = [];
    if (method === "sabaq" || method === "adaptive") {
      // Review last 7 days of learned material
      const recentStart = Math.max(0, learnedVerses.length - versesPerDay * 7);
      const recentEnd = Math.max(0, learnedVerses.length);
      const recentPool = learnedVerses.slice(recentStart, recentEnd);
      // Pick up to 10 verses for review
      const reviewCount = Math.min(10, recentPool.length);
      for (let r = 0; r < reviewCount; r++) {
        const idx = Math.floor((r / reviewCount) * recentPool.length);
        if (recentPool[idx] && !recentReview.includes(recentPool[idx])) {
          recentReview.push(recentPool[idx]);
        }
      }
    }

    // Manzil: review older verses (7+ days ago)
    const distantReview: string[] = [];
    if (method === "sabaq" || method === "adaptive") {
      const distantEnd = Math.max(0, learnedVerses.length - versesPerDay * 7);
      const distantPool = learnedVerses.slice(0, distantEnd);
      if (distantPool.length > 0) {
        // Review a rotating portion of older material
        const manzilCount = Math.min(10, distantPool.length);
        const offset = (day * manzilCount) % Math.max(1, distantPool.length);
        for (let m = 0; m < manzilCount; m++) {
          const idx = (offset + m) % distantPool.length;
          distantReview.push(distantPool[idx]);
        }
      }
    }

    // For 3x3 method: reviews are built into the new verse count (3 reads + 3 recite + 3 review)
    if (method === "3x3") {
      // 3x3 uses more time per verse but fewer new verses
      const adjustedNew = todayNewKeys.slice(
        0,
        Math.max(1, Math.floor(versesPerDay / 3))
      );
      todayNewKeys.length = 0;
      todayNewKeys.push(...adjustedNew);
    }

    // Estimate time
    const newTime = todayNewKeys.length * 2; // 2 min per new verse
    const recentTime = recentReview.length * 0.5; // 30 sec per review verse
    const distantTime = distantReview.length * 0.5;
    const estimatedMinutes = Math.ceil(newTime + recentTime + distantTime);

    // Add today's new verses to the learned pool
    learnedVerses.push(...todayNewKeys);

    schedule.push({
      date,
      newVerses: groupConsecutiveVerses(todayNewKeys),
      recentReview,
      distantReview,
      estimatedMinutes: Math.min(estimatedMinutes, dailyMinutes),
      completed: false,
    });
  }

  return {
    id: generatePlanId(),
    name: generatePlanName(goal, method),
    goal,
    method,
    dailyTimeMinutes: dailyMinutes,
    startDate,
    deadline,
    schedule,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Recalculate a plan based on completed days. Redistributes remaining
 * verses over remaining days when behind or ahead of schedule.
 */
export function recalculatePlan(
  plan: StudyPlan,
  completedDates: string[]
): StudyPlan {
  const completedSet = new Set(completedDates);
  const today = new Date().toISOString().split("T")[0];

  // Mark completed days
  const updatedSchedule = plan.schedule.map((target) => ({
    ...target,
    completed: completedSet.has(target.date),
  }));

  // Count verses already learned from completed days
  let versesLearned = 0;
  for (const target of updatedSchedule) {
    if (target.completed) {
      versesLearned += target.newVerses.reduce((sum, vr) => sum + vr.count, 0);
    }
  }

  // Get total verses in the plan
  const allVerses = getGoalVerses(plan.goal);
  const remainingVerses = allVerses.slice(versesLearned);
  const remainingDays = updatedSchedule.filter(
    (t) => t.date >= today && !t.completed
  );

  if (remainingDays.length === 0 || remainingVerses.length === 0) {
    return { ...plan, schedule: updatedSchedule };
  }

  // Redistribute remaining verses evenly
  const versesPerDay = Math.max(
    1,
    Math.ceil(remainingVerses.length / remainingDays.length)
  );

  let vIdx = 0;
  for (const dayTarget of remainingDays) {
    const todayNewKeys: string[] = [];
    for (let v = 0; v < versesPerDay && vIdx < remainingVerses.length; v++) {
      todayNewKeys.push(remainingVerses[vIdx]);
      vIdx++;
    }
    dayTarget.newVerses = groupConsecutiveVerses(todayNewKeys);
    const newTime = todayNewKeys.length * 2;
    dayTarget.estimatedMinutes = Math.ceil(
      newTime +
        dayTarget.recentReview.length * 0.5 +
        dayTarget.distantReview.length * 0.5
    );
  }

  return { ...plan, schedule: updatedSchedule };
}

/**
 * Get today's target from a plan
 */
export function getTodayTarget(plan: StudyPlan): DailyTarget | null {
  const today = new Date().toISOString().split("T")[0];
  return plan.schedule.find((t) => t.date === today) ?? null;
}

/**
 * Calculate plan progress as a percentage
 */
export function getPlanProgress(plan: StudyPlan): number {
  const totalVerses = getGoalVerses(plan.goal).length;
  if (totalVerses === 0) return 0;

  const completedVerses = plan.schedule
    .filter((t) => t.completed)
    .reduce(
      (sum, t) => sum + t.newVerses.reduce((s, vr) => s + vr.count, 0),
      0
    );

  return Math.min(100, Math.round((completedVerses / totalVerses) * 100));
}

/**
 * Get plan status: "on_track", "behind", "ahead", "completed"
 */
export function getPlanStatus(
  plan: StudyPlan
): "on_track" | "behind" | "ahead" | "completed" {
  const today = new Date().toISOString().split("T")[0];
  const progress = getPlanProgress(plan);

  if (progress >= 100) return "completed";

  const totalDays = daysBetween(plan.startDate, plan.deadline);
  const elapsed = daysBetween(plan.startDate, today);
  const expectedProgress = Math.round((elapsed / totalDays) * 100);

  if (progress >= expectedProgress + 10) return "ahead";
  if (progress <= expectedProgress - 10) return "behind";
  return "on_track";
}

/**
 * Get total verse count for a goal
 */
export function getGoalVerseCount(goal: StudyPlanGoal): number {
  return getGoalVerses(goal).length;
}
