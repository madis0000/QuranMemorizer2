# Gamification System

This directory contains the core gamification logic for the QuranMemorizer app.

## Files

### `xp.ts` - XP Economy Engine

Handles all XP calculations, level progression, and multipliers.

**Key Functions:**

```typescript
// Calculate XP for a completed session
calculateSessionXP(params: SessionXPParams): SessionXPResult

// Get streak multiplier (1.2x to 3.0x)
getStreakMultiplier(streakDays: number): number

// Check for blessed time bonuses
getBlessedTimeMultiplier(hour: number): { multiplier: number; name: string }

// Level system
getXPForLevel(level: number): number // XP needed for level
getLevelFromXP(totalXP: number): number // Current level
getXPProgress(totalXP: number): { level, currentXP, nextLevelXP, progress }

// Badge rewards
getXPForBadge(rarity: 'common' | 'rare' | 'epic' | 'legendary'): number

// Streak rewards
getXPForStreak(streakDays: number): number
```

**XP Constants:**

```typescript
XP_TABLE = {
  sessionComplete: 10,
  perfectSession: 25,
  perVerseRecited: 2,
  perNewVerseMemorized: 5,
  dailyStreakMaintained: 5,
  weeklyStreakBonus: 20,
  monthlyStreakBonus: 100,
  dailyChallengeComplete: 15,
  tajweedRuleMastered: 30,
  perfectTajweedSession: 20,
  badgeEarned: { common: 10, rare: 25, epic: 50, legendary: 100 },
};

STREAK_MULTIPLIERS = {
  3: 1.2, // 20% bonus
  7: 1.5, // 50% bonus
  14: 1.8, // 80% bonus
  30: 2.0, // 100% bonus
  60: 2.5, // 150% bonus
  100: 3.0, // 200% bonus
};

BLESSED_TIMES = {
  fajr: { startHour: 4, endHour: 7, multiplier: 2.0 },
  lastThird: { startHour: 2, endHour: 4, multiplier: 3.0 },
};
```

**Example Usage:**

```typescript
import { calculateSessionXP } from "@/lib/gamification/xp";

const result = calculateSessionXP({
  versesRecited: 10,
  accuracy: 95,
  duration: 600, // 10 minutes
  isNewMemorization: true,
  currentStreak: 7,
  sessionHour: 5, // Fajr time
  tajweedPerfect: true,
  newVersesCount: 5,
});

console.log(result);
// {
//   baseXP: 85, // 10 + 20 + 25 + 20 + 10
//   streakMultiplier: 1.5,
//   timeMultiplier: 2.0,
//   totalXP: 255, // 85 × 1.5 × 2.0
//   breakdown: [
//     { source: "Session Complete", amount: 10 },
//     { source: "Verses Recited (10)", amount: 20 },
//     { source: "New Verses Memorized (5)", amount: 25 },
//     { source: "Perfect Tajweed", amount: 20 },
//     { source: "Streak Multiplier (7 days)", amount: 42 },
//     { source: "Fajr Time Bonus", amount: 128 }
//   ]
// }
```

---

### `achievements.ts` - Achievement System

Manages 50+ achievements across 7 categories with 4 rarity tiers.

**Key Types:**

```typescript
type AchievementCategory =
  | "practice"
  | "streak"
  | "memorization"
  | "tajweed"
  | "speed"
  | "special"
  | "secret";

type AchievementRarity = "common" | "rare" | "epic" | "legendary";

interface Achievement {
  code: string;
  name: string;
  arabicName?: string;
  description: string;
  icon: string; // lucide icon
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  requirement: AchievementRequirement;
  secret?: boolean;
}
```

**Key Functions:**

```typescript
// Evaluate which achievements are newly earned
evaluateAchievements(
  activity: AchievementActivity,
  alreadyEarned: string[]
): string[] // Returns new achievement codes

// Get achievement by code
getAchievementByCode(code: string): Achievement | undefined

// Filter achievements
getAchievementsByCategory(category: AchievementCategory): Achievement[]
getAchievementsByRarity(rarity: AchievementRarity): Achievement[]
getVisibleAchievements(): Achievement[] // Excludes secret achievements

// Get progress stats
getAchievementProgress(earnedCodes: string[]): {
  total: number;
  earned: number;
  byCategory: Record<AchievementCategory, { total, earned }>;
  byRarity: Record<AchievementRarity, { total, earned }>;
}
```

**Activity Tracking:**

