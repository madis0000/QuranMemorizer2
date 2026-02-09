Activate **Team Gamification** agent context for XP economy, leagues, Garden of Jannah, achievements, and challenges.

You are now **Team Gamification**. Your mission is to build Duolingo-level engagement for Quran memorization — making practice genuinely addictive through smart game mechanics.

## Priority 1: XP Economy (Universal Currency)

Every action earns XP. XP drives leagues, unlocks content, and tracks progress.

```typescript
// XP Award Table
const XP_TABLE = {
  // Practice
  sessionComplete: 10, // Base per session
  perfectSession: 25, // 100% accuracy bonus
  perVerseRecited: 2, // Per verse practiced
  perNewVerseMemorized: 5, // First-time memorization

  // Streaks
  dailyStreakMaintained: 5, // Keep streak alive
  weeklyStreakBonus: 20, // 7-day milestone
  monthlyStreakBonus: 100, // 30-day milestone

  // Achievements
  badgeEarned: 10, // Per badge (common)
  rareBadge: 25,
  epicBadge: 50,
  legendaryBadge: 100,

  // Challenges
  dailyChallengeComplete: 15,
  friendChallengeWin: 20,
  circleChallengeContribution: 10,

  // Tajweed
  tajweedRuleMastered: 30,
  perfectTajweedSession: 20,

  // Multipliers
  blessedTimeFajr: 2.0, // 4AM-7AM
  blessedTimeLastThird: 3.0, // Last third of night
  fridayAlKahf: 2.0, // Al-Kahf on Friday
  ramadanMode: 1.5, // During Ramadan
  streakMultiplier: {
    // Streak-based
    3: 1.2,
    7: 1.5,
    14: 1.8,
    30: 2.0,
    60: 2.5,
    100: 3.0,
  },
};
```

**Files to create**:

- `src/lib/gamification/xp.ts` - XP calculation engine with multipliers
- `src/lib/gamification/blessed-time.ts` - Prayer time detection, Ramadan mode
- `src/app/api/gamification/xp/route.ts` - GET totals, POST award XP
- `src/stores/gamificationStore.ts` - XP, league, achievements, garden state

## Priority 2: Quran-Themed Leagues

Weekly competitive leagues inspired by Duolingo:

| League            | Tier     | Promotion       | Demotion          | Min Users     |
| ----------------- | -------- | --------------- | ----------------- | ------------- |
| Talib (Student)   | Bronze   | Top 10 → Qari   | None              | All new users |
| Qari (Reciter)    | Silver   | Top 10 → Hafiz  | Bottom 5 → Talib  | 20            |
| Hafiz (Memorizer) | Gold     | Top 10 → Sheikh | Bottom 5 → Qari   | 20            |
| Sheikh (Scholar)  | Platinum | Top 3 → Imam    | Bottom 5 → Hafiz  | 15            |
| Imam (Leader)     | Diamond  | Stay            | Bottom 5 → Sheikh | 10            |

- Weekly reset every Monday at midnight UTC
- League groups of 15-30 users matched by XP range
- Promotion/demotion animations (celebration confetti / gentle encouragement)
- Can create "Friend Leagues" for competing with specific people

**Files to create**:

- `src/lib/gamification/leagues.ts` - League logic, promotion/demotion
- `src/app/api/gamification/leagues/route.ts` - GET standings, POST weekly reset
- `src/components/gamification/LeagueStandings.tsx` - Weekly leaderboard UI
- `src/components/gamification/LeaguePromotion.tsx` - Promotion/demotion modal

## Priority 3: Garden of Jannah (Visual Growth Metaphor)

The most innovative engagement feature — your memorization grows a beautiful garden:

```typescript
interface GardenState {
  flowers: Record<
    string,
    {
      // verseKey -> flower
      type: "rose" | "jasmine" | "lily" | "tulip" | "orchid";
      stage: "seed" | "sprout" | "bud" | "bloom" | "golden"; // mastery level
      plantedAt: Date;
      lastWatered: Date; // last review
      health: number; // 0-100, decays without review
    }
  >;
  trees: Record<
    number,
    {
      // pageNumber -> tree
      type: "palm" | "olive" | "cedar" | "fig";
      stage: "sapling" | "young" | "mature" | "grand";
      completedAt: Date;
    }
  >;
  landmarks: Record<
    number,
    {
      // surahNumber -> landmark
      type: "fountain" | "pavilion" | "palace" | "gate" | "minaret";
      unlockedAt: Date;
    }
  >;
  decorations: string[]; // purchased with hasanat
  hasanat: number; // currency earned through practice
  gardenLevel: number; // overall garden advancement
}
```

- Visual rendering: 2D isometric garden view (CSS/SVG, no heavy 3D)
- Flowers wilt if not reviewed (loss aversion — powerful motivator)
- Golden bloom = fully mastered verse (FSRS mature + 98%+ accuracy)
- Garden is shareable via screenshot / link
- "Hasanat" shop: buy decorations (bridges, fountains, lighting effects)
- Complete Quran = "Full Jannah" achievement with spectacular visual

**Files to create**:

- `src/lib/gamification/garden.ts` - Garden state management, growth logic, decay
- `src/app/api/gamification/garden/route.ts` - GET/PUT garden state
- `src/components/gamification/GardenView.tsx` - Isometric garden renderer
- `src/components/gamification/FlowerCard.tsx` - Individual verse flower
- `src/components/gamification/GardenShop.tsx` - Hasanat shop for decorations
- `src/app/(main)/garden/page.tsx` - Garden page

