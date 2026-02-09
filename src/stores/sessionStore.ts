import { create } from "zustand";

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

interface SessionState {
  // Session info
  isActive: boolean;
  mode: SessionMode;
  startTime: number | null;

  // Target range
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  currentAyah: number;

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

  // Recording
  isRecording: boolean;
  audioChunks: Blob[];

  // Actions
  startSession: (
    mode: SessionMode,
    surah: number,
    startAyah: number,
    endAyah: number
  ) => void;
  endSession: () => SessionSummary | null;

  setCurrentAyah: (ayah: number) => void;
  nextAyah: () => void;
  previousAyah: () => void;

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

  startRecording: () => void;
  stopRecording: () => void;
  addAudioChunk: (chunk: Blob) => void;
  clearAudioChunks: () => void;
}

export interface SessionSummary {
  mode: SessionMode;
  duration: number; // seconds
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  wordsRecited: number;
  correctWords: number;
  accuracy: number;
  mistakes: Mistake[];
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  isActive: false,
  mode: "memorize",
  startTime: null,

  surahNumber: 1,
  startAyah: 1,
  endAyah: 7,
  currentAyah: 1,

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

  // Actions
  startSession: (mode, surah, startAyah, endAyah) =>
    set({
      isActive: true,
      mode,
      startTime: Date.now(),
      surahNumber: surah,
      startAyah,
      endAyah,
      currentAyah: startAyah,
      wordsRecited: 0,
      correctWords: 0,
      mistakes: [],
      revealedWords: [],
      isHidden: mode === "memorize",
    }),

  endSession: () => {
    const state = get();
    if (!state.isActive || !state.startTime) return null;

    const duration = Math.floor((Date.now() - state.startTime) / 1000);
    const accuracy =
      state.wordsRecited > 0
        ? Math.round((state.correctWords / state.wordsRecited) * 100)
        : 0;

    const summary: SessionSummary = {
      mode: state.mode,
      duration,
      surahNumber: state.surahNumber,
      startAyah: state.startAyah,
      endAyah: state.endAyah,
      wordsRecited: state.wordsRecited,
      correctWords: state.correctWords,
      accuracy,
      mistakes: [...state.mistakes],
    };

    set({
      isActive: false,
      startTime: null,
      wordsRecited: 0,
      correctWords: 0,
      mistakes: [],
      revealedWords: [],
      audioChunks: [],
    });

    return summary;
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

  startRecording: () => set({ isRecording: true }),

  stopRecording: () => set({ isRecording: false }),

  addAudioChunk: (chunk) =>
    set((state) => ({ audioChunks: [...state.audioChunks, chunk] })),

  clearAudioChunks: () => set({ audioChunks: [] }),
}));
