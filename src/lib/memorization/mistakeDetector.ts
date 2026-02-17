// ===== Quran Recitation Mistake Detector =====
// Compares a user's recited text against the original Quranic text and
// produces a detailed list of mistakes together with per-word results
// suitable for UI highlighting.

import {
  normalizeArabic,
  removeDiacritics,
  splitIntoWords,
  wordSimilarity,
} from "./arabic-utils";

// ===== Public types =====

export type MistakeType =
  | "wrong_word"
  | "skipped"
  | "added"
  | "tashkeel"
  | "order";
export type Sensitivity = "strict" | "normal" | "lenient";

export interface DetectedMistake {
  type: MistakeType;
  /** Index of the word in the *original* text (0-based). */
  wordIndex: number;
  /** The word the user actually recited, or `null` for skipped words. */
  recitedText: string | null;
  /** The expected word from the Quran. */
  correctText: string;
  severity: "minor" | "major";
}

export interface ComparisonResult {
  /** Overall accuracy as a percentage (0--100). */
  accuracy: number;
  /** Number of words in the original text. */
  totalWords: number;
  /** Number of words considered correct. */
  correctWords: number;
  /** List of detected mistakes. */
  mistakes: DetectedMistake[];
  /** Per-word status aligned with the original text, for UI highlighting. */
  wordResults: WordResult[];
}

export interface WordResult {
  originalWord: string;
  recitedWord: string | null;
  status: "correct" | "wrong" | "skipped" | "tashkeel";
  /** Similarity score between the original and recited word (0--1). */
  similarity: number;
}

// ===== Sensitivity thresholds =====

interface SensitivityConfig {
  /** Minimum normalised similarity to count as "correct". */
  similarityThreshold: number;
  /** Whether diacritics are ignored when comparing. */
  ignoreDiacritics: boolean;
  /** Apply extra normalisation (lenient mode). */
  extraNormalize: boolean;
}

const SENSITIVITY_CONFIG: Record<Sensitivity, SensitivityConfig> = {
  strict: {
    similarityThreshold: 0.95,
    ignoreDiacritics: false,
    extraNormalize: false,
  },
  normal: {
    similarityThreshold: 0.7,
    ignoreDiacritics: true,
    extraNormalize: false,
  },
  lenient: {
    similarityThreshold: 0.5,
    ignoreDiacritics: true,
    extraNormalize: true,
  },
};

// ===== Main entry point =====

/**
 * Compare a user's recited text against the original Quranic text.
 *
 * The algorithm:
 *  1. Tokenise both texts into word arrays.
 *  2. Compute the LCS (Longest Common Subsequence) on *normalised* words
 *     to build an alignment between the two sequences.
 *  3. Walk through the alignment and classify every original word as
 *     correct, tashkeel-error, wrong, or skipped.  Extra recited words
 *     that do not align to any original word are flagged as "added".
 *  4. Aggregate the results into a {@link ComparisonResult}.
 */
export function compareRecitation(
  originalText: string,
  recitedText: string,
  sensitivity: Sensitivity = "normal"
): ComparisonResult {
  const config = SENSITIVITY_CONFIG[sensitivity];

  // Filter out ornamental Tajweed marks (e.g. U+06DB ۛ) that appear as standalone
  // "words" in Quran text but are never spoken — they normalize to empty strings.
  const originalWords = splitIntoWords(originalText).filter(
    (w) => normalizeArabic(w).length > 0
  );
  const recitedWords = splitIntoWords(recitedText);

  const totalWords = originalWords.length;

  // Edge case: nothing to compare.
  if (totalWords === 0) {
    return {
      accuracy: 100,
      totalWords: 0,
      correctWords: 0,
      mistakes: [],
      wordResults: [],
    };
  }

  // Edge case: user did not recite anything.
  if (recitedWords.length === 0) {
    const mistakes: DetectedMistake[] = originalWords.map((w, i) => ({
      type: "skipped" as const,
      wordIndex: i,
      recitedText: null,
      correctText: w,
      severity: "major" as const,
    }));
    const wordResults: WordResult[] = originalWords.map((w) => ({
      originalWord: w,
      recitedWord: null,
      status: "skipped" as const,
      similarity: 0,
    }));
    return { accuracy: 0, totalWords, correctWords: 0, mistakes, wordResults };
  }

  // Normalise both sequences for alignment.
  const normOriginal = originalWords.map((w) =>
    prepareForComparison(w, config)
  );
  const normRecited = recitedWords.map((w) => prepareForComparison(w, config));

  // Compute LCS indices.
  const { originalIndices, recitedIndices } = computeLCSAlignment(
    normOriginal,
    normRecited
  );

  // Build sets for O(1) membership checks.
  const matchedOriginal = new Set(originalIndices);
  const matchedRecited = new Set(recitedIndices);

  // ---- Classify each original word ----

  const mistakes: DetectedMistake[] = [];
  const wordResults: WordResult[] = [];
  let correctWords = 0;

  // Build a map from original index -> recited index via the LCS pairs.
  const origToRecited = new Map<number, number>();
  for (let k = 0; k < originalIndices.length; k++) {
    origToRecited.set(originalIndices[k], recitedIndices[k]);
  }

  for (let i = 0; i < totalWords; i++) {
    const origWord = originalWords[i];

    if (matchedOriginal.has(i)) {
      // This original word was matched in the LCS.
      const rIdx = origToRecited.get(i)!;
      const recWord = recitedWords[rIdx];

      const classification = classifyMatch(origWord, recWord, config);

      if (classification === "correct") {
        correctWords++;
        wordResults.push({
          originalWord: origWord,
          recitedWord: recWord,
          status: "correct",
          similarity: 1.0,
        });
      } else if (classification === "tashkeel") {
        // Tashkeel error -- minor mistake.
        mistakes.push({
          type: "tashkeel",
          wordIndex: i,
          recitedText: recWord,
          correctText: origWord,
          severity: "minor",
        });
        wordResults.push({
          originalWord: origWord,
          recitedWord: recWord,
          status: "tashkeel",
          similarity: 0.9,
        });
      } else {
        // The words matched at normalised level but the raw similarity
        // is below the threshold -- treat as wrong.
        const sim = wordSimilarity(origWord, recWord);
        mistakes.push({
          type: "wrong_word",
          wordIndex: i,
          recitedText: recWord,
          correctText: origWord,
          severity: "major",
        });
        wordResults.push({
          originalWord: origWord,
          recitedWord: recWord,
          status: "wrong",
          similarity: sim,
        });
      }
    } else {
      // This original word was NOT matched -- it was skipped.
      mistakes.push({
        type: "skipped",
        wordIndex: i,
        recitedText: null,
        correctText: origWord,
        severity: "major",
      });
      wordResults.push({
        originalWord: origWord,
        recitedWord: null,
        status: "skipped",
        similarity: 0,
      });
    }
  }

  // ---- Detect added (extra) words ----

  for (let j = 0; j < recitedWords.length; j++) {
    if (!matchedRecited.has(j)) {
      // This recited word did not match any original word.
      // Find the nearest original word index for positioning.
      const nearestOrigIdx = findNearestOriginalIndex(
        j,
        recitedIndices,
        originalIndices
      );
      mistakes.push({
        type: "added",
        wordIndex: nearestOrigIdx,
        recitedText: recitedWords[j],
        correctText:
          nearestOrigIdx < totalWords ? originalWords[nearestOrigIdx] : "",
        severity: "minor",
      });
    }
  }

  // Sort mistakes by wordIndex for consistent ordering.
  mistakes.sort((a, b) => a.wordIndex - b.wordIndex);

  const accuracy =
    totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;

  return {
    accuracy,
    totalWords,
    correctWords,
    mistakes,
    wordResults,
  };
}

