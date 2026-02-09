"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  AudioPlayer,
  destroyAudioPlayer,
  getAudioPlayer,
  type AudioPlayerState,
} from "@/lib/audio/player";
import { useAudioStore, type RepeatMode } from "@/stores/audioStore";

/**
 * useAudioPlayer bridges the AudioPlayer singleton with the Zustand
 * audioStore. It initializes the player on mount, syncs state changes
 * from the player into the store, and exposes convenient action methods.
 *
 * This hook must be used within a client component (it accesses browser
 * APIs and uses React hooks).
 */
export function useAudioPlayer() {
  const playerRef = useRef<AudioPlayer | null>(null);

  // Select individual values from the store to minimize re-renders.
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const isLoading = useAudioStore((s) => s.isLoading);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const volume = useAudioStore((s) => s.volume);
  const isMuted = useAudioStore((s) => s.isMuted);
  const playbackSpeed = useAudioStore((s) => s.playbackSpeed);
  const repeatMode = useAudioStore((s) => s.repeatMode);
  const autoPlay = useAudioStore((s) => s.autoPlay);
  const currentReciter = useAudioStore((s) => s.currentReciter);
  const currentSurah = useAudioStore((s) => s.currentSurah);
  const currentAyah = useAudioStore((s) => s.currentAyah);

  // Store actions (these are stable references from Zustand)
  const storePlay = useAudioStore((s) => s.play);
  const storePause = useAudioStore((s) => s.pause);
  const storeSetCurrentTime = useAudioStore((s) => s.setCurrentTime);
  const storeSetDuration = useAudioStore((s) => s.setDuration);
  const storeSetCurrentTrack = useAudioStore((s) => s.setCurrentTrack);
  const storeSetIsLoading = useAudioStore((s) => s.setIsLoading);
  const storeSetVolume = useAudioStore((s) => s.setVolume);
  const storeSetPlaybackSpeed = useAudioStore((s) => s.setPlaybackSpeed);
  const storeSetRepeatMode = useAudioStore((s) => s.setRepeatMode);

  // ===== State change handler =====
  // This callback receives every state update from the AudioPlayer and
  // pushes the values into the Zustand store.

  const handleStateChange = useCallback(
    (state: AudioPlayerState) => {
      if (state.isPlaying) {
        storePlay();
      } else {
        storePause();
      }

      storeSetIsLoading(state.isLoading);
      storeSetCurrentTime(state.currentTime);
      storeSetDuration(state.duration);

      if (state.currentSurah > 0 && state.currentAyah > 0) {
        storeSetCurrentTrack(state.currentSurah, state.currentAyah);
      }
    },
    [
      storePlay,
      storePause,
      storeSetIsLoading,
      storeSetCurrentTime,
      storeSetDuration,
      storeSetCurrentTrack,
    ]
  );

  // ===== Initialize player on mount =====

  useEffect(() => {
    const player = getAudioPlayer(handleStateChange);
    playerRef.current = player;

    // Apply persisted settings from the store
    const state = useAudioStore.getState();
    player.setVolume(state.volume);
    player.setPlaybackSpeed(state.playbackSpeed);
    player.setMuted(state.isMuted);
    player.setRepeatMode(state.repeatMode);
    player.setAutoPlay(state.autoPlay);

    return () => {
      // On unmount, destroy the singleton to release resources.
      destroyAudioPlayer();
      playerRef.current = null;
    };
  }, [handleStateChange]);

  // ===== Sync store changes to player =====

  // Keep the player in sync when store values change externally
  // (e.g., from the settings UI).

  useEffect(() => {
    playerRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    playerRef.current?.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    playerRef.current?.setPlaybackSpeed(playbackSpeed);
  }, [playbackSpeed]);

  useEffect(() => {
    playerRef.current?.setRepeatMode(repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    playerRef.current?.setAutoPlay(autoPlay);
  }, [autoPlay]);

  // ===== Action Methods =====

  const playAyah = useCallback(
    (surah: number, ayah: number) => {
      playerRef.current?.playAyah(currentReciter, surah, ayah);
    },
    [currentReciter]
  );

  const playRange = useCallback(
    (surah: number, startAyah: number, endAyah: number) => {
      playerRef.current?.playRange(currentReciter, surah, startAyah, endAyah);
    },
    [currentReciter]
  );

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.resume();
    }
  }, [isPlaying]);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const next = useCallback(() => {
    playerRef.current?.next();
  }, []);

  const previous = useCallback(() => {
    playerRef.current?.previous();
  }, []);

  const stop = useCallback(() => {
    playerRef.current?.stop();
  }, []);

  const seekTo = useCallback((time: number) => {
    playerRef.current?.seekTo(time);
  }, []);

  const setVolume = useCallback(
    (vol: number) => {
      storeSetVolume(vol);
      // The useEffect above will sync to the player
    },
    [storeSetVolume]
  );

  const setSpeed = useCallback(
    (speed: number) => {
      storeSetPlaybackSpeed(speed);
      // The useEffect above will sync to the player
    },
    [storeSetPlaybackSpeed]
  );

  const setRepeatMode = useCallback(
    (mode: RepeatMode) => {
      storeSetRepeatMode(mode);
      // The useEffect above will sync to the player
    },
    [storeSetRepeatMode]
  );

  return {
    // State from the store
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,
    repeatMode,
    autoPlay,
    currentReciter,
    currentSurah,
    currentAyah,

    // Actions
    playAyah,
    playRange,
    togglePlay,
    pause,
    stop,
    next,
    previous,
    seekTo,
    setVolume,
    setSpeed,
    setRepeatMode,
  };
}
