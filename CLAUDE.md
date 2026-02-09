# QuranMemorizer 2.0 - The World's Most Advanced Quran Memorization Platform

## Vision

Build the definitive Quran memorization app that combines **scientifically-backed learning science** (FSRS spaced repetition, active recall, interleaving), **AI-powered voice recognition** with real-time Tajweed coaching, **deep gamification** that makes memorization addictive (Duolingo-level engagement), and **beautiful page-accurate Mushaf rendering** — all wrapped in a social, community-driven experience. No existing app combines all of these. We will.

## V1 Legacy (github.com/madis0000/QuranMemorizer)

The V1 repo contains battle-tested algorithms to port into V2:

- **6-Layer Tajweed System**: text detection, API-based rule mapping, HTML word segmentation, real-time audio analysis (FFT), coaching panel, animated visuals
- **Arabic Utils**: 10-step normalization pipeline, Muqatta'at letter handling, multi-strategy word matching, greedy word alignment with 3-word lookahead
- **Gamification Engine**: 19 achievements across 5 categories, 4 rarity tiers, 6 mastery levels, streak multipliers, daily goals
- **SM-2 SRS**: Full implementation with Ebbinghaus forgetting curve and priority scoring
- **Thematic Contexts**: 10 curated memorization contexts (Ayat al-Kursi, Morning Protection, etc.)
- **Audio Analysis**: Web Audio API with 2048-point FFT, rule-specific weighted scoring (nasality, smoothness, intensity, duration)
- **Voice Shazam**: Real-time voice verse detection with confidence scoring and auto-navigation
- **Memory Challenge Mode**: Progressive hints preserving Tajweed colors in partial reveals

## Tech Stack

