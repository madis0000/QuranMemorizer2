/**
 * Create PostgreSQL Search Index
 *
 * Creates a pg_trgm GIN index on QuranAyah.textSimple for fast
 * partial Arabic text matching via ILIKE.
 */
import { Pool } from "pg";

export async function createSearchIndex(pool: Pool): Promise<void> {
  console.log("Creating search index...");

  try {
    // Enable pg_trgm extension (requires superuser or CREATE EXTENSION privilege)
    await pool.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    console.log("  ✓ pg_trgm extension enabled.");
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`  ⚠ pg_trgm extension: ${msg}`);
    console.warn(
      "    Falling back to btree index. ILIKE searches will be slower."
    );
  }

  // Create trigram index on textSimple (for diacritics-stripped search)
  try {
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "quran_ayah_text_trgm_idx"
        ON "QuranAyah" USING GIN ("textSimple" gin_trgm_ops)
    `);
    console.log("  ✓ GIN trigram index created on QuranAyah.textSimple.");
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    // If pg_trgm is not available, create a regular btree index
    console.warn(`  ⚠ GIN index failed (${msg}), creating btree fallback...`);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "quran_ayah_text_simple_idx"
        ON "QuranAyah" ("textSimple")
    `);
    console.log("  ✓ Btree index created on QuranAyah.textSimple (fallback).");
  }

  // Also create index on QuranWord.textSimple for word-level search
  try {
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "quran_word_text_trgm_idx"
        ON "QuranWord" USING GIN ("textSimple" gin_trgm_ops)
    `);
    console.log("  ✓ GIN trigram index created on QuranWord.textSimple.");
  } catch {
    // Non-critical, skip silently
  }
}
