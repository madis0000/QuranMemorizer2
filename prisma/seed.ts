import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const badges = [
  {
    code: "first_steps",
    name: "First Steps",
    description: "Complete your first recitation session",
    icon: "footprints",
    category: "MILESTONE" as const,
    requirement: { type: "first_session" },
  },
  {
    code: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "flame",
    category: "STREAK" as const,
    requirement: { type: "streak", days: 7 },
  },
  {
    code: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "crown",
    category: "STREAK" as const,
    requirement: { type: "streak", days: 30 },
  },
  {
    code: "streak_100",
    name: "Century",
    description: "Maintain a 100-day streak",
    icon: "trophy",
    category: "STREAK" as const,
    requirement: { type: "streak", days: 100 },
  },
  {
    code: "streak_365",
    name: "Year of Quran",
    description: "Maintain a 365-day streak",
    icon: "award",
    category: "STREAK" as const,
    requirement: { type: "streak", days: 365 },
  },
  {
    code: "surah_complete_1",
    name: "Surah Scholar",
    description: "Memorize a complete surah",
    icon: "book-open",
    category: "MEMORIZATION" as const,
    requirement: { type: "surah_complete", count: 1 },
  },
  {
    code: "surah_complete_10",
    name: "Hafiz in Training",
    description: "Memorize 10 complete surahs",
    icon: "graduation-cap",
    category: "MEMORIZATION" as const,
    requirement: { type: "surah_complete", count: 10 },
  },
  {
    code: "perfect_session",
    name: "Perfect Session",
    description: "Achieve 100% accuracy in a session",
    icon: "star",
    category: "MEMORIZATION" as const,
    requirement: { type: "accuracy", min: 100 },
  },
  {
    code: "night_owl",
    name: "Night Owl",
    description: "Complete a session between 10 PM and 4 AM",
    icon: "moon",
    category: "SPECIAL" as const,
    requirement: { type: "session_time", startHour: 22, endHour: 4 },
  },
  {
    code: "early_bird",
    name: "Early Bird",
    description: "Complete a session between 4 AM and 7 AM",
    icon: "sunrise",
    category: "SPECIAL" as const,
    requirement: { type: "session_time", startHour: 4, endHour: 7 },
  },
  {
    code: "speed_reader",
    name: "Speed Reader",
    description: "Read 10 pages in a single session",
    icon: "zap",
    category: "MILESTONE" as const,
    requirement: { type: "pages_in_session", count: 10 },
  },
  {
    code: "dedicated_50",
    name: "Dedicated",
    description: "Complete 50 total sessions",
    icon: "heart",
    category: "CONSISTENCY" as const,
    requirement: { type: "total_sessions", count: 50 },
  },
  {
    code: "centurion_100",
    name: "Centurion",
    description: "Complete 100 total sessions",
    icon: "shield",
    category: "CONSISTENCY" as const,
    requirement: { type: "total_sessions", count: 100 },
  },
  {
    code: "marathon",
    name: "Marathon",
    description: "Complete a session lasting over 30 minutes",
    icon: "timer",
    category: "MILESTONE" as const,
    requirement: { type: "session_duration", minutes: 30 },
  },
  {
    code: "polyglot",
    name: "Polyglot",
    description: "Use translations in 3+ languages",
    icon: "languages",
    category: "SPECIAL" as const,
    requirement: { type: "translations_used", count: 3 },
  },
];

async function main() {
  console.log("Seeding badges...");

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        requirement: badge.requirement,
      },
      create: badge,
    });
    console.log(`  ✓ ${badge.name}`);
  }

  console.log(`\nSeeded ${badges.length} badges successfully.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
