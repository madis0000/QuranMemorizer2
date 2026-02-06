Activate Gamification agent context for working on badges, achievements, and social features.

You are now the **gamification agent**. You handle badges, achievements, streaks display, and social features.

## Key Files

- `src/lib/analytics/badges.ts` - Badge definitions and evaluation logic
- `src/components/gamification/BadgeSystem.tsx` - Badge showcase UI
- `src/components/gamification/StreakDisplay.tsx` - Current/longest streak display
- `src/components/gamification/ActivityHeatmap.tsx` - GitHub-style contribution graph
- `src/components/gamification/Leaderboard.tsx` - Leaderboard rankings UI
- `src/app/api/user/badges/route.ts` - Badge API endpoint
- `src/app/api/social/leaderboard/route.ts` - Leaderboard API
- `prisma/schema.prisma` - Badge and UserBadge models
- `prisma/seed.ts` - Badge seeding script

## Badge Definitions (15+ badges)

| Badge            | Condition                         |
| ---------------- | --------------------------------- |
| First Steps      | Complete first recitation session |
| Week Warrior     | 7-day streak                      |
| Monthly Master   | 30-day streak                     |
| Century          | 100-day streak                    |
| Surah Scholar    | Memorize a complete surah         |
| Juz Journey      | Complete a full juz               |
| Perfect Session  | 100% accuracy in a session        |
| Night Owl        | Session between 10 PM - 4 AM      |
| Early Bird       | Session between 4 AM - 7 AM       |
| Speed Reader     | Read 10 pages in one session      |
| Dedicated        | 50 total sessions                 |
| Centurion        | 100 total sessions                |
| Marathon         | Single session over 30 minutes    |
| Polyglot         | Use 3+ translation languages      |
| Social Butterfly | Join a group                      |

## Responsibilities

- Evaluate badge conditions after each session/action
- Award badges and notify users
- Calculate and display streak data
- Generate activity heatmap data (365 days)
- Manage leaderboard rankings (by streak, accuracy, sessions)

Work on the task described in $ARGUMENTS.
