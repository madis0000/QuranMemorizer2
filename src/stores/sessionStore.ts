import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MemorizeMode } from "./quranStore";

export type SessionMode = "read" | "memorize" | "listen" | "review";
export type RevealMode = "word" | "phrase" | "ayah" | "line";
export type MistakeSensitivity = "strict" | "normal" | "lenient";

export type HideMode =
  | "full_hide" // All words hidden (current behavior)
  | "first_letter" // Show only first Arabic letter of each word
  | "random_blank" // Progressive: hide 20%→40%→60%→80%→100%
  | "translation_recall" // Show translation, recite Arabic
  | "audio_recall" // Play audio, recite without text
  | "reverse_recall" // Given last word, recite previous verse
  | "context_recall" // Show surrounding verses, fill missing one
  | "keyword_mode"; // Only show content words, hide particles

export interface Mistake {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  wordIndex: number;
  type: "wrong_word" | "skipped" | "added" | "tashkeel" | "order";
  recitedText: string | null;
  correctText: string;
  severity: "minor" | "major";
  timestamp: number;
}

export interface VerseRef {
  surahNumber: number;
  ayahNumber: number;
}

export interface AyahAttempt {
  surahNumber: number;
  ayahNumber: number;
  attempts: number;
  bestAccuracy: number;
  lastAccuracy: number;
  totalTime: number; // ms spent on this ayah
  fsrsRating?: 1 | 2 | 3 | 4; // user's self-rating (Again/Hard/Good/Easy)
  completedAt?: number;
}

export interface StartSessionConfig {
  mode: SessionMode;
  targetType: MemorizeMode;
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  verseList?: VerseRef[];
  juzNumber?: number;
  hizbNumber?: number;
  subjectId?: string;
  pageNumber?: number;
}

export interface DBSessionSnapshot {
  currentAyah: number;
  currentVerseIndex: number;
  currentPageNumber: number;
  mushafCurrentAyahKey: string | null;
  revealedWordKeys: string[];
  revealedWords: number[];
  wordsRecited: number;
  correctWords: number;
  mistakes: Mistake[];
  verseList: VerseRef[];
  revealMode: RevealMode;
  hideMode: HideMode;
  hideDifficulty: number;
  mistakeSensitivity: MistakeSensitivity;
  isHidden: boolean;
  targetId: number | string;
  juzNumber: number | null;
  hizbNumber: number | null;
  subjectId: string | null;
}

export interface DBSessionData {
  id: string;
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  pageNumber: number | null;
  mode: string;
  targetType: string | null;
  duration: number;
  stateSnapshot: DBSessionSnapshot | null;
}

interface SessionState {
  // Session info
  isActive: boolean;
  mode: SessionMode;
  startTime: number | null;

  // DB session ID for sync
  activeSessionId: string | null;

  // Target type (which memorize mode started this)
  targetType: MemorizeMode;
  targetId: number | string;

  // Target range
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  currentAyah: number;

  // Cross-surah support
  verseList: VerseRef[];
  currentVerseIndex: number;
  juzNumber: number | null;
  hizbNumber: number | null;
  subjectId: string | null;

  // Mushaf mode state
  currentPageNumber: number;
  mushafCurrentAyahKey: string | null; // e.g. "2:255"
  revealedWordKeys: Set<string>; // mushaf-mode revealed word keys

  // Memorization settings
  revealMode: RevealMode;
  hideMode: HideMode;
  hideDifficulty: number; // 1-5 for random_blank progression
  mistakeSensitivity: MistakeSensitivity;
  isHidden: boolean;
  revealedWords: number[];

  // Progress
  wordsRecited: number;
  correctWords: number;
  mistakes: Mistake[];

  // Per-ayah tracking (key: "surah:ayah")
  ayahHistory: Record<string, AyahAttempt>;

  // Combo system
  combo: number;
  maxCombo: number;

  // Focus mode
  isFocusMode: boolean;

  // Bookmarked/skipped ayahs
  bookmarkedAyahs: VerseRef[];
  skippedAyahs: VerseRef[];

  // Recording
  isRecording: boolean;
  audioChunks: Blob[];

  // Actions
  startSession: (config: StartSessionConfig) => void;
  /** @deprecated Use startSession(config) instead */
  startSessionLegacy: (
    mode: SessionMode,
    surah: number,
    startAyah: number,
    endAyah: number
  ) => void;
  endSession: () => SessionSummary | null;
  discardSession: () => void;
  setActiveSessionId: (id: string | null) => void;
  loadFromSnapshot: (dbSession: DBSessionData) => void;

