// ===== Mushaf Edition Types =====

export type MushafEditionId =
  | "madinah_1405"
  | "madinah_1421"
  | "madinah_1441"
  | "indopak_15"
  | "indopak_13"
  | "indopak_16"
  | "digital_khatt";

export interface MushafEdition {
  id: MushafEditionId;
  name: string;
  nameArabic: string;
  totalPages: number;
  linesPerPage: number;
  fontFamily: string;
  scriptType: "uthmani" | "indopak";
  description: string;
}

export const MUSHAF_EDITIONS: Record<MushafEditionId, MushafEdition> = {
  madinah_1405: {
    id: "madinah_1405",
    name: "Madinah 1405H (Classic)",
    nameArabic: "مصحف المدينة ١٤٠٥هـ",
    totalPages: 604,
    linesPerPage: 15,
    fontFamily: "KFGQPC Hafs Uthmanic Script",
    scriptType: "uthmani",
    description: "Classic Madinah Mushaf edition from 1405 Hijri",
  },
  madinah_1421: {
    id: "madinah_1421",
    name: "Madinah 1421H",
    nameArabic: "مصحف المدينة ١٤٢١هـ",
    totalPages: 604,
    linesPerPage: 15,
    fontFamily: "KFGQPC Hafs Uthmanic Script",
    scriptType: "uthmani",
    description: "Standard Madinah Mushaf edition from 1421 Hijri",
  },
  madinah_1441: {
    id: "madinah_1441",
    name: "Madinah 1441H (Tajweed)",
    nameArabic: "مصحف المدينة ١٤٤١هـ",
    totalPages: 604,
    linesPerPage: 15,
    fontFamily: "KFGQPC HAFS Uthmanic Script",
    scriptType: "uthmani",
    description: "Latest Madinah Mushaf with Tajweed color coding",
  },
  indopak_15: {
    id: "indopak_15",
    name: "IndoPak 15 Lines",
    nameArabic: "مصحف الهند ١٥ سطر",
    totalPages: 610,
    linesPerPage: 15,
    fontFamily: "Noto Nastaliq Urdu",
    scriptType: "indopak",
    description: "South Asian style with 15 lines per page",
  },
  indopak_13: {
    id: "indopak_13",
    name: "IndoPak 13 Lines",
    nameArabic: "مصحف الهند ١٣ سطر",
    totalPages: 849,
    linesPerPage: 13,
    fontFamily: "Noto Nastaliq Urdu",
    scriptType: "indopak",
    description: "South Asian style with 13 lines per page",
  },
  indopak_16: {
    id: "indopak_16",
    name: "IndoPak 16 Lines",
    nameArabic: "مصحف الهند ١٦ سطر",
    totalPages: 548,
    linesPerPage: 16,
    fontFamily: "Noto Nastaliq Urdu",
    scriptType: "indopak",
    description: "South Asian style with 16 lines per page",
  },
  digital_khatt: {
    id: "digital_khatt",
    name: "Digital Khatt",
    nameArabic: "الخط الرقمي",
    totalPages: 604,
    linesPerPage: 15,
    fontFamily: "Digital Khatt",
    scriptType: "uthmani",
    description: "Modern digital typography",
  },
};

// ===== Surah Types =====

export type RevelationType = "Meccan" | "Medinan";

export interface Surah {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
  startPage: number; // Page in standard Madinah Mushaf
  rukus?: number; // Number of rukus (sections)
}

// ===== Ayah Types =====

export interface Ayah {
  number: number; // Global ayah number (1-6236)
  numberInSurah: number;
  surahNumber: number;
  text: string; // Default script text
  textUthmani: string;
  textIndopak?: string;
  textSimple: string; // Without diacritics
  juz: number;
  hizb: number;
  hizbQuarter: number;
  page: number; // Page in Madinah Mushaf
  sajda?: SajdaInfo;
  words: Word[];
}

export interface SajdaInfo {
  id: number;
  recommended: boolean;
  obligatory: boolean;
}

// ===== Word Types =====

export interface Word {
  id: number;
  position: number; // Position in ayah (1-indexed)
  text: string;
  textUthmani: string;
  textIndopak?: string;
  textSimple: string;
  transliteration?: string;
  translation?: string; // Word-by-word translation
  audioUrl?: string;
  charType: "word" | "end" | "pause"; // end = ayah number, pause = waqf mark
  wordKey: string; // Format: "surah:ayah:word" e.g., "2:255:3"
  tajweedRules?: TajweedRule[];
}

// ===== Tajweed Types =====

export type TajweedRuleType =
  | "ghunnah" // Nasalization
  | "qalqalah" // Echo sound
  | "madd_normal" // Normal elongation
  | "madd_munfasil" // Separated elongation
  | "madd_muttasil" // Connected elongation
  | "madd_lazim" // Obligatory elongation
  | "idgham_ghunnah" // Merging with nasalization
  | "idgham_no_ghunnah" // Merging without nasalization
  | "ikhfa" // Hiding
  | "ikhfa_shafawi" // Lip hiding
  | "iqlab" // Conversion
  | "izhar" // Clear pronunciation
  | "izhar_shafawi"; // Lip clear pronunciation

