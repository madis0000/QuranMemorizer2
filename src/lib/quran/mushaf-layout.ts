/**
 * Mushaf Layout Utilities
 *
 * Handles page-accurate rendering of Quran text matching physical Mushaf editions.
 * Users memorize with spatial memory - they remember where words appear on pages/lines.
 */

import type {
  Ayah,
  LineType,
  MUSHAF_EDITIONS,
  MushafEditionId,
  MushafLine,
  MushafPage,
  MushafWord,
} from "@/types/quran";

// ===== Constants =====

export const TOTAL_AYAHS = 6236;
export const TOTAL_SURAHS = 114;
export const TOTAL_PAGES_MADINAH = 604;

// Basmallah text in various scripts
export const BASMALLAH = {
  uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  indopak: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ",
  simple: "بسم الله الرحمن الرحيم",
};

// Surah names in Arabic
export const SURAH_NAMES: Record<number, string> = {
  1: "سُورَةُ ٱلْفَاتِحَةِ",
  2: "سُورَةُ ٱلْبَقَرَةِ",
  3: "سُورَةُ آلِ عِمْرَانَ",
  4: "سُورَةُ ٱلنِّسَاءِ",
  5: "سُورَةُ ٱلْمَائِدَةِ",
  6: "سُورَةُ ٱلْأَنْعَامِ",
  7: "سُورَةُ ٱلْأَعْرَافِ",
  8: "سُورَةُ ٱلْأَنفَالِ",
  9: "سُورَةُ ٱلتَّوْبَةِ",
  10: "سُورَةُ يُونُسَ",
  11: "سُورَةُ هُودٍ",
  12: "سُورَةُ يُوسُفَ",
  13: "سُورَةُ ٱلرَّعْدِ",
  14: "سُورَةُ إِبْرَاهِيمَ",
  15: "سُورَةُ ٱلْحِجْرِ",
  16: "سُورَةُ ٱلنَّحْلِ",
  17: "سُورَةُ ٱلْإِسْرَاءِ",
  18: "سُورَةُ ٱلْكَهْفِ",
  19: "سُورَةُ مَرْيَمَ",
  20: "سُورَةُ طٰهٰ",
  21: "سُورَةُ ٱلْأَنْبِيَاءِ",
  22: "سُورَةُ ٱلْحَجِّ",
  23: "سُورَةُ ٱلْمُؤْمِنُونَ",
  24: "سُورَةُ ٱلنُّورِ",
  25: "سُورَةُ ٱلْفُرْقَانِ",
  26: "سُورَةُ ٱلشُّعَرَاءِ",
  27: "سُورَةُ ٱلنَّمْلِ",
  28: "سُورَةُ ٱلْقَصَصِ",
  29: "سُورَةُ ٱلْعَنكَبُوتِ",
  30: "سُورَةُ ٱلرُّومِ",
  31: "سُورَةُ لُقْمَانَ",
  32: "سُورَةُ ٱلسَّجْدَةِ",
  33: "سُورَةُ ٱلْأَحْزَابِ",
  34: "سُورَةُ سَبَإٍ",
  35: "سُورَةُ فَاطِرٍ",
  36: "سُورَةُ يٰسٓ",
  37: "سُورَةُ ٱلصَّافَّاتِ",
  38: "سُورَةُ صٓ",
  39: "سُورَةُ ٱلزُّمَرِ",
  40: "سُورَةُ غَافِرٍ",
  41: "سُورَةُ فُصِّلَتْ",
  42: "سُورَةُ ٱلشُّورَىٰ",
  43: "سُورَةُ ٱلزُّخْرُفِ",
  44: "سُورَةُ ٱلدُّخَانِ",
  45: "سُورَةُ ٱلْجَاثِيَةِ",
  46: "سُورَةُ ٱلْأَحْقَافِ",
  47: "سُورَةُ مُحَمَّدٍ",
  48: "سُورَةُ ٱلْفَتْحِ",
  49: "سُورَةُ ٱلْحُجُرَاتِ",
  50: "سُورَةُ قٓ",
  51: "سُورَةُ ٱلذَّارِيَاتِ",
  52: "سُورَةُ ٱلطُّورِ",
  53: "سُورَةُ ٱلنَّجْمِ",
  54: "سُورَةُ ٱلْقَمَرِ",
  55: "سُورَةُ ٱلرَّحْمَـٰنِ",
  56: "سُورَةُ ٱلْوَاقِعَةِ",
  57: "سُورَةُ ٱلْحَدِيدِ",
  58: "سُورَةُ ٱلْمُجَادَلَةِ",
  59: "سُورَةُ ٱلْحَشْرِ",
  60: "سُورَةُ ٱلْمُمْتَحَنَةِ",
  61: "سُورَةُ ٱلصَّفِّ",
  62: "سُورَةُ ٱلْجُمُعَةِ",
  63: "سُورَةُ ٱلْمُنَافِقُونَ",
  64: "سُورَةُ ٱلتَّغَابُنِ",
  65: "سُورَةُ ٱلطَّلَاقِ",
  66: "سُورَةُ ٱلتَّحْرِيمِ",
  67: "سُورَةُ ٱلْمُلْكِ",
  68: "سُورَةُ ٱلْقَلَمِ",
  69: "سُورَةُ ٱلْحَاقَّةِ",
  70: "سُورَةُ ٱلْمَعَارِجِ",
  71: "سُورَةُ نُوحٍ",
  72: "سُورَةُ ٱلْجِنِّ",
  73: "سُورَةُ ٱلْمُزَّمِّلِ",
  74: "سُورَةُ ٱلْمُدَّثِّرِ",
  75: "سُورَةُ ٱلْقِيَامَةِ",
  76: "سُورَةُ ٱلْإِنسَانِ",
  77: "سُورَةُ ٱلْمُرْسَلَاتِ",
  78: "سُورَةُ ٱلنَّبَإِ",
  79: "سُورَةُ ٱلنَّازِعَاتِ",
  80: "سُورَةُ عَبَسَ",
  81: "سُورَةُ ٱلتَّكْوِيرِ",
  82: "سُورَةُ ٱلْإِنفِطَارِ",
  83: "سُورَةُ ٱلْمُطَفِّفِينَ",
  84: "سُورَةُ ٱلْإِنشِقَاقِ",
  85: "سُورَةُ ٱلْبُرُوجِ",
  86: "سُورَةُ ٱلطَّارِقِ",
  87: "سُورَةُ ٱلْأَعْلَىٰ",
  88: "سُورَةُ ٱلْغَاشِيَةِ",
  89: "سُورَةُ ٱلْفَجْرِ",
  90: "سُورَةُ ٱلْبَلَدِ",
  91: "سُورَةُ ٱلشَّمْسِ",
  92: "سُورَةُ ٱللَّيْلِ",
  93: "سُورَةُ ٱلضُّحَىٰ",
  94: "سُورَةُ ٱلشَّرْحِ",
  95: "سُورَةُ ٱلتِّينِ",
  96: "سُورَةُ ٱلْعَلَقِ",
  97: "سُورَةُ ٱلْقَدْرِ",
  98: "سُورَةُ ٱلْبَيِّنَةِ",
  99: "سُورَةُ ٱلزَّلْزَلَةِ",
  100: "سُورَةُ ٱلْعَادِيَاتِ",
  101: "سُورَةُ ٱلْقَارِعَةِ",
  102: "سُورَةُ ٱلتَّكَاثُرِ",
  103: "سُورَةُ ٱلْعَصْرِ",
  104: "سُورَةُ ٱلْهُمَزَةِ",
  105: "سُورَةُ ٱلْفِيلِ",
  106: "سُورَةُ قُرَيْشٍ",
  107: "سُورَةُ ٱلْمَاعُونِ",
  108: "سُورَةُ ٱلْكَوْثَرِ",
  109: "سُورَةُ ٱلْكَافِرُونَ",
  110: "سُورَةُ ٱلنَّصْرِ",
  111: "سُورَةُ ٱلْمَسَدِ",
  112: "سُورَةُ ٱلْإِخْلَاصِ",
  113: "سُورَةُ ٱلْفَلَقِ",
  114: "سُورَةُ ٱلنَّاسِ",
};

