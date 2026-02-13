/**
 * Seed Word-by-Word Data
 *
 * Seeds ~77K words by fetching each surah from quran.com API.
 * Uses 5-parallel concurrency with retries.
 */
import type { PrismaClient } from "@prisma/client";

import { progressBar, runConcurrent, withRetry } from "./utils";

function removeArabicDiacritics(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670]/g, "");
}

interface QuranComWord {
  id: number;
  position: number;
  text_uthmani: string;
  text_indopak?: string;
  transliteration?: { text: string };
  translation?: { text: string };
  char_type_name: string; // "word" | "end" | "pause"
  audio_url?: string;
}

interface QuranComVerse {
  verse_key: string; // "2:255"
  words: QuranComWord[];
}

interface QuranComResponse {
  verses: QuranComVerse[];
  pagination?: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

async function fetchWordsForSurah(
  surahNumber: number,
  perPage: number
): Promise<QuranComVerse[]> {
  const allVerses: QuranComVerse[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await withRetry(async () => {
      const response = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?words=true&word_fields=text_uthmani,text_indopak,transliteration&translation_fields=text&per_page=${perPage}&page=${page}`
      );
      if (!response.ok) {
        throw new Error(
          `API error for surah ${surahNumber} page ${page}: ${response.status}`
        );
      }
      return (await response.json()) as QuranComResponse;
    });

    allVerses.push(...data.verses);

    if (data.pagination?.next_page) {
      page = data.pagination.next_page;
    } else {
      hasMore = false;
    }
  }

  return allVerses;
}

export async function seedWords(prisma: PrismaClient): Promise<void> {
  console.log("Seeding ~77K words...");

  const existing = await prisma.quranWord.count();
  if (existing >= 77000) {
    console.log(`  Already seeded (${existing} words found). Skipping.`);
    return;
  }

  // Get surah list for ayah counts (to set perPage)
  const surahs = await prisma.quranSurah.findMany({
    select: { number: true, numberOfAyahs: true },
    orderBy: { number: "asc" },
  });

  if (surahs.length === 0) {
    throw new Error("No surahs found. Run seed-surahs first.");
  }

  // Check which surahs need words
  const surahsToSeed: { number: number; numberOfAyahs: number }[] = [];
  for (const surah of surahs) {
    const wordCount = await prisma.quranWord.count({
      where: { surahNumber: surah.number },
    });
    if (wordCount === 0) {
      surahsToSeed.push(surah);
    }
  }

  if (surahsToSeed.length === 0) {
    console.log("  All surahs already have word data. Skipping.");
    return;
  }

  console.log(`  ${surahsToSeed.length} surahs need word data...`);

  let completed = 0;
  const total = surahsToSeed.length;

  await runConcurrent(surahsToSeed, 5, async (surah) => {
    // quran.com max per_page is 50, but we use numberOfAyahs when <= 50
    const perPage = Math.min(surah.numberOfAyahs, 50);
    const verses = await fetchWordsForSurah(surah.number, perPage);

    const wordRecords: Array<{
      surahNumber: number;
      ayahNumber: number;
      position: number;
      textUthmani: string;
      textIndopak: string | null;
      textSimple: string;
      transliteration: string | null;
      translation: string | null;
      charType: string;
      wordKey: string;
      audioUrl: string | null;
    }> = [];

    for (const verse of verses) {
      const [, ayahStr] = verse.verse_key.split(":");
      const ayahNumber = parseInt(ayahStr, 10);

      for (const word of verse.words) {
        wordRecords.push({
          surahNumber: surah.number,
          ayahNumber,
          position: word.position,
          textUthmani: word.text_uthmani,
          textIndopak: word.text_indopak ?? null,
          textSimple: removeArabicDiacritics(word.text_uthmani),
          transliteration: word.transliteration?.text ?? null,
          translation: word.translation?.text ?? null,
          charType: word.char_type_name || "word",
          wordKey: `${surah.number}:${ayahNumber}:${word.position}`,
          audioUrl: word.audio_url ?? null,
        });
      }
    }

    // Delete existing words for this surah and re-create (idempotent)
    await prisma.quranWord.deleteMany({
      where: { surahNumber: surah.number },
    });

    // Insert in batches of 1000 to avoid query size limits
    for (let i = 0; i < wordRecords.length; i += 1000) {
      await prisma.quranWord.createMany({
        data: wordRecords.slice(i, i + 1000),
        skipDuplicates: true,
      });
    }

    completed++;
    progressBar(completed, total, "surahs fetched");
  });

  const finalCount = await prisma.quranWord.count();
  console.log(`  ✓ ${finalCount} words seeded.`);
}
