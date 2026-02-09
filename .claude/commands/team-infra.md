Activate **Team Infrastructure** agent context for testing, performance, Redis integration, PWA, and database optimization.

You are now **Team Infrastructure**. Your mission is to ensure the app is reliable, fast, well-tested, and works offline.

## Shared Infrastructure (Docker Desktop)

The project runs on shared infrastructure — NOT isolated per-project containers:

- **PostgreSQL**: `localhost:5432` / database `quranmemorizer2` / user `postgres` / password `MadisTrader2026`
- **Redis**: `localhost:6379` (available but currently UNUSED — zero references in codebase)
- **Docker Desktop**: MVP deployed via `docker compose up --build -d` on port `3002`
- From containers: use `host.docker.internal` instead of `localhost`

### Redis Integration (NEW — HIGH PRIORITY)

Redis is running but has zero usage. Install `ioredis` and create a client:

```typescript
// src/lib/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
export default redis;
```

**Use cases to implement**:

1. **League leaderboards**: Redis sorted sets (`ZADD`, `ZRANGE`) for O(log N) weekly rankings
2. **Weekly XP counters**: `INCRBY` with 7-day TTL for auto-expiring weekly totals
3. **API response caching**: Cache Quran text, translations, reciter lists (TTL: 24hr)
4. **Rate limiting**: Sliding window for API endpoints (prevent abuse)
5. **Real-time presence**: Track online users in Hifz circles
6. **Pub/sub**: Live updates for group challenges, circle activity feeds
7. **Session caching**: Faster auth lookups than hitting Postgres every request

### Testing Against Real Database

Since PostgreSQL is always available on Docker Desktop:

- **Integration tests** can run against the real database (use a test-specific database like `quranmemorizer2_test`)
- No need to mock Prisma for API route tests
- Use `prisma db push` to set up test schema, `prisma db seed` for test data
- Clean up test data between test runs with transactions or truncation

## Priority 1: Test Suite (Currently Zero Tests)

The codebase has zero test files. Build a comprehensive test suite:

### Unit Tests (Critical Algorithms)

```bash
# Test files to create:
src/lib/memorization/__tests__/mistakeDetector.test.ts
src/lib/memorization/__tests__/arabic-utils.test.ts
src/lib/memorization/__tests__/srs.test.ts
src/lib/analytics/__tests__/streaks.test.ts
src/lib/analytics/__tests__/badges.test.ts
src/lib/speech/__tests__/recognition.test.ts
src/lib/audio/__tests__/player.test.ts
```

**Mistake Detector Tests** (highest priority):

- Exact match returns 100% accuracy
- Single wrong word detected correctly
- Skipped word detected
- Added word detected
- Tashkeel-only error classified as MINOR
- Word order error detected
- Multi-word errors: complex cases
- Edge cases: empty input, single word, very long verses
- Arabic normalization: alef variants, taa marbuta, hamza

**SRS Tests**:

- SM-2 interval calculations (current)
- FSRS card state transitions (after migration)
- Due card sorting
- Quality rating mapping from accuracy percentage

**Streak Tests**:

- New streak starts correctly
- Consecutive days increment
- Missed day resets streak
- Timezone handling
- Longest streak tracking
- Heatmap data generation

**Badge Tests**:

- Each badge condition evaluates correctly
- Badge not re-awarded if already earned
- Edge cases: exact threshold values

### Component Tests

```bash
src/components/memorization/__tests__/HiddenVerse.test.tsx
src/components/memorization/__tests__/MistakeHighlight.test.tsx
src/components/voice/__tests__/VoiceRecorder.test.tsx
src/components/quran/__tests__/MushafWord.test.tsx
src/components/gamification/__tests__/StreakDisplay.test.tsx
```

- HiddenVerse: renders hidden, reveals on click, reveals all
- MistakeHighlight: correct/incorrect/skipped colors, mistake list
- VoiceRecorder: mic button states, permission handling (mocked)
- MushafWord: renders Arabic text, click interaction, tajweed colors
- StreakDisplay: shows current/longest, risk warning

### E2E Tests (Playwright)

```bash
e2e/memorize.spec.ts       # Full memorization flow
e2e/quran-reader.spec.ts   # Page navigation, edition switch
e2e/search.spec.ts         # Text search, navigate to verse
e2e/auth.spec.ts           # Login, register, protected routes
e2e/settings.spec.ts       # Change settings, verify persistence
```

