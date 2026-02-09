/**
 * Tajweed Rule Detector
 *
 * Character-by-character Arabic text analysis engine that detects Tajweed rules
 * for color-coded rendering in the Mushaf.
 */

import {
  TAJWEED_COLORS,
  type TajweedRule,
  type TajweedRuleType,
} from "@/types/quran";

// ===== Arabic Character Constants =====

const SUKUN = "\u0652";
const FATHA = "\u064E";
const KASRA = "\u0650";
const DAMMA = "\u064F";
const SHADDA = "\u0651";
const TANWEEN_FATH = "\u064B";
const TANWEEN_KASR = "\u064D";
const TANWEEN_DAMM = "\u064C";
const ALEF = "\u0627";
const WAW = "\u0648";
const YA = "\u064A";
const NOON = "\u0646";
const MEEM = "\u0645";
const BA = "\u0628";
const LAM = "\u0644";

// Alef with various forms
const ALEF_MADDA = "\u0622"; // Alef with Madda above
const ALEF_HAMZA_ABOVE = "\u0623";
const ALEF_HAMZA_BELOW = "\u0625";
const ALEF_WASLA = "\u0671";

// ===== Character Sets =====

/** Diacritics/tashkeel that should be skipped when finding the next "meaningful" letter */
const DIACRITICS = new Set([
  FATHA,
  KASRA,
  DAMMA,
  SUKUN,
  SHADDA,
  TANWEEN_FATH,
  TANWEEN_KASR,
  TANWEEN_DAMM,
  "\u0610", // ARABIC SIGN SALLALLAHOU ALAYHE WASSALLAM
  "\u0611", // ARABIC SIGN ALAYHE ASSALLAM
  "\u0612", // ARABIC SIGN RAHMATULLAH ALAYHE
  "\u0613", // ARABIC SIGN RADI ALLAHOU ANHU
  "\u0614", // ARABIC SIGN TAKHALLUS
  "\u0615", // ARABIC SMALL HIGH TAH
  "\u0616", // ARABIC SMALL HIGH LIGATURE ALEF WITH LAM WITH YEH
  "\u0617", // ARABIC SMALL HIGH ZAIN
  "\u0618", // ARABIC SMALL FATHA
  "\u0619", // ARABIC SMALL DAMMA
  "\u061A", // ARABIC SMALL KASRA
  "\u064B", // FATHATAN
  "\u064C", // DAMMATAN
  "\u064D", // KASRATAN
  "\u064E", // FATHA
  "\u064F", // DAMMA
  "\u0650", // KASRA
  "\u0651", // SHADDA
  "\u0652", // SUKUN
  "\u0653", // ARABIC MADDAH ABOVE
  "\u0654", // ARABIC HAMZA ABOVE
  "\u0655", // ARABIC HAMZA BELOW
  "\u0656", // ARABIC SUBSCRIPT ALEF
  "\u0657", // ARABIC INVERTED DAMMA
  "\u0658", // ARABIC MARK NOON GHUNNA
  "\u0670", // ARABIC LETTER SUPERSCRIPT ALEF (dagger alef)
  "\u06D6", // ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
  "\u06D7", // ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
  "\u06D8", // ARABIC SMALL HIGH MEEM INITIAL FORM
  "\u06D9", // ARABIC SMALL HIGH LAM ALEF
  "\u06DA", // ARABIC SMALL HIGH JEEM
  "\u06DB", // ARABIC SMALL HIGH THREE DOTS
  "\u06DC", // ARABIC SMALL HIGH SEEN
  "\u06DF", // ARABIC SMALL HIGH ROUNDED ZERO
  "\u06E0", // ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
  "\u06E1", // ARABIC SMALL HIGH DOTLESS HEAD OF KHAH
  "\u06E2", // ARABIC SMALL HIGH MEEM ISOLATED FORM
  "\u06E3", // ARABIC SMALL LOW SEEN
  "\u06E4", // ARABIC SMALL HIGH MADDA
  "\u06E5", // ARABIC SMALL WAW
  "\u06E6", // ARABIC SMALL YEH
  "\u06E7", // ARABIC SMALL HIGH YEH
  "\u06E8", // ARABIC SMALL HIGH NOON
  "\u06EA", // ARABIC EMPTY CENTRE LOW STOP
  "\u06EB", // ARABIC EMPTY CENTRE HIGH STOP
  "\u06EC", // ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE
  "\u06ED", // ARABIC SMALL LOW MEEM
]);

