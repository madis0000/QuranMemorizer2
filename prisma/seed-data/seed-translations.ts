/**
 * Seed Translation Data
 *
 * Phase A: Fetch all ~150 translation edition metadata from alquran.cloud (1 API call)
 * Phase B: Seed 3 popular editions' full text (3 × 114 = 342 API calls)
 */
import type { PrismaClient } from "@prisma/client";

import { progressBar, runConcurrent, withRetry } from "./utils";

const POPULAR_EDITIONS = ["en.sahih", "en.asad", "ur.jalandhry"];

interface EditionAPIResponse {
  identifier: string;
  name: string;
  englishName: string;
  language: string;
  direction: string;
  type: string;
  format: string;
}

interface AyahAPIResponse {
  numberInSurah: number;
  text: string;
}

interface SurahTranslationResponse {
  number: number;
  ayahs: AyahAPIResponse[];
}

async function fetchEditions(): Promise<EditionAPIResponse[]> {
  return withRetry(async () => {
    const response = await fetch(
      "https://api.alquran.cloud/v1/edition?format=text&type=translation"
    );
    const data = await response.json();
    if (data.code !== 200) throw new Error(`API error: ${data.status}`);
    return data.data as EditionAPIResponse[];
  });
}

async function fetchSurahTranslation(
  surahNumber: number,
  editionId: string
): Promise<SurahTranslationResponse> {
  return withRetry(async () => {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/${editionId}`
    );
    const data = await response.json();
    if (data.code !== 200)
      throw new Error(
        `API error for ${editionId} surah ${surahNumber}: ${data.status}`
      );
    return data.data as SurahTranslationResponse;
  });
}

export async function seedTranslations(prisma: PrismaClient): Promise<void> {
  console.log("Seeding translation editions + texts...");

  // Phase A: Seed edition metadata
  const existingEditions = await prisma.translationEdition.count();
  if (existingEditions < 10) {
    console.log("  Phase A: Fetching translation editions...");
    const editions = await fetchEditions();

    for (const edition of editions) {
      await prisma.translationEdition.upsert({
        where: { identifier: edition.identifier },
        update: {
          name: edition.name,
          englishName: edition.englishName,
          language: edition.language,
          direction: edition.direction,
        },
        create: {
          identifier: edition.identifier,
          name: edition.name,
          englishName: edition.englishName,
          language: edition.language,
          direction: edition.direction,
          isPopular: POPULAR_EDITIONS.includes(edition.identifier),
        },
      });
    }

    const editionCount = await prisma.translationEdition.count();
    console.log(`  ✓ ${editionCount} translation editions seeded.`);
  } else {
    console.log(
      `  Phase A: Already seeded (${existingEditions} editions found). Skipping.`
    );
  }

  // Phase B: Seed popular edition texts
  console.log("  Phase B: Seeding popular translation texts...");

  for (const editionId of POPULAR_EDITIONS) {
    const existing = await prisma.quranTranslation.count({
      where: { editionId },
    });
    if (existing >= 6236) {
      console.log(
        `  ${editionId}: Already seeded (${existing} rows). Skipping.`
      );
      continue;
    }

    console.log(`  ${editionId}: Fetching 114 surahs...`);

    const surahNumbers = Array.from({ length: 114 }, (_, i) => i + 1);
    let completed = 0;

    await runConcurrent(surahNumbers, 5, async (surahNumber) => {
      const surahData = await fetchSurahTranslation(surahNumber, editionId);

      const records = surahData.ayahs.map((ayah) => ({
        editionId,
        surahNumber,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text,
      }));

      // Delete existing for this edition+surah, then insert
      await prisma.quranTranslation.deleteMany({
        where: { editionId, surahNumber },
      });

      await prisma.quranTranslation.createMany({
        data: records,
        skipDuplicates: true,
      });

      completed++;
      progressBar(completed, 114, `${editionId}`);
    });
  }

  const totalTranslations = await prisma.quranTranslation.count();
  console.log(`  ✓ ${totalTranslations} translation rows seeded.`);
}
