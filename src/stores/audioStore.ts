import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RepeatMode = "none" | "ayah" | "surah" | "page";

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  audioBaseUrl: string;
}

interface AudioState {
  // Player state
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;

  // Playback settings
  playbackSpeed: number;
  repeatMode: RepeatMode;
  autoPlay: boolean;

  // Current track
  currentReciter: string;
  currentSurah: number;
  currentAyah: number;

  // Reciter list (cached)
  reciters: Reciter[];

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleAutoPlay: () => void;
  setCurrentReciter: (reciterId: string) => void;
  setCurrentTrack: (surah: number, ayah: number) => void;
  setReciters: (reciters: Reciter[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      // Initial state
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,

      playbackSpeed: 1,
      repeatMode: "none",
      autoPlay: true,

      currentReciter: "ar.alafasy", // Mishary Rashid Alafasy
      currentSurah: 1,
      currentAyah: 1,

      reciters: [],

      // Actions
      play: () => set({ isPlaying: true }),

      pause: () => set({ isPlaying: false }),

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (duration) => set({ duration }),

      setVolume: (volume) =>
        set({ volume: Math.max(0, Math.min(1, volume)), isMuted: false }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setPlaybackSpeed: (speed) =>
        set({ playbackSpeed: Math.max(0.5, Math.min(2, speed)) }),

      setRepeatMode: (mode) => set({ repeatMode: mode }),

      toggleAutoPlay: () => set((state) => ({ autoPlay: !state.autoPlay })),

      setCurrentReciter: (reciterId) => set({ currentReciter: reciterId }),

      setCurrentTrack: (surah, ayah) =>
        set({ currentSurah: surah, currentAyah: ayah }),

      setReciters: (reciters) => set({ reciters }),

      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "audio-store",
      partialize: (state) => ({
        volume: state.volume,
        playbackSpeed: state.playbackSpeed,
        repeatMode: state.repeatMode,
        autoPlay: state.autoPlay,
        currentReciter: state.currentReciter,
      }),
    }
  )
);
