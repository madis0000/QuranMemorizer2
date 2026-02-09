"use client";

import { Award, Star, Target, Trophy } from "lucide-react";

import { AchievementGrid } from "@/components/gamification/AchievementGrid";
import { XPProgress } from "@/components/gamification/XPProgress";
import { Card } from "@/components/ui/card";

// Mock achievements data - will be replaced with API data later
const MOCK_ACHIEVEMENTS = [
  // Recitation Achievements
  {
    code: "first_recitation",
    name: "First Steps",
    description: "Complete your first recitation session",
    icon: "mic",
    category: "recitation",
    rarity: "common" as const,
    earned: true,
    earnedAt: "2025-01-15T10:30:00Z",
  },
  {
    code: "recite_10_ayahs",
    name: "Devoted Reciter",
    description: "Recite 10 ayahs in a single session",
    icon: "mic",
    category: "recitation",
    rarity: "common" as const,
    earned: true,
    earnedAt: "2025-01-16T14:20:00Z",
  },
  {
    code: "recite_100_ayahs",
    name: "Persistent Reciter",
    description: "Recite 100 ayahs total",
    icon: "mic",
    category: "recitation",
    rarity: "rare" as const,
    earned: true,
    earnedAt: "2025-01-20T09:15:00Z",
  },
  {
    code: "perfect_recitation",
    name: "Flawless Recitation",
    description: "Complete a session with 100% accuracy",
    icon: "star",
    category: "recitation",
    rarity: "epic" as const,
    earned: false,
  },
  {
    code: "recite_full_surah",
    name: "Surah Master",
    description: "Recite an entire surah without mistakes",
    icon: "award",
    category: "recitation",
    rarity: "epic" as const,
    earned: false,
  },

  // Memorization Achievements
  {
    code: "first_memorization",
    name: "Memory Awakened",
    description: "Memorize your first ayah",
    icon: "brain",
    category: "memorization",
    rarity: "common" as const,
    earned: true,
    earnedAt: "2025-01-17T11:00:00Z",
  },
  {
    code: "memorize_surah",
    name: "Surah Keeper",
    description: "Memorize a complete surah",
    icon: "brain",
    category: "memorization",
    rarity: "rare" as const,
    earned: false,
  },
  {
    code: "memorize_juz",
    name: "Juz Guardian",
    description: "Memorize an entire juz",
    icon: "brain",
    category: "memorization",
    rarity: "epic" as const,
    earned: false,
  },
  {
    code: "hafiz",
    name: "Hafiz ul-Quran",
    description: "Memorize the entire Quran",
    icon: "crown",
    category: "memorization",
    rarity: "legendary" as const,
    earned: false,
    secret: true,
  },

  // Streak Achievements
  {
    code: "streak_3",
    name: "Consistent Learner",
    description: "Maintain a 3-day streak",
    icon: "flame",
    category: "streaks",
    rarity: "common" as const,
    earned: true,
    earnedAt: "2025-01-18T08:00:00Z",
  },
  {
    code: "streak_7",
    name: "Weekly Warrior",
    description: "Maintain a 7-day streak",
    icon: "flame",
    category: "streaks",
    rarity: "rare" as const,
    earned: true,
    earnedAt: "2025-01-22T08:00:00Z",
  },
  {
    code: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "flame",
    category: "streaks",
    rarity: "epic" as const,
    earned: false,
  },
  {
    code: "streak_100",
    name: "Centennial Scholar",
    description: "Maintain a 100-day streak",
    icon: "flame",
    category: "streaks",
    rarity: "legendary" as const,
    earned: false,
  },
  {
    code: "streak_365",
    name: "Eternal Dedication",
    description: "Maintain a 365-day streak",
    icon: "infinity",
    category: "streaks",
    rarity: "legendary" as const,
    earned: false,
    secret: true,
  },

  // Special Achievements
  {
    code: "early_bird",
    name: "Early Bird",
    description: "Complete a session before 6 AM",
    icon: "sunrise",
    category: "special",
    rarity: "rare" as const,
    earned: true,
    earnedAt: "2025-01-19T05:45:00Z",
  },
  {
    code: "night_owl",
    name: "Night Owl",
    description: "Complete a session after 11 PM",
    icon: "moon",
    category: "special",
    rarity: "rare" as const,
    earned: false,
  },
  {
    code: "ramadan_warrior",
    name: "Ramadan Warrior",
    description: "Complete sessions every day in Ramadan",
    icon: "star-crescent",
    category: "special",
    rarity: "epic" as const,
    earned: false,
    secret: true,
  },
  {
    code: "laylat_al_qadr",
    name: "Laylat al-Qadr",
    description: "Complete a special session on Laylat al-Qadr",
    icon: "sparkles",
    category: "special",
    rarity: "legendary" as const,
    earned: false,
    secret: true,
  },
  {
    code: "share_knowledge",
    name: "Knowledge Sharer",
    description: "Invite 5 friends to the app",
    icon: "users",
    category: "special",
    rarity: "rare" as const,
    earned: false,
  },
  {
    code: "community_leader",
    name: "Community Leader",
    description: "Reach the top 10 on the global leaderboard",
    icon: "trophy",
    category: "special",
    rarity: "epic" as const,
    earned: false,
  },
];