// Surahs that don't start with Basmallah
export const SURAHS_WITHOUT_BASMALLAH = [1, 9]; // Al-Fatiha (has it as ayah), At-Tawbah

// ===== Juz Information =====

export interface JuzInfo {
  number: number;
  name: string;
  nameArabic: string;
  startSurah: number;
  startAyah: number;
  startPage: number;
}

export const JUZ_INFO: JuzInfo[] = [
  {
    number: 1,
    name: "Alif Lam Meem",
    nameArabic: "ألم",
    startSurah: 1,
    startAyah: 1,
    startPage: 1,
  },
  {
    number: 2,
    name: "Sayaqool",
    nameArabic: "سيقول",
    startSurah: 2,
    startAyah: 142,
    startPage: 22,
  },
  {
    number: 3,
    name: "Tilkar Rusul",
    nameArabic: "تلك الرسل",
    startSurah: 2,
    startAyah: 253,
    startPage: 42,
  },
  {
    number: 4,
    name: "Lan Tanaloo",
    nameArabic: "لن تنالوا",
    startSurah: 3,
    startAyah: 93,
    startPage: 62,
  },
  {
    number: 5,
    name: "Wal Mohsanat",
    nameArabic: "والمحصنات",
    startSurah: 4,
    startAyah: 24,
    startPage: 82,
  },
  {
    number: 6,
    name: "La Yuhibbullah",
    nameArabic: "لا يحب الله",
    startSurah: 4,
    startAyah: 148,
    startPage: 102,
  },
  {
    number: 7,
    name: "Wa Iza Samiu",
    nameArabic: "وإذا سمعوا",
    startSurah: 5,
    startAyah: 83,
    startPage: 121,
  },
  {
    number: 8,
    name: "Wa Lau Annana",
    nameArabic: "ولو أننا",
    startSurah: 6,
    startAyah: 111,
    startPage: 142,
  },
  {
    number: 9,
    name: "Qalal Malao",
    nameArabic: "قال الملأ",
    startSurah: 7,
    startAyah: 88,
    startPage: 162,
  },
  {
    number: 10,
    name: "Wa A'lamu",
    nameArabic: "واعلموا",
    startSurah: 8,
    startAyah: 41,
    startPage: 182,
  },
  {
    number: 11,
    name: "Ya'taziroon",
    nameArabic: "يعتذرون",
    startSurah: 9,
    startAyah: 94,
    startPage: 201,
  },
  {
    number: 12,
    name: "Wa Ma Min Dabbah",
    nameArabic: "وما من دابة",
    startSurah: 11,
    startAyah: 6,
    startPage: 222,
  },
  {
    number: 13,
    name: "Wa Ma Ubarrio",
    nameArabic: "وما أبرئ",
    startSurah: 12,
    startAyah: 53,
    startPage: 242,
  },
  {
    number: 14,
    name: "Rubama",
    nameArabic: "ربما",
    startSurah: 15,
    startAyah: 2,
    startPage: 262,
  },
  {
    number: 15,
    name: "Subhanallazi",
    nameArabic: "سبحان الذي",
    startSurah: 17,
    startAyah: 1,
    startPage: 282,
  },
  {
    number: 16,
    name: "Qal Alam",
    nameArabic: "قال ألم",
    startSurah: 18,
    startAyah: 75,
    startPage: 302,
  },
  {
    number: 17,
    name: "Iqtaraba",
    nameArabic: "اقترب",
    startSurah: 21,
    startAyah: 1,
    startPage: 322,
  },
  {
    number: 18,
    name: "Qad Aflaha",
    nameArabic: "قد أفلح",
    startSurah: 23,
    startAyah: 1,
    startPage: 342,
  },
  {
    number: 19,
    name: "Wa Qalallazina",
    nameArabic: "وقال الذين",
    startSurah: 25,
    startAyah: 21,
    startPage: 362,
  },
  {
    number: 20,
    name: "A'man Khalaq",
    nameArabic: "أمن خلق",
    startSurah: 27,
    startAyah: 56,
    startPage: 382,
  },
  {
    number: 21,
    name: "Utlu Ma Oohi",
    nameArabic: "اتل ما أوحي",
    startSurah: 29,
    startAyah: 46,
    startPage: 402,
  },
  {
    number: 22,
    name: "Wa Man Yaqnut",
    nameArabic: "ومن يقنت",
    startSurah: 33,
    startAyah: 31,
    startPage: 422,
  },
  {
    number: 23,
    name: "Wa Mali",
    nameArabic: "وما لي",
    startSurah: 36,
    startAyah: 22,
    startPage: 442,
  },
  {
    number: 24,
    name: "Fa Man Azlam",
    nameArabic: "فمن أظلم",
    startSurah: 39,
    startAyah: 32,
    startPage: 462,
  },
  {
    number: 25,
    name: "Ilaihi Yurad",
    nameArabic: "إليه يرد",
    startSurah: 41,
    startAyah: 47,
    startPage: 482,
  },
  {
    number: 26,
    name: "Ha Meem",
    nameArabic: "حم",
    startSurah: 46,
    startAyah: 1,
    startPage: 502,
  },
  {
    number: 27,
    name: "Qala Fa Ma Khatbukum",
    nameArabic: "قال فما خطبكم",
    startSurah: 51,
    startAyah: 31,
    startPage: 522,
  },
  {
    number: 28,
    name: "Qad Sami Allah",
    nameArabic: "قد سمع الله",
    startSurah: 58,
    startAyah: 1,
    startPage: 542,
  },
  {
    number: 29,
    name: "Tabarakallazi",
    nameArabic: "تبارك الذي",
    startSurah: 67,
    startAyah: 1,
    startPage: 562,
  },
  {
    number: 30,
    name: "Amma",
    nameArabic: "عم",
    startSurah: 78,
    startAyah: 1,
    startPage: 582,
  },
];

