Activate **Team Progress & Curriculum** agent context for analytics, smart study plans, and progress dashboard.

You are now **Team Progress & Curriculum**. Your mission is to build an insightful analytics dashboard and an intelligent study plan generator.

## Critical Gap: Progress Page Uses Hardcoded Data

`src/app/(main)/progress/page.tsx` (249 lines) displays hardcoded sample data, but ALL the APIs and hooks are built and working:

- `useSessions()` → `GET /api/progress/sessions` (paginated, full data)
- `useStreaks()` → `GET /api/progress/streaks` (365-day heatmap, current/longest)
- `useGoals()` → `GET /api/progress/goals` (active goals with progress)
- `useBadges()` → `GET /api/user/badges` (earned badges)

## Priority 1: Wire Progress Page to Real Data

Replace all hardcoded data with actual API calls:

1. **Stats Grid**: Use real data from streaks + sessions
   - Current Streak (from useStreaks)
   - Total Sessions (from useSessions)
   - Pages Memorized (from sessions aggregation)
   - Average Accuracy (from sessions aggregation)

2. **Activity Heatmap**: Use `ActivityHeatmap` component (exists!) with real streak data
   - 365-day GitHub-style heatmap
   - 5 activity levels based on session count/duration

3. **Weekly Activity Chart**: Compute from last 7 days of sessions
   - Bar chart: minutes practiced per day

4. **Goals Section**: Wire to useGoals + useCreateGoal + useUpdateGoal
   - Display active goals with progress bars
   - Create new goal form
   - Mark goals complete when reached

5. **Badges Section**: Wire to useBadges
   - Show earned badges with dates
   - Show locked badges with progress toward earning

6. **Session History**: Paginated list from useSessions
   - Each session: surah, accuracy, duration, mistakes, date
   - Click to view session details

## Priority 2: Wire Search Page to Real Data

`src/app/(main)/search/page.tsx` (142 lines) is also hardcoded.

Wire to existing infrastructure:

- Text search: `useSearch(query)` from `src/hooks/use-quran.ts`
- Voice search: `voiceSearch()` from `src/lib/speech/voice-search.ts`
- Connect "Go to verse" buttons to quranStore navigation
- Real-time search results as user types (debounced)
- Voice search with listening animation and confidence display

## Priority 3: Smart Curriculum Generator

Build an AI-powered study plan system:

```typescript
interface StudyPlan {
  name: string; // "Memorize Juz Amma"
  goal: {
    type: "surah" | "juz" | "pages" | "quran";
    target: number; // surah number, juz number, or page count
    deadline: Date;
  };
  method: "mauritanian" | "3x3" | "ottoman" | "sabaq" | "adaptive";
  dailyTimeMinutes: number; // Available time per day
  schedule: DailyTarget[]; // Computed daily plan
}

interface DailyTarget {
  date: Date;
  newVerses: { surah: number; ayah: number; count: number }[]; // Sabaq
  recentReview: string[]; // Sabqi - verse keys
  distantReview: string[]; // Manzil - verse keys
  estimatedMinutes: number;
  completed: boolean;
}
```

**Curriculum Engine Logic**:

1. Calculate total verses/pages to memorize
2. Estimate learning speed based on user's history (or defaults)
3. Distribute new learning across available days (backloaded for buffer)
4. Interleave FSRS review cards into daily schedule
5. Avoid scheduling similar/confusable verses on same day
6. Adjust dynamically when user falls behind/gets ahead
7. Factor in difficulty (longer verses = fewer per day)

**Files to create**:

- `src/lib/curriculum/plan-generator.ts` - Plan computation engine
- `src/lib/curriculum/daily-scheduler.ts` - Daily target calculator
- `src/stores/curriculumStore.ts` - Active plan state
- `src/app/(main)/curriculum/page.tsx` - Plan management page
- `src/app/(main)/curriculum/create/page.tsx` - Create plan wizard
- `src/app/api/curriculum/plans/route.ts` - CRUD plans
- `src/app/api/curriculum/daily/route.ts` - Today's targets
- `src/app/api/curriculum/adjust/route.ts` - Recalculate plan
- `src/components/curriculum/StudyPlanCard.tsx` - Plan overview
- `src/components/curriculum/DailyTargetList.tsx` - Today's tasks
- `src/components/curriculum/CalendarView.tsx` - Monthly plan calendar
- `src/components/curriculum/PlanWizard.tsx` - Step-by-step plan creation

## Priority 4: Fluency Metrics Dashboard

Visualize recitation quality over time:

- Words per minute (WPM) trend line
- Accuracy trend line (per session)
- Tajweed accuracy breakdown (per rule type radar chart)
- Verse strength radar chart (different surahs as axes)
- Weak areas identification with recommendations
- "Time to review" alerts based on FSRS

**Files to create**:

- `src/components/progress/FluencyDashboard.tsx` - Comprehensive metrics
- `src/components/progress/AccuracyTrend.tsx` - Session-over-session accuracy
- `src/components/progress/TajweedRadar.tsx` - Per-rule accuracy radar
- `src/components/progress/WeakAreas.tsx` - Personalized recommendations

## Priority 5: Page Mastery Heatmap

Visual grid of all 604 Mushaf pages colored by memorization strength:

```typescript
type PageStrength =
  | "not_started"
  | "learning"
  | "weak"
  | "moderate"
  | "strong"
  | "mastered";
// Colors: gray → red → orange → yellow → green → gold
```

- Click a page to see verse-level breakdown
- FSRS retention probability per page
- Quick actions: "Review this page", "Practice weak verses"

**Files to create**:

- `src/components/progress/PageMasteryGrid.tsx` - 604-page visual grid
- `src/components/progress/PageDetail.tsx` - Per-page verse breakdown

## Key Existing Files

- `src/app/(main)/progress/page.tsx` (249 lines) - HARDCODED, needs wiring
- `src/app/(main)/search/page.tsx` (142 lines) - HARDCODED, needs wiring
- `src/hooks/use-progress.ts` (249 lines) - 11 React Query hooks (ALL WORKING)
- `src/hooks/use-quran.ts` (446 lines) - 18 hooks including useSearch
- `src/lib/analytics/streaks.ts` (161 lines) - Streak calculations
- `src/lib/analytics/badges.ts` (222 lines) - Badge evaluation
- `src/components/gamification/ActivityHeatmap.tsx` - Contribution graph
- `src/app/api/progress/sessions/route.ts` - Session CRUD
- `src/app/api/progress/streaks/route.ts` - Streak API
- `src/app/api/progress/goals/route.ts` - Goals CRUD

## Guidelines

- Progress page should feel like a personal dashboard — motivating, not overwhelming
- Charts should use a lightweight library (Recharts is already in V1 dependencies)
- Curriculum engine should be conservative in estimates (under-promise, over-deliver)
- Daily targets should adapt when user misses days (reschedule, don't pile up)
- Page mastery grid is a key differentiator — make it visually stunning
- All data should load progressively (show skeleton, then data)
- Search should have near-instant feel (debounce 300ms, cache results)

Work on the task described in $ARGUMENTS.
