# Gamification System - XP Economy & Achievements

## Overview

A comprehensive XP (Experience Points) economy and achievement system with 50+ badges, level progression, league rankings, and multipliers for blessed times.

## Files Created

### Core Libraries

1. **`src/lib/gamification/xp.ts`** - XP Economy Engine
   - XP award tables for all actions
   - Streak multipliers (3-100 days: 1.2x to 3.0x)
   - Blessed time multipliers (Fajr 2.0x, Last Third 3.0x)
   - Session XP calculation with breakdown
   - Level progression system (exponential: 100 \* level^1.5)
   - XP progress tracking

2. **`src/lib/gamification/achievements.ts`** - Achievements System
   - 50+ achievements across 7 categories
   - 4 rarity tiers (common, rare, epic, legendary)
   - Achievement evaluation engine
   - Progress tracking by category and rarity

### State Management

3. **`src/stores/gamificationStore.ts`** - Zustand Store
   - Total XP and weekly XP tracking
   - Level state
   - League management (talib → qari → hafiz → sheikh → imam)
   - Achievement earning and notifications
   - Persistent storage

### API Routes

4. **`src/app/api/gamification/xp/route.ts`** - XP Management API
   - GET: Fetch user's XP, level, and progress
   - POST: Award XP with source tracking

5. **`src/app/api/gamification/achievements/route.ts`** - Achievements API
   - GET: Fetch all achievements with earned status
   - POST: Evaluate and award new achievements

### Database

6. **`prisma/schema.prisma`** - Updated Schema
   - `XPTransaction` model for XP history
   - `LeagueStanding` model for weekly rankings
   - User relations updated

## XP Award Table

```typescript
sessionComplete: 10 XP
perfectSession: 25 XP (100% accuracy bonus)
perVerseRecited: 2 XP
perNewVerseMemorized: 5 XP
dailyStreakMaintained: 5 XP
weeklyStreakBonus: 20 XP (7-day milestone)
monthlyStreakBonus: 100 XP (30-day milestone)
dailyChallengeComplete: 15 XP
tajweedRuleMastered: 30 XP
perfectTajweedSession: 20 XP

Badge Rewards:
  Common: 10 XP
  Rare: 25 XP
  Epic: 50 XP
  Legendary: 100 XP
```

## Multipliers

### Streak Multipliers

- 3 days: 1.2x
- 7 days: 1.5x
- 14 days: 1.8x
- 30 days: 2.0x
- 60 days: 2.5x
- 100 days: 3.0x

### Blessed Time Multipliers

- **Fajr Time** (4-7 AM): 2.0x
- **Last Third of Night** (2-4 AM): 3.0x

### Example Calculation

```
Base XP: 50 (10 session + 20 verses + 20 perfect tajweed)
Streak: 30 days → 2.0x multiplier
Time: Fajr (5 AM) → 2.0x multiplier
Total: 50 × 2.0 × 2.0 = 200 XP
```

## Level System

**Formula:** XP needed = 100 × level^1.5

| Level | Total XP Required | XP for This Level |
| ----- | ----------------- | ----------------- |
| 1     | 100               | 100               |
| 5     | 1,118             | 559               |
| 10    | 3,162             | 1,000             |
| 20    | 8,944             | 2,828             |
| 50    | 35,355            | 7,071             |
| 100   | 100,000           | 10,000            |

## League System

Weekly XP-based competitive leagues:

| League | Weekly XP Required | Icon      |
| ------ | ------------------ | --------- |
| Talib  | 0                  | Student   |
| Qari   | 500+               | Reader    |
| Hafiz  | 1,500+             | Memorizer |
| Sheikh | 3,000+             | Scholar   |
| Imam   | 5,000+             | Leader    |

Leagues reset every week (Sunday 00:00).

## Achievement Categories (50+ Total)

### Practice (10 achievements)

- First Steps, Sessions milestones (10/50/100/500)
- Perfect sessions, Perfect page, Perfect surah
- Marathon (30+ minutes)

### Streaks (8 achievements)

- 3, 7, 14, 30, 60, 100, 200, 365 day streaks
- Legendary "Year of Quran" (365 days)

### Memorization (10 achievements)

- First verse, page, surah, juz
- Milestones: 5 surahs, 10 surahs, Juz Amma (30 surahs)
- Half Quran (15 juz), Full Quran (Hafiz - Legendary)
- Al-Fatihah Master (10 perfect recitations)

### Tajweed (6 achievements)

- Progressive mastery: 1, 3, 10+ rules
- Advanced rules, Perfect sessions
- Tajweed Master (Legendary)

### Speed (4 achievements)

- Quick Learner (10 verses < 15 min)
- Speed Reader (10 pages/session)
- Lightning Round (50 verses < 10 min, 90%+ accuracy)
- Speed Demon (full juz in one session - Legendary)

### Special (8 achievements)

- Early Bird (Fajr sessions)
- Night Owl (Last third sessions)
- Friday Scholar (Al-Kahf on Friday)
- Ramadan Warrior (20+ sessions in Ramadan)
- Similar Verses Master
- Social Butterfly, Teacher's Pet, Explorer

### Secret (4 achievements)

Hidden until earned:

- Night Warrior (100 midnight sessions)
- Polyglot (5+ translation languages)
- Comeback Kid (return after 30+ day break)
- Perfectionist (100 perfect sessions - Legendary)

## API Usage

### Award XP After Session

```typescript
// POST /api/gamification/xp
const response = await fetch("/api/gamification/xp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    source: "session_complete",
    amount: 200, // Pre-calculated with multipliers
    sessionId: "session_123",
    multiplier: 4.0, // 2.0 streak × 2.0 fajr
  }),
});

const { totalXP, weeklyXP, level, league } = await response.json();
```