### Test Setup

- Jest + React Testing Library for unit/component tests
- Playwright for E2E tests
- Mock Web Speech API for voice tests
- Mock IndexedDB for offline tests
- Test utilities for creating test data (verses, sessions, etc.)

**Files to create**:

- `jest.config.ts` - Jest configuration
- `jest.setup.ts` - Global test setup
- `playwright.config.ts` - Playwright configuration
- `src/test-utils/` - Shared test utilities, mocks, fixtures

## Priority 2: Performance Optimization

**Targets**: LCP < 2.5s, FID < 100ms, CLS < 0.1, TTI < 3.5s

### Font Optimization

- Arabic fonts are large (1-3MB each). Use `font-display: swap`
- Subset fonts if possible (only Quran characters needed)
- Preload critical font in `<head>`
- Use `next/font` for optimal loading

### Bundle Size

- Audit with `next build --analyze` (add @next/bundle-analyzer)
- Dynamic import heavy libraries (Recharts, audio analysis, etc.)
- Tree-shake unused shadcn components
- Ensure mistakeDetector dynamic import works (already in use-voice-recognition.ts)

### Rendering

- React Server Components for data-fetching pages
- Suspense boundaries for progressive loading
- Virtualize long lists (114 surahs, 6236 ayahs, session history)
- Mushaf page prefetching (already implemented, verify it works)

### API Performance

- Add response caching headers to static data (surah list, reciter list)
- Database query optimization (check N+1 queries in session/goals endpoints)
- Connection pooling already configured via PrismaPg

## Priority 3: PWA Enhancement

Current: basic @ducanh2912/next-pwa setup with manifest.json.

Enhance:

- Service Worker caching strategies:
  - Static assets: Cache-first
  - Quran text: Cache-first (immutable)
  - Translations: Stale-while-revalidate
  - Audio: Cache on-demand
  - API responses: Network-first with fallback
- Bulk pre-caching: Download entire Quran text for offline
- Push notifications: streak reminders, prayer time alerts
- Background sync: queue offline mutations for later replay
- Install prompt: custom UI for "Add to Home Screen"

**Files to verify/update**:

- `next.config.js` or `next.config.ts` - PWA configuration
- `public/manifest.json` - App manifest
- `src/components/pwa/InstallPrompt.tsx` - Install prompt
- `src/components/pwa/OfflineIndicator.tsx` - Offline badge
- `src/lib/offline/sync.ts` - Background sync queue

## Priority 4: Database Optimization

### SRS Table Migration

Current SRS cards stored in `user.settings` JSON field. Needs dedicated table:

- Create `FSRSCard` model in schema.prisma
- Write migration script from JSON to table
- Update SRS API route to use new table
- Add proper indexes on (userId, verseKey), (userId, due)

### Query Optimization

- Add indexes for common queries:
  - `Session`: (userId, createdAt) for recent sessions
  - `Mistake`: (sessionId) for session detail
  - `DailyStats`: (userId, date) for streak calc
  - `Goal`: (userId, isActive) for active goals
- Review N+1 queries in API routes
- Add `select` clauses to Prisma queries (don't fetch unused fields)

### Schema Additions

- Add all new models from CLAUDE.md (XPTransaction, LeagueStanding, Achievement, etc.)
- Run `npx prisma db push` after schema changes
- Create seed script for initial data (badges, achievements, similar verse pairs)

## Priority 5: CI/CD Pipeline

- GitHub Actions workflow:
  - `npm run lint` - ESLint check
  - `npx tsc --noEmit` - Type check
  - `npm test` - Unit tests
  - `npm run build` - Build check
  - Playwright E2E tests (separate job)
- Pre-commit hooks:
  - Lint-staged for changed files
  - Type check
- Automated dependency updates (Dependabot/Renovate)

## Key Existing Files

- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Database seeding
- `docker-compose.yml` - Docker setup
- `public/manifest.json` - PWA manifest

## Guidelines

- Test the most critical paths first (mistake detection, streak calc, SRS)
- Performance measurement: use Lighthouse CI, Web Vitals
- Don't over-optimize prematurely — measure first
- Database migrations should be non-destructive (add columns, don't remove)
- PWA should work even when server is unreachable
- CI should run in under 5 minutes for quick feedback

Work on the task described in $ARGUMENTS.
