"use client";

import { useQuery } from "@tanstack/react-query";

export const similarVerseKeys = {
  all: ["similar-verses"] as const,
  forVerse: (verseKey: string) =>
    [...similarVerseKeys.all, "verse", verseKey] as const,
  list: (page: number) => [...similarVerseKeys.all, "list", { page }] as const,
};

export interface SimilarPairResponse {
  id: string;
  verse1Key: string;
  verse2Key: string;
  similarity: number;
  diffWords: { verse1Only: string[]; verse2Only: string[] };
  category: string;
}

export function useSimilarVerses(verseKey: string) {
  return useQuery({
    queryKey: similarVerseKeys.forVerse(verseKey),
    queryFn: async () => {
      const res = await fetch(
        `/api/quran/similar?verseKey=${encodeURIComponent(verseKey)}`
      );
      if (!res.ok) throw new Error("Failed to fetch similar verses");
      return res.json() as Promise<{
        pairs: SimilarPairResponse[];
        total: number;
      }>;
    },
    enabled: !!verseKey,
  });
}

export function useAllSimilarPairs(page = 1) {
  return useQuery({
    queryKey: similarVerseKeys.list(page),
    queryFn: async () => {
      const res = await fetch(
        `/api/quran/similar?all=true&page=${page}&limit=20`
      );
      if (!res.ok) throw new Error("Failed to fetch similar pairs");
      return res.json() as Promise<{
        pairs: SimilarPairResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>;
    },
    staleTime: 10 * 60 * 1000,
  });
}
