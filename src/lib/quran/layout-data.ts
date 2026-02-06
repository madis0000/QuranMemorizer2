/**
 * Mushaf Layout Data Service
 *
 * Fetches accurate page layouts from pre-computed JSON files.
 * Data source: https://github.com/zonetecde/mushaf-layout
 */

import type {
  LineType,
  MushafEditionId,
  MushafLine,
  MushafPage,
  MushafWord,
} from "@/types/quran";

import {
  BASMALLAH,
  getHizbForPage,
  getJuzForPage,
  SURAH_NAMES,
  toArabicNumber,
} from "./mushaf-layout";

// GitHub raw content URL for Madinah Mushaf layout
const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/zonetecde/mushaf-layout/refs/heads/main/mushaf";

// ===== GitHub JSON Types =====

interface GithubPageData {
  page: number;
  lines: GithubLine[];
}

interface GithubLine {
  line: number;
  type: "surah-header" | "basmala" | "text";
  text?: string;
  surah?: string;
  verseRange?: string;
  words?: GithubWord[];
  qpcV2?: string;
  qpcV1?: string;
}

interface GithubWord {
  location: string; // "surah:verse:word" e.g., "2:255:3"
  word: string;
  qpcV2?: string;
  qpcV1?: string;
}

// ===== Fetch Functions =====

/**
 * Fetch accurate page layout from GitHub
 * Returns the raw GitHub JSON data
 */