/** Tanween marks */
const TANWEEN = new Set([TANWEEN_FATH, TANWEEN_KASR, TANWEEN_DAMM]);

/** Qalqalah letters */
const QALQALAH_LETTERS = new Set([
  "\u0642", // Qaf
  "\u0637", // Ta (emphatic)
  BA, // Ba
  "\u062C", // Jim
  "\u062F", // Dal
]);

/** Ikhfa letters - letters after noon sakinah/tanween that trigger ikhfa */
const IKHFA_LETTERS = new Set([
  "\u062A", // Ta
  "\u062B", // Tha
  "\u062C", // Jim
  "\u062F", // Dal
  "\u0630", // Dhal
  "\u0632", // Za
  "\u0633", // Sin
  "\u0634", // Shin
  "\u0635", // Sad
  "\u0636", // Dad
  "\u0637", // Ta (emphatic)
  "\u0638", // Dha (emphatic)
  "\u0641", // Fa
  "\u0642", // Qaf
  "\u0643", // Kaf
]);

/** Idgham with Ghunnah letters */
const IDGHAM_GHUNNAH_LETTERS = new Set([
  YA, // Ya
  NOON, // Noon
  MEEM, // Meem
  WAW, // Waw
]);

/** Idgham without Ghunnah letters */
const IDGHAM_NO_GHUNNAH_LETTERS = new Set([
  LAM, // Lam
  "\u0631", // Ra
]);

/** Izhar letters (throat letters) */
const IZHAR_LETTERS = new Set([
  "\u0621", // Hamza (standalone)
  "\u0623", // Alef with Hamza above
  "\u0625", // Alef with Hamza below
  "\u0624", // Waw with Hamza above
  "\u0626", // Ya with Hamza above
  "\u0647", // Ha
  "\u0639", // Ain
  "\u062D", // Haa
  "\u063A", // Ghain
  "\u062E", // Kha
  "\u0621", // Hamza
]);

/** The 6 actual throat letters for Izhar (without hamza variants) */
const IZHAR_THROAT_LETTERS = new Set([
  "\u0621", // Hamza
  "\u0647", // Ha
  "\u0639", // Ain
  "\u062D", // Haa
  "\u063A", // Ghain
  "\u062E", // Kha
]);

/** Shamsiyah letters - lam becomes silent before these */
const SHAMSIYAH_LETTERS = new Set([
  "\u062A", // Ta
  "\u062B", // Tha
  "\u062F", // Dal
  "\u0630", // Dhal
  "\u0631", // Ra
  "\u0632", // Za
  "\u0633", // Sin
  "\u0634", // Shin
  "\u0635", // Sad
  "\u0636", // Dad
  "\u0637", // Ta (emphatic)
  "\u0638", // Dha (emphatic)
  NOON, // Noon
  LAM, // Lam
]);

/** Alef variants */
const ALEF_VARIANTS = new Set([
  ALEF,
  ALEF_MADDA,
  ALEF_HAMZA_ABOVE,
  ALEF_HAMZA_BELOW,
  ALEF_WASLA,
  "\u0649", // Alef Maqsura
]);

// ===== Helper Functions =====

/**
 * Check if a character is a diacritic/tashkeel mark
 */
function isDiacritic(ch: string): boolean {
  return DIACRITICS.has(ch);
}

/**
 * Check if a character is a base Arabic letter (not a diacritic)
 */
function isArabicLetter(ch: string): boolean {
  const code = ch.charCodeAt(0);
  // Arabic block: 0x0621-0x064A (letters), 0x0671-0x06D3 (extended)
  return (
    ((code >= 0x0621 && code <= 0x064a) ||
      (code >= 0x0671 && code <= 0x06d3) ||
      code === 0x0622 || // Alef Madda
      code === 0x0623 || // Alef Hamza above
      code === 0x0625 || // Alef Hamza below
      code === 0x0627) && // Alef
    !isDiacritic(ch)
  );
}

