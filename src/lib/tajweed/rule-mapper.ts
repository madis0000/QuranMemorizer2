/**
 * Tajweed Rule Mapper
 *
 * Maps detected TajweedRuleType values to human-readable display data
 * including names, Arabic names, descriptions, colors, and audio durations.
 */

import { TAJWEED_COLORS, type TajweedRuleType } from "@/types/quran";

/** Display information for a Tajweed rule */
export interface TajweedRuleInfo {
  /** Rule type identifier */
  type: TajweedRuleType;
  /** English name */
  name: string;
  /** Arabic name */
  nameArabic: string;
  /** Short English description */
  description: string;
  /** Detailed explanation */
  detailedDescription: string;
  /** Hex color for rendering */
  color: string;
  /** Expected duration in beats/counts for audio timing */
  expectedDuration: number;
  /** Example Arabic word demonstrating this rule */
  exampleWord: string;
  /** Transliteration of example */
  exampleTransliteration: string;
  /** Category grouping for the mastery path */
  category: TajweedCategory;
  /** Stage in the mastery path (1-6) */
  stage: number;
}

/** Category grouping for mastery stages */
export type TajweedCategory =
  | "noon_sakinah"
  | "meem_sakinah"
  | "qalqalah"
  | "madd"
  | "lam_rules"
  | "advanced";

