/**
 * Pure functions for real-time word-by-word comparison of spoken text against
 * original ayah words. Extracted from memorize/page.tsx for reusability.
 */

import {
  normalizeArabic,
  splitIntoWords,
} from "@/lib/memorization/arabic-utils";

// ---------- types ----------

export type LiveStatus = "pending" | "correct" | "wrong" | "current";

export interface LiveWordState {
  originalWord: string;
  wordKey: string;
  status: LiveStatus;
  recitedWord?: string;
}

export interface LiveTrackingResult {
  wordStates: LiveWordState[];
  correctKeys: Set<string>;
  mistakeKeys: Set<string>;
  mistakeDetails: Map<string, { recitedWord?: string }>;
  currentKey: string | undefined;
  progress: number;
  accuracy: number;
  wordsCompleted: number;
  totalWords: number;
  streak: number;
  isComplete: boolean;
}

export const EMPTY_LIVE: LiveTrackingResult = {
  wordStates: [],
  correctKeys: new Set(),
  mistakeKeys: new Set(),
  mistakeDetails: new Map(),
  currentKey: undefined,
  progress: 0,
  accuracy: 0,
  wordsCompleted: 0,
  totalWords: 0,
  streak: 0,
  isComplete: false,
};

// ---------- helpers ----------

/**
 * Check if a word text is a Quranic stop/pause mark (waqf sign) rather than
 * an actual recitable word.  These marks (e.g. ۗ ۖ ۚ ۛ) appear as standalone
 * "words" in QPC data but are never spoken, so they must be skipped in tracking.
 */
export function isWaqfMark(text: string): boolean {
  const stripped = text.replace(/[\s\u0610-\u061A\u064B-\u065F\u0670]/g, "");
  return stripped.length > 0 && /^[\u06D6-\u06ED]+$/.test(stripped);
}

// ---------- main tracking function ----------

/**
 * Real-time word-by-word comparison of spoken text against original ayah words.
 * Returns per-word status, mushaf overlay keys, and progress metrics.
 */
