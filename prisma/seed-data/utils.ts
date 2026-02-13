/**
 * Seed Utilities
 *
 * Retry, concurrency, and progress helpers for database seeding.
 */

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      const backoff = delayMs * Math.pow(2, attempt - 1);
      console.warn(
        `  Attempt ${attempt}/${retries} failed, retrying in ${backoff}ms...`
      );
      await sleep(backoff);
    }
  }
  throw new Error("Unreachable");
}

export async function runConcurrent<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        console.warn(
          `  Batch item failed:`,
          result.reason?.message || result.reason
        );
      }
    }
  }
  return results;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function progressBar(
  current: number,
  total: number,
  label: string
): void {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round(pct / 5);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);
  process.stdout.write(`\r  [${bar}] ${pct}% ${label} (${current}/${total})`);
  if (current === total) process.stdout.write("\n");
}
