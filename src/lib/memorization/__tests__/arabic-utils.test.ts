import { describe, expect, it } from "vitest";

import {
  hasDiacritics,
  levenshteinDistance,
  normalizeArabic,
  removeDiacritics,
  splitIntoWords,
  wordSimilarity,
} from "../arabic-utils";

describe("removeDiacritics", () => {
  it("removes fathah, dammah, kasrah, shadda, sukun", () => {
    // bism with fathah, kasrah, sukun, shadda
    const withDiacritics = "\u0628\u0650\u0633\u0652\u0645\u0650";
    const result = removeDiacritics(withDiacritics);
    expect(result).toBe("\u0628\u0633\u0645"); // bsm
  });

  it("removes tanween (fathatan, dammatan, kasratan)", () => {
    // ahad with tanween fathah: \u064B
    const input = "\u0623\u064E\u062D\u064E\u062F\u064C";
    const result = removeDiacritics(input);
    expect(result).toBe("\u0623\u062D\u062F"); // ahd
  });

  it("removes superscript alef (U+0670)", () => {
    const input = "\u0631\u064E\u062D\u0670\u0645";
    const result = removeDiacritics(input);
    expect(result).toBe("\u0631\u062D\u0645");
  });

  it("returns empty string for empty input", () => {
    expect(removeDiacritics("")).toBe("");
  });

  it("leaves non-diacritic characters intact", () => {
    const input = "\u0628\u0633\u0645"; // bsm with no diacritics
    expect(removeDiacritics(input)).toBe(input);
  });
});

describe("normalizeArabic", () => {
  it("normalizes alef variants to bare alef", () => {
    // hamza above: \u0623, hamza below: \u0625, madda: \u0622, wasla: \u0671
    expect(normalizeArabic("\u0623")).toBe("\u0627"); // alef with hamza above -> alef
    expect(normalizeArabic("\u0625")).toBe("\u0627"); // alef with hamza below -> alef
    expect(normalizeArabic("\u0622")).toBe("\u0627"); // alef with madda -> alef
    expect(normalizeArabic("\u0671")).toBe("\u0627"); // alef wasla -> alef
  });

  it("normalizes taa marbuta to haa", () => {
    // taa marbuta: \u0629 -> haa: \u0647
    expect(normalizeArabic("\u0631\u062D\u0645\u0629")).toBe(
      "\u0631\u062D\u0645\u0647"
    );
  });

  it("normalizes alef maksura to yaa", () => {
    // alef maksura: \u0649 -> yaa: \u064A
    expect(normalizeArabic("\u0639\u0644\u0649")).toBe("\u0639\u0644\u064A");
  });

  it("normalizes waw with hamza to waw", () => {
    // \u0624 -> \u0648
    expect(normalizeArabic("\u0624")).toBe("\u0648");
  });

  it("normalizes yaa with hamza to yaa", () => {
    // \u0626 -> \u064A
    expect(normalizeArabic("\u0626")).toBe("\u064A");
  });

  it("removes tatweel/kashida", () => {
    // tatweel is \u0640
    const input = "\u0639\u0640\u0640\u0644\u0645";
    const result = normalizeArabic(input);
    expect(result).toBe("\u0639\u0644\u0645");
  });

  it("removes diacritics as part of normalization", () => {
    const withDiacritics = "\u0628\u0650\u0633\u0652\u0645\u0650";
    const result = normalizeArabic(withDiacritics);
    expect(result).toBe("\u0628\u0633\u0645");
  });

  it("collapses and trims whitespace", () => {
    const input = "  \u0628\u0633\u0645   \u0627\u0644\u0644\u0647  ";
    const result = normalizeArabic(input);
    expect(result).toBe("\u0628\u0633\u0645 \u0627\u0644\u0644\u0647");
  });

  it("handles combined normalization", () => {
    // Input with diacritics, alef variant, taa marbuta
    const input =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0623\u064E\u062D\u064E\u062F\u064C \u0631\u062D\u0645\u0629";
    const result = normalizeArabic(input);
    // Should have no diacritics, alef variant normalized, taa marbuta -> haa
    expect(result).toBe(
      "\u0628\u0633\u0645 \u0627\u062D\u062F \u0631\u062D\u0645\u0647"
    );
  });
});

