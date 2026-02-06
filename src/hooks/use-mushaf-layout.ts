/**
 * Mushaf Layout Hooks
 *
 * React Query hooks for fetching accurate Mushaf page layouts.
 * Provides offline-first support via IndexedDB caching.
 */

import { useCallback } from "react";
import type { MushafEditionId, MushafPage } from "@/types/quran";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchAccuratePageLayout,
  getTotalPages,
  isLayoutAvailable,
} from "@/lib/quran/layout-data";
import { getPageLayout, savePageLayout } from "@/lib/storage/indexed-db";

// ===== Query Keys =====

const layoutKeys = {
  all: ["mushaf", "layout"] as const,
  page: (edition: MushafEditionId, pageNumber: number) =>
    [...layoutKeys.all, edition, pageNumber] as const,
};

// ===== Main Hook =====

/**
 * Fetch accurate page layout with offline-first support
 *
 * @param pageNumber - Page number (1-604 for Madinah, varies by edition)
 * @param edition - Mushaf edition (default: madinah_1421)
 * @param enabled - Whether to enable the query (default: true)
 */
export function useAccuratePage(
  pageNumber: number,
  edition: MushafEditionId = "madinah_1421",
  enabled: boolean = true
) {
  return useQuery({
    queryKey: layoutKeys.page(edition, pageNumber),
    queryFn: async (): Promise<MushafPage> => {
      // Try IndexedDB cache first (offline support)
      try {
        const cached = await getPageLayout(edition, pageNumber);
        if (cached) {
          return cached;
        }
      } catch (error) {
        console.warn("Failed to read from IndexedDB cache:", error);
      }

      // Fetch from remote source
      const page = await fetchAccuratePageLayout(pageNumber, edition);

      // Cache for offline use
      try {
        await savePageLayout(edition, page);
      } catch (error) {
        console.warn("Failed to cache page layout:", error);
      }

      return page;
    },
    enabled: enabled && isLayoutAvailable(edition),
    staleTime: Infinity, // Layout data never changes
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

// ===== Prefetch Hook =====

/**
 * Prefetch adjacent pages for smoother navigation
 */
export function usePrefetchLayout() {
  const queryClient = useQueryClient();

  return useCallback(
    async (pageNumber: number, edition: MushafEditionId = "madinah_1421") => {
      if (!isLayoutAvailable(edition)) return;

      const totalPages = getTotalPages(edition);
      if (pageNumber < 1 || pageNumber > totalPages) return;

      // Prefetch this page
      await queryClient.prefetchQuery({
        queryKey: layoutKeys.page(edition, pageNumber),
        queryFn: async () => {
          // Try cache first
          const cached = await getPageLayout(edition, pageNumber);
          if (cached) return cached;

          // Fetch and cache
          const page = await fetchAccuratePageLayout(pageNumber, edition);
          await savePageLayout(edition, page);
          return page;
        },
        staleTime: Infinity,
      });
    },
    [queryClient]
  );
}

/**
 * Prefetch multiple pages at once
 */
export function usePrefetchLayoutRange() {
  const queryClient = useQueryClient();

  return useCallback(
    async (
      startPage: number,
      endPage: number,
      edition: MushafEditionId = "madinah_1421"
    ) => {
      if (!isLayoutAvailable(edition)) return;

      const totalPages = getTotalPages(edition);
      const pages: number[] = [];

      for (let page = startPage; page <= endPage; page++) {
        if (page >= 1 && page <= totalPages) {
          pages.push(page);
        }
      }

      // Prefetch in parallel with concurrency limit
      const BATCH_SIZE = 5;
      for (let i = 0; i < pages.length; i += BATCH_SIZE) {
        const batch = pages.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map((pageNumber) =>
            queryClient.prefetchQuery({
              queryKey: layoutKeys.page(edition, pageNumber),
              queryFn: async () => {
                const cached = await getPageLayout(edition, pageNumber);
                if (cached) return cached;

                const page = await fetchAccuratePageLayout(pageNumber, edition);
                await savePageLayout(edition, page);
                return page;
              },
              staleTime: Infinity,
            })
          )
        );
      }
    },
    [queryClient]
  );
}

// ===== Utility Hooks =====

/**
 * Check if layout data is available for an edition
 */
export function useLayoutAvailable(edition: MushafEditionId) {
  return isLayoutAvailable(edition);
}

/**
 * Get total pages for an edition
 */
export function useTotalPages(edition: MushafEditionId) {
  return getTotalPages(edition);
}

/**
 * Invalidate cached layout (useful after edition change)
 */
export function useInvalidateLayout() {
  const queryClient = useQueryClient();

  return useCallback(
    (edition?: MushafEditionId, pageNumber?: number) => {
      if (edition && pageNumber) {
        queryClient.invalidateQueries({
          queryKey: layoutKeys.page(edition, pageNumber),
        });
      } else if (edition) {
        queryClient.invalidateQueries({
          queryKey: [...layoutKeys.all, edition],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: layoutKeys.all,
        });
      }
    },
    [queryClient]
  );
}