/** Complete mapping of all Tajweed rules to their display info */
const RULE_MAP: Record<TajweedRuleType, TajweedRuleInfo> = {
  // ===== Stage 1: Noon Sakinah & Tanween =====
  ikhfa: {
    type: "ikhfa",
    name: "Ikhfa",
    nameArabic: "\u0625\u062E\u0641\u0627\u0621",
    description: "Hiding - noon sound is partially hidden",
    detailedDescription:
      "When noon sakinah or tanween is followed by one of 15 letters, the noon is pronounced between izhar and idgham with a ghunnah (nasalization) of 2 counts.",
    color: TAJWEED_COLORS.ikhfa,
    expectedDuration: 2,
    exampleWord: "\u0645\u0650\u0646 \u062A\u064E\u062D\u0652\u062A\u0650",
    exampleTransliteration: "min tahti",
    category: "noon_sakinah",
    stage: 1,
  },
  iqlab: {
    type: "iqlab",
    name: "Iqlab",
    nameArabic: "\u0625\u0642\u0644\u0627\u0628",
    description: "Conversion - noon changes to meem before ba",
    detailedDescription:
      "When noon sakinah or tanween is followed by the letter ba, the noon sound converts to a meem sound with ghunnah of 2 counts.",
    color: TAJWEED_COLORS.iqlab,
    expectedDuration: 2,
    exampleWord: "\u0623\u0646\u0628\u0650\u0626\u0652\u0647\u064F\u0645",
    exampleTransliteration: "anbi'hum",
    category: "noon_sakinah",
    stage: 1,
  },
  idgham_ghunnah: {
    type: "idgham_ghunnah",
    name: "Idgham with Ghunnah",
    nameArabic: "\u0625\u062F\u063A\u0627\u0645 \u0628\u063A\u0646\u0629",
    description: "Merging with nasalization",
    detailedDescription:
      "When noon sakinah or tanween is followed by ya, noon, meem, or waw, the noon merges into the next letter with a nasal sound (ghunnah) of 2 counts.",
    color: TAJWEED_COLORS.idgham_ghunnah,
    expectedDuration: 2,
    exampleWord:
      "\u0645\u0650\u0646 \u0648\u064E\u0644\u0650\u064A\u0651\u064D",
    exampleTransliteration: "min waliyy",
    category: "noon_sakinah",
    stage: 1,
  },
  idgham_no_ghunnah: {
    type: "idgham_no_ghunnah",
    name: "Idgham without Ghunnah",
    nameArabic:
      "\u0625\u062F\u063A\u0627\u0645 \u0628\u0644\u0627 \u063A\u0646\u0629",
    description: "Merging without nasalization",
    detailedDescription:
      "When noon sakinah or tanween is followed by lam or ra, the noon merges completely into the next letter without any nasal sound.",
    color: TAJWEED_COLORS.idgham_no_ghunnah,
    expectedDuration: 0,
    exampleWord:
      "\u0645\u0650\u0646 \u0631\u0651\u064E\u0628\u0651\u0650\u0643\u064E",
    exampleTransliteration: "min rabbika",
    category: "noon_sakinah",
    stage: 1,
  },
  izhar: {
    type: "izhar",
    name: "Izhar",
    nameArabic: "\u0625\u0638\u0647\u0627\u0631",
    description: "Clear pronunciation of noon",
    detailedDescription:
      "When noon sakinah or tanween is followed by one of the 6 throat letters (hamza, ha, ain, haa, ghain, kha), the noon is pronounced clearly without ghunnah.",
    color: TAJWEED_COLORS.izhar,
    expectedDuration: 0,
    exampleWord:
      "\u0645\u0650\u0646\u0652 \u0639\u0650\u0644\u0652\u0645\u064D",
    exampleTransliteration: "min 'ilm",
    category: "noon_sakinah",
    stage: 1,
  },

  // ===== Stage 2: Meem Sakinah =====
  ikhfa_shafawi: {
    type: "ikhfa_shafawi",
    name: "Ikhfa Shafawi",
    nameArabic: "\u0625\u062E\u0641\u0627\u0621 \u0634\u0641\u0648\u064A",
    description: "Lip hiding - meem before ba",
    detailedDescription:
      "When meem sakinah is followed by ba, the meem is partially hidden (between izhar and idgham) with ghunnah of 2 counts. The lips come close but do not fully close.",
    color: TAJWEED_COLORS.ikhfa_shafawi,
    expectedDuration: 2,
    exampleWord:
      "\u062A\u064E\u0631\u0652\u0645\u0650\u064A\u0647\u0650\u0645 \u0628\u0650\u062D\u0650\u062C\u064E\u0627\u0631\u064E\u0629\u064D",
    exampleTransliteration: "tarmeehim bihijaarah",
    category: "meem_sakinah",
    stage: 2,
  },
  izhar_shafawi: {
    type: "izhar_shafawi",
    name: "Izhar Shafawi",
    nameArabic: "\u0625\u0638\u0647\u0627\u0631 \u0634\u0641\u0648\u064A",
    description: "Lip clear pronunciation",
    detailedDescription:
      "When meem sakinah is followed by any letter except ba and meem, the meem is pronounced clearly from the lips without any ghunnah extension.",
    color: TAJWEED_COLORS.izhar_shafawi,
    expectedDuration: 0,
    exampleWord:
      "\u0623\u064E\u0645\u0652 \u062D\u064E\u0633\u0650\u0628\u062A\u064E",
    exampleTransliteration: "am hasibta",
    category: "meem_sakinah",
    stage: 2,
  },

  // ===== Stage 3: Qalqalah =====
  qalqalah: {
    type: "qalqalah",
    name: "Qalqalah",
    nameArabic: "\u0642\u0644\u0642\u0644\u0629",
    description: "Echo/bouncing sound",
    detailedDescription:
      "When one of the 5 qalqalah letters (\u0642 \u0637 \u0628 \u062C \u062F) has a sukun, it is pronounced with a slight bouncing echo. The echo is stronger at the end of an ayah (major qalqalah) and lighter in the middle of a word (minor qalqalah).",
    color: TAJWEED_COLORS.qalqalah,
    expectedDuration: 0.5,
    exampleWord: "\u064A\u064E\u062E\u0652\u0644\u064F\u0642\u0652",
    exampleTransliteration: "yakhluq",
    category: "qalqalah",
    stage: 3,
  },

  // ===== Stage 4: Madd =====
  madd_normal: {
    type: "madd_normal",
    name: "Madd Tabii",
    nameArabic: "\u0645\u062F \u0637\u0628\u064A\u0639\u064A",
    description: "Natural elongation (2 counts)",
    detailedDescription:
      "The basic elongation that occurs when alef follows fatha, waw (with sukun) follows damma, or ya (with sukun) follows kasra. Always elongated for exactly 2 counts.",
    color: TAJWEED_COLORS.madd_normal,
    expectedDuration: 2,
    exampleWord: "\u0642\u064E\u0627\u0644\u064E",
    exampleTransliteration: "qaala",
    category: "madd",
    stage: 4,
  },
  madd_muttasil: {
    type: "madd_muttasil",
    name: "Madd Muttasil",
    nameArabic: "\u0645\u062F \u0645\u062A\u0635\u0644",
    description: "Connected elongation (4-5 counts)",
    detailedDescription:
      "When a madd letter is followed by a hamza in the same word, the elongation is extended to 4-5 counts. This is obligatory (waajib).",
    color: TAJWEED_COLORS.madd_muttasil,
    expectedDuration: 4.5,
    exampleWord: "\u062C\u064E\u0627\u0621\u064E",
    exampleTransliteration: "jaa'a",
    category: "madd",
    stage: 4,
  },
  madd_munfasil: {
    type: "madd_munfasil",
    name: "Madd Munfasil",
    nameArabic: "\u0645\u062F \u0645\u0646\u0641\u0635\u0644",
    description: "Separated elongation (4-5 counts)",
    detailedDescription:
      "When a madd letter at the end of one word is followed by a hamza at the beginning of the next word, the elongation is 4-5 counts. This is permissible (jaa'iz).",
    color: TAJWEED_COLORS.madd_munfasil,
    expectedDuration: 4.5,
    exampleWord:
      "\u0641\u0650\u064A \u0623\u064E\u0646\u0641\u064F\u0633\u0650\u0647\u0650\u0645\u0652",
    exampleTransliteration: "fee anfusihim",
    category: "madd",
    stage: 4,
  },
  madd_lazim: {
    type: "madd_lazim",
    name: "Madd Lazim",
    nameArabic: "\u0645\u062F \u0644\u0627\u0632\u0645",
    description: "Obligatory elongation (6 counts)",
    detailedDescription:
      "When a madd letter is followed by a sukun or shadda in the same word, the elongation must be 6 counts. This is the longest type of madd and is obligatory.",
    color: TAJWEED_COLORS.madd_lazim,
    expectedDuration: 6,
    exampleWord: "\u0622\u0644\u0652\u0622\u0646\u064E",
    exampleTransliteration: "aaal-aana",
    category: "madd",
    stage: 4,
  },

  // ===== Stage 5: (Lam rules use idgham_no_ghunnah) =====
  // Lam Shamsiyah is already mapped through idgham_no_ghunnah
  // No separate type needed

  // ===== Stage 6: Advanced =====
  ghunnah: {
    type: "ghunnah",
    name: "Ghunnah",
    nameArabic: "\u063A\u0646\u0629",
    description: "Nasalization (2 counts)",
    detailedDescription:
      "A nasal sound that resonates from the nasal passage. It occurs when noon or meem has a shadda (doubled), lasting 2 counts. Ghunnah is one of the essential characteristics of Arabic recitation.",
    color: TAJWEED_COLORS.ghunnah,
    expectedDuration: 2,
    exampleWord: "\u0625\u0650\u0646\u0651\u064E",
    exampleTransliteration: "inna",
    category: "advanced",
    stage: 6,
  },
};

