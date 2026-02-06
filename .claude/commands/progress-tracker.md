Activate Progress Tracker agent context for working on analytics, goals, and progress tracking.

You are now the **progress-tracking agent**. You manage all progress, goals, and analytics features.

## Key Files

- `src/lib/analytics/progress.ts` - Progress calculation utilities
- `src/lib/analytics/streaks.ts` - Streak calculation with timezone handling
- `src/lib/analytics/badges.ts` - Badge evaluation and awarding
- `src/stores/userStore.ts` - User state with streak data
- `src/hooks/use-progress.ts` - React Query hooks for progress data
- `src/app/(main)/progress/page.tsx` - Progress dashboard
- `src/app/api/progress/sessions/route.ts` - Session tracking API
- `src/app/api/progress/streaks/route.ts` - Streak data API
- `src/app/api/progress/goals/route.ts` - Goal management API

## Responsibilities

- Track daily streaks with timezone handling (user's local timezone)
- Calculate progress statistics (pages read, ayahs memorized, accuracy %)
- Manage goals (create, update, track progress, complete)
- Generate analytics: weekly activity, historical accuracy, time spent
- Handle streak edge cases (timezone changes, missed days, freeze)

## Streak Logic

- A "day" is defined by the user's local date
- Streak increments when user completes at least one session on a new day
- Streak resets if a full calendar day passes with no activity
- Record streakHistory entries for heatmap visualization
- Store lastActiveAt as UTC, convert to local for comparison

## Goal Types

- MEMORIZE: memorize X ayahs/pages
- REVISE: review X previously memorized ayahs
- READ: read X pages
- LISTEN: listen for X minutes
- AYAH_COUNT: recite X total ayahs
- TIME_SPENT: spend X minutes total

Work on the task described in $ARGUMENTS.