  setCurrentAyah: (ayah: number) => void;
  nextAyah: () => void;
  previousAyah: () => void;
  nextVerse: () => void;
  previousVerse: () => void;

  setRevealMode: (mode: RevealMode) => void;
  setHideMode: (mode: HideMode) => void;
  setHideDifficulty: (level: number) => void;
  setMistakeSensitivity: (sensitivity: MistakeSensitivity) => void;
  toggleHidden: () => void;
  revealWord: (wordIndex: number) => void;
  revealAll: () => void;
  resetRevealed: () => void;

  addMistake: (mistake: Omit<Mistake, "id" | "timestamp">) => void;
  incrementWordsRecited: (correct: boolean) => void;

  // Per-ayah tracking & combo
  recordAyahAttempt: (key: string, accuracy: number, timeMs: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setFocusMode: (on: boolean) => void;
  bookmarkCurrentAyah: () => void;
  skipCurrentAyah: () => void;
  navigateToVerse: (surah: number, ayah: number) => void;
  setFSRSRating: (key: string, rating: 1 | 2 | 3 | 4) => void;

  // Mushaf mode actions
  setCurrentPageNumber: (page: number) => void;
  setMushafCurrentAyahKey: (key: string | null) => void;
  revealWordKey: (wordKey: string) => void;
  resetRevealedWordKeys: () => void;

  startRecording: () => void;
  stopRecording: () => void;
  addAudioChunk: (chunk: Blob) => void;
  clearAudioChunks: () => void;
}

export interface SessionSummary {
  mode: SessionMode;
  targetType: MemorizeMode;
  duration: number; // seconds
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  wordsRecited: number;
  correctWords: number;
  accuracy: number;
  mistakes: Mistake[];
  juzNumber: number | null;
  hizbNumber: number | null;
  subjectId: string | null;
  versesCompleted: number;
  totalVerses: number;
  // Enhanced summary fields
  ayahHistory: Record<string, AyahAttempt>;
  maxCombo: number;
  weakAyahs: AyahAttempt[]; // accuracy < 70%
  perfectAyahs: AyahAttempt[]; // accuracy >= 95%
  bookmarkedAyahs: VerseRef[];
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // Initial state
      isActive: false,
      mode: "memorize",
      startTime: null,

      activeSessionId: null,

      targetType: "ayah",
      targetId: 0,

      surahNumber: 1,
      startAyah: 1,
      endAyah: 7,
      currentAyah: 1,

      verseList: [],
      currentVerseIndex: 0,
      juzNumber: null,
      hizbNumber: null,
      subjectId: null,

      currentPageNumber: 1,
      mushafCurrentAyahKey: null,
      revealedWordKeys: new Set<string>(),

      revealMode: "word",
      hideMode: "full_hide",
      hideDifficulty: 3,
      mistakeSensitivity: "normal",
      isHidden: true,
      revealedWords: [],

      wordsRecited: 0,
      correctWords: 0,
      mistakes: [],

      ayahHistory: {},
      combo: 0,
      maxCombo: 0,
      isFocusMode: false,
      bookmarkedAyahs: [],
      skippedAyahs: [],

      isRecording: false,
      audioChunks: [],

      // Actions
      startSession: (config) =>
        set({
          isActive: true,
          mode: config.mode,
          startTime: Date.now(),
          targetType: config.targetType,
          targetId:
            config.juzNumber ??
            config.hizbNumber ??
            config.subjectId ??
            config.pageNumber ??
            config.surahNumber,
          surahNumber: config.surahNumber,
          startAyah: config.startAyah,
          endAyah: config.endAyah,
          currentAyah: config.startAyah,
          verseList: config.verseList ?? [],
          currentVerseIndex: 0,
          juzNumber: config.juzNumber ?? null,
          hizbNumber: config.hizbNumber ?? null,
          subjectId: config.subjectId ?? null,
          currentPageNumber: config.pageNumber ?? 1,
          mushafCurrentAyahKey: null,
          revealedWordKeys: new Set<string>(),
          wordsRecited: 0,
          correctWords: 0,
          mistakes: [],
          revealedWords: [],
          isHidden: config.mode === "memorize",
          ayahHistory: {},
          combo: 0,
          maxCombo: 0,
          isFocusMode: false,
          bookmarkedAyahs: [],
          skippedAyahs: [],
        }),

      startSessionLegacy: (mode, surah, startAyah, endAyah) =>
        get().startSession({
          mode,
          targetType: "ayah",
          surahNumber: surah,
          startAyah,
          endAyah,
        }),