/**
 * Get display information for a Tajweed rule type.
 *
 * @param type - The TajweedRuleType to look up
 * @returns TajweedRuleInfo with all display data
 */
export function getRuleInfo(type: TajweedRuleType): TajweedRuleInfo {
  return RULE_MAP[type];
}

/**
 * Get all rule infos for a specific mastery stage.
 *
 * @param stage - Stage number (1-6)
 * @returns Array of TajweedRuleInfo for rules in that stage
 */
export function getRulesByStage(stage: number): TajweedRuleInfo[] {
  return Object.values(RULE_MAP).filter((rule) => rule.stage === stage);
}

/**
 * Get all rule infos for a specific category.
 *
 * @param category - The TajweedCategory to filter by
 * @returns Array of TajweedRuleInfo for rules in that category
 */
export function getRulesByCategory(
  category: TajweedCategory
): TajweedRuleInfo[] {
  return Object.values(RULE_MAP).filter((rule) => rule.category === category);
}

/**
 * Get all rule info entries.
 *
 * @returns Array of all TajweedRuleInfo objects
 */
export function getAllRuleInfos(): TajweedRuleInfo[] {
  return Object.values(RULE_MAP);
}

/**
 * Mastery stage definitions
 */
export interface MasteryStageInfo {
  stage: number;
  name: string;
  nameArabic: string;
  description: string;
  category: TajweedCategory;
  ruleTypes: TajweedRuleType[];
}

export const MASTERY_STAGES: MasteryStageInfo[] = [
  {
    stage: 1,
    name: "Noon Sakinah & Tanween",
    nameArabic:
      "\u0646\u0648\u0646 \u0633\u0627\u0643\u0646\u0629 \u0648\u062A\u0646\u0648\u064A\u0646",
    description:
      "Learn the five rules governing noon with sukun and tanween marks",
    category: "noon_sakinah",
    ruleTypes: [
      "ikhfa",
      "iqlab",
      "idgham_ghunnah",
      "idgham_no_ghunnah",
      "izhar",
    ],
  },
  {
    stage: 2,
    name: "Meem Sakinah",
    nameArabic: "\u0645\u064A\u0645 \u0633\u0627\u0643\u0646\u0629",
    description: "Master the three rules for meem with sukun",
    category: "meem_sakinah",
    ruleTypes: ["ikhfa_shafawi", "izhar_shafawi"],
  },
  {
    stage: 3,
    name: "Qalqalah",
    nameArabic: "\u0642\u0644\u0642\u0644\u0629",
    description: "Practice the echoing bounce on the five qalqalah letters",
    category: "qalqalah",
    ruleTypes: ["qalqalah"],
  },
  {
    stage: 4,
    name: "Madd (Elongation)",
    nameArabic: "\u0645\u062F",
    description:
      "Learn the different types of vowel elongation and their durations",
    category: "madd",
    ruleTypes: ["madd_normal", "madd_muttasil", "madd_munfasil", "madd_lazim"],
  },
  {
    stage: 5,
    name: "Lam Rules",
    nameArabic: "\u0623\u062D\u0643\u0627\u0645 \u0627\u0644\u0644\u0627\u0645",
    description:
      "Distinguish between Lam Shamsiyah (assimilated) and Lam Qamariyah (pronounced)",
    category: "lam_rules",
    ruleTypes: ["idgham_no_ghunnah"],
  },
  {
    stage: 6,
    name: "Advanced Rules",
    nameArabic:
      "\u0623\u062D\u0643\u0627\u0645 \u0645\u062A\u0642\u062F\u0645\u0629",
    description:
      "Master ghunnah, tafkheem, tarqeeq, and other advanced articulation rules",
    category: "advanced",
    ruleTypes: ["ghunnah"],
  },
];