- **Framework**: Next.js 16+ with App Router (React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: Zustand 5 (persisted) + TanStack React Query 5
- **Audio Processing**: Web Audio API, MediaRecorder API, Howler.js
- **Speech Recognition**: Web Speech API (ar-SA) + Whisper API fallback (tarteel-ai/whisper-base-ar-quran)
- **Database**: PostgreSQL with Prisma 7 ORM (PrismaPg adapter)
- **Authentication**: NextAuth.js v5 (Google, Facebook, Apple, Credentials)
- **Quran Data**: AlQuran.cloud API, Quran.com API, QUL (Quranic Universal Library)
- **SRS Algorithm**: FSRS-6 (replacing SM-2, via `ts-fsrs` package)
- **PWA**: @ducanh2912/next-pwa with offline-first architecture
- **i18n**: 3 languages (English, Arabic, Urdu)

## Current Status (V2 Baseline)

| Area              | Backend | Frontend | Notes                                                 |
| ----------------- | ------- | -------- | ----------------------------------------------------- |
| Quran Reader      | 95%     | 90%      | 7 editions, page-accurate, prefetch                   |
| Memorization      | 100%    | 85%      | Voice + compare + session + save                      |
| Listen            | 100%    | 30%      | AudioPlayer class ready, UI mockup only               |
| Search            | 100%    | 20%      | API + hooks ready, hardcoded UI                       |
| Progress          | 100%    | 25%      | APIs + hooks ready, hardcoded UI                      |
| Settings          | 70%     | 70%      | Local only, no server sync                            |
| Voice Recognition | 80%     | 80%      | Web Speech works, Whisper fallback not auto-triggered |
| Mistake Detection | 100%    | 100%     | LCS + Levenshtein, 3 sensitivity levels               |
| SRS (SM-2)        | 100%    | 0%       | Full backend, zero UI                                 |
| Audio Player      | 100%    | 10%      | Singleton + hook ready, not wired to UI               |
| Offline/IndexedDB | 90%     | 85%      | 7 object stores, background sync                      |
| Gamification      | 100%    | 20%      | 15 badges defined, not auto-triggered                 |
| Auth              | 95%     | 95%      | 4 providers, protected routes                         |
| Tajweed Colors    | 0%      | 0%       | Types defined, not rendered                           |

**Critical gaps to fill**: Tajweed system (port from V1), FSRS upgrade, listen/search/progress page wiring, SRS review UI, badge auto-triggering, settings server sync, similar verse trainer, gamification depth.

## Innovative Features (What Makes Us World-Class)

### 1. FSRS-6 Spaced Repetition (Replacing SM-2)

The Free Spaced Repetition Scheduler achieves 99.6% superiority over SM-2 in A/B tests, with 20-30% fewer reviews for the same retention. Uses the Three Component Model (Stability, Retrievability, Difficulty) with 21 optimizable parameters trained on 700M+ reviews. Drop-in via `ts-fsrs` npm package.

### 2. Six-Layer Tajweed System (Ported from V1 + Enhanced)

| Layer                | Description                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------- |
| 1. Text Detection    | Character-by-character analysis: Qalqalah, Noon Sakinah, Idgham, Ikhfa, Iqlab, Lam Shamsiyah |
| 2. API Rule Mapping  | Parse `<tajweed>` HTML from Quran Foundation API, map 30+ class variants                     |
| 3. HTML Segmentation | Split Tajweed-marked HTML into words preserving all markup                                   |
| 4. Audio Analysis    | Web Audio API FFT: duration, volume, pitch, nasality, clarity, smoothness                    |
| 5. Coaching Panel    | Real-time rule display, Madd timing circle, accuracy toasts                                  |
| 6. Animated Visuals  | Per-rule components: MaddVisual, QalqalahVisual, IkhfaVisual, etc.                           |

**Tajweed Color Scheme:**
| Rule | Color | Hex |
|------|-------|-----|
| Qalqalah | Blue | `#0088ff` |
| Ikhfa | Green | `#169777` |
| Iqlab | Orange | `#ff7e1e` |
| Idgham (Ghunna) | Magenta | `#d500b7` |
| Idgham (No Ghunna) | Gray | `#aaaaaa` |
| Ghunna | Pink | `#ff69b4` |
| Madd Normal | Magenta | `#d500b7` |
| Madd Obligatory | Red | `#ff0000` |
| Lam Shamsiyah | Gray | `#aaaaaa` |

### 3. Similar Verse Trainer (NO COMPETITOR HAS THIS)

The #1 challenge for Huffaz is confusing similar verses (mutashabihat). We build:

- Automatic detection of verses with >70% word overlap
- Side-by-side comparison highlighting differences
- Targeted drills: given a verse, recite the correct continuation (not the similar one)
- "Which surah?" quick quiz
- Difficulty scaling based on mistake history
- Pre-built sets: common confusion pairs across the Quran

### 4. Garden of Jannah (Visual Growth Metaphor)

Inspired by Forest app but Quran-themed:

- Each memorized verse grows a **flower** in your garden
- Each memorized page grows a **tree**
- Each memorized surah builds a **landmark** (fountain, palace, gate)
- Each completed juz creates a **garden section**
- Abandoned sessions wilt your recent growth (loss aversion)
- Complete the Quran = Full Jannah garden with rivers, palaces, and light
- Garden is shareable and visually stunning
- "Hasanat" currency earned through practice, spent on garden decorations

### 5. Quran-Themed Leagues (Duolingo-Style Competition)

Weekly competitive leagues with promotion/demotion:
| League | Tier | Promotion | Demotion |
|--------|------|-----------|----------|
| Talib (Student) | Bronze | Top 10 advance | None |
| Qari (Reciter) | Silver | Top 10 advance | Bottom 5 demote |
| Hafiz (Memorizer) | Gold | Top 10 advance | Bottom 5 demote |
| Sheikh (Scholar) | Platinum | Top 3 advance | Bottom 5 demote |
| Imam (Leader) | Diamond | Stay | Bottom 5 demote |

- XP earned from: practice sessions, perfect accuracy, streak maintenance, league challenges
- Weekly reset with promotion/demotion animations
- League-specific challenges and rewards
- Friend leagues for competing with people you know

### 6. Smart Curriculum Generator (AI-Powered Study Plans)

- Input a goal: "Memorize Juz Amma in 3 months" or "Complete Surah Al-Baqarah by Ramadan"
- AI generates a daily study plan considering:
  - Optimal FSRS intervals
  - User's historical learning speed
  - Available daily time budget
  - Interleaving of new learning + review
  - Difficulty curve (easier surahs first)
  - Similar verse awareness (don't learn confusing verses on same day)
- Dynamic adjustment based on actual progress
- Calendar view with daily targets
- Push notification reminders at optimal study times

### 7. Memory Palace Mode (Mushaf as Spatial Memory)

The physical Mushaf IS a memory palace — every Hafiz navigates by page position:

- **Page Mastery Heatmap**: Visual grid of all 604 pages, colored by strength
- **Position Recall Drills**: "What's the first verse on page 342?"
- **Page-Level SRS**: Schedule review at page granularity, not just ayah
- **Visual Anchoring**: Highlight where on the page each verse starts (top/middle/bottom)
- **Mushaf Navigation Quiz**: Given a verse, identify which page it's on

### 8. Progressive Hide Modes (Multiple Strategies)

| Mode               | Description                                              |
| ------------------ | -------------------------------------------------------- |
| Full Hide          | All words hidden as `___`, classic memorization test     |
| First Letter       | Show only first letter of each word as hint              |
| Random Blank       | Hide 20% → 40% → 60% → 80% → 100% of words progressively |
| Translation Recall | Show translation, recite Arabic from memory              |
| Audio Recall       | Listen to audio, then recite without text                |
| Reverse Recall     | Given last word, recite the previous verse               |
| Context Recall     | Given surrounding verses, fill in the missing one        |
| Keyword Mode       | Only show key content words, hide particles/prepositions |

### 9. Challenge Mode (Competitive Practice)

- **Speed Challenge**: Recite a page/surah as fast as possible with accuracy threshold
- **Accuracy Challenge**: Perfect recitation required (Tajweed-strict mode)
- **Endurance Challenge**: How many pages can you recite without a mistake?
- **Random Verse Challenge**: Random verse appears, recite it from memory
- **Daily Challenge**: New challenge every day with bonus XP
- **Friend Challenges**: Challenge a friend to beat your score
- **Timed Quizzes**: Multiple choice (which surah?), fill-in-the-blank, audio identification

### 10. Tajweed Mastery Path (Rule-by-Rule Progression)

- Dedicated learning path for each Tajweed rule
- Progressive unlocking: Noon Sakinah → Meem Sakinah → Qalqalah → Madd → etc.
- Per-rule practice with audio analysis scoring
- Rule mastery badges (bronze/silver/gold/master)
- Real-time coaching during recitation showing active rules
- Expected vs actual pronunciation comparison
- Animated visualizations explaining each rule

### 11. Recitation Replay & Diff

- Record every practice session audio
- Replay with visual annotation: correct words green, mistakes red
- Side-by-side waveform comparison (user vs. Qari)
- Tajweed rule accuracy overlay on timeline
- Share recordings with teacher/study partner for feedback
- Historical progress: compare your recitation from week 1 vs. now

### 12. Hifz Circles (Social Accountability)

- Create/join study groups (2-50 members)
- Group streaks (all members must practice daily)
- Weekly group challenges with combined XP
- Study partner matching (similar level, timezone, goals)
- Group leaderboard within circles
- Teacher role with student progress dashboard
- Voice notes for feedback/encouragement
- Scheduled group review sessions

### 13. Traditional Methods (Digitized)

- **Mauritanian Method**: Mastery gates — must achieve 95%+ accuracy before advancing to next verse
- **3x3 Method**: Read verse 3 times → recite from memory 3 times → combine with previous verses
- **Ottoman Method**: Page-by-page with bi-weekly review cycles
- **Sabaq/Sabqi/Manzil System**: New lesson (Sabaq), recent review (Sabqi), older review (Manzil) — all tracked separately
- Configurable method selection in settings

### 14. Blessed Time Bonuses

- **Fajr Bonus (4AM-7AM)**: 2x XP during blessed morning hours
- **Last Third of Night**: 3x XP during tahajjud time
- **Friday Al-Kahf**: Special badge and bonus for reciting Al-Kahf on Friday
- **Ramadan Mode**: Enhanced goals, special Ramadan badges, Khatm tracker (complete Quran in 30 days)
- **Prayer Time Integration**: Smart notifications aligned with local prayer times
- Adjusts automatically based on user's location/timezone

### 15. Fluency Metrics Dashboard

- Words per minute (WPM) tracking over time
- Pause frequency and duration analysis
- Confidence score (hesitation detection)
- Tajweed accuracy percentage per rule type
- Session-over-session improvement graphs
- Verse-level strength radar chart
- Personalized recommendations based on weak areas

## Architecture

### Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Login, register
│   ├── (main)/                 # Authenticated routes
│   │   ├── quran/              # Mushaf reader
│   │   ├── memorize/           # Memorization mode + review
│   │   ├── listen/             # Audio player
│   │   ├── search/             # Text + voice search
│   │   ├── progress/           # Analytics dashboard
│   │   ├── tajweed/            # [NEW] Tajweed learning path
│   │   ├── garden/             # [NEW] Garden of Jannah
│   │   ├── challenges/         # [NEW] Challenge modes
│   │   ├── circles/            # [NEW] Hifz circles
│   │   ├── similar-verses/     # [NEW] Similar verse trainer
│   │   ├── curriculum/         # [NEW] Smart study plans
│   │   └── settings/           # User settings
│   └── api/
│       ├── auth/               # NextAuth
│       ├── quran/              # [NEW] Surah, ayah, search, audio
│       ├── recitation/         # Transcribe, compare, search
│       ├── tajweed/            # [NEW] Rules, progress, audio analysis
│       ├── progress/           # Sessions, streaks, goals, SRS
│       ├── gamification/       # [NEW] XP, leagues, achievements, garden
│       ├── social/             # Leaderboard, circles, challenges
│       ├── curriculum/         # [NEW] Study plans, daily targets
│       └── user/               # Settings, bookmarks, badges
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── quran/                  # Mushaf rendering components
│   ├── memorization/           # Hidden verse, mistakes, reveal, session
│   ├── tajweed/                # [NEW] Detector, coaching, visuals, practice
│   ├── voice/                  # Recorder, tracker, search
│   ├── gamification/           # Streaks, badges, leagues, garden, challenges
│   ├── social/                 # Circles, leaderboard, teacher dashboard
│   ├── curriculum/             # [NEW] Study plan, calendar, daily targets
│   └── pwa/                    # Install prompt, offline indicator
├── lib/
│   ├── quran/                  # API, layout, data
│   ├── speech/                 # Recognition, whisper, voice-search
│   ├── memorization/           # Mistake detector, arabic-utils, SRS (FSRS)
│   ├── tajweed/                # [NEW] Detector, rule-mapper, html-utils, audio-analyzer
│   ├── audio/                  # Player, recorder
│   ├── analytics/              # Streaks, badges
│   ├── gamification/           # [NEW] XP, leagues, achievements, garden, challenges
│   ├── similar-verses/         # [NEW] Detection, comparison, drills
│   ├── curriculum/             # [NEW] Plan generator, daily scheduler
│   ├── storage/                # IndexedDB
│   ├── offline/                # Background sync
│   ├── fonts/                  # Arabic font loading
│   └── i18n/                   # Internationalization
├── hooks/                      # React hooks
├── stores/                     # Zustand stores
├── types/                      # TypeScript types
└── data/                       # Static data (mushaf layouts)
```

### API Endpoints

```
/api/
├── auth/
│   ├── register/               # POST: Email/password registration
│   └── [...nextauth]/          # NextAuth handlers
├── quran/
│   ├── surah/                  # GET: Surah data with ayahs
│   ├── ayah/                   # GET: Single ayah with word data
│   ├── search/                 # GET: Text search, POST: Voice search
│   ├── audio/                  # GET: Audio URLs for reciter/surah
│   └── similar/                # [NEW] GET: Similar verses for a given ayah
├── recitation/
│   ├── transcribe/             # POST: Audio -> text via Whisper
│   ├── compare/                # POST: Compare recited vs original
│   └── search/                 # GET/POST: Text/voice verse search
├── tajweed/
│   ├── rules/                  # [NEW] GET: All tajweed rules with examples
│   ├── analyze/                # [NEW] POST: Analyze audio for tajweed accuracy
│   └── progress/               # [NEW] GET/PUT: Per-rule mastery tracking
├── progress/
│   ├── sessions/               # GET/POST: Session CRUD with pagination
│   ├── streaks/                # GET: 365-day streak history + heatmap
│   ├── goals/                  # GET/POST/PATCH: Smart goals
│   └── srs/                    # GET/POST/PATCH: FSRS cards (replacing SM-2)
├── gamification/
│   ├── xp/                     # [NEW] GET/POST: XP transactions + totals
│   ├── leagues/                # [NEW] GET/POST: League standings + promotion
│   ├── achievements/           # [NEW] GET: All achievements + user progress
│   ├── garden/                 # [NEW] GET/PUT: Garden state + decorations
│   └── challenges/             # [NEW] GET/POST: Daily + friend challenges
├── social/
│   ├── leaderboard/            # GET: Global rankings
│   ├── circles/                # [NEW] CRUD: Hifz study groups
│   ├── circles/[id]/members/   # [NEW] Manage circle membership
│   └── circles/[id]/challenges/# [NEW] Circle challenges
├── curriculum/
│   ├── plans/                  # [NEW] GET/POST: Study plan CRUD
│   ├── daily/                  # [NEW] GET: Today's study targets
│   └── adjust/                 # [NEW] POST: Recalculate plan based on progress
└── user/
    ├── settings/               # GET/PUT: User preferences (server-synced)
    ├── bookmarks/              # GET/POST/DELETE: Bookmarks
    └── badges/                 # GET: Earned badges
```

### Database Schema Additions Needed

```prisma
// New models to add to prisma/schema.prisma

model XPTransaction {
  id        String   @id @default(cuid())
  userId    String
  amount    Int
  source    XPSource // SESSION, STREAK, CHALLENGE, ACHIEVEMENT, BONUS
  metadata  Json?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model LeagueStanding {
  id         String   @id @default(cuid())
  userId     String
  league     League   // TALIB, QARI, HAFIZ, SHEIKH, IMAM
  weekStart  DateTime
  weekXP     Int      @default(0)
  rank       Int?
  promoted   Boolean  @default(false)
  demoted    Boolean  @default(false)
  user       User     @relation(fields: [userId], references: [id])
  @@unique([userId, weekStart])
}

model Achievement {
  id          String   @id @default(cuid())
  key         String   @unique
  name        String
  nameAr      String?
  description String
  icon        String
  rarity      Rarity   // COMMON, RARE, EPIC, LEGENDARY
  category    String
  condition   Json     // { type: "streak", threshold: 7 }
  xpReward    Int      @default(0)
}

model UserAchievement {
  id            String   @id @default(cuid())
  userId        String
  achievementId String
  earnedAt      DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id])
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  @@unique([userId, achievementId])
}

model GardenState {
  id          String   @id @default(cuid())
  userId      String   @unique
  flowers     Json     // { verseKey: { type, stage, plantedAt } }
  trees       Json     // { pageNumber: { type, stage, plantedAt } }
  landmarks   Json     // { surahNumber: { type, unlockedAt } }
  decorations Json     // purchased with hasanat
  hasanat     Int      @default(0)
  user        User     @relation(fields: [userId], references: [id])
}

model HifzCircle {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  isPublic    Boolean  @default(true)
  maxMembers  Int      @default(20)
  groupStreak Int      @default(0)
  createdAt   DateTime @default(now())
  owner       User     @relation("CircleOwner", fields: [ownerId], references: [id])
  members     CircleMember[]
  challenges  CircleChallenge[]
}

model CircleMember {
  id       String     @id @default(cuid())
  circleId String
  userId   String
  role     CircleRole // OWNER, TEACHER, MEMBER
  joinedAt DateTime   @default(now())
  circle   HifzCircle @relation(fields: [circleId], references: [id])
  user     User       @relation(fields: [userId], references: [id])
  @@unique([circleId, userId])
}

model StudyPlan {
  id          String   @id @default(cuid())
  userId      String
  name        String
  goal        Json     // { type: "surah", target: 2, deadline: "2026-06-01" }
  schedule    Json     // daily targets computed by curriculum engine
  method      String   // "mauritanian", "3x3", "ottoman", "sabaq"
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}

model TajweedProgress {
  id         String   @id @default(cuid())
  userId     String
  rule       String   // "qalqalah", "ikhfa", "idgham", etc.
  accuracy   Float    @default(0)
  sessions   Int      @default(0)
  mastery    Mastery  // NONE, BRONZE, SILVER, GOLD, PLATINUM, MASTER
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id])
  @@unique([userId, rule])
}

