import type {
  Ayah,
  AyahResponse,
  QuranAPIResponse,
  Reciter,
  SearchResult,
  Surah,
  Translation,
  Word,
} from "@/types/quran";

// ===== API Configuration =====

const ALQURAN_API_BASE = "https://api.alquran.cloud/v1";
const QUL_API_BASE = "https://api.quran.com/api/v4";
const AUDIO_CDN_BASE = "https://cdn.islamic.network/quran/audio";

// ===== Surah API =====

export async function fetchAllSurahs(): Promise<Surah[]> {
  const response = await fetch(`${ALQURAN_API_BASE}/surah`);
  const data: QuranAPIResponse<Surah[]> = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to fetch surahs: ${data.status}`);
  }

  return data.data.map((surah) => ({
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.numberOfAyahs,
    revelationType: surah.revelationType,
    startPage: getStartPage(surah.number),
  }));
}

export async function fetchSurah(
  surahNumber: number,
  edition: string = "quran-uthmani"
): Promise<{ surah: Surah; ayahs: Ayah[] }> {
  const response = await fetch(
    `${ALQURAN_API_BASE}/surah/${surahNumber}/${edition}`
  );
  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to fetch surah: ${data.status}`);
  }

  const surahData = data.data;

  return {
    surah: {
      number: surahData.number,
      name: surahData.name,
      englishName: surahData.englishName,
      englishNameTranslation: surahData.englishNameTranslation,
      numberOfAyahs: surahData.numberOfAyahs,
      revelationType: surahData.revelationType,
      startPage: getStartPage(surahData.number),
    },
    ayahs: surahData.ayahs.map((ayah: AyahResponse) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      surahNumber: surahData.number,
      text: ayah.text,
      textUthmani: ayah.text,
      textSimple: removeArabicDiacritics(ayah.text),
      juz: ayah.juz,
      hizb: Math.ceil(ayah.hizbQuarter / 4),
      hizbQuarter: ayah.hizbQuarter,
      page: ayah.page,
      sajda:
        typeof ayah.sajda === "object"
          ? ayah.sajda
          : ayah.sajda
            ? { id: 0, recommended: true, obligatory: false }
            : undefined,
      words: [], // Words fetched separately
    })),
  };
}

// ===== Ayah API =====

export async function fetchAyah(
  surahNumber: number,
  ayahNumber: number,
  edition: string = "quran-uthmani"
): Promise<Ayah> {
  const response = await fetch(
    `${ALQURAN_API_BASE}/ayah/${surahNumber}:${ayahNumber}/${edition}`
  );
  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to fetch ayah: ${data.status}`);
  }

  const ayahData = data.data;

  return {
    number: ayahData.number,
    numberInSurah: ayahData.numberInSurah,
    surahNumber: ayahData.surah.number,
    text: ayahData.text,
    textUthmani: ayahData.text,
    textSimple: removeArabicDiacritics(ayahData.text),
    juz: ayahData.juz,
    hizb: Math.ceil(ayahData.hizbQuarter / 4),
    hizbQuarter: ayahData.hizbQuarter,
    page: ayahData.page,
    words: [],
  };
}

export async function fetchAyahRange(
  surahNumber: number,
  startAyah: number,
  endAyah: number,
  edition: string = "quran-uthmani"
): Promise<Ayah[]> {
  const ayahs: Ayah[] = [];

  // Batch fetch for efficiency
  const promises = [];
  for (let i = startAyah; i <= endAyah; i++) {
    promises.push(fetchAyah(surahNumber, i, edition));
  }

  const results = await Promise.all(promises);
  return results;
}

// ===== Word-by-Word API (Quran.com) =====

export async function fetchWordsForAyah(
  surahNumber: number,
  ayahNumber: number
): Promise<Word[]> {
  const response = await fetch(
    `${QUL_API_BASE}/verses/by_key/${surahNumber}:${ayahNumber}?words=true&word_fields=text_uthmani,text_indopak,transliteration`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch words: ${response.statusText}`);
  }

  const data = await response.json();
  const verse = data.verse;

  return verse.words.map(
    (word: {
      id: number;
      position: number;
      text_uthmani: string;
      text_indopak: string;
      char_type_name: string;
      transliteration?: { text: string };
      translation?: { text: string };
    }) => ({
      id: word.id,
      position: word.position,
      text: word.text_uthmani,
      textUthmani: word.text_uthmani,
      textIndopak: word.text_indopak,
      textSimple: removeArabicDiacritics(word.text_uthmani),
      transliteration: word.transliteration?.text,
      translation: word.translation?.text,
      charType: word.char_type_name === "word" ? "word" : "end",
      wordKey: `${surahNumber}:${ayahNumber}:${word.position}`,
    })
  );
}

