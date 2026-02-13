/**
 * Seed Ayahs Data
 *
 * Seeds 6,236 ayahs by fetching each surah from alquran.cloud/v1/surah/{n}/quran-uthmani.
 * Uses 5-parallel concurrency with retries.
 */
import { Prisma, type PrismaClient } from "@prisma/client";

import { progressBar, runConcurrent, withRetry } from "./utils";

function removeArabicDiacritics(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670]/g, "");
}

interface AyahAPIResponse {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  hizbQuarter: number;
  page: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

interface SurahAPIResponse {
  number: number;
  numberOfAyahs: number;
  ayahs: AyahAPIResponse[];
}

async function fetchSurahAyahs(surahNumber: number): Promise<SurahAPIResponse> {
  return withRetry(async () => {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`
    );
    const data = await response.json();
    if (data.code !== 200)
      throw new Error(`API error for surah ${surahNumber}: ${data.status}`);
    return data.data as SurahAPIResponse;
  });
}

export async function seedAyahs(prisma: PrismaClient): Promise<void> {
  console.log("Seeding 6,236 ayahs...");

  const existing = await prisma.quranAyah.count();
  if (existing >= 6236) {
    console.log(`  Already seeded (${existing} ayahs found). Skipping.`);
    return;
  }

  // Get list of surahs that still need seeding
  const surahs = await prisma.quranSurah.findMany({
    select: { number: true, numberOfAyahs: true },
    orderBy: { number: "asc" },
  });

  if (surahs.length === 0) {
    throw new Error("No surahs found. Run seed-surahs first.");
  }

  // Check which surahs already have all ayahs
  const surahsToSeed: number[] = [];
  for (const surah of surahs) {
    const ayahCount = await prisma.quranAyah.count({
      where: { surahNumber: surah.number },
    });
    if (ayahCount < surah.numberOfAyahs) {
      surahsToSeed.push(surah.number);
    }
  }

  if (surahsToSeed.length === 0) {
    console.log("  All surahs already have their ayahs. Skipping.");
    return;
  }

  console.log(`  ${surahsToSeed.length} surahs need ayah data...`);

  let completed = 0;
  const total = surahsToSeed.length;

  await runConcurrent(surahsToSeed, 5, async (surahNumber) => {
    const surahData = await fetchSurahAyahs(surahNumber);

    const ayahRecords = surahData.ayahs.map((ayah) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      surahNumber: surahData.number,
      text: ayah.text,
      textSimple: removeArabicDiacritics(ayah.text),
      juz: ayah.juz,
      hizb: Math.ceil(ayah.hizbQuarter / 4),
      hizbQuarter: ayah.hizbQuarter,
      page: ayah.page,
      sajda:
        typeof ayah.sajda === "object" && ayah.sajda !== null
          ? (ayah.sajda as unknown as Prisma.JsonObject)
          : ayah.sajda
            ? ({
                id: 0,
                recommended: true,
                obligatory: false,
              } as unknown as Prisma.JsonObject)
            : Prisma.JsonNull,
    }));

    // Delete existing ayahs for this surah and re-create (idempotent)
    await prisma.quranAyah.deleteMany({
      where: { surahNumber: surahData.number },
    });

    await prisma.quranAyah.createMany({
      data: ayahRecords,
      skipDuplicates: true,
    });

    completed++;
    progressBar(completed, total, `surahs fetched`);
  });

  const finalCount = await prisma.quranAyah.count();
  console.log(`  ✓ ${finalCount} ayahs seeded.`);
}
