/**
 * Shared hide-mode utilities for both ayah-by-ayah and mushaf memorization.
 *
 * Extracted from ProgressiveHideModes so the bridge module
 * (mushaf-hide-bridge.ts) can reuse the same logic.
 */

// Arabic particles to hide in keyword_mode
export const ARABIC_PARTICLES = new Set([
  "من",
  "في",
  "على",
  "إلى",
  "عن",
  "إن",
  "أن",
  "ما",
  "لا",
  "هو",
  "هي",
  "الذي",
  "التي",
  "هذا",
  "هذه",
  "ذلك",
  "تلك",
  "كل",
  "بعض",
  "غير",
  "عند",
  "بين",
  "حتى",
  "إذا",
  "إذ",
  "لم",
  "لن",
  "قد",
  "سوف",
  "ثم",
  "أو",
  "و",
  "ف",
  "ب",
  "ل",
  "ك",
]);

/** Get first Arabic letter of a word (skip diacritics). */
export function getFirstLetter(word: string): string {
  for (const char of word) {
    if (/[\u0621-\u064A]/.test(char)) return char;
  }
  return word[0] || "";
}

/** Seeded random for consistent word hiding. */
export function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + index;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 100) / 100;
}

/** Check if word should be hidden based on difficulty (random_blank mode). */
export function shouldHideWord(
  index: number,
  _totalWords: number,
  difficulty: number,
  seed: string
): boolean {
  const hidePercentage = difficulty * 20; // 1->20%, 2->40%, etc.
  const random = seededRandom(seed, index);
  return random * 100 < hidePercentage;
}

/** Check if word is an Arabic particle (keyword_mode). */
export function isParticle(word: string): boolean {
  // Remove diacritics for comparison
  const cleanWord = word.replace(/[\u064B-\u065F]/g, "");
  return ARABIC_PARTICLES.has(cleanWord);
}