```typescript
interface AchievementActivity {
  // Core stats
  currentStreak: number;
  totalSessions: number;

  // Session details
  lastSessionAccuracy?: number;
  lastSessionDuration?: number;
  lastSessionHour?: number;
  lastSessionSurahNumber?: number;
  pagesInLastSession?: number;
  versesInLastSession?: number;
  lastSessionMinutes?: number;

  // Memorization progress
  completedSurahs?: number;
  completedJuz?: number;
  totalVersesMemorized?: number;
  pagesMemorized?: number;

  // Special features
  translationsUsed?: number;
  tajweedRulesMastered?: number;
  tajweedPerfectSessions?: number;
  hideModesUsed?: number;

  // Time-based
  isFriday?: boolean;
  isRamadan?: boolean;
  midnightSessions?: number;
  ramadanSessionCount?: number;

  // Performance
  perfectSessionCount?: number;
  surahPerfectCounts?: Record<number, number>;

  // Speed achievements
  speedMemorizations?: Array<{ verses: number; minutes: number }>;
  speedRecitations?: Array<{
    verses: number;
    minutes: number;
    accuracy: number;
  }>;
  juzInSession?: boolean;

  // Social
  groupChallengesCompleted?: number;
  usersHelped?: number;

  // Comeback
  daysInactive?: number;
  sessionsAfterBreak?: number;

  // Similar verses
  similarVersesCorrect?: number;
}
```

**Example Usage:**

```typescript
import {
  evaluateAchievements,
  getAchievementProgress,
} from "@/lib/gamification/achievements";

// After a session
const activity = {
  currentStreak: 7,
  totalSessions: 50,
  lastSessionAccuracy: 100,
  lastSessionDuration: 1800,
  lastSessionHour: 5,
  pagesInLastSession: 2,
  completedSurahs: 5,
  completedJuz: 1,
  totalVersesMemorized: 250,
  tajweedRulesMastered: 5,
  perfectSessionCount: 10,
};

const alreadyEarned = ["first_steps", "sessions_10", "streak_3"];
const newAchievements = evaluateAchievements(activity, alreadyEarned);

console.log(newAchievements);
// ['sessions_50', 'streak_7', 'perfect_session']

// Get overall progress
const progress = getAchievementProgress(alreadyEarned);
console.log(progress);
// {
//   total: 50,
//   earned: 3,
//   byCategory: {
//     practice: { total: 10, earned: 2 },
//     streak: { total: 8, earned: 1 },
//     ...
//   },
//   byRarity: {
//     common: { total: 15, earned: 3 },
//     rare: { total: 20, earned: 0 },
//     ...
//   }
// }
```

---

## Achievement Categories

### Practice (10)

✓ First Steps → Sessions 10 → Sessions 50 → Sessions 100 → Sessions 500
✓ Perfect Session → Perfect 5 → Perfect Page → Perfect Surah
✓ Marathon 30min

### Streaks (8)

✓ 3 days → 7 days → 14 days → 30 days → 60 days → 100 days → 200 days → 365 days

### Memorization (10)

✓ First Verse → First Page → First Surah → First Juz
✓ 5 Surahs → 10 Surahs → 30 Surahs (Juz Amma)
✓ Half Quran → Full Quran (Hafiz - Legendary)
✓ Al-Fatihah Master

### Tajweed (6)

✓ First Rule → 3 Rules → 10 Rules (Basic Complete)
✓ Advanced Rules → Perfect Tajweed Session → Tajweed Master

### Speed (4)

✓ Quick Learner → Speed Reader → Lightning Round → Speed Demon

### Special (8)

✓ Early Bird, Night Owl, Friday Scholar, Ramadan Warrior
✓ Similar Verses Master, Social Butterfly, Teacher's Pet, Explorer

### Secret (4)

🔒 Hidden until earned:

- Night Warrior, Polyglot, Comeback Kid, Perfectionist

---

## Integration Flow

### 1. Session Completion

```typescript
// In your session completion handler
import { useGamificationStore } from "@/stores";

import { calculateSessionXP } from "@/lib/gamification/xp";

async function handleSessionComplete(session) {
  const user = await getCurrentUser();

  // Calculate XP
  const xpResult = calculateSessionXP({
    versesRecited: session.versesRecited,
    accuracy: session.accuracy,
    duration: session.duration,
    isNewMemorization: session.mode === "MEMORIZE",
    currentStreak: user.streakCount,
    sessionHour: new Date().getHours(),
    tajweedPerfect: session.tajweedScore === 100,
    newVersesCount: session.newVersesCount,
  });

  // Award XP via API
  const xpResponse = await fetch("/api/gamification/xp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "session_complete",
      amount: xpResult.totalXP,
      sessionId: session.id,
      multiplier: xpResult.streakMultiplier * xpResult.timeMultiplier,
    }),
  });

  const { totalXP, level, weeklyXP, league } = await xpResponse.json();

  // Update store
  const gamificationStore = useGamificationStore.getState();
  gamificationStore.setTotalXP(totalXP);
  gamificationStore.setLevel(level);
  gamificationStore.setWeeklyXP(weeklyXP);
  gamificationStore.setLeague(league);

  // Show XP breakdown
  showXPSummary(xpResult);
}
```

### 2. Achievement Evaluation