export default function AchievementsPage() {
  // Mock user data - will be replaced with real data from API
  const mockUserData = {
    totalXP: 3450,
    level: 12,
    currentLevelXP: 450,
    nextLevelXP: 1000,
  };

  const earnedCount = MOCK_ACHIEVEMENTS.filter((a) => a.earned).length;
  const totalCount = MOCK_ACHIEVEMENTS.length;
  const totalXPFromAchievements = earnedCount * 50; // Assuming 50 XP per achievement

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-[#059669] to-[#047857] dark:from-[#00E5A0]/20 dark:to-[#00E5A0]/10 p-3 rounded-lg">
            <Trophy className="w-8 h-8 text-white dark:text-[#00E5A0]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#1A2E22] dark:text-[#E8F0EC]">
              Achievements
            </h1>
            <p className="text-[#5A7B6B] dark:text-[#6B8B7B]">
              Track your Quran learning milestones
            </p>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <Card className="p-6 mb-8">
        <XPProgress
          totalXP={mockUserData.totalXP}
          level={mockUserData.level}
          currentLevelXP={mockUserData.currentLevelXP}
          nextLevelXP={mockUserData.nextLevelXP}
        />
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Achievements */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#059669]/10 dark:bg-[#00E5A0]/10 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-[#059669] dark:text-[#00E5A0]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A2E22] dark:text-[#E8F0EC]">
                {earnedCount} / {totalCount}
              </div>
              <div className="text-sm text-[#5A7B6B] dark:text-[#6B8B7B]">
                Achievements Unlocked
              </div>
            </div>
          </div>
        </Card>

        {/* Total XP */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFD700]/10 dark:bg-[#FFD700]/10 p-3 rounded-lg">
              <Star className="w-6 h-6 text-[#FFD700] dark:text-[#FFD700]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A2E22] dark:text-[#E8F0EC]">
                {totalXPFromAchievements.toLocaleString()}
              </div>
              <div className="text-sm text-[#5A7B6B] dark:text-[#6B8B7B]">
                XP from Achievements
              </div>
            </div>
          </div>
        </Card>

        {/* Completion Rate */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#059669]/10 dark:bg-[#00E5A0]/10 p-3 rounded-lg">
              <Target className="w-6 h-6 text-[#059669] dark:text-[#00E5A0]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A2E22] dark:text-[#E8F0EC]">
                {Math.round((earnedCount / totalCount) * 100)}%
              </div>
              <div className="text-sm text-[#5A7B6B] dark:text-[#6B8B7B]">
                Completion Rate
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievement Grid */}
      <AchievementGrid achievements={MOCK_ACHIEVEMENTS} />

      {/* Bottom Info */}
      <div className="mt-8 p-4 bg-[#059669]/5 dark:bg-[#00E5A0]/5 border border-[#059669]/20 dark:border-[#00E5A0]/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-[#059669] dark:text-[#00E5A0] mt-0.5 flex-shrink-0" />
          <div className="text-sm text-[#1A2E22] dark:text-[#E8F0EC]">
            <p className="font-semibold mb-1">About Achievements</p>
            <p className="text-[#5A7B6B] dark:text-[#6B8B7B]">
              Earn achievements by completing various milestones in your Quran
              learning journey. Each achievement rewards you with XP and helps
              you level up. Some achievements are secret - discover them by
              exploring different features!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
