/**
 * Audio Download Manager
 *
 * Manages downloading surah audio for offline listening.
 * Downloads each ayah individually and stores blobs in IndexedDB.
 */

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import { getAudioUrl } from "@/lib/quran/api";

// ===== Types =====

export type DownloadStatus =
  | "pending"
  | "downloading"
  | "completed"
  | "error"
  | "cancelled";

export interface DownloadTask {
  id: string;
  surahNumber: number;
  reciterId: string;
  totalAyahs: number;
  downloadedAyahs: number;
  status: DownloadStatus;
  error?: string;
}

export type DownloadProgressCallback = (task: DownloadTask) => void;

// ===== Audio Cache DB =====

interface AudioCacheEntry {
  key: string; // "reciterId:surahNumber:ayahNumber"
  reciterId: string;
  surahNumber: number;
  ayahNumber: number;
  blob: Blob;
  size: number;
  downloadedAt: number;
}

interface AudioCacheDBSchema extends DBSchema {
  "audio-cache": {
    key: string;
    value: AudioCacheEntry;
    indexes: {
      "by-reciter": string;
      "by-surah": [string, number]; // [reciterId, surahNumber]
    };
  };
}

const AUDIO_DB_NAME = "quran-audio-cache";
const AUDIO_DB_VERSION = 1;

let audioDB: Promise<IDBPDatabase<AudioCacheDBSchema>> | null = null;

function getAudioDB(): Promise<IDBPDatabase<AudioCacheDBSchema>> {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }

  if (!audioDB) {
    audioDB = openDB<AudioCacheDBSchema>(AUDIO_DB_NAME, AUDIO_DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("audio-cache", { keyPath: "key" });
        store.createIndex("by-reciter", "reciterId");
        store.createIndex("by-surah", ["reciterId", "surahNumber"]);
      },
    });
  }

  return audioDB;
}

function audioCacheKey(
  reciterId: string,
  surahNumber: number,
  ayahNumber: number
): string {
  return `${reciterId}:${surahNumber}:${ayahNumber}`;
}

function downloadTaskId(reciterId: string, surahNumber: number): string {
  return `${reciterId}:${surahNumber}`;
}

// ===== AudioDownloadManager =====

export class AudioDownloadManager {
  private activeTasks: Map<string, DownloadTask> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();
  private listeners: Set<DownloadProgressCallback> = new Set();

