import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { createSearchIndex } from "./seed-data/create-search-index";
import { seedAyahs } from "./seed-data/seed-ayahs";
import { seedJuz } from "./seed-data/seed-juz";
import { seedPageLayouts } from "./seed-data/seed-page-layouts";
import { seedReciters } from "./seed-data/seed-reciters";
import { seedSimilarVerses } from "./seed-data/seed-similar-verses";
import { seedSurahs } from "./seed-data/seed-surahs";
import { seedTranslations } from "./seed-data/seed-translations";
import { seedWords } from "./seed-data/seed-words";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ===== Badge Data (existing) =====

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

async function seedBadges() {
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
  }
  console.log(`  ✓ ${badges.length} badges seeded.`);
}

// ===== Main Orchestrator =====

async function main() {
  const args = process.argv.slice(2);
  const startTime = Date.now();

  console.log("╔══════════════════════════════════════╗");
  console.log("║  QuranMemorizer 2.0 — Database Seed  ║");
  console.log("╚══════════════════════════════════════╝\n");

  if (args.includes("--quick")) {
    // Quick seed: static data only (no network calls)
    console.log("Mode: QUICK (static data only)\n");
    await seedJuz(prisma);
    await seedReciters(prisma);
    await seedBadges();
  } else if (args.includes("--ayahs")) {
    // Ayahs only
    console.log("Mode: AYAHS ONLY\n");
    await seedSurahs(prisma); // Required dependency
    await seedAyahs(prisma);
  } else if (args.includes("--layouts")) {
    // Page layouts only
    console.log("Mode: LAYOUTS ONLY\n");
    await seedPageLayouts(prisma);
  } else if (args.includes("--words")) {
    // Words only
    console.log("Mode: WORDS ONLY\n");
    await seedWords(prisma);
  } else if (args.includes("--translations")) {
    // Translations only
    console.log("Mode: TRANSLATIONS ONLY\n");
    await seedTranslations(prisma);
  } else if (args.includes("--similar")) {
    // Similar verse pairs only (computational, no API)
    console.log("Mode: SIMILAR VERSES ONLY\n");
    await seedSimilarVerses(prisma);
  } else if (args.includes("--search-index")) {
    // Search index only
    console.log("Mode: SEARCH INDEX ONLY\n");
    await createSearchIndex(pool);
  } else {
    // Full seed
    console.log("Mode: FULL SEED\n");

    // Phase 1: Static data (instant)
    await seedJuz(prisma);
    await seedReciters(prisma);
    await seedBadges();

    // Phase 2: Surahs (1 API call)
    await seedSurahs(prisma);

    // Phase 3: Ayahs (114 API calls, 5 concurrent)
    await seedAyahs(prisma);

    // Phase 4: Page layouts (604 GitHub fetches, 10 concurrent)
    await seedPageLayouts(prisma);

    // Phase 5: Words (~77K from quran.com, 114 API calls)
    await seedWords(prisma);

    // Phase 6: Translations (editions + 3 popular texts)
    await seedTranslations(prisma);

    // Phase 7: Similar verse pairs (computational)
    await seedSimilarVerses(prisma);

    // Phase 8: Search index (PostgreSQL GIN)
    await createSearchIndex(pool);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nSeed completed in ${elapsed}s.`);
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