// ===== Translation API =====

export async function fetchAvailableTranslations(): Promise<Translation[]> {
  const response = await fetch(
    `${ALQURAN_API_BASE}/edition?format=text&type=translation`
  );
  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to fetch translations: ${data.status}`);
  }

  return data.data.map(
    (edition: {
      identifier: string;
      name: string;
      englishName: string;
      language: string;
      direction: string;
    }) => ({
      id: edition.identifier,
      name: edition.name,
      englishName: edition.englishName,
      language: edition.language,
      languageCode: edition.language,
      direction: edition.direction === "rtl" ? "rtl" : "ltr",
    })
  );
}

export async function fetchTranslation(
  surahNumber: number,
  translationId: string
): Promise<{ surahNumber: number; ayahNumber: number; text: string }[]> {
  const response = await fetch(
    `${ALQURAN_API_BASE}/surah/${surahNumber}/${translationId}`
  );
  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to fetch translation: ${data.status}`);
  }

  return data.data.ayahs.map(
    (ayah: { numberInSurah: number; text: string }) => ({
      surahNumber,
      ayahNumber: ayah.numberInSurah,
      text: ayah.text,
    })
  );
}

// ===== Audio/Reciter API =====

export const POPULAR_RECITERS: Reciter[] = [
  {
    id: "ar.alafasy",
    name: "Mishary Rashid Alafasy",
    englishName: "Mishary Rashid Alafasy",
    arabicName: "مشاري راشد العفاسي",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.alafasy`,
  },
  {
    id: "ar.abdulbasitmurattal",
    name: "Abdul Basit Abdul Samad",
    englishName: "Abdul Basit Abdul Samad (Murattal)",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Murattal",
    bitrate: 192,
    baseUrl: `${AUDIO_CDN_BASE}/192/ar.abdulbasitmurattal`,
  },
  {
    id: "ar.abdurrahmaansudais",
    name: "Abdur Rahman As-Sudais",
    englishName: "Abdur Rahman As-Sudais",
    arabicName: "عبدالرحمن السديس",
    style: "Murattal",
    bitrate: 192,
    baseUrl: `${AUDIO_CDN_BASE}/192/ar.abdurrahmaansudais`,
  },
  {
    id: "ar.saabormahmoudkhalilalhos",
    name: "Mahmoud Khalil Al-Hussary",
    englishName: "Mahmoud Khalil Al-Hussary",
    arabicName: "محمود خليل الحصري",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.husary`,
  },
  {
    id: "ar.minshawi",
    name: "Mohamed Siddiq El-Minshawi",
    englishName: "Mohamed Siddiq El-Minshawi",
    arabicName: "محمد صديق المنشاوي",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.minshawi`,
  },
  {
    id: "ar.muhammadayyoub",
    name: "Muhammad Ayyub",
    englishName: "Muhammad Ayyub",
    arabicName: "محمد أيوب",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.muhammadayyoub`,
  },
  {
    id: "ar.ahmedajamy",
    name: "Ahmed ibn Ali al-Ajamy",
    englishName: "Ahmed ibn Ali al-Ajamy",
    arabicName: "أحمد بن علي العجمي",
    style: "Murattal",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.ahmedajamy`,
  },
  {
    id: "ar.maabormahmoudkhalilalhos",
    name: "Mahmoud Khalil Al-Hussary (Mujawwad)",
    englishName: "Mahmoud Khalil Al-Hussary (Mujawwad)",
    arabicName: "محمود خليل الحصري - مجوّد",
    style: "Mujawwad",
    bitrate: 128,
    baseUrl: `${AUDIO_CDN_BASE}/128/ar.husarymujawwad`,
  },
];

export function getAudioUrl(
  reciterId: string,
  surahNumber: number,
  ayahNumber: number
): string {
  const reciter = POPULAR_RECITERS.find((r) => r.id === reciterId);
  if (!reciter) {
    throw new Error(`Reciter not found: ${reciterId}`);
  }

  // Format: CDN uses global ayah number
  const globalAyahNumber = getGlobalAyahNumber(surahNumber, ayahNumber);
  return `${reciter.baseUrl}/${globalAyahNumber}.mp3`;
}

export function getSurahAudioUrl(
  reciterId: string,
  surahNumber: number
): string {
  const reciter = POPULAR_RECITERS.find((r) => r.id === reciterId);
  if (!reciter) {
    throw new Error(`Reciter not found: ${reciterId}`);
  }

  const paddedSurah = surahNumber.toString().padStart(3, "0");
  return `${reciter.baseUrl}/${paddedSurah}.mp3`;
}

// ===== Search API =====

export async function searchQuran(
  query: string,
  options: {
    language?: string;
    limit?: number;
  } = {}
): Promise<SearchResult[]> {
  const { language = "ar", limit = 20 } = options;

  // Use Quran.com search API
  const response = await fetch(
    `${QUL_API_BASE}/search?q=${encodeURIComponent(query)}&size=${limit}&language=${language}`
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();

  return data.search.results.map(
    (result: {
      verse_key: string;
      text: string;
      highlighted: string;
      translations?: { text: string }[];
    }) => {
      const [surah, ayah] = result.verse_key.split(":").map(Number);
      return {
        surahNumber: surah,
        ayahNumber: ayah,
        text: result.text,
        highlightedText: result.highlighted || result.text,
        matchScore: 1,
        translation: result.translations?.[0]?.text,
      };
    }
  );
}

// ===== Page API =====

export async function fetchPage(
  pageNumber: number,
  edition: string = "quran-uthmani"
): Promise<Ayah[]> {
  const response = await fetch(
    `${ALQURAN_API_BASE}/page/${pageNumber}/${edition}`
  );
  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to fetch page: ${data.status}`);
  }

  return data.data.ayahs.map((ayah: AyahResponse) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    surahNumber: ayah.surah.number,
    text: ayah.text,
    textUthmani: ayah.text,
    textSimple: removeArabicDiacritics(ayah.text),
    juz: ayah.juz,
    hizb: Math.ceil(ayah.hizbQuarter / 4),
    hizbQuarter: ayah.hizbQuarter,
    page: ayah.page,
    words: [],
  }));
}