// ===== Page Layout Utilities =====

/**
 * Get Juz number for a given page
 */
export function getJuzForPage(pageNumber: number): number {
  for (let i = JUZ_INFO.length - 1; i >= 0; i--) {
    if (pageNumber >= JUZ_INFO[i].startPage) {
      return JUZ_INFO[i].number;
    }
  }
  return 1;
}

/**
 * Get Hizb number for a given page (1-60)
 */
export function getHizbForPage(pageNumber: number): number {
  // Each Hizb is roughly 10 pages in Madinah Mushaf
  return Math.ceil(pageNumber / 10);
}

/**
 * Check if a surah starts on a given page
 */
export function surahStartsOnPage(
  surahNumber: number,
  pageNumber: number,
  surahStartPages: Record<number, number>
): boolean {
  return surahStartPages[surahNumber] === pageNumber;
}

/**
 * Get surahs that appear on a given page
 */
export function getSurahsOnPage(
  pageNumber: number,
  surahStartPages: Record<number, number>
): number[] {
  const surahs: number[] = [];

  for (let surah = 1; surah <= 114; surah++) {
    const startPage = surahStartPages[surah] || 1;
    const nextSurahStartPage = surahStartPages[surah + 1] || 605;

    if (pageNumber >= startPage && pageNumber < nextSurahStartPage) {
      surahs.push(surah);
    }
  }

  return surahs;
}

