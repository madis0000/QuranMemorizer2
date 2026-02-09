// Re-export testing library
export * from "@testing-library/react";

// Helper to create test Quran ayah data
export function createTestAyah(overrides?: {
  number?: number;
  numberInSurah?: number;
  surahNumber?: number;
  text?: string;
  textUthmani?: string;
  textSimple?: string;
  juz?: number;
  page?: number;
}) {
  return {
    number: 1,
    numberInSurah: 1,
    surahNumber: 1,
    text: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
    textUthmani:
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
    textSimple:
      "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645",
    juz: 1,
    hizb: 1,
    hizbQuarter: 1,
    page: 1,
    words: [],
    ...overrides,
  };
}

// Helper to create test memorization session data
export function createTestSession(overrides?: {
  id?: string;
  userId?: string;
  surahNumber?: number;
  startAyah?: number;
  endAyah?: number;
  accuracy?: number;
  duration?: number;
  date?: string;
}) {
  return {
    id: "session-1",
    userId: "user-1",
    surahNumber: 1,
    startAyah: 1,
    endAyah: 7,
    accuracy: 85,
    duration: 300,
    date: new Date().toISOString().split("T")[0],
    ...overrides,
  };
}