/**
 * Get the next meaningful (non-diacritic) character in the text.
 * Skips over diacritics and whitespace to find the next base letter.
 * Returns { char, index } or null if not found.
 */
function getNextMeaningfulChar(
  text: string,
  startIndex: number
): { char: string; index: number } | null {
  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (isArabicLetter(ch)) {
      return { char: ch, index: i };
    }
    // Skip diacritics and spaces
    if (
      isDiacritic(ch) ||
      ch === " " ||
      ch === "\u200B" ||
      ch === "\u200C" ||
      ch === "\u200D"
    ) {
      continue;
    }
    // If we encounter a non-Arabic, non-diacritic, non-space char, stop
    // This handles end-of-word boundaries
    if (!isDiacritic(ch) && ch !== " ") {
      // Could be a number or other character - check if Arabic
      const code = ch.charCodeAt(0);
      if (code >= 0x0660 && code <= 0x0669) {
        // Arabic-Indic digit, skip
        continue;
      }
      if (code >= 0x06f0 && code <= 0x06f9) {
        // Extended Arabic-Indic digit, skip
        continue;
      }
    }
  }
  return null;
}

/**
 * Check if a character at position has sukun on it
 */
function hasSukun(text: string, letterIndex: number): boolean {
  for (let i = letterIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (ch === SUKUN) return true;
    if (!isDiacritic(ch)) break; // Hit next letter
  }
  return false;
}

/**
 * Check if a character at position has shadda on it
 */
function hasShadda(text: string, letterIndex: number): boolean {
  for (let i = letterIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (ch === SHADDA) return true;
    if (!isDiacritic(ch)) break;
  }
  return false;
}

/**
 * Check if a character at position has a tanween mark
 */
function hasTanween(text: string, letterIndex: number): boolean {
  for (let i = letterIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (TANWEEN.has(ch)) return true;
    if (!isDiacritic(ch)) break;
  }
  return false;
}

/**
 * Check if a character has fatha
 */
function hasFatha(text: string, letterIndex: number): boolean {
  for (let i = letterIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (ch === FATHA || ch === TANWEEN_FATH) return true;
    if (!isDiacritic(ch)) break;
  }
  return false;
}

/**
 * Check if a character has kasra
 */
function hasKasra(text: string, letterIndex: number): boolean {
  for (let i = letterIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (ch === KASRA || ch === TANWEEN_KASR) return true;
    if (!isDiacritic(ch)) break;
  }
  return false;
}

/**
 * Check if a character has damma
 */
function hasDamma(text: string, letterIndex: number): boolean {
  for (let i = letterIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (ch === DAMMA || ch === TANWEEN_DAMM) return true;
    if (!isDiacritic(ch)) break;
  }
  return false;
}

/**
 * Get the end index for a rule that spans a letter + its diacritics
 */
function getLetterEndIndex(text: string, letterIndex: number): number {
  let end = letterIndex;
  for (let i = letterIndex + 1; i < text.length; i++) {
    if (isDiacritic(text[i])) {
      end = i;
    } else {
      break;
    }
  }
  return end;
}

/**
 * Create a TajweedRule object
 */
function createRule(
  type: TajweedRuleType,
  startChar: number,
  endChar: number,
  description?: string
): TajweedRule {
  return {
    type,
    startChar,
    endChar,
    color: TAJWEED_COLORS[type],
    description,
  };
}

// ===== Memoization Cache =====

const MAX_CACHE_SIZE = 1000;
const detectionCache = new Map<string, TajweedRule[]>();

function getCachedOrDetect(text: string): TajweedRule[] {
  const cached = detectionCache.get(text);
  if (cached) {
    return cached;
  }

  const rules = detectRulesInternal(text);

  // Evict oldest entries if cache is too large
  if (detectionCache.size >= MAX_CACHE_SIZE) {
    const firstKey = detectionCache.keys().next().value;
    if (firstKey !== undefined) {
      detectionCache.delete(firstKey);
    }
  }

  detectionCache.set(text, rules);
  return rules;
}

