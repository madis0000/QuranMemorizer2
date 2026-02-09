Activate **Team Social** agent context for Hifz circles, group features, teacher dashboard, and social accountability.

You are now **Team Social**. Your mission is to build social features that make Quran memorization a community experience with accountability and encouragement.

## Priority 1: Hifz Circles (Study Groups)

Create/join study groups for collaborative memorization:

```typescript
interface HifzCircle {
  id: string;
  name: string;
  description?: string;
  owner: User;
  members: CircleMember[]; // 2-50 members
  isPublic: boolean;
  maxMembers: number;
  groupStreak: number; // all members must practice daily
  weeklyChallenge?: Challenge;
  createdAt: Date;
}

interface CircleMember {
  user: User;
  role: "OWNER" | "TEACHER" | "MEMBER";
  joinedAt: Date;
  weeklyXP: number;
  lastActiveAt: Date;
}
```

**Features**:

- Create circle with name, description, public/private
- Invite via link or username
- Group streak: maintained only when ALL members practice daily
- Weekly group challenges (e.g., "collectively recite Juz 30 this week")
- Circle leaderboard (member rankings by XP)
- Activity feed: "Ahmed memorized 3 new verses today"
- Circle-specific achievements

**Files to create**:

- `src/app/(main)/circles/page.tsx` - Circle discovery + my circles
- `src/app/(main)/circles/[id]/page.tsx` - Circle detail page
- `src/app/(main)/circles/create/page.tsx` - Create circle form
- `src/app/api/social/circles/route.ts` - CRUD circles
- `src/app/api/social/circles/[id]/members/route.ts` - Manage members
- `src/app/api/social/circles/[id]/challenges/route.ts` - Circle challenges
- `src/components/social/CircleCard.tsx` - Circle preview card
- `src/components/social/CircleMemberList.tsx` - Member list with status
- `src/components/social/CircleActivityFeed.tsx` - Recent activity
- `src/components/social/CircleChallenge.tsx` - Weekly challenge widget

## Priority 2: Teacher Dashboard

For Quran teachers/scholars to track student progress:

- Add students to teacher's circle with TEACHER role
- View each student's:
  - Current memorization progress (pages, surahs, juz)
  - Recent session accuracy
  - Streak status
  - Tajweed mastery levels
  - Weak areas and common mistakes
  - FSRS review calendar
- Send feedback/notes on specific verses
- Approve student advancement (for Mauritanian method mastery gates)
- Set assignments (e.g., "Memorize 2:255-260 by Friday")
- Grade recitation recordings

**Files to create**:

- `src/app/(main)/circles/[id]/teacher/page.tsx` - Teacher dashboard
- `src/components/social/TeacherStudentCard.tsx` - Student progress summary
- `src/components/social/TeacherAssignment.tsx` - Create/manage assignments
- `src/components/social/TeacherFeedback.tsx` - Per-verse feedback

## Priority 3: Enhanced Leaderboard

Current: `src/app/api/social/leaderboard/route.ts` returns streak + session leaders. Accuracy leaders returns empty.

**Enhance with**:

- Global leaderboard: by XP (all time), by XP (this week), by streak
- League leaderboard: within your current league group
- Circle leaderboard: within your study groups
- Friends leaderboard: among your connections
- Filters: by country, by age group, by memorization goal
- User profiles: show garden preview, badge showcase, streak
- "Add friend" functionality

**Files to update**:

- `src/app/api/social/leaderboard/route.ts` - Add filters + friend boards
- `src/components/gamification/Leaderboard.tsx` - Enhanced with tabs and filters

## Priority 4: Friend Challenges

Challenge friends to compete:

- Send challenge: "Beat my score on Surah Al-Mulk"
- Challenge types: speed, accuracy, endurance, specific surah/page
- Notification when challenged
- Results comparison after both complete
- XP bonus for winner

## Priority 5: Accountability Partners

- Match users by: similar level, timezone, language, goals
- Daily check-in: "Did you practice today?"
- Gentle reminders if partner hasn't practiced
- Celebrate each other's milestones

## Key Existing Files

- `src/app/api/social/leaderboard/route.ts` (98 lines) - Partial leaderboard
- `src/components/gamification/Leaderboard.tsx` - Rankings table
- `prisma/schema.prisma` - Needs HifzCircle, CircleMember models

## Infrastructure: Redis for Real-Time Social

Redis is available at `localhost:6379` (Docker Desktop shared infra) but currently unused. Use it for:

```typescript
import redis from '@/lib/redis';

// Circle online presence
await redis.sadd(`circle:${circleId}:online`, userId);
await redis.expire(`circle:${circleId}:online`, 300); // 5-min TTL, refresh on activity

// Circle activity feed (recent events list)
await redis.lpush(`circle:${circleId}:feed`, JSON.stringify({ userId, event: 'session_complete', ... }));
await redis.ltrim(`circle:${circleId}:feed`, 0, 49); // Keep last 50 events

// Circle leaderboard
await redis.zincrby(`circle:${circleId}:weekly`, xpAmount, userId);
```

## Guidelines

- All social features require authentication
- Privacy: users should control what's visible (settings)
- Group streak is a powerful motivator — make it prominent
- Teacher features should be clearly separated (role-based access)
- **Use Redis pub/sub for live circle activity feeds** and online presence
- **Use Redis sorted sets for circle leaderboards**
- Use React Query for real-time-feeling updates (polling / refetch intervals)
- Keep social features optional — some users prefer solo study
- Respect: no shaming for missed days, only encouragement

Work on the task described in $ARGUMENTS.
