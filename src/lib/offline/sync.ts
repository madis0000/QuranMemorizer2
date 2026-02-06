/**
 * Background sync queue for offline-first functionality.
 * Queues API calls when offline and replays them when connection returns.
 */

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  timestamp: number;
  retries: number;
}

const DB_NAME = "quran-memorizer-sync";
const STORE_NAME = "sync-queue";
const MAX_RETRIES = 3;

/**
 * Open the IndexedDB for sync queue.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Add a request to the sync queue.
 */
export async function queueRequest(
  url: string,
  method: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const request: QueuedRequest = {
    id: crypto.randomUUID(),
    url,
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: headers ?? { "Content-Type": "application/json" },
    timestamp: Date.now(),
    retries: 0,
  };

  store.add(request);
  db.close();
}

/**
 * Get all queued requests.
 */
export async function getQueuedRequests(): Promise<QueuedRequest[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Remove a request from the queue.
 */
async function removeRequest(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(id);
  db.close();
}

/**
 * Replay all queued requests.
 * Called when connection is restored.
 */
export async function replayQueue(): Promise<{
  success: number;
  failed: number;
}> {
  const requests = await getQueuedRequests();
  let success = 0;
  let failed = 0;

  for (const req of requests) {
    try {
      const response = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });

      if (response.ok) {
        await removeRequest(req.id);
        success++;
      } else if (req.retries >= MAX_RETRIES) {
        await removeRequest(req.id);
        failed++;
      } else {
        // Update retry count
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put({ ...req, retries: req.retries + 1 });
        db.close();
        failed++;
      }
    } catch {
      // Network still unavailable, keep in queue
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Initialize online/offline listeners for automatic sync.
 */
export function initBackgroundSync(
  onSync?: (result: { success: number; failed: number }) => void
) {
  if (typeof window === "undefined") return;

  const handleOnline = async () => {
    const result = await replayQueue();
    onSync?.(result);
  };

  window.addEventListener("online", handleOnline);

  return () => {
    window.removeEventListener("online", handleOnline);
  };
}

/**
 * Check if the app is currently online.
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

/**
 * Fetch with offline queue fallback.
 * If offline, queues the request for later replay.
 */
export async function fetchWithSync(
  url: string,
  options: RequestInit = {}
): Promise<Response | null> {
  if (isOnline()) {
    try {
      return await fetch(url, options);
    } catch {
      // Network error - queue it
      await queueRequest(
        url,
        options.method ?? "GET",
        options.body ? JSON.parse(options.body as string) : undefined,
        options.headers as Record<string, string>
      );
      return null;
    }
  } else {
    await queueRequest(
      url,
      options.method ?? "GET",
      options.body ? JSON.parse(options.body as string) : undefined,
      options.headers as Record<string, string>
    );
    return null;
  }
}