// ===== Main Detection Logic =====

/**
 * Detect all Tajweed rules in a given Arabic text string.
 *
 * Returns an array of TajweedRule objects sorted by startChar position.
 * Each rule specifies the character range, type, and color for rendering.
 *
 * @param text - Arabic text to analyze (typically a single word)
 * @returns Array of detected TajweedRule objects
 */
export function detectTajweedRules(text: string): TajweedRule[] {
  if (!text || text.length === 0) {
    return [];
  }
  return getCachedOrDetect(text);
}

function detectRulesInternal(text: string): TajweedRule[] {
  const rules: TajweedRule[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    // Skip diacritics - we process from the base letter
    if (isDiacritic(ch)) continue;

    // ===== 1. Ghunnah: Noon or Meem with Shadda =====
    if ((ch === NOON || ch === MEEM) && hasShadda(text, i)) {
      const endIdx = getLetterEndIndex(text, i);
      rules.push(
        createRule("ghunnah", i, endIdx, "Ghunnah - nasalization for 2 counts")
      );
      continue; // Shadda noon/meem is ghunnah, don't check other rules
    }

    // ===== 2. Noon Sakinah & Tanween Rules =====
    if (ch === NOON && (hasSukun(text, i) || hasTanween(text, i))) {
      const noonEnd = getLetterEndIndex(text, i);
      const next = getNextMeaningfulChar(text, noonEnd + 1);

      if (next) {
        const nextChar = next.char;
        const nextEnd = getLetterEndIndex(text, next.index);

        // Iqlab: before Ba
        if (nextChar === BA) {
          rules.push(
            createRule(
              "iqlab",
              i,
              nextEnd,
              "Iqlab - noon changes to meem before ba"
            )
          );
          continue;
        }

        // Idgham with Ghunnah: before Ya, Noon, Meem, Waw
        if (IDGHAM_GHUNNAH_LETTERS.has(nextChar) && nextChar !== NOON) {
          // When next letter is also noon, it's izhar, not idgham
          rules.push(
            createRule(
              "idgham_ghunnah",
              i,
              nextEnd,
              "Idgham with Ghunnah - merging with nasalization"
            )
          );
          continue;
        }

        // Special case: noon sakinah followed by noon - could be idgham or ghunnah
        if (nextChar === NOON && !hasShadda(text, next.index)) {
          rules.push(
            createRule(
              "idgham_ghunnah",
              i,
              nextEnd,
              "Idgham with Ghunnah - noon merges into noon"
            )
          );
          continue;
        }

        // Idgham without Ghunnah: before Lam, Ra
        if (IDGHAM_NO_GHUNNAH_LETTERS.has(nextChar)) {
          rules.push(
            createRule(
              "idgham_no_ghunnah",
              i,
              nextEnd,
              "Idgham without Ghunnah - merging without nasalization"
            )
          );
          continue;
        }

        // Ikhfa: before the 15 ikhfa letters
        if (IKHFA_LETTERS.has(nextChar)) {
          rules.push(
            createRule("ikhfa", i, nextEnd, "Ikhfa - hiding the noon sound")
          );
          continue;
        }

        // Izhar: before throat letters
        if (IZHAR_THROAT_LETTERS.has(nextChar) || IZHAR_LETTERS.has(nextChar)) {
          rules.push(
            createRule(
              "izhar",
              i,
              noonEnd,
              "Izhar - clear pronunciation of noon"
            )
          );
          continue;
        }
      }
    }

    // Tanween on any letter (not noon)
    if (ch !== NOON && isArabicLetter(ch) && hasTanween(text, i)) {
      const letterEnd = getLetterEndIndex(text, i);
      const next = getNextMeaningfulChar(text, letterEnd + 1);

      if (next) {
        const nextChar = next.char;
        const nextEnd = getLetterEndIndex(text, next.index);

        // Iqlab: tanween before Ba
        if (nextChar === BA) {
          rules.push(
            createRule(
              "iqlab",
              i,
              nextEnd,
              "Iqlab - tanween changes to meem before ba"
            )
          );
          continue;
        }

        // Idgham with Ghunnah: tanween before Ya, Noon, Meem, Waw
        if (IDGHAM_GHUNNAH_LETTERS.has(nextChar)) {
          rules.push(
            createRule(
              "idgham_ghunnah",
              i,
              nextEnd,
              "Idgham with Ghunnah - tanween merging with nasalization"
            )
          );
          continue;
        }

        // Idgham without Ghunnah: tanween before Lam, Ra
        if (IDGHAM_NO_GHUNNAH_LETTERS.has(nextChar)) {
          rules.push(
            createRule(
              "idgham_no_ghunnah",
              i,
              nextEnd,
              "Idgham without Ghunnah - tanween merging without nasalization"
            )
          );
          continue;
        }

        // Ikhfa: tanween before ikhfa letters
        if (IKHFA_LETTERS.has(nextChar)) {
          rules.push(
            createRule("ikhfa", i, nextEnd, "Ikhfa - hiding the tanween sound")
          );
          continue;
        }

        // Izhar: tanween before throat letters
        if (IZHAR_THROAT_LETTERS.has(nextChar) || IZHAR_LETTERS.has(nextChar)) {
          rules.push(
            createRule(
              "izhar",
              i,
              letterEnd,
              "Izhar - clear pronunciation of tanween"
            )
          );
          continue;
        }
      }
    }

    // ===== 3. Meem Sakinah Rules =====
    if (ch === MEEM && hasSukun(text, i)) {
      const meemEnd = getLetterEndIndex(text, i);
      const next = getNextMeaningfulChar(text, meemEnd + 1);

      if (next) {
        const nextChar = next.char;
        const nextEnd = getLetterEndIndex(text, next.index);

        // Ikhfa Shafawi: meem sakinah before ba
        if (nextChar === BA) {
          rules.push(
            createRule(
              "ikhfa_shafawi",
              i,
              nextEnd,
              "Ikhfa Shafawi - lip hiding before ba"
            )
          );
          continue;
        }

        // Idgham Shafawi would be meem sakinah before meem - this becomes ghunnah
        // Already handled above as ghunnah for meem+shadda
        if (nextChar === MEEM) {
          rules.push(
            createRule(
              "ghunnah",
              i,
              nextEnd,
              "Idgham Meem - meem merges into meem with ghunnah"
            )
          );
          continue;
        }

        // Izhar Shafawi: meem sakinah before any other letter
        rules.push(
          createRule(
            "izhar_shafawi",
            i,
            meemEnd,
            "Izhar Shafawi - clear pronunciation of meem"
          )
        );
        continue;
      }
    }

    // ===== 4. Qalqalah =====
    if (QALQALAH_LETTERS.has(ch) && hasSukun(text, i)) {
      const letterEnd = getLetterEndIndex(text, i);
      rules.push(
        createRule("qalqalah", i, letterEnd, "Qalqalah - echoing bounce sound")
      );
      continue;
    }

    // ===== 5. Madd Rules =====
    // Natural Madd: Alef after fatha, Waw after damma, Ya after kasra
    if (ALEF_VARIANTS.has(ch) && i > 0) {
      // Find previous base letter
      let prevLetterIdx = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (isArabicLetter(text[j])) {
          prevLetterIdx = j;
          break;
        }
      }

      if (prevLetterIdx >= 0 && hasFatha(text, prevLetterIdx)) {
        const alefEnd = getLetterEndIndex(text, i);
        const next = getNextMeaningfulChar(text, alefEnd + 1);

        // Connected Madd (Muttasil): madd letter followed by hamza in same word
        if (
          next &&
          (next.char === "\u0621" ||
            next.char === ALEF_HAMZA_ABOVE ||
            next.char === ALEF_HAMZA_BELOW ||
            next.char === "\u0624" ||
            next.char === "\u0626")
        ) {
          rules.push(
            createRule(
              "madd_muttasil",
              prevLetterIdx,
              getLetterEndIndex(text, next.index),
              "Madd Muttasil - connected elongation (4-5 counts)"
            )
          );
          continue;
        }

        // Normal Madd (2 counts)
        rules.push(
          createRule(
            "madd_normal",
            prevLetterIdx,
            alefEnd,
            "Madd Tabii - natural elongation (2 counts)"
          )
        );
        continue;
      }
    }

    if (ch === WAW && !hasSukun(text, i) && i > 0) {
      let prevLetterIdx = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (isArabicLetter(text[j])) {
          prevLetterIdx = j;
          break;
        }
      }

      if (
        prevLetterIdx >= 0 &&
        hasDamma(text, prevLetterIdx) &&
        hasSukun(text, i)
      ) {
        // Waw sakinah after damma is madd
        const wawEnd = getLetterEndIndex(text, i);
        rules.push(
          createRule(
            "madd_normal",
            prevLetterIdx,
            wawEnd,
            "Madd Tabii - natural elongation with waw (2 counts)"
          )
        );
        continue;
      }
    }

    // Ya sakinah after kasra = madd
    if (ch === YA && i > 0) {
      let prevLetterIdx = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (isArabicLetter(text[j])) {
          prevLetterIdx = j;
          break;
        }
      }

      if (
        prevLetterIdx >= 0 &&
        hasKasra(text, prevLetterIdx) &&
        hasSukun(text, i)
      ) {
        const yaEnd = getLetterEndIndex(text, i);
        const next = getNextMeaningfulChar(text, yaEnd + 1);

        // Connected Madd
        if (
          next &&
          (next.char === "\u0621" ||
            next.char === ALEF_HAMZA_ABOVE ||
            next.char === "\u0626")
        ) {
          rules.push(
            createRule(
              "madd_muttasil",
              prevLetterIdx,
              getLetterEndIndex(text, next.index),
              "Madd Muttasil - connected elongation with ya (4-5 counts)"
            )
          );
          continue;
        }

        rules.push(
          createRule(
            "madd_normal",
            prevLetterIdx,
            yaEnd,
            "Madd Tabii - natural elongation with ya (2 counts)"
          )
        );
        continue;
      }
    }

    // Alef Madda - special case for madd lazim/obligatory
    if (ch === ALEF_MADDA) {
      const alefEnd = getLetterEndIndex(text, i);
      rules.push(
        createRule(
          "madd_lazim",
          i,
          alefEnd,
          "Madd Lazim - obligatory elongation (6 counts)"
        )
      );
      continue;
    }

    // ===== 6. Lam Rules (Al-Shamsiyah & Al-Qamariyah) =====
    if (ch === LAM && i > 0) {
      // Check if this is lam of al- (preceded by alef)
      let prevLetterIdx = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (isArabicLetter(text[j])) {
          prevLetterIdx = j;
          break;
        }
      }

      if (prevLetterIdx >= 0 && ALEF_VARIANTS.has(text[prevLetterIdx])) {
        const lamEnd = getLetterEndIndex(text, i);
        const next = getNextMeaningfulChar(text, lamEnd + 1);

        if (next && SHAMSIYAH_LETTERS.has(next.char)) {
          // Lam Shamsiyah - lam is silent, next letter has shadda
          rules.push(
            createRule(
              "idgham_no_ghunnah",
              i,
              getLetterEndIndex(text, next.index),
              "Lam Shamsiyah - lam merges into next letter"
            )
          );
          continue;
        }
        // Lam Qamariyah: lam is pronounced clearly - no special highlighting needed
      }
    }
  }

  // Sort rules by start position and remove overlaps
  rules.sort((a, b) => a.startChar - b.startChar);
  return deduplicateRules(rules);
}

/**
 * Remove overlapping rules, keeping the first (highest priority) one
 */
function deduplicateRules(rules: TajweedRule[]): TajweedRule[] {
  if (rules.length <= 1) return rules;

  const result: TajweedRule[] = [rules[0]];

  for (let i = 1; i < rules.length; i++) {
    const prev = result[result.length - 1];
    const curr = rules[i];

    // If current rule starts after previous rule ends, no overlap
    if (curr.startChar > prev.endChar) {
      result.push(curr);
    }
    // Otherwise skip (overlap) - keep the first one
  }

  return result;
}

/**
 * Clear the detection cache. Useful for testing or memory management.
 */
export function clearDetectionCache(): void {
  detectionCache.clear();
}
