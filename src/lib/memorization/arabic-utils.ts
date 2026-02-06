// ===== Arabic Text Utilities for Memorization =====
// Provides normalisation, tokenisation, and similarity functions
// tailored for comparing Quran recitation against the original text.

// ===== Unicode ranges =====

/**
 * Arabic diacritical marks (tashkeel) range: U+064B -- U+065F, plus
 * U+0670 (superscript alef) which appears in Uthmani script.
 */
const DIACRITICS_RE = /[\u064B-\u065F\u0670]/g;

/**
 * Arabic tatweel / kashida character (U+0640).
 */
const TATWEEL_RE = /\u0640/g;

// ===== Public API =====

/**
 * Remove all Arabic diacritical marks (tashkeel) from `text`.
 *
 * Covers fathah, dammah, kasrah, shadda, sukun, tanween variants,
 * and superscript alef.
 */
export function removeDiacritics(text: string): string {
  return text.replace(DIACRITICS_RE, "");
}

/**
 * Normalise Arabic text for fuzzy comparison.
 *
 * The following transformations are applied in order:
 *  1. Remove diacritics (tashkeel)
 *  2. Normalise alef variants (hamza-above, hamza-below, madda, wasla -> bare alef)
 *  3. Normalise taa marbuta -> haa
 *  4. Normalise alef maksura -> yaa
 *  5. Normalise waw with hamza -> waw
 *  6. Normalise yaa with hamza -> yaa
 *  7. Remove tatweel / kashida
 *  8. Collapse and trim whitespace
 */
export function normalizeArabic(text: string): string {
  return (
    text
      // 1. Diacritics
      .replace(DIACRITICS_RE, "")
      // 2. Alef variants:  إ أ آ ٱ  ->  ا
      .replace(/[\u0625\u0623\u0622\u0671]/g, "\u0627")
      // 3. Taa marbuta  ة  ->  ه
      .replace(/\u0629/g, "\u0647")
      // 4. Alef maksura  ى  ->  ي
      .replace(/\u0649/g, "\u064A")
      // 5. Waw with hamza  ؤ  ->  و
      .replace(/\u0624/g, "\u0648")
      // 6. Yaa with hamza  ئ  ->  ي
      .replace(/\u0626/g, "\u064A")
      // 7. Tatweel / kashida
      .replace(TATWEEL_RE, "")
      // 8. Whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Split Arabic text into individual words.
 *
 * Handles standard space, non-breaking space (U+00A0), zero-width
 * non-joiner (U+200C), and any other Unicode whitespace.
 */
export function splitIntoWords(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  return trimmed.split(/\s+/);
}

/**
 * Check whether `text` contains any Arabic diacritical marks.
 */
export function hasDiacritics(text: string): boolean {
  return DIACRITICS_RE.test(text);
}

/**
 * Compute a similarity score (0--1) between two Arabic words.
 *
 * Scoring strategy:
 *  - Normalised forms are identical            -> 1.0
 *  - Only diacritics differ (base text same)   -> 0.9  (tashkeel error)
 *  - Otherwise: 1 - levenshtein(n1, n2) / max(|n1|, |n2|)
 */
export function wordSimilarity(word1: string, word2: string): number {
  // Exact match (including diacritics).
  if (word1 === word2) return 1.0;

  const n1 = normalizeArabic(word1);
  const n2 = normalizeArabic(word2);

  // Normalised forms match -- the only differences were diacritics /
  // variant letter forms.
  if (n1 === n2) return 0.9;

  // Fall back to edit-distance based similarity.
  const maxLen = Math.max(n1.length, n2.length);
  if (maxLen === 0) return 1.0;

  const dist = levenshteinDistance(n1, n2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Compute the Levenshtein (edit) distance between two strings.
 *
 * Uses the standard DP algorithm with O(min(m,n)) space optimisation.
 */
export function levenshteinDistance(a: string, b: string): number {
  // Ensure `a` is the shorter string so we use less memory.
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const m = a.length;
  const n = b.length;

  // Single-row DP. prev[j] holds the distance for (i-1, j).
  let prev = new Array<number>(m + 1);
  let curr = new Array<number>(m + 1);

  // Base case: distance from empty prefix of `a` to first j chars of `b`
  // is j (all inserts).  But we iterate over `b` in the outer loop, so
  // initialise prev as the distances from first i chars of `a` to empty
  // prefix of `b`.
  for (let i = 0; i <= m; i++) {
    prev[i] = i;
  }

  for (let j = 1; j <= n; j++) {
    curr[0] = j; // distance from empty `a` to first j chars of `b`

    for (let i = 1; i <= m; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[i] = Math.min(
        curr[i - 1] + 1, // insert
        prev[i] + 1, // delete
        prev[i - 1] + cost // substitute
      );
    }

    // Swap rows.
    [prev, curr] = [curr, prev];
  }

  return prev[m];
}
