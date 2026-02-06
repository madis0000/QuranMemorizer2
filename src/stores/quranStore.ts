import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  translation?: string;
}

export type MushafEdition =
  | "madinah_1405"
  | "madinah_1421"
  | "madinah_1441"
  | "indopak_15"
  | "indopak_13"
  | "indopak_16"
  | "digital_khatt";

export type ViewMode = "mushaf" | "adaptive" | "split";

interface QuranState {
  // Current position
  currentSurah: number;
  currentAyah: number;
  currentPage: number;
  currentJuz: number;

  // View settings
  mushafEdition: MushafEdition;
  viewMode: ViewMode;
  showTajweed: boolean;
  showTranslation: boolean;
  showTransliteration: boolean;
  translationLanguage: string;
  fontSize: number;

  // Reading progress
  lastReadPosition: {
    surah: number;
    ayah: number;
    page: number;
    timestamp: number;
  } | null;

  // Actions
  setCurrentPosition: (surah: number, ayah: number) => void;
  setCurrentPage: (page: number) => void;
  setMushafEdition: (edition: MushafEdition) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTajweed: () => void;
  toggleTranslation: () => void;
  toggleTransliteration: () => void;
  setTranslationLanguage: (lang: string) => void;
  setFontSize: (size: number) => void;
  saveReadingPosition: () => void;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSurah: 1,
      currentAyah: 1,
      currentPage: 1,
      currentJuz: 1,

      mushafEdition: "madinah_1421",
      viewMode: "mushaf",
      showTajweed: true,
      showTranslation: false,
      showTransliteration: false,
      translationLanguage: "en",
      fontSize: 24,

      lastReadPosition: null,

      // Actions
      setCurrentPosition: (surah, ayah) =>
        set({ currentSurah: surah, currentAyah: ayah }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setMushafEdition: (edition) => set({ mushafEdition: edition }),

      setViewMode: (mode) => set({ viewMode: mode }),

      toggleTajweed: () =>
        set((state) => ({ showTajweed: !state.showTajweed })),

      toggleTranslation: () =>
        set((state) => ({ showTranslation: !state.showTranslation })),

      toggleTransliteration: () =>
        set((state) => ({ showTransliteration: !state.showTransliteration })),

      setTranslationLanguage: (lang) => set({ translationLanguage: lang }),

      setFontSize: (size) =>
        set({ fontSize: Math.max(16, Math.min(48, size)) }),

      saveReadingPosition: () => {
        const state = get();
        set({
          lastReadPosition: {
            surah: state.currentSurah,
            ayah: state.currentAyah,
            page: state.currentPage,
            timestamp: Date.now(),
          },
        });
      },
    }),
    {
      name: "quran-store",
      partialize: (state) => ({
        mushafEdition: state.mushafEdition,
        viewMode: state.viewMode,
        showTajweed: state.showTajweed,
        showTranslation: state.showTranslation,
        showTransliteration: state.showTransliteration,
        translationLanguage: state.translationLanguage,
        fontSize: state.fontSize,
        lastReadPosition: state.lastReadPosition,
      }),
    }
  )
);