      endSession: () => {
        const state = get();
        if (!state.isActive || !state.startTime) return null;

        const duration = Math.floor((Date.now() - state.startTime) / 1000);
        const accuracy =
          state.wordsRecited > 0
            ? Math.round((state.correctWords / state.wordsRecited) * 100)
            : 0;

        const versesCompleted =
          state.verseList.length > 0
            ? state.currentVerseIndex + 1
            : state.currentAyah - state.startAyah + 1;

        // For mushaf mode, total = completed (user stops when they want).
        // For juz/hizb/subject with verseList, total = verseList length.
        // For ayah/surah, total = full ayah range.
        const totalVerses =
          state.verseList.length > 0
            ? state.verseList.length
            : state.targetType === "mushaf"
              ? versesCompleted
              : state.endAyah - state.startAyah + 1;

        const ayahHistoryCopy = { ...state.ayahHistory };
        const allAttempts = Object.values(ayahHistoryCopy);
        const weakAyahs = allAttempts.filter((a) => a.bestAccuracy < 70);
        const perfectAyahs = allAttempts.filter((a) => a.bestAccuracy >= 95);

        const summary: SessionSummary = {
          mode: state.mode,
          targetType: state.targetType,
          duration,
          surahNumber: state.surahNumber,
          startAyah: state.startAyah,
          endAyah: state.endAyah,
          wordsRecited: state.wordsRecited,
          correctWords: state.correctWords,
          accuracy,
          mistakes: [...state.mistakes],
          juzNumber: state.juzNumber,
          hizbNumber: state.hizbNumber,
          subjectId: state.subjectId,
          versesCompleted,
          totalVerses,
          ayahHistory: ayahHistoryCopy,
          maxCombo: state.maxCombo,
          weakAyahs,
          perfectAyahs,
          bookmarkedAyahs: [...state.bookmarkedAyahs],
        };

        set({
          isActive: false,
          startTime: null,
          activeSessionId: null,
          verseList: [],
          currentVerseIndex: 0,
          juzNumber: null,
          hizbNumber: null,
          subjectId: null,
          currentPageNumber: 1,
          mushafCurrentAyahKey: null,
          revealedWordKeys: new Set<string>(),
          wordsRecited: 0,
          correctWords: 0,
          mistakes: [],
          revealedWords: [],
          audioChunks: [],
          ayahHistory: {},
          combo: 0,
          maxCombo: 0,
          isFocusMode: false,
          bookmarkedAyahs: [],
          skippedAyahs: [],
        });

        return summary;
      },

      discardSession: () =>
        set({
          isActive: false,
          mode: "memorize",
          startTime: null,
          activeSessionId: null,
          targetType: "ayah",
          targetId: 0,
          surahNumber: 1,
          startAyah: 1,
          endAyah: 7,
          currentAyah: 1,
          verseList: [],
          currentVerseIndex: 0,
          juzNumber: null,
          hizbNumber: null,
          subjectId: null,
          currentPageNumber: 1,
          mushafCurrentAyahKey: null,
          revealedWordKeys: new Set<string>(),
          revealMode: "word",
          hideMode: "full_hide",
          hideDifficulty: 3,
          mistakeSensitivity: "normal",
          isHidden: true,
          revealedWords: [],
          wordsRecited: 0,
          correctWords: 0,
          mistakes: [],
          isRecording: false,
          audioChunks: [],
          ayahHistory: {},
          combo: 0,
          maxCombo: 0,
          isFocusMode: false,
          bookmarkedAyahs: [],
          skippedAyahs: [],
        }),

      setActiveSessionId: (id) => set({ activeSessionId: id }),

