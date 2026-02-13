/**
 * Internal API Client
 *
 * Fetches Quran reference data from PostgreSQL-backed internal API routes.
 * Used as primary data source, with external APIs as fallback.
 */
import type {
  Ayah,
  MushafPage,
  Reciter,
  SearchResult,
  Surah,
  Translation,
  Word,
} from "@/types/quran";

import type { JuzInfo } from "./mushaf-layout";

const BASE_URL =
  typeof window !== "undefined"
    ? "" // Browser: relative URL
    : `http://localhost:${process.env.PORT || 3000}`; // Server-side: absolute URL

async function fetchInternal<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`Internal API error: ${response.status} ${path}`);
  }

  return response.json();
}

/**
 * Fetch all 114 surahs from internal API
 */
export async function fetchSurahsInternal(): Promise<Surah[]> {
  const data = await fetchInternal<
    Array<{
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
      startPage: number;
    }>
  >("/api/quran/surahs");

  return data.map((s) => ({
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType as "Meccan" | "Medinan",
    startPage: s.startPage,
  }));
}

/**
 * Fetch a single surah with its ayahs from internal API
 */
export async function fetchSurahInternal(
  surahNumber: number
): Promise<{ surah: Surah; ayahs: Ayah[] }> {
  const data = await fetchInternal<{
    surah: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
      startPage: number;
    };
    ayahs: Array<{
      number: number;
      numberInSurah: number;
      surahNumber: number;
      text: string;
      textSimple: string;
      juz: number;
      hizb: number;
      hizbQuarter: number;
      page: number;
      sajda: { id: number; recommended: boolean; obligatory: boolean } | null;
    }>;
  }>(`/api/quran/surahs/${surahNumber}`);

  return {
    surah: {
      number: data.surah.number,
      name: data.surah.name,
      englishName: data.surah.englishName,
      englishNameTranslation: data.surah.englishNameTranslation,
      numberOfAyahs: data.surah.numberOfAyahs,
      revelationType: data.surah.revelationType as "Meccan" | "Medinan",
      startPage: data.surah.startPage,
    },
    ayahs: data.ayahs.map((a) => ({
      number: a.number,
      numberInSurah: a.numberInSurah,
      surahNumber: a.surahNumber,
      text: a.text,
      textUthmani: a.text,
      textSimple: a.textSimple,
      juz: a.juz,
      hizb: a.hizb,
      hizbQuarter: a.hizbQuarter,
      page: a.page,
      sajda: a.sajda || undefined,
      words: [],
    })),
  };
}

/**
 * Fetch a MushafPage layout from internal API
 */
export async function fetchPageLayoutInternal(
  pageNumber: number
): Promise<MushafPage> {
  return fetchInternal<MushafPage>(`/api/quran/pages/${pageNumber}`);
}

/**
 * Fetch all 30 juz from internal API
 */
export async function fetchJuzInternal(): Promise<JuzInfo[]> {
  return fetchInternal<JuzInfo[]>("/api/quran/juz");
}

/**
 * Fetch all reciters from internal API
 */
export async function fetchRecitersInternal(): Promise<Reciter[]> {
  return fetchInternal<Reciter[]>("/api/quran/reciters");
}

/**
 * Fetch words for a single ayah from internal API
 */
export async function fetchWordsInternal(
  surahNumber: number,
  ayahNumber: number
): Promise<Word[]> {
  const data = await fetchInternal<
    Array<{
      id: number;
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
    }>
  >(`/api/quran/words/${surahNumber}/${ayahNumber}`);

  return data.map((w) => ({
    id: w.id,
    position: w.position,
    text: w.textUthmani,
    textUthmani: w.textUthmani,
    textIndopak: w.textIndopak ?? undefined,
    textSimple: w.textSimple,
    transliteration: w.transliteration ?? undefined,
    translation: w.translation ?? undefined,
    charType: w.charType as "word" | "end" | "pause",
    wordKey: w.wordKey,
    audioUrl: w.audioUrl ?? undefined,
  }));
}

/**
 * Fetch words for an entire surah from internal API
 */
export async function fetchWordsBySurahInternal(
  surahNumber: number
): Promise<Word[]> {
  const data = await fetchInternal<
    Array<{
      id: number;
      position: number;
      textUthmani: string;
      textIndopak: string | null;
      textSimple: string;
      transliteration: string | null;
      translation: string | null;
      charType: string;
      wordKey: string;
      audioUrl: string | null;
    }>
  >(`/api/quran/words/${surahNumber}`);

  return data.map((w) => ({
    id: w.id,
    position: w.position,
    text: w.textUthmani,
    textUthmani: w.textUthmani,
    textIndopak: w.textIndopak ?? undefined,
    textSimple: w.textSimple,
    transliteration: w.transliteration ?? undefined,
    translation: w.translation ?? undefined,
    charType: w.charType as "word" | "end" | "pause",
    wordKey: w.wordKey,
    audioUrl: w.audioUrl ?? undefined,
  }));
}

/**
 * Fetch available translation editions from internal API
 */
export async function fetchTranslationsListInternal(): Promise<Translation[]> {
  const data = await fetchInternal<
    Array<{
      identifier: string;
      name: string;
      englishName: string;
      language: string;
      direction: string;
      author: string | null;
      isPopular: boolean;
    }>
  >("/api/quran/translations");

  return data.map((e) => ({
    id: e.identifier,
    name: e.name,
    englishName: e.englishName,
    language: e.language,
    languageCode: e.language,
    direction: e.direction as "ltr" | "rtl",
    author: e.author ?? undefined,
  }));
}

/**
 * Fetch translation text for a surah from internal API
 */
export async function fetchTranslationInternal(
  editionId: string,
  surahNumber: number
): Promise<{ surahNumber: number; ayahNumber: number; text: string }[]> {
  return fetchInternal<
    { surahNumber: number; ayahNumber: number; text: string }[]
  >(`/api/quran/translations/${editionId}/${surahNumber}`);
}

/**
 * Search Quran from internal PostgreSQL API
 */
export async function searchQuranInternal(
  query: string,
  limit = 20
): Promise<SearchResult[]> {
  return fetchInternal<SearchResult[]>(
    `/api/quran/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
}
