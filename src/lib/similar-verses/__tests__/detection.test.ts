import { describe, expect, it } from "vitest";

import {
  detectSimilarVerses,
  findSimilarTo,
  highlightDifferences,
  jaccardSimilarity,
  tokenizeVerse,
} from "../detection";

describe("tokenizeVerse", () => {
  it("tokenizes Arabic text into words", () => {
    const tokens = tokenizeVerse("بسم الله الرحمن الرحيم");
    expect(tokens.length).toBe(4);
    expect(tokens[0]).toBe("بسم");
  });

  it("normalizes diacritics before tokenizing", () => {
    const tokens1 = tokenizeVerse("بِسْمِ اللَّهِ");
    const tokens2 = tokenizeVerse("بسم الله");
    expect(tokens1).toEqual(tokens2);
  });

  it("handles empty text", () => {
    expect(tokenizeVerse("")).toEqual([]);
    expect(tokenizeVerse("   ")).toEqual([]);
  });
});

describe("jaccardSimilarity", () => {
  it("returns 1 for identical word sets", () => {
    expect(jaccardSimilarity(["a", "b", "c"], ["a", "b", "c"])).toBe(1);
  });

  it("returns 0 for completely different word sets", () => {
    expect(jaccardSimilarity(["a", "b"], ["c", "d"])).toBe(0);
  });

  it("returns correct partial similarity", () => {
    // J({a,b,c}, {a,b,d}) = 2/4 = 0.5
    expect(jaccardSimilarity(["a", "b", "c"], ["a", "b", "d"])).toBe(0.5);
  });

  it("handles empty arrays", () => {
    expect(jaccardSimilarity([], [])).toBe(0);
    expect(jaccardSimilarity(["a"], [])).toBe(0);
  });

  it("handles duplicates (set behavior)", () => {
    // Sets: {a,b} and {a,b} -> 2/2 = 1.0
    expect(jaccardSimilarity(["a", "a", "b"], ["a", "b", "b"])).toBe(1);
  });
});

describe("highlightDifferences", () => {
  it("finds words unique to each verse", () => {
    const diff = highlightDifferences(
      ["الذين", "آمنوا", "وعملوا"],
      ["الذين", "كفروا", "وعملوا"]
    );
    expect(diff.verse1Only).toEqual(["آمنوا"]);
    expect(diff.verse2Only).toEqual(["كفروا"]);
  });

  it("returns empty arrays for identical verses", () => {
    const diff = highlightDifferences(["a", "b"], ["a", "b"]);
    expect(diff.verse1Only).toEqual([]);
    expect(diff.verse2Only).toEqual([]);
  });
});

describe("detectSimilarVerses", () => {
  it("detects similar verses above threshold", () => {
    const verses = new Map([
      ["1:1", "بسم الله الرحمن الرحيم"],
      ["2:1", "بسم الله الرحمن الرحيم"],
      ["3:1", "قل هو الله أحد"],
    ]);

    const pairs = detectSimilarVerses(verses, 0.7);
    expect(pairs.length).toBe(1);
    expect(pairs[0].verse1Key).toBe("1:1");
    expect(pairs[0].verse2Key).toBe("2:1");
    expect(pairs[0].similarity).toBe(1);
    expect(pairs[0].category).toBe("near_identical");
  });

  it("returns empty array when no pairs meet threshold", () => {
    const verses = new Map([
      ["1:1", "بسم الله الرحمن الرحيم"],
      ["112:1", "قل هو الله أحد"],
    ]);
    expect(detectSimilarVerses(verses, 0.9)).toEqual([]);
  });

  it("skips pairs with very different lengths", () => {
    const verses = new Map([
      ["1:1", "بسم"],
      ["2:1", "بسم الله الرحمن الرحيم والحمد لله رب العالمين"],
    ]);
    expect(detectSimilarVerses(verses, 0.3)).toEqual([]);
  });
});

describe("findSimilarTo", () => {
  it("finds similar verses for a target", () => {
    const corpus = new Map([
      ["2:1", "بسم الله الرحمن الرحيم"],
      ["3:1", "قل هو الله أحد"],
    ]);

    const results = findSimilarTo("1:1", "بسم الله الرحمن الرحيم", corpus, 0.7);
    expect(results.length).toBe(1);
    expect(results[0].verse2Key).toBe("2:1");
  });

  it("excludes the target verse from results", () => {
    const corpus = new Map([["1:1", "بسم الله الرحمن الرحيم"]]);

    const results = findSimilarTo("1:1", "بسم الله الرحمن الرحيم", corpus, 0.7);
    expect(results.length).toBe(0);
  });
});
