/**
 * Arabic Font Loading System for Quran Memorizer
 *
 * Supports multiple font families for different Mushaf editions:
 * - KFGQPC Hafs: Standard Uthmani script (Madinah Mushaf)
 * - Amiri Quran: Alternative Uthmani script
 * - Noto Nastaliq Urdu: IndoPak script
 * - Scheherazade: Academic Arabic
 */

import type { MushafEditionId } from "@/types/quran";

// ===== Font Configuration =====

export interface ArabicFont {
  id: string;
  name: string;
  family: string;
  source: "google" | "local" | "cdn";
  url?: string;
  weights: number[];
  scriptType: "uthmani" | "indopak" | "naskh";
  features?: string[];
}

export const ARABIC_FONTS: Record<string, ArabicFont> = {
  // Primary Uthmani fonts
  kfgqpc_hafs: {
    id: "kfgqpc_hafs",
    name: "KFGQPC Hafs Uthmanic Script",
    family: "KFGQPC Hafs Uthmanic Script",
    source: "cdn",
    url: "https://cdn.jsdelivr.net/gh/nicferrier/kfgqpc-fonts@master/KFGQPC_HAFS.ttf",
    weights: [400],
    scriptType: "uthmani",
    features: ["liga", "calt"],
  },

  kfgqpc_uthmanic: {
    id: "kfgqpc_uthmanic",
    name: "KFGQPC Uthmanic Script HAFS",
    family: "KFGQPC Uthmanic Script HAFS",
    source: "cdn",
    url: "https://fonts.qurancomplex.gov.sa/wp02/wp-content/uploads/2019/02/UthmanicHafs_v2-2-2.ttf",
    weights: [400],
    scriptType: "uthmani",
  },

  // Amiri Quran - beautiful Naskh with Quranic features
  amiri_quran: {
    id: "amiri_quran",
    name: "Amiri Quran",
    family: "Amiri Quran",
    source: "google",
    weights: [400],
    scriptType: "naskh",
    features: ["liga", "calt", "ccmp"],
  },

  // Noto Nastaliq for IndoPak style
  noto_nastaliq: {
    id: "noto_nastaliq",
    name: "Noto Nastaliq Urdu",
    family: "Noto Nastaliq Urdu",
    source: "google",
    weights: [400, 500, 600, 700],
    scriptType: "indopak",
  },

  // Scheherazade for academic use
  scheherazade: {
    id: "scheherazade",
    name: "Scheherazade New",
    family: "Scheherazade New",
    source: "google",
    weights: [400, 500, 600, 700],
    scriptType: "naskh",
  },

  // Lateef for Nastaliq style
  lateef: {
    id: "lateef",
    name: "Lateef",
    family: "Lateef",
    source: "google",
    weights: [400],
    scriptType: "indopak",
  },

  // Me Quran for standard Arabic
  me_quran: {
    id: "me_quran",
    name: "Me Quran",
    family: "me_quran",
    source: "cdn",
    url: "https://cdn.jsdelivr.net/npm/quran-fonts@1.0.0/fonts/me_quran.ttf",
    weights: [400],
    scriptType: "uthmani",
  },

  // Digital Khatt - modern digital typography
  digital_khatt: {
    id: "digital_khatt",
    name: "Digital Khatt",
    family: "Digital Khatt",
    source: "cdn",
    url: "https://api.quranwbw.com/assets/fonts/DigitalKhatt.woff2",
    weights: [400],
    scriptType: "uthmani",
  },
};

// ===== Font for each Mushaf Edition =====

export const EDITION_FONTS: Record<MushafEditionId, string> = {
  madinah_1405: "kfgqpc_hafs",
  madinah_1421: "kfgqpc_hafs",
  madinah_1441: "kfgqpc_uthmanic",
  indopak_15: "noto_nastaliq",
  indopak_13: "noto_nastaliq",
  indopak_16: "noto_nastaliq",
  digital_khatt: "digital_khatt",
};

// ===== Font Loading Utilities =====

/**
 * Generate Google Fonts URL for multiple fonts
 */
