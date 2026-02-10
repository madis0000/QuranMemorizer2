/**
 * Recording Store — IndexedDB persistence for recitation recordings
 *
 * Stores audio blobs alongside metadata for replay and comparison.
 */

const DB_NAME = "quran-memorizer";
const STORE_NAME = "recordings";
const DB_VERSION = 2; // bump version to add recordings store

export interface RecordingMetadata {
  id: string;
  verseKey: string;
  sessionId?: string;
  accuracy?: number;
  duration: number;
  createdAt: string;
  blob: Blob;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("verseKey", "verseKey", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a recording
 */
export async function saveRecording(
  verseKey: string,
  blob: Blob,
  metadata: { sessionId?: string; accuracy?: number; duration: number }
): Promise<string> {
  const db = await openDB();
  const id = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const record: RecordingMetadata = {
    id,
    verseKey,
    sessionId: metadata.sessionId,
    accuracy: metadata.accuracy,
    duration: metadata.duration,
    createdAt: new Date().toISOString(),
    blob,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get a recording by ID
 */
export async function getRecording(
  id: string
): Promise<RecordingMetadata | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all recordings for a verse
 */
export async function getRecordingsForVerse(
  verseKey: string
): Promise<RecordingMetadata[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("verseKey");
    const request = index.getAll(verseKey);
    request.onsuccess = () => {
      const results = (request.result as RecordingMetadata[]).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a recording
 */
export async function deleteRecording(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