model SimilarVersePair {
  id         String @id @default(cuid())
  verse1Key  String // "2:35"
  verse2Key  String // "7:19"
  similarity Float  // 0.0-1.0
  diffWords  Json   // words that differ
  category   String // "near_identical", "similar_opening", "similar_ending"
  @@unique([verse1Key, verse2Key])
}

model Challenge {
  id          String        @id @default(cuid())
  type        ChallengeType // SPEED, ACCURACY, ENDURANCE, RANDOM, DAILY, FRIEND
  creatorId   String?
  targetId    String?       // friend challenge target
  circleId    String?       // circle challenge
  config      Json          // { surah, page, timeLimit, accuracyThreshold }
  startsAt    DateTime
  endsAt      DateTime
  createdAt   DateTime      @default(now())
}

model FSRSCard {
  id            String   @id @default(cuid())
  userId        String
  verseKey      String   // "2:255"
  stability     Float    @default(0)
  difficulty    Float    @default(0)
  elapsedDays   Int      @default(0)
  scheduledDays Int      @default(0)
  reps          Int      @default(0)
  lapses        Int      @default(0)
  state         Int      @default(0) // 0=New, 1=Learning, 2=Review, 3=Relearning
  due           DateTime @default(now())
  lastReview    DateTime?
  user          User     @relation(fields: [userId], references: [id])
  @@unique([userId, verseKey])
}