export async function fetchGithubPageLayout(
  pageNumber: number
): Promise<GithubPageData> {
  const paddedPage = pageNumber.toString().padStart(3, "0");
  const url = `${GITHUB_RAW_BASE}/page-${paddedPage}.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${pageNumber}: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch and transform page layout to our MushafPage type
 */
export async function fetchAccuratePageLayout(
  pageNumber: number,
  edition: MushafEditionId = "madinah_1421"
): Promise<MushafPage> {
  // For MVP, only Madinah Mushaf is supported via GitHub
  if (!edition.startsWith("madinah")) {
    throw new Error(
      `Edition ${edition} not yet supported. Only Madinah editions available.`
    );
  }

  const data = await fetchGithubPageLayout(pageNumber);
  return transformToMushafPage(data, pageNumber, edition);
}

// ===== Transform Functions =====

/**
 * Transform GitHub JSON structure to our MushafPage type
 */
function transformToMushafPage(
  data: GithubPageData,
  pageNumber: number,
  edition: MushafEditionId
): MushafPage {
  const lines: MushafLine[] = [];
  const surahsOnPage = new Set<number>();

  for (const githubLine of data.lines) {
    const line = transformLine(githubLine, pageNumber);
    lines.push(line);

    // Track surahs on this page
    if (line.surahNumber) {
      surahsOnPage.add(line.surahNumber);
    }
    for (const word of line.words) {
      if (word.surahNumber > 0) {
        surahsOnPage.add(word.surahNumber);
      }
    }
  }

  return {
    pageNumber,
    lines,
    surahsOnPage: Array.from(surahsOnPage).sort((a, b) => a - b),
    juz: getJuzForPage(pageNumber),
    hizb: getHizbForPage(pageNumber),
    edition,
  };
}

/**
 * Transform a single line from GitHub format to MushafLine
 */
function transformLine(githubLine: GithubLine, pageNumber: number): MushafLine {
  const lineNumber = githubLine.line;

  switch (githubLine.type) {
    case "surah-header":
      return createSurahHeaderLine(githubLine, lineNumber, pageNumber);

    case "basmala":
      return createBasmalaLine(githubLine, lineNumber, pageNumber);

    case "text":
    default:
      return createTextLine(githubLine, lineNumber, pageNumber);
  }
}

/**
 * Create a surah header line
 */
function createSurahHeaderLine(
  githubLine: GithubLine,
  lineNumber: number,
  pageNumber: number
): MushafLine {
  const surahNumber = parseInt(githubLine.surah || "0", 10);
  const headerText =
    githubLine.text || SURAH_NAMES[surahNumber] || `سورة ${surahNumber}`;

  const headerWord: MushafWord = {
    id: 0,
    text: headerText,
    textUthmani: headerText,
    surahNumber,
    ayahNumber: 0,
    wordPosition: 0,
    wordKey: `${surahNumber}:header`,
    lineNumber,
    pageNumber,
    isFirstInAyah: false,
    isLastInAyah: false,
    isAyahEnd: false,
  };

  return {
    lineNumber,
    pageNumber,
    lineType: "surah_name" as LineType,
    words: [headerWord],
    isCentered: true,
    surahNumber,
  };
}

/**
 * Create a basmala line
 */
function createBasmalaLine(
  githubLine: GithubLine,
  lineNumber: number,
  pageNumber: number
): MushafLine {
  // Get surah number from context - basmala always comes after surah header
  // We'll determine surah from verse range if available
  const surahNumber = 0;

  const basmalaWord: MushafWord = {
    id: 0,
    text: BASMALLAH.uthmani,
    textUthmani: BASMALLAH.uthmani,
    surahNumber,
    ayahNumber: 0,
    wordPosition: 0,
    wordKey: `${surahNumber}:basmallah`,
    lineNumber,
    pageNumber,
    isFirstInAyah: false,
    isLastInAyah: false,
    isAyahEnd: false,
    // QPC glyph codes from the line-level data for basmala
    qpcV1: githubLine.qpcV1,
    qpcV2: githubLine.qpcV2,
  };

  return {
    lineNumber,
    pageNumber,
    lineType: "basmallah" as LineType,
    words: [basmalaWord],
    isCentered: true,
    surahNumber,
  };
}

/**
 * Create a text line with words
 */
function createTextLine(
  githubLine: GithubLine,
  lineNumber: number,
  pageNumber: number
): MushafLine {
  const words: MushafWord[] = [];

  if (githubLine.words && githubLine.words.length > 0) {
    for (let i = 0; i < githubLine.words.length; i++) {
      const githubWord = githubLine.words[i];
      const word = transformWord(
        githubWord,
        i,
        lineNumber,
        pageNumber,
        githubLine.words.length
      );
      words.push(word);
    }
  }

  // Determine surah number from first word
  const surahNumber = words.length > 0 ? words[0].surahNumber : 0;

  return {
    lineNumber,
    pageNumber,
    lineType: "ayah" as LineType,
    words,
    isCentered: false,
    surahNumber,
  };
}

/**
 * Transform a single word from GitHub format to MushafWord
 */
function transformWord(
  githubWord: GithubWord,
  index: number,
  lineNumber: number,
  pageNumber: number,
  totalWordsInLine: number
): MushafWord {
  // Parse location: "surah:verse:word" e.g., "2:255:3"
  const [surahStr, verseStr, wordStr] = githubWord.location.split(":");
  const surahNumber = parseInt(surahStr, 10);
  const ayahNumber = parseInt(verseStr, 10);
  const wordPosition = parseInt(wordStr, 10);

  // Check if this word contains/ends with a verse number
  // In the GitHub data, verse numbers are embedded in the last word of each ayah
  // e.g., "ٱلرَّحِيمِ ١" (word + space + Arabic numeral)
  // Arabic-Indic numerals: ٠١٢٣٤٥٦٧٨٩ (U+0660 to U+0669)
  const arabicNumeralPattern = /[\u0660-\u0669]+\s*$/;
  const hasAyahEndMarker = arabicNumeralPattern.test(githubWord.word);

  // Determine if first/last in ayah
  const isFirstInAyah = wordPosition === 1;
  const isLastInAyah = hasAyahEndMarker;
  const isAyahEnd = hasAyahEndMarker;

  // Keep the original text from the data - it already includes proper Arabic text with verse markers
  const text = githubWord.word;

  return {
    id: index,
    text,
    textUthmani: text,
    surahNumber,
    ayahNumber,
    wordPosition,
    wordKey: githubWord.location,
    lineNumber,
    pageNumber,
    isFirstInAyah,
    isLastInAyah,
    isAyahEnd,
    // QPC glyph codes for font rendering
    qpcV1: githubWord.qpcV1,
    qpcV2: githubWord.qpcV2,
  };
}

// ===== Utility Functions =====

/**
 * Check if layout data is available for an edition
 */
export function isLayoutAvailable(edition: MushafEditionId): boolean {
  // Currently only Madinah editions supported via GitHub
  return edition.startsWith("madinah");
}

/**
 * Get total pages for an edition
 */
export function getTotalPages(edition: MushafEditionId): number {
  switch (edition) {
    case "madinah_1405":
    case "madinah_1421":
    case "madinah_1441":
    case "digital_khatt":
      return 604;
    case "indopak_15":
      return 610;
    case "indopak_13":
      return 849;
    case "indopak_16":
      return 548;
    default:
      return 604;
  }
}

/**
 * Prefetch multiple pages for smoother navigation
 */
export async function prefetchPageLayouts(
  pages: number[],
  edition: MushafEditionId = "madinah_1421"
): Promise<Map<number, MushafPage>> {
  const results = new Map<number, MushafPage>();

  const promises = pages.map(async (page) => {
    try {
      const layout = await fetchAccuratePageLayout(page, edition);
      results.set(page, layout);
    } catch (error) {
      console.warn(`Failed to prefetch page ${page}:`, error);
    }
  });

  await Promise.all(promises);
  return results;
}