```typescript
// After session stats are updated
import { evaluateAchievements } from "@/lib/gamification/achievements";

async function checkAchievements(user, session) {
  const activity = {
    currentStreak: user.streakCount,
    totalSessions: user.totalSessions,
    lastSessionAccuracy: session.accuracy,
    lastSessionDuration: session.duration,
    lastSessionHour: new Date().getHours(),
    lastSessionSurahNumber: session.surahNumber,
    pagesInLastSession: session.pages?.length ?? 0,
    completedSurahs: user.completedSurahs,
    completedJuz: user.completedJuz,
    totalVersesMemorized: user.versesMemorized,
    translationsUsed: user.translationsUsed?.length ?? 0,
    tajweedRulesMastered: user.tajweedRulesMastered,
    perfectSessionCount: user.perfectSessions,
    isFriday: new Date().getDay() === 5,
    isRamadan: checkIfRamadan(new Date()),
  };

  const response = await fetch("/api/gamification/achievements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  });

  const { newAchievements } = await response.json();

  if (newAchievements.length > 0) {
    // Update store
    const gamificationStore = useGamificationStore.getState();
    newAchievements.forEach((achievement) => {
      gamificationStore.earnAchievement(achievement.code);
    });

    // Show achievement popups
    showAchievementPopups(newAchievements);
  }
}
```

### 3. UI Display

```typescript
import { useGamificationStore } from '@/stores';
import { getXPProgress } from '@/lib/gamification/xp';

function XPDisplay() {
  const { totalXP, level, weeklyXP, currentLeague } = useGamificationStore();
  const progress = getXPProgress(totalXP);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Level {level}</span>
        <span className="text-muted-foreground">{totalXP.toLocaleString()} XP</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {progress.currentXP} / {progress.nextLevelXP} XP to Level {level + 1}
      </p>

      <div className="mt-4">
        <p className="font-semibold">League: {currentLeague}</p>
        <p className="text-sm">Weekly XP: {weeklyXP}</p>
      </div>
    </div>
  );
}
```

---

## API Endpoints

### GET `/api/gamification/xp`

Returns user's XP status.

**Response:**

```json
{
  "totalXP": 5000,
  "weeklyXP": 1200,
  "level": 15,
  "currentXP": 450,
  "nextLevelXP": 581,
  "progress": 77,
  "league": "qari",
  "leagueRank": 23
}
```

### POST `/api/gamification/xp`

Award XP to user.

**Request:**

```json
{
  "source": "session_complete",
  "amount": 200,
  "sessionId": "session_123",
  "multiplier": 4.0
}
```

**Response:**

```json
{
  "success": true,
  "transaction": {
    "id": "tx_123",
    "amount": 200,
    "source": "session_complete",
    "multiplier": 4.0
  },
  "totalXP": 5200,
  "weeklyXP": 1400,
  "level": 15,
  "league": "qari"
}
```

### GET `/api/gamification/achievements`

Get all achievements with earned status.

**Response:**

```json
{
  "achievements": [
    {
      "code": "first_steps",
      "name": "First Steps",
      "description": "Complete your first session",
      "icon": "footprints",
      "category": "practice",
      "rarity": "common",
      "xpReward": 10,
      "earned": true,
      "earnedAt": "2026-01-15T10:30:00Z"
    },
    ...
  ],
  "progress": {
    "total": 50,
    "earned": 12,
    "byCategory": {...},
    "byRarity": {...}
  }
}
```

### POST `/api/gamification/achievements`

Evaluate and award achievements.

**Request:**

```json
{
  "currentStreak": 7,
  "totalSessions": 50,
  "lastSessionAccuracy": 100,
  "completedSurahs": 5,
  ...
}
```

**Response:**

```json
{
  "newAchievements": [
    {
      "code": "sessions_50",
      "name": "Dedicated Learner",
      "rarity": "rare",
      "xpAwarded": 25,
      "earnedAt": "2026-02-09T14:20:00Z"
    }
  ],
  "count": 1,
  "message": "Earned 1 new achievement(s)!"
}
```

---

## Database Migrations

After creating/modifying the schema:

```bash
# Development (push to local DB)
npx prisma db push

# Production (create migration)
npx prisma migrate dev --name add_xp_and_leagues

# Generate Prisma client
npx prisma generate
```

---

## Testing Checklist

- [ ] XP calculation with base values
- [ ] Streak multipliers (3, 7, 14, 30, 60, 100 days)
- [ ] Blessed time multipliers (Fajr, Last Third)
- [ ] Combined multipliers (streak × time)
- [ ] Level progression calculations
- [ ] Achievement evaluation for each category
- [ ] Secret achievements remain hidden
- [ ] XP API endpoints
- [ ] Achievement API endpoints
- [ ] Store updates
- [ ] Database transactions
- [ ] League promotions/demotions
- [ ] Weekly XP reset logic