## Priority 4: Achievement System (50+ Badges)

Expand from current 15 badges to 50+. Port V1's 19 achievements and add more:

### Categories & Badges

**Practice (10)**:
First Steps, 10 Sessions, 50 Sessions, 100 Sessions, 500 Sessions,
Perfect Session, 5 Perfect Sessions, Perfect Page, Perfect Surah, Marathon (30min+)

**Streaks (8)**:
3-Day, 7-Day, 14-Day, 30-Day, 60-Day, 100-Day, 200-Day, 365-Day

**Memorization (10)**:
First Verse, First Page, First Surah, First Juz, 5 Surahs, 10 Surahs, 30 Surahs,
Half Quran, Full Quran (LEGENDARY), Al-Fatihah Perfect

**Tajweed (6)**:
First Rule Learned, 3 Rules Mastered, All Basic Rules, Advanced Rules,
Perfect Tajweed Session, Tajweed Master

**Speed (4)**:
Quick Learner (<2min verse), Speed Reader (5 verses <10min),
Lightning Round (page <15min), Speed Demon (juz review <1hr)

**Special (8)**:
Early Bird (before Fajr), Night Owl (last third), Friday Scholar (Al-Kahf),
Ramadan Warrior, Similar Verse Master, Social Butterfly (join circle),
Teacher's Pet (teacher approved), Explorer (try all memorization methods)

**Secret (4)**:
Hidden achievements discovered through specific actions
(e.g., practice every day of Ramadan, recite entire Quran from memory in one session)

### Rarity Tiers

- **Common**: Standard achievements, subtle animation
- **Rare**: Sparkle effect, notification popup
- **Epic**: Full-screen celebration, confetti
- **Legendary**: Custom animation sequence, sound effect, shareable card

**Files to create**:

- `src/lib/gamification/achievements.ts` - 50+ definitions + evaluation engine
- `src/app/api/gamification/achievements/route.ts` - GET all + user progress
- `src/components/gamification/AchievementPopup.tsx` - Unlock celebration
- `src/components/gamification/AchievementGrid.tsx` - Badge showcase
- `src/components/gamification/AchievementCard.tsx` - Individual badge display

## Priority 5: Challenge Modes

- `src/lib/gamification/challenges.ts` - Challenge logic + scoring
- `src/app/api/gamification/challenges/route.ts` - CRUD challenges
- `src/components/gamification/ChallengeCard.tsx` - Challenge display
- `src/components/gamification/DailyChallenge.tsx` - Daily challenge widget
- `src/app/(main)/challenges/page.tsx` - Challenge hub

Challenge types: Speed, Accuracy, Endurance, Random Verse, Daily, Friend, Circle

## Key Existing Files

- `src/lib/analytics/badges.ts` (222 lines) - Current 15 badges + evaluator
- `src/lib/analytics/streaks.ts` (161 lines) - Streak calc + heatmap
- `src/components/gamification/StreakDisplay.tsx` - 3-column streak card
- `src/components/gamification/BadgeSystem.tsx` - Badge grid
- `src/components/gamification/Leaderboard.tsx` - Rankings table
- `src/components/gamification/ActivityHeatmap.tsx` - Contribution graph
- `src/app/api/user/badges/route.ts` - Badge API
- `src/app/api/social/leaderboard/route.ts` - Leaderboard API

## V1 Gamification to Port

From V1's `lib/memorization/gamification.ts`:

- 19 achievements with Arabic names and motivational messages
- 4 rarity tiers with distinct visual styles
- 6 mastery levels with threshold/session requirements
- Streak multiplier system (3d=1.2x through 100d=3.0x)
- Streak freeze (3 available)
- At-risk detection with motivational messages
- Daily goals with per-date tracking

## Infrastructure: Redis for Real-Time Gamification

Redis is available at `localhost:6379` (Docker Desktop shared infra) but currently unused. Use it for:

```typescript
// League leaderboards — Redis sorted sets
import redis from "@/lib/redis";

// Award XP and update league standing atomically
await redis.zincrby(`league:${weekKey}:${league}`, xpAmount, userId);

// Get top 30 in league
const standings = await redis.zrevrange(
  `league:${weekKey}:${league}`,
  0,
  29,
  "WITHSCORES"
);

// Weekly XP counter with auto-expiry
await redis.incrby(`xp:weekly:${userId}`, amount);
await redis.expire(`xp:weekly:${userId}`, 7 * 24 * 60 * 60); // 7-day TTL
```

**Install**: `npm install ioredis` + create `src/lib/redis.ts` client singleton.

## Guidelines

- XP should be awarded atomically (Redis transaction + Postgres transaction) to prevent duplication
- Blessed time detection needs user's timezone (from settings or browser)
- Garden state should be efficient (don't store 6236 flowers if most are empty)
- Achievements should auto-evaluate after every session, streak update, and milestone
- League promotion/demotion should run as a weekly cron job / API call
- **Use Redis sorted sets for leaderboards** — O(log N) updates, O(1) rank lookups
- Use canvas-confetti for celebration effects (already in V1 dependencies)
- All gamification state should sync to server (not localStorage-only)
- League standings: write to both Redis (real-time) and Postgres (persistence)

Work on the task described in $ARGUMENTS.
