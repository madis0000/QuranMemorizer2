/**
 * Seed Surahs Data
 *
 * Seeds 114 surahs. Fetches from alquran.cloud API for English names
 * and revelation types, combines with static start page mappings.
 */
import type { PrismaClient } from "@prisma/client";

import { withRetry } from "./utils";

const START_PAGES: Record<number, number> = {
  1: 1,
  2: 2,
  3: 50,
  4: 77,
  5: 106,
  6: 128,
  7: 151,
  8: 177,
  9: 187,
  10: 208,
  11: 221,
  12: 235,
  13: 249,
  14: 255,
  15: 262,
  16: 267,
  17: 282,
  18: 293,
  19: 305,
  20: 312,
  21: 322,
  22: 332,
  23: 342,
  24: 350,
  25: 359,
  26: 367,
  27: 377,
  28: 385,
  29: 396,
  30: 404,
  31: 411,
  32: 415,
  33: 418,
  34: 428,
  35: 434,
  36: 440,
  37: 446,
  38: 453,
  39: 458,
  40: 467,
  41: 477,
  42: 483,
  43: 489,
  44: 496,
  45: 499,
  46: 502,
  47: 507,
  48: 511,
  49: 515,
  50: 518,
  51: 520,
  52: 523,
  53: 526,
  54: 528,
  55: 531,
  56: 534,
  57: 537,
  58: 542,
  59: 545,
  60: 549,
  61: 551,
  62: 553,
  63: 554,
  64: 556,
  65: 558,
  66: 560,
  67: 562,
  68: 564,
  69: 566,
  70: 568,
  71: 570,
  72: 572,
  73: 574,
  74: 575,
  75: 577,
  76: 578,
  77: 580,
  78: 582,
  79: 583,
  80: 585,
  81: 586,
  82: 587,
  83: 587,
  84: 589,
  85: 590,
  86: 591,
  87: 591,
  88: 592,
  89: 593,
  90: 594,
  91: 595,
  92: 595,
  93: 596,
  94: 596,
  95: 597,
  96: 597,
  97: 598,
  98: 598,
  99: 599,
  100: 599,
  101: 600,
  102: 600,
  103: 601,
  104: 601,
  105: 601,
  106: 602,
  107: 602,
  108: 602,
  109: 603,
  110: 603,
  111: 603,
  112: 604,
  113: 604,
  114: 604,
};

interface SurahAPIResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export async function seedSurahs(prisma: PrismaClient): Promise<void> {
  console.log("Seeding 114 surahs...");

  const existing = await prisma.quranSurah.count();
  if (existing === 114) {
    console.log("  Already seeded (114 surahs found). Skipping.");
    return;
  }

  // Fetch surah metadata from alquran.cloud API
  const surahs = await withRetry(async () => {
    const response = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await response.json();
    if (data.code !== 200) throw new Error(`API error: ${data.status}`);
    return data.data as SurahAPIResponse[];
  });

  for (const surah of surahs) {
    await prisma.quranSurah.upsert({
      where: { number: surah.number },
      update: {
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
        startPage: START_PAGES[surah.number] || 1,
      },
      create: {
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
        startPage: START_PAGES[surah.number] || 1,
      },
    });
  }

  console.log("  ✓ 114 surahs seeded.");
}