// ===== Word Processing =====

/**
 * Convert ayah text to words array
 */
export function textToWords(
  text: string,
  surahNumber: number,
  ayahNumber: number
): MushafWord[] {
  const wordTexts = text.split(/\s+/).filter((w) => w.length > 0);

  return wordTexts.map((wordText, index) => ({
    id: index,
    text: wordText,
    textUthmani: wordText,
    surahNumber,
    ayahNumber,
    wordPosition: index + 1,
    wordKey: `${surahNumber}:${ayahNumber}:${index + 1}`,
    lineNumber: 0, // Set during page layout
    pageNumber: 0, // Set during page layout
    isFirstInAyah: index === 0,
    isLastInAyah: index === wordTexts.length - 1,
    isAyahEnd: false,
  }));
}

/**
 * Add ayah end marker after last word
 */
export function addAyahEndMarker(
  words: MushafWord[],
  ayahNumber: number
): MushafWord[] {
  if (words.length === 0) return words;

  // Convert ayah number to Arabic numerals
  const arabicNumber = toArabicNumber(ayahNumber);

  const endMarker: MushafWord = {
    id: words.length,
    text: `﴿${arabicNumber}﴾`,
    textUthmani: `﴿${arabicNumber}﴾`,
    surahNumber: words[0].surahNumber,
    ayahNumber,
    wordPosition: words.length + 1,
    wordKey: `${words[0].surahNumber}:${ayahNumber}:end`,
    lineNumber: 0,
    pageNumber: 0,
    isFirstInAyah: false,
    isLastInAyah: false,
    isAyahEnd: true,
  };

  return [...words, endMarker];
}