export function computeLiveTracking(
  originalWords: string[],
  wordKeys: string[],
  spokenText: string
): LiveTrackingResult {
  if (originalWords.length === 0 || wordKeys.length !== originalWords.length) {
    return EMPTY_LIVE;
  }

  // Count recitable words (exclude waqf marks) for accurate totals
  const recitableCount = originalWords.filter((w) => !isWaqfMark(w)).length;
  if (recitableCount === 0) return EMPTY_LIVE;

  const spokenWords = splitIntoWords(spokenText);
  if (spokenWords.length === 0) {
    // Find first recitable word for initial "current" marker
    const firstRecitable = originalWords.findIndex((w) => !isWaqfMark(w));
    const states: LiveWordState[] = originalWords.map((w, i) => ({
      originalWord: w,
      wordKey: wordKeys[i],
      status: isWaqfMark(w)
        ? ("correct" as const) // waqf marks auto-pass
        : i === firstRecitable
          ? ("current" as const)
          : ("pending" as const),
    }));
    return {
      ...EMPTY_LIVE,
      wordStates: states,
      currentKey: firstRecitable >= 0 ? wordKeys[firstRecitable] : undefined,
      totalWords: recitableCount,
    };
  }

  const normalizedOrig = originalWords.map(normalizeArabic);
  const normalizedSpoken = spokenWords.map(normalizeArabic);

  // Muqatta'at detection: when the original is 1 recitable word and the user
  // spoke multiple words (e.g. "ألف لام ميم" for الم), extract the first letter
  // of each spoken word and check if they spell the original word.
  if (recitableCount === 1 && spokenWords.length > 1) {
    const recitableIdx = originalWords.findIndex((w) => !isWaqfMark(w));
    const firstLetters = normalizedSpoken.map((w) => w.charAt(0)).join("");
    if (recitableIdx >= 0 && firstLetters === normalizedOrig[recitableIdx]) {
      const states: LiveWordState[] = originalWords.map((w, i) => ({
        originalWord: w,
        wordKey: wordKeys[i],
        status: "correct" as const,
      }));
      return {
        wordStates: states,
        correctKeys: new Set(wordKeys),
        mistakeKeys: new Set<string>(),
        mistakeDetails: new Map(),
        currentKey: undefined,
        progress: 100,
        accuracy: 100,
        wordsCompleted: 1,
        totalWords: 1,
        streak: 1,
        isComplete: true,
      };
    }
  }

  const states: LiveWordState[] = originalWords.map((w, i) => ({
    originalWord: w,
    wordKey: wordKeys[i],
    status: isWaqfMark(w)
      ? ("correct" as LiveStatus)
      : ("pending" as LiveStatus),
  }));

  let origIdx = 0;
  let spokenIdx = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let streak = 0;
  let maxStreak = 0;

  while (
    spokenIdx < normalizedSpoken.length &&
    origIdx < normalizedOrig.length
  ) {
    // Auto-skip waqf marks — they are not spoken
    if (isWaqfMark(originalWords[origIdx])) {
      origIdx++;
      continue;
    }

    const spoken = normalizedSpoken[spokenIdx];
    const expected = normalizedOrig[origIdx];

    // Direct match (exact or high similarity after normalization)
    if (spoken === expected) {
      states[origIdx].status = "correct";
      correctCount++;
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      origIdx++;
      spokenIdx++;
      continue;
    }

    // Lookahead: check if user skipped 1-2 recitable words (said a later word)
    let found = false;
    for (
      let ahead = 1;
      ahead <= 2 && origIdx + ahead < normalizedOrig.length;
      ahead++
    ) {
      // Skip waqf marks in lookahead
      if (isWaqfMark(originalWords[origIdx + ahead])) continue;
      if (spoken === normalizedOrig[origIdx + ahead]) {
        // Mark skipped recitable words as wrong (skip waqf marks)
        for (let skip = 0; skip < ahead; skip++) {
          if (!isWaqfMark(originalWords[origIdx + skip])) {
            states[origIdx + skip].status = "wrong";
            wrongCount++;
          }
        }
        states[origIdx + ahead].status = "correct";
        correctCount++;
        streak = 1;
        origIdx = origIdx + ahead + 1;
        spokenIdx++;
        found = true;
        break;
      }
    }

    if (!found) {
      // Current word is wrong
      states[origIdx].status = "wrong";
      states[origIdx].recitedWord = spokenWords[spokenIdx];
      wrongCount++;
      streak = 0;
      origIdx++;
      spokenIdx++;
    }
  }

  // Skip past any trailing waqf marks to find next recitable word
  while (origIdx < states.length && isWaqfMark(originalWords[origIdx])) {
    origIdx++;
  }

  // Mark current word (first recitable pending after last processed)
  if (origIdx < states.length) {
    states[origIdx].status = "current";
  }

  const completed = correctCount + wrongCount;
  const total = recitableCount;
  const correctKeys = new Set<string>();
  const mistakeKeys = new Set<string>();

  const mistakeDetails = new Map<string, { recitedWord?: string }>();
  for (const s of states) {
    if (s.status === "correct") correctKeys.add(s.wordKey);
    if (s.status === "wrong") {
      mistakeKeys.add(s.wordKey);
      mistakeDetails.set(s.wordKey, { recitedWord: s.recitedWord });
    }
  }

  return {
    wordStates: states,
    correctKeys,
    mistakeKeys,
    mistakeDetails,
    currentKey: origIdx < states.length ? wordKeys[origIdx] : undefined,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    accuracy:
      completed > 0 ? Math.round((correctCount / completed) * 100) : 100,
    wordsCompleted: completed,
    totalWords: total,
    streak: maxStreak,
    isComplete: completed >= total,
  };
}