  /**
   * Download all ayahs for a surah, storing each in IndexedDB.
   * Downloads sequentially, one ayah at a time, with one retry on failure.
   */
  async downloadSurah(
    reciterId: string,
    surahNumber: number,
    totalAyahs: number
  ): Promise<void> {
    const taskId = downloadTaskId(reciterId, surahNumber);

    // If already downloading, skip
    const existing = this.activeTasks.get(taskId);
    if (existing && existing.status === "downloading") {
      return;
    }

    const task: DownloadTask = {
      id: taskId,
      surahNumber,
      reciterId,
      totalAyahs,
      downloadedAyahs: 0,
      status: "downloading",
    };

    // Count already-downloaded ayahs so we can resume
    const db = await getAudioDB();
    let alreadyDownloaded = 0;
    for (let ayah = 1; ayah <= totalAyahs; ayah++) {
      const key = audioCacheKey(reciterId, surahNumber, ayah);
      const entry = await db.get("audio-cache", key);
      if (entry) {
        alreadyDownloaded++;
      }
    }
    task.downloadedAyahs = alreadyDownloaded;

    // If already complete, mark immediately
    if (alreadyDownloaded === totalAyahs) {
      task.status = "completed";
      this.activeTasks.set(taskId, task);
      this.emitProgress(task);
      return;
    }

    this.activeTasks.set(taskId, task);
    this.emitProgress(task);

    const controller = new AbortController();
    this.abortControllers.set(taskId, controller);

    try {
      for (let ayah = 1; ayah <= totalAyahs; ayah++) {
        // Check for cancellation
        if (controller.signal.aborted) {
          task.status = "cancelled";
          this.activeTasks.set(taskId, { ...task });
          this.emitProgress(task);
          return;
        }

        const key = audioCacheKey(reciterId, surahNumber, ayah);

        // Skip if already cached
        const cached = await db.get("audio-cache", key);
        if (cached) {
          continue;
        }

        // Download with one retry
        let blob: Blob | null = null;
        const url = getAudioUrl(reciterId, surahNumber, ayah);

        for (let attempt = 0; attempt < 2; attempt++) {
          if (controller.signal.aborted) {
            task.status = "cancelled";
            this.activeTasks.set(taskId, { ...task });
            this.emitProgress(task);
            return;
          }

          try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
            }
            blob = await response.blob();
            break;
          } catch (err: unknown) {
            if (err instanceof DOMException && err.name === "AbortError") {
              task.status = "cancelled";
              this.activeTasks.set(taskId, { ...task });
              this.emitProgress(task);
              return;
            }
            // On first failure, retry; on second, propagate error
            if (attempt === 1) {
              const message =
                err instanceof Error ? err.message : "Download failed";
              task.status = "error";
              task.error = `Ayah ${ayah}: ${message}`;
              this.activeTasks.set(taskId, { ...task });
              this.emitProgress(task);
              return;
            }
            // Small delay before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (blob) {
          const entry: AudioCacheEntry = {
            key,
            reciterId,
            surahNumber,
            ayahNumber: ayah,
            blob,
            size: blob.size,
            downloadedAt: Date.now(),
          };
          await db.put("audio-cache", entry);

          task.downloadedAyahs++;
          this.activeTasks.set(taskId, { ...task });
          this.emitProgress(task);
        }
      }

      task.status = "completed";
      this.activeTasks.set(taskId, { ...task });
      this.emitProgress(task);
    } finally {
      this.abortControllers.delete(taskId);
    }
  }

  /**
   * Cancel an active download for a given surah.
   */
  cancelDownload(reciterId: string, surahNumber: number): void {
    const taskId = downloadTaskId(reciterId, surahNumber);
    const controller = this.abortControllers.get(taskId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(taskId);
    }

    const task = this.activeTasks.get(taskId);
    if (task && task.status === "downloading") {
      task.status = "cancelled";
      this.activeTasks.set(taskId, { ...task });
      this.emitProgress(task);
    }
  }

  /**
   * Delete cached audio for a surah.
   */
  async deleteSurah(reciterId: string, surahNumber: number): Promise<void> {
    const db = await getAudioDB();
    const entries = await db.getAllKeysFromIndex("audio-cache", "by-surah", [
      reciterId,
      surahNumber,
    ]);

    const tx = db.transaction("audio-cache", "readwrite");
    await Promise.all([...entries.map((key) => tx.store.delete(key)), tx.done]);

    // Clear the task record
    const taskId = downloadTaskId(reciterId, surahNumber);
    this.activeTasks.delete(taskId);
  }

  /**
   * Check if a surah is fully downloaded for a given reciter.
   */
  async isSurahDownloaded(
    reciterId: string,
    surahNumber: number,
    totalAyahs: number
  ): Promise<boolean> {
    const db = await getAudioDB();
    const entries = await db.getAllKeysFromIndex("audio-cache", "by-surah", [
      reciterId,
      surahNumber,
    ]);
    return entries.length >= totalAyahs;
  }

  /**
   * Get the count of downloaded ayahs for a surah.
   */
  async getDownloadedCount(
    reciterId: string,
    surahNumber: number
  ): Promise<number> {
    const db = await getAudioDB();
    const entries = await db.getAllKeysFromIndex("audio-cache", "by-surah", [
      reciterId,
      surahNumber,
    ]);
    return entries.length;
  }

  /**
   * Get cached audio blob. Returns null if not cached.
   */
  async getCachedAudio(
    reciterId: string,
    surahNumber: number,
    ayahNumber: number
  ): Promise<Blob | null> {
    const db = await getAudioDB();
    const key = audioCacheKey(reciterId, surahNumber, ayahNumber);
    const entry = await db.get("audio-cache", key);
    return entry?.blob ?? null;
  }

  /**
   * Get total storage used by cached audio (in bytes).
   */
  async getStorageUsed(): Promise<number> {
    const db = await getAudioDB();
    const all = await db.getAll("audio-cache");
    let total = 0;
    for (const entry of all) {
      total += entry.size;
    }
    return total;
  }

  /**
   * Get a summary of all downloaded surahs for a given reciter.
   */
  async getDownloadedSurahs(
    reciterId: string
  ): Promise<
    Array<{ surahNumber: number; ayahCount: number; totalSize: number }>
  > {
    const db = await getAudioDB();
    const all = await db.getAllFromIndex(
      "audio-cache",
      "by-reciter",
      reciterId
    );

    const surahMap = new Map<
      number,
      { ayahCount: number; totalSize: number }
    >();
    for (const entry of all) {
      const existing = surahMap.get(entry.surahNumber);
      if (existing) {
        existing.ayahCount++;
        existing.totalSize += entry.size;
      } else {
        surahMap.set(entry.surahNumber, {
          ayahCount: 1,
          totalSize: entry.size,
        });
      }
    }

    const result: Array<{
      surahNumber: number;
      ayahCount: number;
      totalSize: number;
    }> = [];
    surahMap.forEach((value, surahNumber) => {
      result.push({ surahNumber, ...value });
    });

    return result.sort((a, b) => a.surahNumber - b.surahNumber);
  }

  /**
   * Delete all cached audio data.
   */
  async deleteAll(): Promise<void> {
    const db = await getAudioDB();
    await db.clear("audio-cache");
    this.activeTasks.clear();
  }

  /**
   * Get the current task state for a surah download.
   */
  getTask(reciterId: string, surahNumber: number): DownloadTask | undefined {
    const taskId = downloadTaskId(reciterId, surahNumber);
    return this.activeTasks.get(taskId);
  }

  /**
   * Subscribe to download progress events.
   * Returns an unsubscribe function.
   */
  onProgress(callback: DownloadProgressCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private emitProgress(task: DownloadTask): void {
    const snapshot = { ...task };
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch {
        // Ignore listener errors
      }
    }
  }
}

// ===== Singleton =====

let instance: AudioDownloadManager | null = null;

/**
 * Get the singleton AudioDownloadManager instance.
 */
export function getAudioDownloadManager(): AudioDownloadManager {
  if (!instance) {
    instance = new AudioDownloadManager();
  }
  return instance;
}
