"use client";

import { useMemo } from "react";
import type { Ayah } from "@/types/quran";

import { useAyahs } from "@/hooks/use-quran";
import { useSessionStore, type VerseRef } from "@/stores/sessionStore";

interface MemorizeVerseResult {
  currentAyah: Ayah | undefined;
  previousAyah: Ayah | undefined;
  nextAyah: Ayah | undefined;
  currentWords: string[];
  currentText: string;
  currentSurahNumber: number;
  currentAyahNumber: number;
  /** For cross-surah modes: which surah we're currently in */
  currentSurahName: string | undefined;
  isLoading: boolean;
  /** Total verse count for this session */
  totalVerses: number;
  /** Current position (1-based) in the verse list */
  currentPosition: number;
  /** Whether this mode uses a verse list (juz/hizb/subject) */
  isCrossSurah: boolean;
}

/**
 * Resolves the current verse for any memorization mode.
 *
 * - For ayah/surah mode: uses surahNumber + currentAyah from session
 * - For juz/hizb/subject: resolves from verseList[currentVerseIndex]
 * - Handles cross-surah data fetching with useAyahs() caching
 */
export function useMemorizeVerse(): MemorizeVerseResult {
  const session = useSessionStore();
  const {
    isActive,
    surahNumber,
    currentAyah: currentAyahNum,
    startAyah,
    endAyah,
    verseList,
    currentVerseIndex,
    targetType,
  } = session;

  const isCrossSurah = verseList.length > 0;

  // For cross-surah modes, determine current verse from the verseList
  const resolvedSurah = isCrossSurah
    ? (verseList[currentVerseIndex]?.surahNumber ?? surahNumber)
    : surahNumber;

  const resolvedAyah = isCrossSurah
    ? (verseList[currentVerseIndex]?.ayahNumber ?? currentAyahNum)
    : currentAyahNum;

  // Fetch ayahs for the resolved surah
  const { data: ayahsData, isLoading } = useAyahs(isActive ? resolvedSurah : 0);
  const ayahs: Ayah[] = useMemo(() => ayahsData ?? [], [ayahsData]);

  // Find current, previous, and next ayahs
  const currentAyah = ayahs.find((a) => a.numberInSurah === resolvedAyah);

  // For cross-surah, previous/next might be in a different surah
  // We only resolve within the current surah's data for simplicity
  const previousAyah = useMemo(() => {
    if (isCrossSurah) {
      // Previous verse might be in the same surah
      const prevIndex = currentVerseIndex - 1;
      if (prevIndex >= 0) {
        const prev = verseList[prevIndex];
        if (prev.surahNumber === resolvedSurah) {
          return ayahs.find((a) => a.numberInSurah === prev.ayahNumber);
        }
      }
      return undefined;
    }
    return ayahs.find((a) => a.numberInSurah === resolvedAyah - 1);
  }, [
    ayahs,
    resolvedAyah,
    isCrossSurah,
    currentVerseIndex,
    verseList,
    resolvedSurah,
  ]);

  const nextAyah = useMemo(() => {
    if (isCrossSurah) {
      const nextIndex = currentVerseIndex + 1;
      if (nextIndex < verseList.length) {
        const next = verseList[nextIndex];
        if (next.surahNumber === resolvedSurah) {
          return ayahs.find((a) => a.numberInSurah === next.ayahNumber);
        }
      }
      return undefined;
    }
    return ayahs.find((a) => a.numberInSurah === resolvedAyah + 1);
  }, [
    ayahs,
    resolvedAyah,
    isCrossSurah,
    currentVerseIndex,
    verseList,
    resolvedSurah,
  ]);

  const currentWords = currentAyah?.text?.split(/\s+/).filter(Boolean) ?? [];
  const currentText = currentAyah?.text ?? "";

  const totalVerses = isCrossSurah ? verseList.length : endAyah - startAyah + 1;

  const currentPosition = isCrossSurah
    ? currentVerseIndex + 1
    : resolvedAyah - startAyah + 1;

  return {
    currentAyah,
    previousAyah,
    nextAyah,
    currentWords,
    currentText,
    currentSurahNumber: resolvedSurah,
    currentAyahNumber: resolvedAyah,
    currentSurahName: undefined, // Will be resolved by the toolbar from surahs list
    isLoading,
    totalVerses,
    currentPosition,
    isCrossSurah,
  };
}

/**
 * Build a verseList from juz data (fetched ayahs).
 * Used at session start time to populate verseList for juz/hizb modes.
 */
export function buildVerseListFromAyahs(
  ayahs: Ayah[],
  surahNumber: number
): VerseRef[] {
  return ayahs.map((a) => ({
    surahNumber,
    ayahNumber: a.numberInSurah,
  }));
}