enum XPSource {
  SESSION
  STREAK
  CHALLENGE
  ACHIEVEMENT
  BONUS
  BLESSED_TIME
}

enum League {
  TALIB
  QARI
  HAFIZ
  SHEIKH
  IMAM
}

enum Rarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}

enum CircleRole {
  OWNER
  TEACHER
  MEMBER
}

enum ChallengeType {
  SPEED
  ACCURACY
  ENDURANCE
  RANDOM_VERSE
  DAILY
  FRIEND
  CIRCLE
}

enum Mastery {
  NONE
  BRONZE
  SILVER
  GOLD
  PLATINUM
  MASTER
}
```

### Zustand Stores (Existing + New)

| Store             | File                          | Persisted | Purpose                                     |
| ----------------- | ----------------------------- | --------- | ------------------------------------------- |
| quranStore        | `stores/quranStore.ts`        | Yes       | Reading state, position, edition, settings  |
| audioStore        | `stores/audioStore.ts`        | Yes       | Playback state, reciter, volume, speed      |
| sessionStore      | `stores/sessionStore.ts`      | No        | Active memorization session (ephemeral)     |
| userStore         | `stores/userStore.ts`         | Yes       | User info, preferences, streak              |
| gamificationStore | `stores/gamificationStore.ts` | Yes       | [NEW] XP, league, achievements, garden      |
| tajweedStore      | `stores/tajweedStore.ts`      | Yes       | [NEW] Active rules, coaching state, mastery |
| curriculumStore   | `stores/curriculumStore.ts`   | Yes       | [NEW] Active plan, daily targets, method    |

## External APIs & Resources

- **AlQuran.cloud API**: https://alquran.cloud/api
- **Quran.com API**: https://api.quran.com/api/v4
- **QUL (Quranic Universal Library)**: https://qul.tarteel.ai/
  - Mushaf Layouts: https://qul.tarteel.ai/mushaf_layouts (29 editions)
  - Layout Docs: https://qul.tarteel.ai/docs/mushaf-layout
- **Whisper Arabic Quran Model**: tarteel-ai/whisper-base-ar-quran (HuggingFace)
- **FSRS Algorithm**: `ts-fsrs` npm package (TypeScript implementation of FSRS-6)
- **Quran Audio Sources**:
  - everyayah.com - Multiple Qari recitations
  - verses.quran.com - Word-level audio
  - QUL segmented audio (62 reciters with timestamps)
- **Fonts**: KFGQPC Hafs, Amiri Quran, IndoPak Nastaleeq

## Infrastructure

### Shared Services (Docker Desktop)

- **PostgreSQL**: `localhost:5432` / database `quranmemorizer2` / user `postgres`
  - Used via Prisma 7 with PrismaPg adapter and connection pooling
  - From Docker containers: `host.docker.internal:5432`
  - **Available for integration tests** — no need to mock Prisma, test against real DB
- **Redis**: `localhost:6379` (available but currently UNUSED in codebase)
  - Should be used for: league leaderboards, real-time features, API response caching, rate limiting, session caching, pub/sub for live updates
  - Install: `ioredis` or `@upstash/redis` (edge-compatible)
  - From Docker containers: `host.docker.internal:6379`

### Docker Deployment

- **Dockerfile**: Multi-stage build (deps → builder → runner), Node 20 Alpine, standalone output
- **docker-compose.yml**: App on port `3002`, connects to shared Postgres + Redis via `host.docker.internal`
- **Deploy**: `docker compose up --build -d` → runs at `http://localhost:3002`