export function getGoogleFontsUrl(fontIds: string[]): string {
  const googleFonts = fontIds
    .map((id) => ARABIC_FONTS[id])
    .filter((font) => font?.source === "google");

  if (googleFonts.length === 0) return "";

  const families = googleFonts
    .map((font) => {
      const weights = font.weights.join(";");
      return `family=${encodeURIComponent(font.family)}:wght@${weights}`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Generate @font-face CSS for CDN fonts
 */
export function getFontFaceCSS(fontId: string): string {
  const font = ARABIC_FONTS[fontId];
  if (!font || font.source !== "cdn" || !font.url) return "";

  const format = font.url.endsWith(".woff2")
    ? "woff2"
    : font.url.endsWith(".woff")
      ? "woff"
      : "truetype";

  return `
@font-face {
  font-family: '${font.family}';
  src: url('${font.url}') format('${format}');
  font-weight: ${font.weights[0]};
  font-style: normal;
  font-display: swap;
}
`.trim();
}

/**
 * Get all @font-face declarations for CDN fonts
 */
export function getAllCDNFontFaces(): string {
  return Object.keys(ARABIC_FONTS)
    .map(getFontFaceCSS)
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Load fonts dynamically using the Font Loading API
 */
export async function loadFont(fontId: string): Promise<boolean> {
  const font = ARABIC_FONTS[fontId];
  if (!font) {
    console.warn(`Font not found: ${fontId}`);
    return false;
  }

  // Check if already loaded
  if (document.fonts.check(`1em "${font.family}"`)) {
    return true;
  }

  try {
    if (font.source === "google") {
      // Load via stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = getGoogleFontsUrl([fontId]);
      document.head.appendChild(link);

      // Wait for font to load
      await document.fonts.load(`1em "${font.family}"`);
    } else if (font.source === "cdn" && font.url) {
      // Load via FontFace API
      const fontFace = new FontFace(font.family, `url(${font.url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
    }

    return true;
  } catch (error) {
    console.error(`Failed to load font: ${fontId}`, error);
    return false;
  }
}

/**
 * Load font for a specific Mushaf edition
 */
export async function loadEditionFont(
  editionId: MushafEditionId
): Promise<boolean> {
  const fontId = EDITION_FONTS[editionId];
  if (!fontId) {
    console.warn(`No font configured for edition: ${editionId}`);
    return false;
  }
  return loadFont(fontId);
}

/**
 * Get CSS font-family value for an edition
 */
export function getEditionFontFamily(editionId: MushafEditionId): string {
  const fontId = EDITION_FONTS[editionId];
  const font = ARABIC_FONTS[fontId];

  if (!font) {
    // Fallback to system Arabic fonts
    return "'Amiri', 'Traditional Arabic', 'Simplified Arabic', serif";
  }

  // Include fallbacks
  const fallbacks =
    font.scriptType === "indopak"
      ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
      : "'Amiri', 'Traditional Arabic', 'Simplified Arabic', serif";

  return `'${font.family}', ${fallbacks}`;
}

/**
 * Preload essential fonts for faster initial render
 */
export function preloadEssentialFonts(): void {
  const essentialFonts = ["kfgqpc_hafs", "amiri_quran"];

  essentialFonts.forEach((fontId) => {
    const font = ARABIC_FONTS[fontId];
    if (font?.source === "cdn" && font.url) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = font.url.endsWith(".woff2") ? "font/woff2" : "font/ttf";
      link.crossOrigin = "anonymous";
      link.href = font.url;
      document.head.appendChild(link);
    }
  });
}

// ===== Arabic Text Utilities =====

/**
 * Check if a character is Arabic
 */
export function isArabicChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x0600 && code <= 0x06ff) || // Arabic
    (code >= 0x0750 && code <= 0x077f) || // Arabic Supplement
    (code >= 0x08a0 && code <= 0x08ff) || // Arabic Extended-A
    (code >= 0xfb50 && code <= 0xfdff) || // Arabic Presentation Forms-A
    (code >= 0xfe70 && code <= 0xfeff) // Arabic Presentation Forms-B
  );
}

/**
 * Check if text contains Arabic
 */
export function containsArabic(text: string): boolean {
  return [...text].some(isArabicChar);
}

/**
 * Get optimal font size for Arabic text based on line count
 */
export function getOptimalFontSize(
  containerWidth: number,
  linesPerPage: number,
  scriptType: "uthmani" | "indopak"
): number {
  // Base calculations for optimal readability
  const baseSize = Math.floor(containerWidth / 20);

  // Adjust for script type (Nastaliq needs more vertical space)
  const scriptMultiplier = scriptType === "indopak" ? 0.85 : 1;

  // Adjust for lines per page
  const lineMultiplier =
    linesPerPage <= 13 ? 1.1 : linesPerPage >= 16 ? 0.9 : 1;

  return Math.max(
    16,
    Math.min(32, baseSize * scriptMultiplier * lineMultiplier)
  );
}
