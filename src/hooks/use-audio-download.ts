"use client";

/**
 * useAudioDownload Hook
 *
 * Wraps the AudioDownloadManager singleton for React components.
 * Provides reactive state for download progress, storage usage, and
 * surah download status.
 */
import { useCallback, useEffect, useSyncExternalStore } from "react";

import {
  getAudioDownloadManager,
  type AudioDownloadManager,
  type DownloadTask,
} from "@/lib/audio/download-manager";
import { useAudioStore } from "@/stores/audioStore";

// ===== Shared external store for download state =====

// We use a module-level cache that all hook instances share, updated
// via the AudioDownloadManager's onProgress callback.

interface DownloadState {
  tasks: Map<string, DownloadTask>;
  storageUsed: number;
  version: number; // Incremented on every change to trigger re-render
}

let sharedState: DownloadState = {
  tasks: new Map(),
  storageUsed: 0,
  version: 0,
};

const stateListeners = new Set<() => void>();

function notifyListeners(): void {
  for (const listener of stateListeners) {
    listener();
  }
}

function subscribeToState(onStoreChange: () => void): () => void {
  stateListeners.add(onStoreChange);
  return () => {
    stateListeners.delete(onStoreChange);
  };
}

function getStateSnapshot(): DownloadState {
  return sharedState;
}

// Server snapshot for SSR
const serverSnapshot: DownloadState = {
  tasks: new Map(),
  storageUsed: 0,
  version: 0,
};

function getServerSnapshot(): DownloadState {
  return serverSnapshot;
}

let progressSubscribed = false;

function ensureProgressSubscription(manager: AudioDownloadManager): void {
  if (progressSubscribed) return;
  progressSubscribed = true;

  manager.onProgress((task) => {
    const nextTasks = new Map(sharedState.tasks);
    nextTasks.set(task.id, task);
    sharedState = {
      tasks: nextTasks,
      storageUsed: sharedState.storageUsed,
      version: sharedState.version + 1,
    };
    notifyListeners();
  });
}

// ===== Hook =====

interface UseAudioDownloadReturn {
  /** Start downloading all ayahs for a surah */
  downloadSurah: (surahNumber: number, totalAyahs: number) => void;
  /** Cancel an active download */
  cancelDownload: (surahNumber: number) => void;
  /** Delete cached audio for a surah */
  deleteSurah: (surahNumber: number) => Promise<void>;
  /** Delete all cached audio */
  deleteAll: () => Promise<void>;
  /** Check if a surah is fully downloaded (async, returns via callback) */
  checkIsDownloaded: (
    surahNumber: number,
    totalAyahs: number
  ) => Promise<boolean>;
  /** Get the current download task for a surah, if any */
  getTaskForSurah: (surahNumber: number) => DownloadTask | undefined;
  /** Current total storage used (bytes) */
  storageUsed: number;
  /** All active/recent download tasks */
  tasks: Map<string, DownloadTask>;
  /** Refresh storage usage from IndexedDB */
  refreshStorageUsed: () => Promise<void>;
}

// Module-level manager reference (avoids ref-in-render issues)
let managerInstance: AudioDownloadManager | null = null;

function getManager(): AudioDownloadManager | null {
  if (typeof window === "undefined") return null;
  if (!managerInstance) {
    managerInstance = getAudioDownloadManager();
    ensureProgressSubscription(managerInstance);
  }
  return managerInstance;
}

export function useAudioDownload(): UseAudioDownloadReturn {
  const currentReciter = useAudioStore((s) => s.currentReciter);

  const state = useSyncExternalStore(
    subscribeToState,
    getStateSnapshot,
    getServerSnapshot
  );

  // Refresh storage on mount
  useEffect(() => {
    const manager = getManager();
    if (!manager) return;

    manager.getStorageUsed().then((used) => {
      sharedState = {
        ...sharedState,
        storageUsed: used,
        version: sharedState.version + 1,
      };
      notifyListeners();
    });
  }, []);

  const downloadSurah = useCallback(
    (surahNumber: number, totalAyahs: number) => {
      const manager = getManager();
      if (!manager) return;
      // Fire and forget -- progress tracked via onProgress
      manager.downloadSurah(currentReciter, surahNumber, totalAyahs);
    },
    [currentReciter]
  );

  const cancelDownload = useCallback(
    (surahNumber: number) => {
      getManager()?.cancelDownload(currentReciter, surahNumber);
    },
    [currentReciter]
  );

  const deleteSurah = useCallback(
    async (surahNumber: number) => {
      const manager = getManager();
      if (!manager) return;
      await manager.deleteSurah(currentReciter, surahNumber);
      const used = await manager.getStorageUsed();
      sharedState = {
        tasks: new Map(sharedState.tasks),
        storageUsed: used,
        version: sharedState.version + 1,
      };
      notifyListeners();
    },
    [currentReciter]
  );

  const deleteAll = useCallback(async () => {
    const manager = getManager();
    if (!manager) return;
    await manager.deleteAll();
    sharedState = {
      tasks: new Map(),
      storageUsed: 0,
      version: sharedState.version + 1,
    };
    notifyListeners();
  }, []);

  const checkIsDownloaded = useCallback(
    async (surahNumber: number, totalAyahs: number): Promise<boolean> => {
      const manager = getManager();
      if (!manager) return false;
      return manager.isSurahDownloaded(currentReciter, surahNumber, totalAyahs);
    },
    [currentReciter]
  );

  const getTaskForSurah = useCallback(
    (surahNumber: number): DownloadTask | undefined => {
      const manager = getManager();
      if (!manager) return undefined;
      // Check live manager state, then fall back to shared state
      const live = manager.getTask(currentReciter, surahNumber);
      if (live) return live;
      const taskId = `${currentReciter}:${surahNumber}`;
      return state.tasks.get(taskId);
    },
    [currentReciter, state.tasks]
  );

  const refreshStorageUsed = useCallback(async () => {
    const manager = getManager();
    if (!manager) return;
    const used = await manager.getStorageUsed();
    sharedState = {
      ...sharedState,
      storageUsed: used,
      version: sharedState.version + 1,
    };
    notifyListeners();
  }, []);

  return {
    downloadSurah,
    cancelDownload,
    deleteSurah,
    deleteAll,
    checkIsDownloaded,
    getTaskForSurah,
    storageUsed: state.storageUsed,
    tasks: state.tasks,
    refreshStorageUsed,
  };
}