### Evaluate Achievements

```typescript
// POST /api/gamification/achievements
const activity = {
  currentStreak: 7,
  totalSessions: 50,
  lastSessionAccuracy: 100,
  lastSessionDuration: 1800, // seconds
  lastSessionHour: 5, // Fajr time
  pagesInLastSession: 2,
  completedSurahs: 5,
  completedJuz: 1,
  totalVersesMemorized: 250,
  translationsUsed: 3,
  tajweedRulesMastered: 5,
  isFriday: false,
  isRamadan: false,
};

const response = await fetch("/api/gamification/achievements", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(activity),
});

const { newAchievements, count } = await response.json();
// newAchievements: Array of newly earned achievements
```

### Get User's XP Status

```typescript
// GET /api/gamification/xp
const response = await fetch("/api/gamification/xp");
const data = await response.json();

console.log(data);
// {
//   totalXP: 5000,
//   weeklyXP: 1200,
//   level: 15,
//   currentXP: 450,
//   nextLevelXP: 581,
//   progress: 77, // 0-100
//   league: 'qari',
//   leagueRank: 23
// }
```

### Get All Achievements

```typescript
// GET /api/gamification/achievements
const response = await fetch("/api/gamification/achievements");
const { achievements, progress } = await response.json();

console.log(progress);
// {
//   total: 50,
//   earned: 12,
//   byCategory: {
//     practice: { total: 10, earned: 4 },
//     streak: { total: 8, earned: 3 },
//     ...
//   },
//   byRarity: {
//     common: { total: 15, earned: 8 },
//     rare: { total: 20, earned: 4 },
//     epic: { total: 10, earned: 0 },
//     legendary: { total: 5, earned: 0 }
//   }
// }
```

## Store Usage

```typescript
import { useGamificationStore } from '@/stores';

function Component() {
  const {
    totalXP,
    weeklyXP,
    level,
    currentLeague,
    leagueRank,
    earnedAchievements,
    recentAchievement,
    addXP,
    earnAchievement,
    dismissAchievement
  } = useGamificationStore();

  // Award XP locally (should sync with API)
  addXP(50, 'manual_award');

  // Earn achievement
  earnAchievement('streak_7');

  // Dismiss achievement popup
  dismissAchievement();

  return (
    <div>
      <p>Level {level} | {totalXP} XP</p>
      <p>League: {currentLeague} (Rank #{leagueRank})</p>
      <p>Achievements: {earnedAchievements.length}/50</p>
    </div>
  );
}
```

## Database Models

### XPTransaction

```prisma
model XPTransaction {
  id          String   @id @default(cuid())
  userId      String
  amount      Int
  source      String   // e.g., "session_complete", "streak_bonus"
  sessionId   String?  // Optional link
  multiplier  Float    @default(1.0)
  createdAt   DateTime @default(now())

  user        User     @relation(...)
}
```

### LeagueStanding

```prisma
model LeagueStanding {
  id          String   @id @default(cuid())
  userId      String
  league      String   // talib, qari, hafiz, sheikh, imam
  weekKey     String   // e.g., "2026-W06"
  weeklyXP    Int      @default(0)
  rank        Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(...)

  @@unique([userId, weekKey])
}
```

## Integration Examples

### After Session Completion

```typescript
import { evaluateAchievements } from "@/lib/gamification/achievements";
import { calculateSessionXP } from "@/lib/gamification/xp";

async function onSessionComplete(session) {
  // 1. Calculate XP
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

  // 2. Award XP via API
  await fetch("/api/gamification/xp", {
    method: "POST",
    body: JSON.stringify({
      source: "session_complete",
      amount: xpResult.totalXP,
      sessionId: session.id,
      multiplier: xpResult.streakMultiplier * xpResult.timeMultiplier,
    }),
  });

  // 3. Evaluate achievements
  const activity = {
    currentStreak: user.streakCount,
    totalSessions: user.totalSessions + 1,
    lastSessionAccuracy: session.accuracy,
    lastSessionDuration: session.duration,
    lastSessionHour: new Date().getHours(),
    // ... other fields
  };

  const newAchievements = await fetch("/api/gamification/achievements", {
    method: "POST",
    body: JSON.stringify(activity),
  });

  // 4. Show XP breakdown and new achievements
  showXPBreakdown(xpResult.breakdown);
  showNewAchievements(newAchievements);
}
```

## Next Steps

### Database Migration

```bash
# Push schema to database
npx prisma db push

# Or create migration
npx prisma migrate dev --name add_xp_and_leagues
```

### UI Components Needed

1. XP Progress Bar (with level display)
2. Achievement Unlock Popup
3. Achievement Grid/List
4. League Leaderboard
5. XP Breakdown Display
6. Streak Multiplier Indicator
7. Blessed Time Banner

### Future Enhancements

- Daily/Weekly challenges for bonus XP
- Achievement categories filtering
- Achievement sharing
- League promotion/demotion animations
- XP history graph
- Achievement rarity statistics
- Social competition features

## Testing

All TypeScript checks pass:

- `npx tsc --noEmit` ✓
- `npm run build` ✓
- 28 routes compiled successfully
- 2 new API routes added

## Build Status

✅ TypeScript compilation: 0 errors
✅ Next.js build: Success
✅ Prisma schema: Valid
✅ Prisma client: Generated
✅ All new files created
✅ Store exports updated

Total new routes: 2 (XP API + Achievements API)
Total achievements: 50+
Total XP sources: 10+
Total multipliers: 8 (streak) + 2 (blessed time)