      loadFromSnapshot: (dbSession) => {
        const snap = dbSession.stateSnapshot;
        set({
          isActive: true,
          mode: (dbSession.mode?.toLowerCase() as SessionMode) ?? "memorize",
          startTime: Date.now(), // restart timer from now
          activeSessionId: dbSession.id,
          targetType: (dbSession.targetType as MemorizeMode) ?? "ayah",
          targetId: snap?.targetId ?? dbSession.surahNumber,
          surahNumber: dbSession.surahNumber,
          startAyah: dbSession.startAyah,
          endAyah: dbSession.endAyah,
          currentAyah: snap?.currentAyah ?? dbSession.startAyah,
          verseList: snap?.verseList ?? [],
          currentVerseIndex: snap?.currentVerseIndex ?? 0,
          juzNumber: snap?.juzNumber ?? null,
          hizbNumber: snap?.hizbNumber ?? null,
          subjectId: snap?.subjectId ?? null,
          currentPageNumber:
            snap?.currentPageNumber ?? dbSession.pageNumber ?? 1,
          mushafCurrentAyahKey: snap?.mushafCurrentAyahKey ?? null,
          revealedWordKeys: new Set<string>(snap?.revealedWordKeys ?? []),
          revealMode: snap?.revealMode ?? "word",
          hideMode: snap?.hideMode ?? "full_hide",
          hideDifficulty: snap?.hideDifficulty ?? 3,
          mistakeSensitivity: snap?.mistakeSensitivity ?? "normal",
          isHidden: snap?.isHidden ?? true,
          revealedWords: snap?.revealedWords ?? [],
          wordsRecited: snap?.wordsRecited ?? 0,
          correctWords: snap?.correctWords ?? 0,
          mistakes: snap?.mistakes ?? [],
        });
      },

      setCurrentAyah: (ayah) => set({ currentAyah: ayah, revealedWords: [] }),

      nextAyah: () =>
        set((state) => ({
          currentAyah: Math.min(state.currentAyah + 1, state.endAyah),
          revealedWords: [],
        })),

      previousAyah: () =>
        set((state) => ({
          currentAyah: Math.max(state.currentAyah - 1, state.startAyah),
          revealedWords: [],
        })),

      nextVerse: () =>
        set((state) => {
          if (state.verseList.length === 0) {
            // Fallback to nextAyah behavior
            return {
              currentAyah: Math.min(state.currentAyah + 1, state.endAyah),
              revealedWords: [],
            };
          }
          const nextIndex = Math.min(
            state.currentVerseIndex + 1,
            state.verseList.length - 1
          );
          const nextVerse = state.verseList[nextIndex];
          return {
            currentVerseIndex: nextIndex,
            surahNumber: nextVerse.surahNumber,
            currentAyah: nextVerse.ayahNumber,
            revealedWords: [],
          };
        }),

      previousVerse: () =>
        set((state) => {
          if (state.verseList.length === 0) {
            return {
              currentAyah: Math.max(state.currentAyah - 1, state.startAyah),
              revealedWords: [],
            };
          }
          const prevIndex = Math.max(state.currentVerseIndex - 1, 0);
          const prevVerse = state.verseList[prevIndex];
          return {
            currentVerseIndex: prevIndex,
            surahNumber: prevVerse.surahNumber,
            currentAyah: prevVerse.ayahNumber,
            revealedWords: [],
          };
        }),

      setRevealMode: (mode) => set({ revealMode: mode }),

      setHideMode: (mode) => set({ hideMode: mode }),

      setHideDifficulty: (level) => set({ hideDifficulty: level }),

      setMistakeSensitivity: (sensitivity) =>
        set({ mistakeSensitivity: sensitivity }),

      toggleHidden: () => set((state) => ({ isHidden: !state.isHidden })),

      revealWord: (wordIndex) =>
        set((state) => ({
          revealedWords: state.revealedWords.includes(wordIndex)
            ? state.revealedWords
            : [...state.revealedWords, wordIndex],
        })),

      revealAll: () => set({ isHidden: false }),

      resetRevealed: () => set({ revealedWords: [], isHidden: true }),

