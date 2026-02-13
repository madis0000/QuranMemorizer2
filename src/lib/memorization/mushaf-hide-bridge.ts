/**
 * Mushaf Hide Bridge
 *
 * Translates hide-mode logic (per-ayah word indices) into the Set<string>
 * word-key collections (`"surah:ayah:position"`) that MushafPage understands.
 *
 * This bridges the ayah-centric memorization engine with the page-level
 * MushafPage component so both modes share identical hiding behaviour.
 */

import type { MushafPage, MushafWord } from "@/types/quran";

import {
  getFirstLetter,
  isParticle,
  seededRandom,
} from "@/lib/memorization/hide-utils";
import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import type { HideMode } from "@/stores/sessionStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AyahOnPage {
  surahNumber: number;
  ayahNumber: number;
}

export interface AyahRange {
  surahNumber: number;
  startAyah: number;
  endAyah: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip trailing Arabic-Indic numerals (and preceding space) from ayah-end
 * word text.  QPC data appends the ayah number to the last word's text field,
 * e.g. "ٱلرَّحِيمِ ١".  We need the bare Arabic word for comparisons.
 */
function stripAyahNumber(text: string): string {
  return text.replace(/\s*[٠-٩]+$/, "");
}

/** Collect ALL MushafWords for a specific ayah on a page (including ayah-end). */
function getWordsForAyah(
  page: MushafPage,
  surahNumber: number,
  ayahNumber: number
): MushafWord[] {
  const words: MushafWord[] = [];
  for (const line of page.lines) {
    if (line.lineType !== "ayah") continue;
    for (const w of line.words) {
      if (w.surahNumber === surahNumber && w.ayahNumber === ayahNumber) {
        words.push(w);
      }
    }
  }
  return words;
}

/** Check whether an ayah falls inside the active session range. */
function isInRange(surah: number, ayah: number, range: AyahRange): boolean {
  return (
    surah === range.surahNumber &&
    ayah >= range.startAyah &&
    ayah <= range.endAyah
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return an ordered list of unique (surah, ayah) pairs appearing on the page.
 * Only includes ayah-type lines (not surah_name / basmallah / empty).
 * Includes all ayahs, even muqatta'at (e.g. الٓمٓ 2:1) so they appear
 * in the memorization flow. The user can advance past them manually.
 */
export function getAyahsOnPage(page: MushafPage): AyahOnPage[] {
  const seen = new Set<string>();
  const result: AyahOnPage[] = [];

  for (const line of page.lines) {
    if (line.lineType !== "ayah") continue;
    for (const w of line.words) {
      const key = `${w.surahNumber}:${w.ayahNumber}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          surahNumber: w.surahNumber,
          ayahNumber: w.ayahNumber,
        });
      }
    }
  }
  return result;
}

/**
 * Concatenate the plain text of one ayah from a MushafPage.
 * Useful for passing to the mistake detector.
 */
export function getAyahTextFromPage(
  page: MushafPage,
  surahNumber: number,
  ayahNumber: number
): string {
  return getWordsForAyah(page, surahNumber, ayahNumber)
    .map((w) => (w.isAyahEnd ? stripAyahNumber(w.text) : w.text))
    .join(" ");
}

/**
 * Return the ordered list of word keys for a specific ayah on a page.
 * Useful for mapping word-index → mushaf word key for live tracking.
 */
export function getWordKeysForAyah(
  page: MushafPage,
  surahNumber: number,
  ayahNumber: number
): string[] {
  return getWordsForAyah(page, surahNumber, ayahNumber).map((w) => w.wordKey);
}

/**
 * Return the ordered list of word texts for a specific ayah on a page,
 * one entry per MushafWord (aligned 1:1 with `getWordKeysForAyah`).
 *
 * Unlike `getAyahTextFromPage` which joins with spaces and can create
 * misalignment when word texts contain internal spaces (e.g. "رَيْبَ ۛ"),
 * this returns exactly one text per word key.
 */
export function getWordTextsForAyah(
  page: MushafPage,
  surahNumber: number,
  ayahNumber: number
): string[] {
  return getWordsForAyah(page, surahNumber, ayahNumber).map((w) =>
    w.isAyahEnd ? stripAyahNumber(w.text) : w.text
  );
}

/**
 * Compute the set of word keys that should be hidden on the mushaf page
 * based on the current hide mode and difficulty.
 *
 * Words outside `ayahRange` are NEVER hidden.
 * Structural lines (surah_name, basmallah) and ayah-end markers are NEVER hidden.
 */
export function computeHiddenWordKeys(
  page: MushafPage,
  hideMode: HideMode,
  hideDifficulty: number,
  isHidden: boolean,
  revealedWordKeys: ReadonlySet<string>,
  ayahRange: AyahRange
): Set<string> {
  const hidden = new Set<string>();
  if (!isHidden) return hidden;

  // Modes that hide everything on mushaf (auxiliary panel shows mode-specific UI)
  const fullHideModes: HideMode[] = [
    "full_hide",
    "translation_recall",
    "audio_recall",
    "context_recall",
    "reverse_recall",
  ];

  for (const line of page.lines) {
    if (line.lineType !== "ayah") continue;

    for (const word of line.words) {
      if (!isInRange(word.surahNumber, word.ayahNumber, ayahRange)) continue;
      if (revealedWordKeys.has(word.wordKey)) continue;

      // Ayah-end markers contain word glyph + number glyph in QPC data.
      // Hide the ayah-end word so MushafWord renders a blank placeholder
      // for the word part while keeping the ayah number visible.
      // This applies to all ayahs including muqatta'at (e.g. الٓمٓ 2:1).
      if (word.isAyahEnd) {
        if (fullHideModes.includes(hideMode) || hideMode === "first_letter") {
          hidden.add(word.wordKey);
        }
        continue;
      }

      if (fullHideModes.includes(hideMode)) {
        hidden.add(word.wordKey);
      } else if (hideMode === "first_letter") {
        // first_letter hides all words but shows hint — handled by hintWordKeys
        hidden.add(word.wordKey);
      } else if (hideMode === "random_blank") {
        const verseKey = `${word.surahNumber}:${word.ayahNumber}`;
        const hidePercentage = hideDifficulty * 20;
        const random = seededRandom(verseKey, word.wordPosition);
        if (random * 100 < hidePercentage) {
          hidden.add(word.wordKey);
        }
      } else if (hideMode === "keyword_mode") {
        if (isParticle(word.text)) {
          hidden.add(word.wordKey);
        }
      }
    }
  }

  return hidden;
}

/**
 * Compute hint text for first_letter mode.
 * Returns a Map of wordKey → hint string (e.g. "ب...").
 * Only applies to words within the ayah range.
 */
export function computeHintWordKeys(
  page: MushafPage,
  ayahRange: AyahRange
): Map<string, string> {
  const hints = new Map<string, string>();

  for (const line of page.lines) {
    if (line.lineType !== "ayah") continue;
    for (const word of line.words) {
      if (!isInRange(word.surahNumber, word.ayahNumber, ayahRange)) continue;
      const text = word.isAyahEnd ? stripAyahNumber(word.text) : word.text;
      hints.set(word.wordKey, getFirstLetter(text) + "...");
    }
  }

  return hints;
}

/**
 * Convert a ComparisonResult for a single ayah into mistake word keys
 * on the mushaf page.
 */
export function computeMistakeWordKeys(
  page: MushafPage,
  surahNumber: number,
  ayahNumber: number,
  comparisonResult: ComparisonResult
): Set<string> {
  const mistakes = new Set<string>();
  const words = getWordsForAyah(page, surahNumber, ayahNumber);

  for (const wr of comparisonResult.wordResults) {
    if (wr.status === "wrong" || wr.status === "skipped") {
      // Find the word by matching text — wordResults are aligned with original words
      const idx = comparisonResult.wordResults.indexOf(wr);
      if (idx >= 0 && idx < words.length) {
        mistakes.add(words[idx].wordKey);
      }
    }
  }

  return mistakes;
}

/**
 * Convert a ComparisonResult for a single ayah into correct/highlighted word keys.
 */
export function computeCorrectWordKeys(
  page: MushafPage,
  surahNumber: number,
  ayahNumber: number,
  comparisonResult: ComparisonResult
): Set<string> {
  const correct = new Set<string>();
  const words = getWordsForAyah(page, surahNumber, ayahNumber);

  for (let i = 0; i < comparisonResult.wordResults.length; i++) {
    if (
      comparisonResult.wordResults[i].status === "correct" &&
      i < words.length
    ) {
      correct.add(words[i].wordKey);
    }
  }

  return correct;
}