export interface TajweedRule {
  type: TajweedRuleType;
  startChar: number; // Character index in word
  endChar: number;
  color: string; // Hex color for highlighting
  description?: string;
}

export const TAJWEED_COLORS: Record<TajweedRuleType, string> = {
  ghunnah: "#FF7E1E", // Orange
  qalqalah: "#4B0082", // Indigo
  madd_normal: "#1E90FF", // Dodger blue
  madd_munfasil: "#00CED1", // Dark turquoise
  madd_muttasil: "#008B8B", // Dark cyan
  madd_lazim: "#0000CD", // Medium blue
  idgham_ghunnah: "#228B22", // Forest green
  idgham_no_ghunnah: "#006400", // Dark green
  ikhfa: "#DC143C", // Crimson
  ikhfa_shafawi: "#FF69B4", // Hot pink
  iqlab: "#8B008B", // Dark magenta
  izhar: "#696969", // Dim gray
  izhar_shafawi: "#A9A9A9", // Dark gray
};

// ===== Mushaf Layout Types =====

export type LineType = "ayah" | "surah_name" | "basmallah" | "empty";

export interface MushafLine {
  lineNumber: number;
  pageNumber: number;
  lineType: LineType;
  words: MushafWord[];
  isCentered: boolean;
  surahNumber?: number; // For surah_name lines
}

export interface MushafWord {
  id: number;
  text: string;
  textUthmani: string;
  textIndopak?: string;
  surahNumber: number;
  ayahNumber: number;
  wordPosition: number;
  wordKey: string; // "surah:ayah:word"
  lineNumber: number;
  pageNumber: number;
  isFirstInAyah: boolean;
  isLastInAyah: boolean;
  isAyahEnd: boolean; // True for ayah number markers
  // QPC Glyph codes for font rendering
  qpcV1?: string; // QPC V1 glyph code (1405H)
  qpcV2?: string; // QPC V2 glyph code (1421H)
  // Optional enrichment data
  transliteration?: string;
  translation?: string;
  tajweedRules?: TajweedRule[];
}

export interface MushafPage {
  pageNumber: number;
  lines: MushafLine[];
  surahsOnPage: number[]; // List of surah numbers that appear on this page
  juz: number;
  hizb: number;
  edition: MushafEditionId;
}

// ===== Translation Types =====

export interface Translation {
  id: string;
  name: string;
  englishName: string;
  language: string;
  languageCode: string; // ISO 639-1
  direction: "ltr" | "rtl";
  author?: string;
}

export interface AyahTranslation {
  ayahKey: string; // "surah:ayah"
  translationId: string;
  text: string;
}

// ===== Tafsir Types =====

export interface Tafsir {
  id: string;
  name: string;
  englishName: string;
  language: string;
  languageCode: string;
  author?: string;
}

export interface AyahTafsir {
  ayahKey: string;
  tafsirId: string;
  text: string;
}

// ===== Audio/Reciter Types =====

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  arabicName: string;
  style?: string; // e.g., "Murattal", "Mujawwad"
  bitrate?: number;
  baseUrl: string; // CDN base URL for audio files
}

export interface AyahAudio {
  ayahKey: string;
  reciterId: string;
  url: string;
  duration?: number; // In milliseconds
  timestamps?: WordTimestamp[];
}

export interface WordTimestamp {
  wordPosition: number;
  startTime: number; // Milliseconds
  endTime: number;
}

// ===== Juz/Hizb Types =====

export interface Juz {
  number: number; // 1-30
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  versesCount: number;
}

export interface Hizb {
  number: number; // 1-60
  juz: number;
  startSurah: number;
  startAyah: number;
  quarters: HizbQuarter[];
}

export interface HizbQuarter {
  number: number; // 1-4 within hizb
  globalNumber: number; // 1-240
  startSurah: number;
  startAyah: number;
}

// ===== Bookmark Types =====

export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber?: number;
  note?: string;
  color?: string;
  createdAt: Date;
  folder?: string;
}

// ===== Search Types =====

export interface SearchResult {
  surahNumber: number;
  ayahNumber: number;
  text: string;
  highlightedText: string; // With match highlighting
  matchScore: number;
  translation?: string;
}

export interface VoiceSearchResult extends SearchResult {
  confidence: number; // Speech recognition confidence
  transcribedText: string; // What was transcribed from voice
}

// ===== API Response Types =====

export interface QuranAPIResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface SurahListResponse {
  surahs: Surah[];
}

export interface AyahResponse {
  number: number;
  audio?: string;
  audioSecondary?: string[];
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | SajdaInfo;
}