/**
 * Convert number to Arabic numerals
 */
export function toArabicNumber(num: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicDigits[parseInt(d)] || d)
    .join("");
}

// ===== Page Building =====

/**
 * Create a Mushaf line
 */
export function createLine(
  lineNumber: number,
  pageNumber: number,
  lineType: LineType,
  words: MushafWord[],
  isCentered: boolean = false,
  surahNumber?: number
): MushafLine {
  return {
    lineNumber,
    pageNumber,
    lineType,
    words: words.map((w) => ({ ...w, lineNumber, pageNumber })),
    isCentered,
    surahNumber,
  };
}

/**
 * Create a surah header line
 */
export function createSurahHeaderLine(
  lineNumber: number,
  pageNumber: number,
  surahNumber: number
): MushafLine {
  const headerWord: MushafWord = {
    id: 0,
    text: SURAH_NAMES[surahNumber] || `سورة ${surahNumber}`,
    textUthmani: SURAH_NAMES[surahNumber] || `سورة ${surahNumber}`,
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

  return createLine(
    lineNumber,
    pageNumber,
    "surah_name",
    [headerWord],
    true,
    surahNumber
  );
}

/**
 * Create a basmallah line
 */
export function createBasmallahLine(
  lineNumber: number,
  pageNumber: number,
  surahNumber: number,
  scriptType: "uthmani" | "indopak" = "uthmani"
): MushafLine {
  const basmallahText =
    scriptType === "indopak" ? BASMALLAH.indopak : BASMALLAH.uthmani;

  const basmallahWord: MushafWord = {
    id: 0,
    text: basmallahText,
    textUthmani: BASMALLAH.uthmani,
    textIndopak: BASMALLAH.indopak,
    surahNumber,
    ayahNumber: 0,
    wordPosition: 0,
    wordKey: `${surahNumber}:basmallah`,
    lineNumber,
    pageNumber,
    isFirstInAyah: false,
    isLastInAyah: false,
    isAyahEnd: false,
  };

  return createLine(
    lineNumber,
    pageNumber,
    "basmallah",
    [basmallahWord],
    true,
    surahNumber
  );
}

/**
 * Build a simple page from ayahs (adaptive mode, not page-accurate)
 */
export function buildAdaptivePage(
  ayahs: Ayah[],
  pageNumber: number,
  linesPerPage: number = 15
): MushafPage {
  const lines: MushafLine[] = [];
  let currentLine: MushafWord[] = [];
  let lineNumber = 1;
  const surahsOnPage = new Set<number>();

  for (const ayah of ayahs) {
    surahsOnPage.add(ayah.surahNumber);

    // Check if this is first ayah of a surah (needs header + basmallah)
    if (ayah.numberInSurah === 1) {
      // Add surah header
      if (currentLine.length > 0) {
        lines.push(createLine(lineNumber, pageNumber, "ayah", currentLine));
        lineNumber++;
        currentLine = [];
      }

      lines.push(
        createSurahHeaderLine(lineNumber, pageNumber, ayah.surahNumber)
      );
      lineNumber++;

      // Add basmallah (except for Al-Fatiha which has it as ayah 1, and At-Tawbah)
      if (!SURAHS_WITHOUT_BASMALLAH.includes(ayah.surahNumber)) {
        lines.push(
          createBasmallahLine(lineNumber, pageNumber, ayah.surahNumber)
        );
        lineNumber++;
      }
    }

    // Process ayah words
    const words = textToWords(ayah.text, ayah.surahNumber, ayah.numberInSurah);
    const wordsWithEnd = addAyahEndMarker(words, ayah.numberInSurah);

    for (const word of wordsWithEnd) {
      currentLine.push(word);

      // Simple line breaking - roughly 8-10 words per line
      if (currentLine.length >= 8 || word.isAyahEnd) {
        lines.push(createLine(lineNumber, pageNumber, "ayah", currentLine));
        lineNumber++;
        currentLine = [];

        if (lineNumber > linesPerPage) break;
      }
    }

    if (lineNumber > linesPerPage) break;
  }

  // Add remaining words
  if (currentLine.length > 0) {
    lines.push(createLine(lineNumber, pageNumber, "ayah", currentLine));
  }

  return {
    pageNumber,
    lines,
    surahsOnPage: Array.from(surahsOnPage),
    juz: getJuzForPage(pageNumber),
    hizb: getHizbForPage(pageNumber),
    edition: "madinah_1421",
  };
}

// ===== Navigation Utilities =====

export interface PageNavigation {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  previousPage: number | null;
  nextPage: number | null;
  juz: number;
  hizb: number;
  surahsOnPage: number[];
}

export function getPageNavigation(
  pageNumber: number,
  edition: MushafEditionId = "madinah_1421"
): PageNavigation {
  const totalPages =
    edition === "indopak_13"
      ? 849
      : edition === "indopak_16"
        ? 548
        : edition === "indopak_15"
          ? 610
          : 604;

  return {
    currentPage: pageNumber,
    totalPages,
    hasPrevious: pageNumber > 1,
    hasNext: pageNumber < totalPages,
    previousPage: pageNumber > 1 ? pageNumber - 1 : null,
    nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
    juz: getJuzForPage(pageNumber),
    hizb: getHizbForPage(pageNumber),
    surahsOnPage: [], // Would need layout data
  };
}

/** Approximate surah start pages for Madinah Mushaf */
const SURAH_START_PAGES: Record<number, number> = {
  1: 1,
  2: 2,
  3: 50,
  4: 77,
  5: 106,
  6: 128,
  7: 151,
  8: 177,
  9: 187,
  10: 208,
  11: 221,
  12: 235,
  13: 249,
  14: 255,
  15: 262,
  16: 267,
  17: 282,
  18: 293,
  19: 305,
  20: 312,
  21: 322,
  22: 332,
  23: 342,
  24: 350,
  25: 359,
  26: 367,
  27: 377,
  28: 385,
  29: 396,
  30: 404,
  31: 411,
  32: 415,
  33: 418,
  34: 428,
  35: 434,
  36: 440,
  37: 446,
  38: 453,
  39: 458,
  40: 467,
  41: 477,
  42: 483,
  43: 489,
  44: 496,
  45: 499,
  46: 502,
  47: 507,
  48: 511,
  49: 515,
  50: 518,
  51: 520,
  52: 523,
  53: 526,
  54: 528,
  55: 531,
  56: 534,
  57: 537,
  58: 542,
  59: 545,
  60: 549,
  61: 551,
  62: 553,
  63: 554,
  64: 556,
  65: 558,
  66: 560,
  67: 562,
  68: 564,
  69: 566,
  70: 568,
  71: 570,
  72: 572,
  73: 574,
  74: 575,
  75: 577,
  76: 578,
  77: 580,
  78: 582,
  79: 583,
  80: 585,
  81: 586,
  82: 587,
  83: 587,
  84: 589,
  85: 590,
  86: 591,
  87: 591,
  88: 592,
  89: 593,
  90: 594,
  91: 595,
  92: 595,
  93: 596,
  94: 596,
  95: 597,
  96: 597,
  97: 598,
  98: 598,
  99: 599,
  100: 599,
  101: 600,
  102: 600,
  103: 601,
  104: 601,
  105: 601,
  106: 602,
  107: 602,
  108: 602,
  109: 603,
  110: 603,
  111: 603,
  112: 604,
  113: 604,
  114: 604,
};

/**
 * Get page number for a specific surah and ayah
 */
export function getPageForAyah(
  surahNumber: number,
  ayahNumber: number,
  _edition: MushafEditionId = "madinah_1421"
): number {
  const ayahsPerPage = 15;
  const startPage = SURAH_START_PAGES[surahNumber] || 1;
  const estimatedOffset = Math.floor(ayahNumber / ayahsPerPage);
  return Math.min(startPage + estimatedOffset, 604);
}

/**
 * Get the primary surah number for a given page.
 * Returns the surah whose start page is <= pageNumber.
 */
export function getSurahForPage(pageNumber: number): number {
  let surah = 1;
  for (let s = 1; s <= 114; s++) {
    if ((SURAH_START_PAGES[s] || 1) <= pageNumber) {
      surah = s;
    }
  }
  return surah;
}