      addMistake: (mistake) =>
        set((state) => ({
          mistakes: [
            ...state.mistakes,
            {
              ...mistake,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
          ],
        })),

      incrementWordsRecited: (correct) =>
        set((state) => ({
          wordsRecited: state.wordsRecited + 1,
          correctWords: correct ? state.correctWords + 1 : state.correctWords,
        })),

      // Per-ayah tracking & combo
      recordAyahAttempt: (key, accuracy, timeMs) =>
        set((state) => {
          const existing = state.ayahHistory[key];
          const attempt: AyahAttempt = existing
            ? {
                ...existing,
                attempts: existing.attempts + 1,
                bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
                lastAccuracy: accuracy,
                totalTime: existing.totalTime + timeMs,
                completedAt: Date.now(),
              }
            : {
                surahNumber: parseInt(key.split(":")[0]) || 0,
                ayahNumber: parseInt(key.split(":")[1]) || 0,
                attempts: 1,
                bestAccuracy: accuracy,
                lastAccuracy: accuracy,
                totalTime: timeMs,
                completedAt: Date.now(),
              };
          return {
            ayahHistory: { ...state.ayahHistory, [key]: attempt },
          };
        }),

      incrementCombo: () =>
        set((state) => {
          const newCombo = state.combo + 1;
          return {
            combo: newCombo,
            maxCombo: Math.max(state.maxCombo, newCombo),
          };
        }),

      resetCombo: () => set({ combo: 0 }),

      setFocusMode: (on) => set({ isFocusMode: on }),

      bookmarkCurrentAyah: () =>
        set((state) => {
          const ref = {
            surahNumber: state.surahNumber,
            ayahNumber: state.currentAyah,
          };
          const exists = state.bookmarkedAyahs.some(
            (b) =>
              b.surahNumber === ref.surahNumber &&
              b.ayahNumber === ref.ayahNumber
          );
          if (exists) return state;
          return { bookmarkedAyahs: [...state.bookmarkedAyahs, ref] };
        }),

      skipCurrentAyah: () =>
        set((state) => {
          const ref = {
            surahNumber: state.surahNumber,
            ayahNumber: state.currentAyah,
          };
          const exists = state.skippedAyahs.some(
            (s) =>
              s.surahNumber === ref.surahNumber &&
              s.ayahNumber === ref.ayahNumber
          );
          if (exists) return state;
          return { skippedAyahs: [...state.skippedAyahs, ref] };
        }),

      navigateToVerse: (surah, ayah) =>
        set((state) => {
          // Mid-session jump to any verse
          const newState: Partial<SessionState> = {
            surahNumber: surah,
            currentAyah: ayah,
            revealedWords: [],
            mushafCurrentAyahKey: null,
            revealedWordKeys: new Set<string>(),
          };
          // Extend range if outside current bounds
          if (surah !== state.surahNumber) {
            newState.startAyah = 1;
            newState.endAyah = 999; // Will be clamped by actual surah length
          } else {
            if (ayah < state.startAyah) newState.startAyah = ayah;
            if (ayah > state.endAyah) newState.endAyah = ayah;
          }
          return newState;
        }),

      setFSRSRating: (key, rating) =>
        set((state) => {
          const existing = state.ayahHistory[key];
          if (!existing) return state;
          return {
            ayahHistory: {
              ...state.ayahHistory,
              [key]: { ...existing, fsrsRating: rating },
            },
          };
        }),

      // Mushaf mode actions
      setCurrentPageNumber: (page) => set({ currentPageNumber: page }),

      setMushafCurrentAyahKey: (key) => set({ mushafCurrentAyahKey: key }),

      revealWordKey: (wordKey) =>
        set((state) => {
          const next = new Set(state.revealedWordKeys);
          next.add(wordKey);
          return { revealedWordKeys: next };
        }),

      resetRevealedWordKeys: () => set({ revealedWordKeys: new Set<string>() }),

      startRecording: () => set({ isRecording: true }),

      stopRecording: () => set({ isRecording: false }),

      addAudioChunk: (chunk) =>
        set((state) => ({ audioChunks: [...state.audioChunks, chunk] })),

      clearAudioChunks: () => set({ audioChunks: [] }),
    }),
    {
      name: "session-storage",
      partialize: (state) => ({
        isActive: state.isActive,
        mode: state.mode,
        startTime: state.startTime,
        activeSessionId: state.activeSessionId,
        targetType: state.targetType,
        targetId: state.targetId,
        surahNumber: state.surahNumber,
        startAyah: state.startAyah,
        endAyah: state.endAyah,
        currentAyah: state.currentAyah,
        verseList: state.verseList,
        currentVerseIndex: state.currentVerseIndex,
        juzNumber: state.juzNumber,
        hizbNumber: state.hizbNumber,
        subjectId: state.subjectId,
        currentPageNumber: state.currentPageNumber,
        mushafCurrentAyahKey: state.mushafCurrentAyahKey,
        revealedWordKeys: Array.from(state.revealedWordKeys),
        revealMode: state.revealMode,
        hideMode: state.hideMode,
        hideDifficulty: state.hideDifficulty,
        mistakeSensitivity: state.mistakeSensitivity,
        isHidden: state.isHidden,
        revealedWords: state.revealedWords,
        wordsRecited: state.wordsRecited,
        correctWords: state.correctWords,
        mistakes: state.mistakes,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Record<string, unknown>),
        // Rehydrate Set from persisted array
        revealedWordKeys: new Set<string>(
          ((persisted as Record<string, unknown>)
            ?.revealedWordKeys as string[]) ?? []
        ),
        // Hardware state — always reset
        isRecording: false,
        audioChunks: [],
      }),
    }
  )
);
