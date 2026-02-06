"use client";

/**
 * Quran Data Hooks
 *
 * React Query hooks for fetching Quran data with offline-first support.
 * Data is cached in React Query memory and persisted to IndexedDB.
 */
import type { Ayah, Reciter, Surah, Translation } from "@/types/quran";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchAllSurahs,
  fetchAvailableTranslations,
  fetchAyah,
  fetchJuz,
  fetchPage,
  fetchSurah,
  fetchTranslation,
  fetchWordsForAyah,
  POPULAR_RECITERS,
  searchQuran,
} from "@/lib/quran/api";
import {
  deleteBookmark,
  getAllSurahs,
  getAyah,
  getAyahsByJuz,
  getAyahsByPage,
  getAyahsBySurah,
  getBookmarks,
  getLastReadPosition,
  getOfflineStats,
  getSurah,
  hasOfflineData,
  saveAyahs,
  saveBookmark,
  saveReadingProgress,
  saveSurahs,
  searchOffline,
} from "@/lib/storage/indexed-db";

// ===== Query Keys =====

export const quranKeys = {
  all: ["quran"] as const,
  surahs: () => [...quranKeys.all, "surahs"] as const,
  surah: (number: number) => [...quranKeys.surahs(), number] as const,
  ayahs: (surahNumber: number) =>
    [...quranKeys.all, "ayahs", surahNumber] as const,
  ayah: (surahNumber: number, ayahNumber: number) =>
    [...quranKeys.ayahs(surahNumber), ayahNumber] as const,
  words: (surahNumber: number, ayahNumber: number) =>
    [...quranKeys.ayah(surahNumber, ayahNumber), "words"] as const,
  page: (pageNumber: number) => [...quranKeys.all, "page", pageNumber] as const,
  juz: (juzNumber: number) => [...quranKeys.all, "juz", juzNumber] as const,
  translations: () => [...quranKeys.all, "translations"] as const,
  translation: (id: string, surahNumber: number) =>
    [...quranKeys.translations(), id, surahNumber] as const,
  search: (query: string) => [...quranKeys.all, "search", query] as const,
  bookmarks: () => [...quranKeys.all, "bookmarks"] as const,
  readingProgress: () => [...quranKeys.all, "readingProgress"] as const,
  offlineStats: () => [...quranKeys.all, "offlineStats"] as const,
};

// ===== Surah Hooks =====

/**
 * Fetch all surahs with offline-first support
 */
export function useSurahs() {
  return useQuery({
    queryKey: quranKeys.surahs(),
    queryFn: async (): Promise<Surah[]> => {
      // Try offline first
      try {
        const offlineSurahs = await getAllSurahs();
        if (offlineSurahs.length === 114) {
          return offlineSurahs;
        }
      } catch {
        // Continue to fetch online
      }

      // Fetch from API and cache
      const surahs = await fetchAllSurahs();
      try {
        await saveSurahs(surahs);
      } catch {
        // Ignore cache errors
      }
      return surahs;
    },
    staleTime: Infinity, // Surah list never changes
    gcTime: Infinity,
  });
}

/**
 * Fetch a single surah with its ayahs
 */
export function useSurah(surahNumber: number) {
  return useQuery({
    queryKey: quranKeys.surah(surahNumber),
    queryFn: async () => {
      // Try offline first
      try {
        const offlineSurah = await getSurah(surahNumber);
        const offlineAyahs = await getAyahsBySurah(surahNumber);
        if (offlineSurah && offlineAyahs.length > 0) {
          return { surah: offlineSurah, ayahs: offlineAyahs };
        }
      } catch {
        // Continue to fetch online
      }

      // Fetch from API and cache
      const { surah, ayahs } = await fetchSurah(surahNumber);
      try {
        await saveAyahs(ayahs);
      } catch {
        // Ignore cache errors
      }
      return { surah, ayahs };
    },
    staleTime: Infinity,
    enabled: surahNumber >= 1 && surahNumber <= 114,
  });
}

// ===== Ayah Hooks =====

/**
 * Fetch ayahs for a surah
 */
export function useAyahs(surahNumber: number) {
  return useQuery({
    queryKey: quranKeys.ayahs(surahNumber),
    queryFn: async (): Promise<Ayah[]> => {
      // Try offline first
      try {
        const offlineAyahs = await getAyahsBySurah(surahNumber);
        if (offlineAyahs.length > 0) {
          return offlineAyahs;
        }
      } catch {
        // Continue to fetch online
      }

      // Fetch from API
      const { ayahs } = await fetchSurah(surahNumber);
      try {
        await saveAyahs(ayahs);
      } catch {
        // Ignore cache errors
      }
      return ayahs;
    },
    staleTime: Infinity,
    enabled: surahNumber >= 1 && surahNumber <= 114,
  });
}

/**
 * Fetch a single ayah
 */
export function useAyah(surahNumber: number, ayahNumber: number) {
  return useQuery({
    queryKey: quranKeys.ayah(surahNumber, ayahNumber),
    queryFn: async (): Promise<Ayah> => {
      // Try offline first
      try {
        const offlineAyah = await getAyah(surahNumber, ayahNumber);
        if (offlineAyah) {
          return offlineAyah;
        }
      } catch {
        // Continue to fetch online
      }

      return fetchAyah(surahNumber, ayahNumber);
    },
    staleTime: Infinity,
    enabled: surahNumber >= 1 && surahNumber <= 114 && ayahNumber >= 1,
  });
}