describe("splitIntoWords", () => {
  it("splits Arabic text on whitespace", () => {
    const text =
      "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646";
    const words = splitIntoWords(text);
    expect(words).toHaveLength(3);
    expect(words[0]).toBe("\u0628\u0633\u0645");
    expect(words[1]).toBe("\u0627\u0644\u0644\u0647");
    expect(words[2]).toBe("\u0627\u0644\u0631\u062D\u0645\u0646");
  });

  it("returns empty array for empty string", () => {
    expect(splitIntoWords("")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(splitIntoWords("   ")).toEqual([]);
  });

  it("handles single word", () => {
    const words = splitIntoWords("\u0628\u0633\u0645");
    expect(words).toHaveLength(1);
    expect(words[0]).toBe("\u0628\u0633\u0645");
  });

  it("handles multiple spaces between words", () => {
    const text = "\u0628\u0633\u0645   \u0627\u0644\u0644\u0647";
    const words = splitIntoWords(text);
    expect(words).toHaveLength(2);
  });

  it("trims leading and trailing whitespace", () => {
    const text = "  \u0628\u0633\u0645 \u0627\u0644\u0644\u0647  ";
    const words = splitIntoWords(text);
    expect(words).toHaveLength(2);
    expect(words[0]).toBe("\u0628\u0633\u0645");
  });
});

describe("hasDiacritics", () => {
  it("returns true for text with diacritics", () => {
    expect(hasDiacritics("\u0628\u0650\u0633\u0652\u0645\u0650")).toBe(true);
  });

  it("returns false for text without diacritics", () => {
    expect(hasDiacritics("\u0628\u0633\u0645")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(hasDiacritics("")).toBe(false);
  });
});

describe("wordSimilarity", () => {
  it("returns 1.0 for identical words", () => {
    const word = "\u0628\u0650\u0633\u0652\u0645\u0650";
    expect(wordSimilarity(word, word)).toBe(1.0);
  });

  it("returns 0.9 for diacritics-only differences", () => {
    const withDiacritics = "\u0628\u0650\u0633\u0652\u0645\u0650";
    const withoutDiacritics = "\u0628\u0633\u0645";
    expect(wordSimilarity(withDiacritics, withoutDiacritics)).toBe(0.9);
  });

  it("returns value between 0 and 1 for different words", () => {
    const word1 = "\u0628\u0633\u0645";
    const word2 = "\u0642\u0644\u0645";
    const sim = wordSimilarity(word1, word2);
    expect(sim).toBeGreaterThanOrEqual(0);
    expect(sim).toBeLessThanOrEqual(1);
  });

  it("returns 0.9 for alef variant differences", () => {
    // These normalize to the same thing
    const word1 = "\u0623\u062D\u062F"; // with hamza
    const word2 = "\u0627\u062D\u062F"; // bare alef
    expect(wordSimilarity(word1, word2)).toBe(0.9);
  });

  it("returns 1.0 for two empty strings", () => {
    expect(wordSimilarity("", "")).toBe(1.0);
  });
});

describe("levenshteinDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshteinDistance("abc", "abc")).toBe(0);
  });

  it("returns length of string when compared with empty", () => {
    expect(levenshteinDistance("abc", "")).toBe(3);
    expect(levenshteinDistance("", "abc")).toBe(3);
  });

  it("returns 1 for single character difference", () => {
    expect(levenshteinDistance("abc", "adc")).toBe(1);
  });

  it("handles insertions", () => {
    expect(levenshteinDistance("abc", "abcd")).toBe(1);
  });

  it("handles deletions", () => {
    expect(levenshteinDistance("abcd", "abc")).toBe(1);
  });

  it("is symmetric", () => {
    const d1 = levenshteinDistance("kitten", "sitting");
    const d2 = levenshteinDistance("sitting", "kitten");
    expect(d1).toBe(d2);
  });

  it("computes correct distance for known example", () => {
    // kitten -> sitting: 3 operations
    expect(levenshteinDistance("kitten", "sitting")).toBe(3);
  });
});
