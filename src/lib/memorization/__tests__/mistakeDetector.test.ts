import { describe, expect, it } from "vitest";

import { compareRecitation } from "../mistakeDetector";

// Sample Arabic texts for testing
// Basmala: bismillah ir-rahman ir-raheem
const BASMALA =
  "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650";
// "bismi" "allahi" "alrrahmani" "alrraheemi"

// Same text without diacritics (tashkeel)
const BASMALA_NO_DIACRITICS =
  "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645";

// A completely different set of words
const DIFFERENT_TEXT =
  "\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u064C";
// "qul" "huwa" "allahu" "ahad"

describe("compareRecitation", () => {
  it("returns 100% accuracy and 0 mistakes for exact match", () => {
    const result = compareRecitation(BASMALA, BASMALA);
    expect(result.accuracy).toBe(100);
    expect(result.mistakes).toHaveLength(0);
    expect(result.totalWords).toBe(4);
    expect(result.correctWords).toBe(4);
  });

  it("returns 0% accuracy and all words skipped for empty recitation", () => {
    const result = compareRecitation(BASMALA, "");
    expect(result.accuracy).toBe(0);
    expect(result.totalWords).toBe(4);
    expect(result.correctWords).toBe(0);
    expect(result.mistakes).toHaveLength(4);
    for (const mistake of result.mistakes) {
      expect(mistake.type).toBe("skipped");
      expect(mistake.recitedText).toBeNull();
      expect(mistake.severity).toBe("major");
    }
  });

  it("returns 100% for empty original and empty recitation", () => {
    const result = compareRecitation("", "");
    expect(result.accuracy).toBe(100);
    expect(result.totalWords).toBe(0);
    expect(result.correctWords).toBe(0);
    expect(result.mistakes).toHaveLength(0);
    expect(result.wordResults).toHaveLength(0);
  });

  it("detects a replaced word as skipped + added via LCS alignment", () => {
    // Replace second word "allahi" with "kitab" (completely different)
    const original =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650";
    const recited =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0643\u062A\u0627\u0628 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650";
    const result = compareRecitation(original, recited, "strict");

    // LCS aligns first and third words; "allahi" is skipped, "kitab" is added
    expect(result.accuracy).toBeLessThan(100);
    expect(result.mistakes.length).toBeGreaterThanOrEqual(1);
    const types = result.mistakes.map((m) => m.type);
    expect(types).toContain("skipped");
    expect(types).toContain("added");
  });

  it("detects a skipped word", () => {
    // Original has 4 words, recited has only 3 (skipping the second)
    const original =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650";
    const recited =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650";
    const result = compareRecitation(original, recited);

    const skippedMistakes = result.mistakes.filter((m) => m.type === "skipped");
    expect(skippedMistakes.length).toBeGreaterThanOrEqual(1);
    expect(result.correctWords).toBeLessThan(result.totalWords);
  });

  it("detects an added/extra word", () => {
    // User recites an extra word not in the original
    const original =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650";
    const recited =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0643\u062A\u0627\u0628 \u0627\u0644\u0644\u0651\u064E\u0647\u0650";
    const result = compareRecitation(original, recited);

    const addedMistakes = result.mistakes.filter((m) => m.type === "added");
    expect(addedMistakes.length).toBeGreaterThanOrEqual(1);
    expect(addedMistakes[0].severity).toBe("minor");
  });

  it("strict mode treats diacritics-stripped text as mismatched (skipped+added)", () => {
    // In strict mode, LCS compares with diacritics preserved, so
    // "bismi" (with tashkeel) != "bsm" (without) - they won't align
    const result = compareRecitation(BASMALA, BASMALA_NO_DIACRITICS, "strict");

    // Strict mode can't align these via LCS, so words are skipped/added
    expect(result.accuracy).toBeLessThan(100);
    expect(result.mistakes.length).toBeGreaterThan(0);
  });

  it("treats tashkeel-only differences as correct in normal sensitivity", () => {
    const result = compareRecitation(BASMALA, BASMALA_NO_DIACRITICS, "normal");
    // In normal mode, diacritics are ignored, so all words should be correct
    expect(result.accuracy).toBe(100);
    expect(result.mistakes).toHaveLength(0);
  });

  it("works correctly with single word input", () => {
    const original = "\u0628\u0650\u0633\u0652\u0645\u0650";
    const result = compareRecitation(original, original);
    expect(result.accuracy).toBe(100);
    expect(result.totalWords).toBe(1);
    expect(result.correctWords).toBe(1);
    expect(result.mistakes).toHaveLength(0);
  });

  it("handles long verses with multiple mistake types", () => {
    // 5 original words
    const original =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650 \u0642\u064F\u0644\u0652";
    // Recited: skip word 2 ("allahi"), and add an extra word at the end
    const recited =
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650 \u0642\u064F\u0644\u0652 \u0643\u062A\u0627\u0628";
    const result = compareRecitation(original, recited);

    // Should have at least one skipped and one added
    const types = result.mistakes.map((m) => m.type);
    expect(types).toContain("skipped");
    expect(types).toContain("added");
    expect(result.totalWords).toBe(5);
  });

  it("marks all correct words as 'correct' in wordResults", () => {
    const result = compareRecitation(BASMALA, BASMALA);
    expect(result.wordResults).toHaveLength(4);
    for (const wr of result.wordResults) {
      expect(wr.status).toBe("correct");
      expect(wr.similarity).toBe(1.0);
      expect(wr.recitedWord).not.toBeNull();
    }
  });

  it("marks skipped words correctly in wordResults", () => {
    const result = compareRecitation(BASMALA, "");
    for (const wr of result.wordResults) {
      expect(wr.status).toBe("skipped");
      expect(wr.recitedWord).toBeNull();
      expect(wr.similarity).toBe(0);
    }
  });

  it("wordResults length matches totalWords", () => {
    const result = compareRecitation(BASMALA, BASMALA);
    expect(result.wordResults).toHaveLength(result.totalWords);
  });

  it("completely different text yields low accuracy", () => {
    const result = compareRecitation(BASMALA, DIFFERENT_TEXT);
    expect(result.accuracy).toBeLessThan(50);
  });

  it("lenient sensitivity is more forgiving", () => {
    // Use similar but not identical words
    const original =
      "\u0623\u064E\u062D\u064E\u062F\u064C \u0627\u0644\u0644\u0651\u064E\u0647\u064F";
    const recited = "\u0627\u062D\u062F \u0627\u0644\u0644\u0647"; // simplified forms
    const strictResult = compareRecitation(original, recited, "strict");
    const lenientResult = compareRecitation(original, recited, "lenient");

    // Lenient should be at least as accurate as strict
    expect(lenientResult.accuracy).toBeGreaterThanOrEqual(
      strictResult.accuracy
    );
  });
});