// ===== Internal helpers =====

/**
 * Prepare a word for comparison according to the sensitivity config.
 */
function prepareForComparison(word: string, config: SensitivityConfig): string {
  if (config.extraNormalize || config.ignoreDiacritics) {
    return normalizeArabic(word);
  }
  // Strict mode: only remove tatweel and normalise whitespace, keep
  // diacritics and letter variants.
  return word.replace(/\u0640/g, "").trim();
}

/**
 * Classify how an original word and its LCS-matched recited word relate.
 *
 * Returns:
 *  - 'correct'  if the words are considered equivalent
 *  - 'tashkeel' if only diacritics differ (and sensitivity allows it)
 *  - 'wrong'    otherwise
 */
function classifyMatch(
  originalWord: string,
  recitedWord: string,
  config: SensitivityConfig
): "correct" | "tashkeel" | "wrong" {
  // Exact match (including diacritics).
  if (originalWord === recitedWord) return "correct";

  // Check whether the base (diacritics-stripped) forms are the same.
  const baseOrig = removeDiacritics(originalWord);
  const baseRec = removeDiacritics(recitedWord);

  if (baseOrig === baseRec) {
    // Only diacritics differ.
    if (config.ignoreDiacritics) {
      // In non-strict modes we accept this as correct.
      return "correct";
    }
    // In strict mode this is a tashkeel error.
    return "tashkeel";
  }

  // Normalised comparison.
  const normOrig = normalizeArabic(originalWord);
  const normRec = normalizeArabic(recitedWord);

  if (normOrig === normRec) {
    // Differences are only in letter variants (alef forms, taa marbuta, etc.).
    // In non-strict modes treat as correct.
    if (config.ignoreDiacritics) return "correct";
    return "tashkeel";
  }

  // Compute fine-grained similarity.
  const sim = wordSimilarity(originalWord, recitedWord);
  if (sim >= config.similarityThreshold) {
    return "correct";
  }

  return "wrong";
}

/**
 * Compute the Longest Common Subsequence (LCS) of two string arrays and
 * return the aligned index pairs.
 *
 * Uses standard O(m*n) dynamic programming.
 */
function computeLCSAlignment(
  a: string[],
  b: string[]
): { originalIndices: number[]; recitedIndices: number[] } {
  const m = a.length;
  const n = b.length;

  // Build the DP table.
  // dp[i][j] = length of LCS of a[0..i-1] and b[0..j-1].
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = new Array<number>(n + 1).fill(0);
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Back-track to recover the actual LCS indices.
  const originalIndices: number[] = [];
  const recitedIndices: number[] = [];

  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      originalIndices.push(i - 1);
      recitedIndices.push(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  // The back-track produces indices in reverse order.
  originalIndices.reverse();
  recitedIndices.reverse();

  return { originalIndices, recitedIndices };
}

/**
 * Given the index `j` of an unmatched recited word, find the original-text
 * index it should be associated with.  We pick the original index
 * corresponding to the nearest LCS-matched recited index, biased toward
 * the position *after* the match (because extras are usually inserted
 * between two correct words).
 */
function findNearestOriginalIndex(
  recitedIdx: number,
  recitedIndices: number[],
  originalIndices: number[]
): number {
  if (originalIndices.length === 0) return 0;

  // Find the last LCS recited index that is < recitedIdx.
  let bestOrigIdx = 0;
  for (let k = 0; k < recitedIndices.length; k++) {
    if (recitedIndices[k] < recitedIdx) {
      // The extra word comes after this matched pair, so associate it
      // with the *next* original position.
      bestOrigIdx = Math.min(
        originalIndices[k] + 1,
        originalIndices[originalIndices.length - 1]
      );
    } else {
      break;
    }
  }

  return bestOrigIdx;
}
