/**
 * IndexedDB Storage for Offline Quran Data
 *
 * Stores Quran text, translations, audio metadata, and user data for offline access.
 */

import type { Ayah, MushafPage, SearchResult, Surah } from "@/types/quran";
import { openDB, type DBSchema, type IDBPDatabase } from "idb";

// ===== Helper Functions =====

function ayahKey(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}:${ayahNumber}`;
}

function translationKey(
  translationId: string,
  surahNumber: number,
  ayahNumber: number
): string {
  return `${translationId}:${surahNumber}:${ayahNumber}`;
}

function pageKey(edition: string, pageNumber: number): string {
  return `${edition}:${pageNumber}`;
}

// ===== Database Schema =====

interface AyahWithKey extends Ayah {
  key: string;
}

interface TranslationEntry {
  key: string;
  translationId: string;
  surahNumber: number;
  ayahNumber: number;
  text: string;
}

interface BookmarkEntry {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  color?: string;
  folder?: string;
  createdAt: number;
  synced: number; // 0 = false, 1 = true (for indexing)
}

interface ReadingProgressEntry {
  key: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: number;
}

interface SearchIndexEntry {
  key: string;
  surahNumber: number;
  ayahNumber: number;
  text: string;
  normalizedText: string;
}

interface QuranDBSchema extends DBSchema {
  surahs: {
    key: number;
    value: Surah;
    indexes: { "by-name": string };
  };

  ayahs: {
    key: string;
    value: AyahWithKey;
    indexes: {
      "by-surah": number;
      "by-page": number;
      "by-juz": number;
    };
  };

  translations: {
    key: string;
    value: TranslationEntry;
    indexes: {
      "by-translation": string;
      "by-surah": number;
    };
  };

  bookmarks: {
    key: string;
    value: BookmarkEntry;
    indexes: {
      "by-surah": number;
      "by-synced": number;
    };
  };

  readingProgress: {
    key: string;
    value: ReadingProgressEntry;
  };

  searchIndex: {
    key: string;
    value: SearchIndexEntry;
    indexes: { "by-surah": number };
  };

  pageLayouts: {
    key: string;
    value: MushafPage & { key: string };
    indexes: {
      "by-edition": string;
      "by-page": number;
    };
  };
}

// ===== Database Instance =====

const DB_NAME = "quran-memorizer";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<QuranDBSchema>> | null = null;

/**
 * Get or create the database instance
 */
export async function getDB(): Promise<IDBPDatabase<QuranDBSchema>> {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }

  if (!dbPromise) {
    dbPromise = openDB<QuranDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          // Surahs store
          const surahsStore = db.createObjectStore("surahs", {
            keyPath: "number",
          });
          surahsStore.createIndex("by-name", "englishName");

          // Ayahs store
          const ayahsStore = db.createObjectStore("ayahs", { keyPath: "key" });
          ayahsStore.createIndex("by-surah", "surahNumber");
          ayahsStore.createIndex("by-page", "page");
          ayahsStore.createIndex("by-juz", "juz");

          // Translations store
          const translationsStore = db.createObjectStore("translations", {
            keyPath: "key",
          });
          translationsStore.createIndex("by-translation", "translationId");
          translationsStore.createIndex("by-surah", "surahNumber");

          // Bookmarks store
          const bookmarksStore = db.createObjectStore("bookmarks", {
            keyPath: "id",
          });
          bookmarksStore.createIndex("by-surah", "surahNumber");
          bookmarksStore.createIndex("by-synced", "synced");

          // Reading progress store
          db.createObjectStore("readingProgress", { keyPath: "key" });

          // Search index store
          const searchIndexStore = db.createObjectStore("searchIndex", {
            keyPath: "key",
          });
          searchIndexStore.createIndex("by-surah", "surahNumber");

          // Page layouts store
          const pageLayoutsStore = db.createObjectStore("pageLayouts", {
            keyPath: "key",
          });
          pageLayoutsStore.createIndex("by-edition", "edition");
          pageLayoutsStore.createIndex("by-page", "pageNumber");
        }
      },
    });
  }

  return dbPromise;
}

// ===== Surah Operations =====

export async function saveSurah(surah: Surah): Promise<void> {
  const db = await getDB();
  await db.put("surahs", surah);
}

export async function saveSurahs(surahs: Surah[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("surahs", "readwrite");
  await Promise.all([...surahs.map((s) => tx.store.put(s)), tx.done]);
}

export async function getSurah(
  surahNumber: number
): Promise<Surah | undefined> {
  const db = await getDB();
  return db.get("surahs", surahNumber);
}

export async function getAllSurahs(): Promise<Surah[]> {
  const db = await getDB();
  return db.getAll("surahs");
}

// ===== Ayah Operations =====

export async function saveAyah(ayah: Ayah): Promise<void> {
  const db = await getDB();
  const ayahWithKey: AyahWithKey = {
    ...ayah,
    key: ayahKey(ayah.surahNumber, ayah.numberInSurah),
  };
  await db.put("ayahs", ayahWithKey);
}

export async function saveAyahs(ayahs: Ayah[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("ayahs", "readwrite");
  const ayahsWithKeys = ayahs.map((a) => ({
    ...a,
    key: ayahKey(a.surahNumber, a.numberInSurah),
  }));
  await Promise.all([...ayahsWithKeys.map((a) => tx.store.put(a)), tx.done]);
}

export async function getAyah(
  surahNumber: number,
  ayahNumber: number
): Promise<Ayah | undefined> {
  const db = await getDB();
  const key = ayahKey(surahNumber, ayahNumber);
  const result = await db.get("ayahs", key);
  return result;
}

export async function getAyahsBySurah(surahNumber: number): Promise<Ayah[]> {
  const db = await getDB();
  return db.getAllFromIndex("ayahs", "by-surah", surahNumber);
}

export async function getAyahsByPage(pageNumber: number): Promise<Ayah[]> {
  const db = await getDB();
  return db.getAllFromIndex("ayahs", "by-page", pageNumber);
}

export async function getAyahsByJuz(juzNumber: number): Promise<Ayah[]> {
  const db = await getDB();
  return db.getAllFromIndex("ayahs", "by-juz", juzNumber);
}

// ===== Translation Operations =====

export async function saveTranslation(
  translationId: string,
  surahNumber: number,
  ayahNumber: number,
  text: string
): Promise<void> {
  const db = await getDB();
  const entry: TranslationEntry = {
    key: translationKey(translationId, surahNumber, ayahNumber),
    translationId,
    surahNumber,
    ayahNumber,
    text,
  };
  await db.put("translations", entry);
}

export async function saveTranslations(
  translations: Array<{
    translationId: string;
    surahNumber: number;
    ayahNumber: number;
    text: string;
  }>
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("translations", "readwrite");
  const entries = translations.map((t) => ({
    ...t,
    key: translationKey(t.translationId, t.surahNumber, t.ayahNumber),
  }));
  await Promise.all([...entries.map((e) => tx.store.put(e)), tx.done]);
}

export async function getTranslation(
  translationId: string,
  surahNumber: number,
  ayahNumber: number
): Promise<string | undefined> {
  const db = await getDB();
  const key = translationKey(translationId, surahNumber, ayahNumber);
  const result = await db.get("translations", key);
  return result?.text;
}

export async function getTranslationsBySurah(
  translationId: string,
  surahNumber: number
): Promise<Array<{ ayahNumber: number; text: string }>> {
  const db = await getDB();
  const all = await db.getAllFromIndex(
    "translations",
    "by-translation",
    translationId
  );
  return all
    .filter((t) => t.surahNumber === surahNumber)
    .map((t) => ({ ayahNumber: t.ayahNumber, text: t.text }));
}

// ===== Bookmarks Operations =====

export async function saveBookmark(bookmark: {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  color?: string;
  folder?: string;
}): Promise<void> {
  const db = await getDB();
  const entry: BookmarkEntry = {
    ...bookmark,
    createdAt: Date.now(),
    synced: 0,
  };
  await db.put("bookmarks", entry);
}

export async function getBookmarks(): Promise<
  Array<{
    id: string;
    surahNumber: number;
    ayahNumber: number;
    note?: string;
    color?: string;
    folder?: string;
    createdAt: number;
  }>
> {
  const db = await getDB();
  return db.getAll("bookmarks");
}

export async function getBookmarksBySurah(surahNumber: number): Promise<
  Array<{
    id: string;
    ayahNumber: number;
    note?: string;
    color?: string;
  }>
> {
  const db = await getDB();
  const all = await db.getAllFromIndex("bookmarks", "by-surah", surahNumber);
  return all.map((b) => ({
    id: b.id,
    ayahNumber: b.ayahNumber,
    note: b.note,
    color: b.color,
  }));
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("bookmarks", id);
}

export async function getUnsyncedBookmarks(): Promise<
  Array<{
    id: string;
    surahNumber: number;
    ayahNumber: number;
    note?: string;
    createdAt: number;
  }>
> {
  const db = await getDB();
  return db.getAllFromIndex("bookmarks", "by-synced", 0);
}

export async function markBookmarksSynced(ids: string[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("bookmarks", "readwrite");

  await Promise.all(
    ids.map(async (id) => {
      const bookmark = await tx.store.get(id);
      if (bookmark) {
        await tx.store.put({ ...bookmark, synced: 1 });
      }
    })
  );

  await tx.done;
}

// ===== Reading Progress Operations =====

export async function saveReadingProgress(
  surahNumber: number,
  ayahNumber: number,
  pageNumber: number
): Promise<void> {
  const db = await getDB();
  const entry: ReadingProgressEntry = {
    key: "lastRead",
    surahNumber,
    ayahNumber,
    pageNumber,
    timestamp: Date.now(),
  };
  await db.put("readingProgress", entry);
}

export async function getLastReadPosition(): Promise<{
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
} | null> {
  const db = await getDB();
  const result = await db.get("readingProgress", "lastRead");
  return result || null;
}

// ===== Search Index Operations =====

export async function buildSearchIndex(
  ayahs: Array<{ surahNumber: number; ayahNumber: number; text: string }>
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("searchIndex", "readwrite");

  const entries: SearchIndexEntry[] = ayahs.map((ayah) => ({
    key: ayahKey(ayah.surahNumber, ayah.ayahNumber),
    surahNumber: ayah.surahNumber,
    ayahNumber: ayah.ayahNumber,
    text: ayah.text,
    normalizedText: normalizeForSearch(ayah.text),
  }));

  await Promise.all([...entries.map((e) => tx.store.put(e)), tx.done]);
}

export async function searchOffline(
  query: string,
  limit: number = 20
): Promise<SearchResult[]> {
  const db = await getDB();
  const normalizedQuery = normalizeForSearch(query);
  const all = await db.getAll("searchIndex");

  const results = all
    .filter((entry) => entry.normalizedText.includes(normalizedQuery))
    .slice(0, limit)
    .map((entry) => ({
      surahNumber: entry.surahNumber,
      ayahNumber: entry.ayahNumber,
      text: entry.text,
      highlightedText: entry.text, // No highlighting for offline search
      matchScore: 1,
      translation: undefined, // No translation in offline index
    }));

  return results;
}

// ===== Page Layout Operations =====

export async function savePageLayout(
  edition: string,
  page: MushafPage
): Promise<void> {
  const db = await getDB();
  const entry = {
    ...page,
    key: pageKey(edition, page.pageNumber),
  };
  await db.put("pageLayouts", entry);
}

export async function getPageLayout(
  edition: string,
  pageNumber: number
): Promise<MushafPage | undefined> {
  const db = await getDB();
  const key = pageKey(edition, pageNumber);
  return db.get("pageLayouts", key);
}

// ===== Utility Functions =====

/**
 * Normalize Arabic text for search matching
 */
function normalizeForSearch(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Remove diacritics
    .replace(/[إأآا]/g, "ا") // Normalize alef
    .replace(/ة/g, "ه") // Normalize taa marbuta
    .replace(/ى/g, "ي") // Normalize alef maksura
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Check if database has data for offline use
 */
export async function hasOfflineData(): Promise<boolean> {
  try {
    const db = await getDB();
    const surahCount = await db.count("surahs");
    const ayahCount = await db.count("ayahs");
    return surahCount === 114 && ayahCount > 0;
  } catch {
    return false;
  }
}

/**
 * Get offline data statistics
 */
export async function getOfflineStats(): Promise<{
  surahs: number;
  ayahs: number;
  translations: number;
  bookmarks: number;
  hasFullQuran: boolean;
}> {
  try {
    const db = await getDB();
    const surahCount = await db.count("surahs");
    const ayahCount = await db.count("ayahs");
    const translationCount = await db.count("translations");
    const bookmarkCount = await db.count("bookmarks");

    return {
      surahs: surahCount,
      ayahs: ayahCount,
      translations: translationCount,
      bookmarks: bookmarkCount,
      hasFullQuran: surahCount === 114 && ayahCount >= 6236,
    };
  } catch {
    return {
      surahs: 0,
      ayahs: 0,
      translations: 0,
      bookmarks: 0,
      hasFullQuran: false,
    };
  }
}

/**
 * Clear all offline data
 */
export async function clearOfflineData(): Promise<void> {
  const db = await getDB();
  const stores = [
    "surahs",
    "ayahs",
    "translations",
    "pageLayouts",
    "searchIndex",
  ] as const;

  for (const store of stores) {
    await db.clear(store);
  }
}
