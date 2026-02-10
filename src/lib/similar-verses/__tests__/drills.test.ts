import { describe, expect, it } from "vitest";

import { generateDrill, scoreDrillAnswer } from "../drills";

const MOCK_PAIR = {
  verse1Key: "2:35",
  verse2Key: "7:19",
  similarity: 0.92,
  category: "near_identical" as const,
};

const VERSE1_TEXT =
  "وقلنا يا آدم اسكن أنت وزوجك الجنة وكلا منها رغدا حيث شئتما";
const VERSE2_TEXT = "ويا آدم اسكن أنت وزوجك الجنة فكلا من حيث شئتما";

describe("generateDrill", () => {
  it("generates a continue drill", () => {
    const drill = generateDrill(
      MOCK_PAIR,
      VERSE1_TEXT,
      VERSE2_TEXT,
      "continue"
    );
    expect(drill.type).toBe("continue");
    expect(drill.prompt).toContain("...");
    expect(drill.options).toBeDefined();
    expect(drill.options!.length).toBe(2);
    expect(drill.correctAnswer).toBeTruthy();
  });

  it("generates a which_surah drill", () => {
    const drill = generateDrill(
      MOCK_PAIR,
      VERSE1_TEXT,
      VERSE2_TEXT,
      "which_surah"
    );
    expect(drill.type).toBe("which_surah");
    expect(drill.options).toContain("Surah 2");
    expect(drill.options).toContain("Surah 7");
    expect(drill.correctAnswer).toBe("Surah 2");
  });

  it("generates a spot_difference drill", () => {
    const drill = generateDrill(
      MOCK_PAIR,
      VERSE1_TEXT,
      VERSE2_TEXT,
      "spot_difference"
    );
    expect(drill.type).toBe("spot_difference");
    expect(drill.prompt).toContain("---");
  });

  it("generates a complete_verse drill", () => {
    const drill = generateDrill(
      MOCK_PAIR,
      VERSE1_TEXT,
      VERSE2_TEXT,
      "complete_verse"
    );
    expect(drill.type).toBe("complete_verse");
    expect(drill.prompt).toContain("...");
  });

  it("auto-picks drill type based on category", () => {
    // near_identical -> spot_difference
    const drill = generateDrill(MOCK_PAIR, VERSE1_TEXT, VERSE2_TEXT);
    expect(drill.type).toBe("spot_difference");

    // similar_opening -> continue
    const pair2 = { ...MOCK_PAIR, category: "similar_opening" as const };
    const drill2 = generateDrill(pair2, VERSE1_TEXT, VERSE2_TEXT);
    expect(drill2.type).toBe("continue");
  });
});

describe("scoreDrillAnswer", () => {
  it("scores correct answer with time bonus", () => {
    const drill = generateDrill(
      MOCK_PAIR,
      VERSE1_TEXT,
      VERSE2_TEXT,
      "which_surah"
    );
    const result = scoreDrillAnswer(drill, drill.correctAnswer, 3000);
    expect(result.correct).toBe(true);
    expect(result.score).toBe(150); // 100 + 50 time bonus
  });

  it("scores correct answer with reduced time bonus", () => {
    const drill = generateDrill(
      MOCK_PAIR,
      VERSE1_TEXT,
      VERSE2_TEXT,
      "which_surah"
    );
    const result = scoreDrillAnswer(drill, drill.correctAnswer, 7000);
    expect(result.correct).toBe(true);
    expect(result.score).toBe(125); // 100 + 25 time bonus
  });

  it("scores incorrect answer", () => {
    const drill = generateDrill(
      MOCK_PAIR,
      VERSE1_TEXT,
      VERSE2_TEXT,
      "which_surah"
    );
    const wrongAnswer = drill.options!.find((o) => o !== drill.correctAnswer)!;
    const result = scoreDrillAnswer(drill, wrongAnswer, 3000);
    expect(result.correct).toBe(false);
    expect(result.score).toBe(0);
  });
});