### Redis Usage Plan (NEW)

```typescript
// src/lib/redis.ts — Redis client singleton
import Redis from "ioredis";

export const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

// Use cases:
// 1. League leaderboards: sorted sets (ZADD/ZRANGE) for O(log N) rankings
// 2. Weekly XP tracking: INCRBY with TTL for auto-expiring weekly counters
// 3. API caching: cache Quran text, translations, reciter lists (TTL: 24h)
// 4. Rate limiting: sliding window for API endpoints
// 5. Real-time presence: track who's online in Hifz circles
// 6. Session caching: faster auth lookups than Postgres
// 7. Pub/sub: live updates for group challenges, circle activity feeds
```

## Environment Variables

```
# Database (Docker Desktop shared PostgreSQL)
DATABASE_URL="postgresql://postgres:MadisTrader2026@127.0.0.1:5432/quranmemorizer2"

# Redis (Docker Desktop shared Redis)
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="quran-memorizer-dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Email
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@quranmemorizer.app

# APIs
HUGGINGFACE_API_KEY=
QURAN_API_URL=https://api.alquran.cloud/v1
```

## Development Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
npm run test             # Tests

# Database
npm run db:push          # Push Prisma schema to PostgreSQL
npm run db:studio        # Open Prisma Studio GUI

# Docker (Production MVP)
docker compose up --build -d    # Build + deploy to localhost:3002
docker compose logs -f app      # View logs
docker compose down              # Stop
```

## Development Teams (Slash Commands)

Each team has a dedicated slash command that activates agent context with full knowledge of relevant files, patterns, and responsibilities.

### Team Tajweed (`/team-tajweed`)

Port V1's 6-layer Tajweed system into V2. Build the Tajweed learning path, audio analysis, real-time coaching, and mastery tracking.

### Team Memorization Engine (`/team-memorization`)

FSRS-6 upgrade, progressive hide modes, similar verse trainer, traditional methods (Mauritanian, 3x3, Sabaq), Memory Palace mode.

### Team Voice AI (`/team-voice`)

Speech recognition, Whisper auto-fallback, voice search "Shazam", recitation tracking, fluency metrics, recitation replay with diff.

### Team Audio Experience (`/team-audio`)

Audio player wiring, Qari selection, word-level sync, offline download, recording & playback, listen page completion.

### Team Gamification (`/team-gamification`)

XP economy, Quran leagues, Garden of Jannah, 50+ achievements, challenge modes, daily challenges, blessed time bonuses, streak multipliers.

### Team Social (`/team-social`)

Hifz circles, group streaks, teacher dashboard, friend challenges, leaderboards, accountability partners.

### Team Progress & Curriculum (`/team-progress`)

Smart curriculum generator, analytics dashboard, progress page wiring, fluency metrics, page mastery heatmap, search page wiring.

### Team Integration & Polish (`/team-integration`)

Wire disconnected pages (listen, search, progress), settings server sync, error boundaries, badge auto-triggering, bookmark deduplication.

### Team UX & i18n (`/team-ux`)

RTL support, i18n message integration, theme system, responsive polish, accessibility (WCAG), onboarding flow, loading skeletons.

### Team Infrastructure (`/team-infra`)

Testing (unit + E2E), CI/CD, performance optimization, PWA enhancement, offline reliability, database optimization.

## Implementation Phases

### Phase 1: Foundation Fixes (Wire Everything)

**Goal**: Connect all existing but disconnected features

1. Wire Listen page to AudioPlayer + useAudioPlayer
2. Wire Search page to useSearch + voiceSearch
3. Wire Progress page to useSessions, useStreaks, useGoals, useBadges
4. Sync settings to server via useUpdateSettings
5. Auto-trigger badge evaluation after sessions
6. Fix voice recognition Whisper auto-fallback
7. Pass surah/ayah context to useVoiceRecognition
8. Add React Error Boundaries
9. Render Tajweed colors on MushafWord component

### Phase 2: Core Differentiators

**Goal**: Build features no competitor has

1. Replace SM-2 with FSRS-6 (`ts-fsrs` package)
2. Port V1 Tajweed system (6 layers) into V2
3. Build SRS review queue UI
4. Similar Verse Trainer (detection + drills)
5. Progressive hide modes (8 strategies)
6. XP system + achievement engine
7. Real-time Tajweed coaching panel
8. Recitation replay with visual diff

### Phase 3: Engagement & Social

**Goal**: Make it addictive and social

1. Garden of Jannah visual metaphor
2. Quran-themed leagues (weekly competition)
3. Challenge modes (speed, accuracy, endurance, daily)
4. Hifz Circles (study groups)
5. Smart curriculum generator
6. Blessed time bonuses
7. Traditional method support (Mauritanian, 3x3, Sabaq)
8. Teacher dashboard

### Phase 4: Polish & Scale

**Goal**: Production-ready, world-class

1. Comprehensive test suite
2. Performance optimization (LCP < 2.5s)
3. Full i18n with RTL
4. Onboarding flow
5. Bulk Quran data pre-caching
6. Audio offline download manager
7. Push notifications (prayer times, streak reminders)
8. Mobile-responsive perfection

## Code Style Guidelines

- TypeScript strict mode, no `any` (except Prisma JSON fields)
- React Server Components where possible, `"use client"` only when needed
- Error Boundaries around every major section
- Suspense for loading states
- ARIA attributes for accessibility
- `dir="rtl"` for Arabic text containers
- CSS logical properties (start/end not left/right)
- Mobile-first responsive design
- Offline-first data access pattern (IndexedDB → API → cache)

## Performance Targets

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTI < 3.5s
- Offline support via Service Worker + IndexedDB
- Audio preloading for smooth playback
- Layout prefetching (adjacent pages)
- Image/font optimization

## Testing Strategy

- Unit tests: Mistake detection, FSRS scheduling, streak calculation, Arabic normalization, similar verse detection, XP calculation
- Component tests: React Testing Library for all interactive components
- E2E tests: Playwright for critical flows (memorize, review, search, settings)
- Voice recognition mocking for test reliability
- Target: >80% coverage on core algorithms
