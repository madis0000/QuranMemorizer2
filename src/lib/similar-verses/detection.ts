/**
 * Similar Verse Detection Algorithm
 *
 * Detects verses (mutashabihat) that are similar enough to confuse Huffaz.
 * Uses Jaccard similarity on normalized Arabic word bags.
 */

import { normalizeArabic } from "@/lib/memorization/arabic-utils";

export interface SimilarVersePair {
  verse1Key: string;
  verse2Key: string;
  similarity: number;
  diffWords: { verse1Only: string[]; verse2Only: string[] };
  category:
    | "near_identical"
    | "similar_opening"
    | "similar_ending"
    | "thematic";
}

/**
 * Tokenize Arabic verse text into normalized word array
 */
export function tokenizeVerse(text: string): string[] {
  return normalizeArabic(text)
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * Compute Jaccard similarity between two word bags
 * J(A,B) = |A ∩ B| / |A ∪ B|
 */
export function jaccardSimilarity(words1: string[], words2: string[]): number {
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) intersection++;
  }

  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Compute ordered overlap — checks if openings or endings match
 */
function classifyOverlap(
  words1: string[],
  words2: string[],
  similarity: number
): SimilarVersePair["category"] {
  if (similarity >= 0.9) return "near_identical";

  const minLen = Math.min(words1.length, words2.length);
  const checkLen = Math.min(3, minLen);

  // Check opening match
  let openingMatch = 0;
  for (let i = 0; i < checkLen; i++) {
    if (words1[i] === words2[i]) openingMatch++;
  }

  // Check ending match
  let endingMatch = 0;
  for (let i = 0; i < checkLen; i++) {
    if (words1[words1.length - 1 - i] === words2[words2.length - 1 - i]) {
      endingMatch++;
    }
  }

  if (openingMatch >= 2) return "similar_opening";
  if (endingMatch >= 2) return "similar_ending";
  return "thematic";
}

/**
 * Find words that differ between two verses
 */
export function highlightDifferences(
  words1: string[],
  words2: string[]
): { verse1Only: string[]; verse2Only: string[] } {
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const verse1Only = words1.filter((w) => !set2.has(w));
  const verse2Only = words2.filter((w) => !set1.has(w));

  return { verse1Only, verse2Only };
}

/**
 * Detect similar verses from a corpus of verse texts.
 *
 * @param verses - Map of verseKey -> Arabic text
 * @param threshold - Minimum Jaccard similarity (default 0.7)
 * @returns Array of similar verse pairs
 */
export function detectSimilarVerses(
  verses: Map<string, string>,
  threshold = 0.7
): SimilarVersePair[] {
  const pairs: SimilarVersePair[] = [];
  const entries = Array.from(verses.entries());

  // Precompute tokenized forms
  const tokenized = new Map<string, string[]>();
  for (const [key, text] of entries) {
    tokenized.set(key, tokenizeVerse(text));
  }

  // Compare all pairs
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [key1] = entries[i];
      const [key2] = entries[j];
      const words1 = tokenized.get(key1)!;
      const words2 = tokenized.get(key2)!;

      // Quick length filter — very different lengths unlikely to be similar
      const lenRatio =
        Math.min(words1.length, words2.length) /
        Math.max(words1.length, words2.length);
      if (lenRatio < 0.5) continue;

      const similarity = jaccardSimilarity(words1, words2);
      if (similarity >= threshold) {
        const diffWords = highlightDifferences(words1, words2);
        const category = classifyOverlap(words1, words2, similarity);
        pairs.push({
          verse1Key: key1,
          verse2Key: key2,
          similarity: Math.round(similarity * 1000) / 1000,
          diffWords,
          category,
        });
      }
    }
  }

  return pairs.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Find similar verses for a specific verse from the database
 */
export function findSimilarTo(
  targetKey: string,
  targetText: string,
  corpus: Map<string, string>,
  threshold = 0.7
): SimilarVersePair[] {
  const targetWords = tokenizeVerse(targetText);
  const results: SimilarVersePair[] = [];

  for (const [key, text] of corpus) {
    if (key === targetKey) continue;

    const words = tokenizeVerse(text);
    const lenRatio =
      Math.min(targetWords.length, words.length) /
      Math.max(targetWords.length, words.length);
    if (lenRatio < 0.5) continue;

    const similarity = jaccardSimilarity(targetWords, words);
    if (similarity >= threshold) {
      const diffWords = highlightDifferences(targetWords, words);
      const category = classifyOverlap(targetWords, words, similarity);
      results.push({
        verse1Key: targetKey,
        verse2Key: key,
        similarity: Math.round(similarity * 1000) / 1000,
        diffWords,
        category,
      });
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity);
}