/**
 * Fetch words for an ayah (word-by-word data)
 */
export function useAyahWords(surahNumber: number, ayahNumber: number) {
  return useQuery({
    queryKey: quranKeys.words(surahNumber, ayahNumber),
    queryFn: () => fetchWordsForAyah(surahNumber, ayahNumber),
    staleTime: Infinity,
    enabled: surahNumber >= 1 && surahNumber <= 114 && ayahNumber >= 1,
  });
}

// ===== Page Hooks =====

/**
 * Fetch ayahs for a Mushaf page
 */
export function usePage(pageNumber: number) {
  return useQuery({
    queryKey: quranKeys.page(pageNumber),
    queryFn: async (): Promise<Ayah[]> => {
      // Try offline first
      try {
        const offlineAyahs = await getAyahsByPage(pageNumber);
        if (offlineAyahs.length > 0) {
          return offlineAyahs;
        }
      } catch {
        // Continue to fetch online
      }

      return fetchPage(pageNumber);
    },
    staleTime: Infinity,
    enabled: pageNumber >= 1 && pageNumber <= 604,
  });
}

/**
 * Fetch ayahs for a Juz
 */
export function useJuz(juzNumber: number) {
  return useQuery({
    queryKey: quranKeys.juz(juzNumber),
    queryFn: async (): Promise<Ayah[]> => {
      // Try offline first
      try {
        const offlineAyahs = await getAyahsByJuz(juzNumber);
        if (offlineAyahs.length > 0) {
          return offlineAyahs;
        }
      } catch {
        // Continue to fetch online
      }

      return fetchJuz(juzNumber);
    },
    staleTime: Infinity,
    enabled: juzNumber >= 1 && juzNumber <= 30,
  });
}

// ===== Translation Hooks =====

/**
 * Fetch available translations
 */
export function useAvailableTranslations() {
  return useQuery({
    queryKey: quranKeys.translations(),
    queryFn: fetchAvailableTranslations,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Fetch translation for a surah
 */
export function useTranslation(translationId: string, surahNumber: number) {
  return useQuery({
    queryKey: quranKeys.translation(translationId, surahNumber),
    queryFn: () => fetchTranslation(surahNumber, translationId),
    staleTime: Infinity,
    enabled: !!translationId && surahNumber >= 1 && surahNumber <= 114,
  });
}

// ===== Reciter Hooks =====

/**
 * Get available reciters
 */
export function useReciters(): Reciter[] {
  return POPULAR_RECITERS;
}

// ===== Search Hooks =====

/**
 * Search Quran with offline fallback
 */
export function useSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: quranKeys.search(query),
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      // Try online search first
      try {
        return await searchQuran(query);
      } catch {
        // Fall back to offline search
        return searchOffline(query);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && query.length >= 2,
  });
}

// ===== Bookmark Hooks =====

/**
 * Fetch all bookmarks
 */
export function useBookmarks() {
  return useQuery({
    queryKey: quranKeys.bookmarks(),
    queryFn: getBookmarks,
    staleTime: 0, // Always fresh
  });
}

/**
 * Add a bookmark
 */
export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmark: {
      id: string;
      surahNumber: number;
      ayahNumber: number;
      note?: string;
      color?: string;
      folder?: string;
    }) => saveBookmark(bookmark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quranKeys.bookmarks() });
    },
  });
}

/**
 * Delete a bookmark
 */
export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quranKeys.bookmarks() });
    },
  });
}

// ===== Reading Progress Hooks =====

/**
 * Fetch last reading position
 */
export function useReadingProgress() {
  return useQuery({
    queryKey: quranKeys.readingProgress(),
    queryFn: getLastReadPosition,
    staleTime: 0,
  });
}

/**
 * Save reading progress
 */
export function useSaveReadingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      surahNumber,
      ayahNumber,
      pageNumber,
    }: {
      surahNumber: number;
      ayahNumber: number;
      pageNumber: number;
    }) => saveReadingProgress(surahNumber, ayahNumber, pageNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quranKeys.readingProgress() });
    },
  });
}

// ===== Offline Status Hooks =====

/**
 * Check offline data availability
 */
export function useOfflineStatus() {
  return useQuery({
    queryKey: ["offlineStatus"],
    queryFn: hasOfflineData,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Get offline data statistics
 */
export function useOfflineStats() {
  return useQuery({
    queryKey: quranKeys.offlineStats(),
    queryFn: getOfflineStats,
    staleTime: 30 * 1000,
  });
}

// ===== Prefetch Utilities =====

/**
 * Prefetch data for a surah (for faster navigation)
 */
export function usePrefetchSurah() {
  const queryClient = useQueryClient();

  return (surahNumber: number) => {
    queryClient.prefetchQuery({
      queryKey: quranKeys.surah(surahNumber),
      queryFn: () => fetchSurah(surahNumber),
      staleTime: Infinity,
    });
  };
}

/**
 * Prefetch data for a page
 */
export function usePrefetchPage() {
  const queryClient = useQueryClient();

  return (pageNumber: number) => {
    queryClient.prefetchQuery({
      queryKey: quranKeys.page(pageNumber),
      queryFn: () => fetchPage(pageNumber),
      staleTime: Infinity,
    });
  };
}