export async function fetchJuz(
  juzNumber: number,
  edition: string = "quran-uthmani"
): Promise<Ayah[]> {
  const response = await fetch(
    `${ALQURAN_API_BASE}/juz/${juzNumber}/${edition}`
  );
  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(`Failed to fetch juz: ${data.status}`);
  }

  return data.data.ayahs.map((ayah: AyahResponse) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    surahNumber: ayah.surah.number,
    text: ayah.text,
    textUthmani: ayah.text,
    textSimple: removeArabicDiacritics(ayah.text),
    juz: ayah.juz,
    hizb: Math.ceil(ayah.hizbQuarter / 4),
    hizbQuarter: ayah.hizbQuarter,
    page: ayah.page,
    words: [],
  }));
}

// ===== Utility Functions =====

/**
 * Remove Arabic diacritics (tashkeel) from text
 */
export function removeArabicDiacritics(text: string): string {
  // Arabic diacritics Unicode range: U+064B to U+065F
  return text.replace(/[\u064B-\u065F\u0670]/g, "");
}

/**
 * Normalize Arabic text for comparison
 */
export function normalizeArabicText(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Remove diacritics
    .replace(/[إأآا]/g, "ا") // Normalize alef variants
    .replace(/ة/g, "ه") // Normalize taa marbuta
    .replace(/ى/g, "ي") // Normalize alef maksura
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Get start page for a surah in standard Madinah Mushaf
 */
function getStartPage(surahNumber: number): number {
  const startPages: Record<number, number> = {
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

  return startPages[surahNumber] || 1;
}

/**
 * Calculate global ayah number from surah and ayah
 */
function getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
  // Total ayahs before each surah (cumulative)
  const ayahsBeforeSurah: Record<number, number> = {
    1: 0,
    2: 7,
    3: 293,
    4: 493,
    5: 669,
    6: 789,
    7: 954,
    8: 1160,
    9: 1235,
    10: 1364,
    11: 1473,
    12: 1596,
    13: 1707,
    14: 1750,
    15: 1802,
    16: 1901,
    17: 2029,
    18: 2140,
    19: 2250,
    20: 2348,
    21: 2483,
    22: 2595,
    23: 2673,
    24: 2791,
    25: 2855,
    26: 2932,
    27: 3159,
    28: 3252,
    29: 3340,
    30: 3409,
    31: 3469,
    32: 3503,
    33: 3533,
    34: 3606,
    35: 3660,
    36: 3705,
    37: 3788,
    38: 3970,
    39: 4058,
    40: 4133,
    41: 4218,
    42: 4272,
    43: 4325,
    44: 4414,
    45: 4473,
    46: 4510,
    47: 4545,
    48: 4583,
    49: 4612,
    50: 4630,
    51: 4675,
    52: 4735,
    53: 4784,
    54: 4846,
    55: 4901,
    56: 4979,
    57: 5075,
    58: 5104,
    59: 5126,
    60: 5150,
    61: 5163,
    62: 5177,
    63: 5188,
    64: 5199,
    65: 5217,
    66: 5229,
    67: 5241,
    68: 5271,
    69: 5323,
    70: 5375,
    71: 5419,
    72: 5447,
    73: 5475,
    74: 5495,
    75: 5551,
    76: 5591,
    77: 5622,
    78: 5672,
    79: 5712,
    80: 5758,
    81: 5800,
    82: 5829,
    83: 5848,
    84: 5884,
    85: 5909,
    86: 5931,
    87: 5948,
    88: 5967,
    89: 5993,
    90: 6023,
    91: 6043,
    92: 6058,
    93: 6079,
    94: 6090,
    95: 6098,
    96: 6106,
    97: 6125,
    98: 6130,
    99: 6138,
    100: 6146,
    101: 6157,
    102: 6168,
    103: 6176,
    104: 6179,
    105: 6188,
    106: 6193,
    107: 6197,
    108: 6204,
    109: 6207,
    110: 6213,
    111: 6216,
    112: 6221,
    113: 6225,
    114: 6230,
  };

  return (ayahsBeforeSurah[surahNumber] || 0) + ayahNumber;
}

/**
 * Get surah and ayah from global ayah number
 */
export function getAyahFromGlobal(
  globalNumber: number
): { surahNumber: number; ayahNumber: number } | null {
  const ayahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
    111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
    54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49,
    62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28,
    28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
    15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5,
    6,
  ];

  let cumulative = 0;
  for (let i = 0; i < ayahCounts.length; i++) {
    if (globalNumber <= cumulative + ayahCounts[i]) {
      return {
        surahNumber: i + 1,
        ayahNumber: globalNumber - cumulative,
      };
    }
    cumulative += ayahCounts[i];
  }

  return null;
}
