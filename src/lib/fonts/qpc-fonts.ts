/**
 * QPC (Quran Printing Complex) Font Loading System
 *
 * Manages dynamic loading of page-specific QPC fonts for accurate Mushaf rendering.
 * Each page requires its own font file (604 total for Madinah Mushaf).
 *
 * CDN: https://verses.quran.foundation/fonts/quran
 */

// ===== CDN Configuration =====

const QURAN_FOUNDATION_CDN = "https://verses.quran.foundation/fonts/quran";
const TARTEEL_CDN = "https://static-cdn.tarteel.ai/qul/fonts";

// ===== Font Types =====

export type QPCVersion =
  | "v1"
  | "v2"
  | "v4-colrv1"
  | "v4-svg-light"
  | "v4-svg-dark"
  | "v4-svg-sepia";
export type FontFormat = "woff2" | "woff" | "ttf";

export interface LoadedFont {
  name: string;
  version: QPCVersion;
  pageNumber: number;
  loaded: boolean;
}

// ===== Font URL Builders =====

/**
 * Get the CDN URL for a page-specific QPC font
 */
export function getQPCFontUrl(
  pageNumber: number,
  version: QPCVersion = "v2",
  format: FontFormat = "woff2"
): string {
  const paddedPage = pageNumber.toString();

  switch (version) {
    case "v1":
      return `${QURAN_FOUNDATION_CDN}/hafs/v1/${format}/p${paddedPage}.${format}`;
    case "v2":
      return `${QURAN_FOUNDATION_CDN}/hafs/v2/${format}/p${paddedPage}.${format}`;
    case "v4-colrv1":
      return `${QURAN_FOUNDATION_CDN}/hafs/v4/colrv1/${format}/p${paddedPage}.${format}`;
    case "v4-svg-light":
      return `${QURAN_FOUNDATION_CDN}/hafs/v4/ot-svg/light/${format}/p${paddedPage}.${format}`;
    case "v4-svg-dark":
      return `${QURAN_FOUNDATION_CDN}/hafs/v4/ot-svg/dark/${format}/p${paddedPage}.${format}`;
    case "v4-svg-sepia":
      return `${QURAN_FOUNDATION_CDN}/hafs/v4/ot-svg/sepia/${format}/p${paddedPage}.${format}`;
    default:
      return `${QURAN_FOUNDATION_CDN}/hafs/v2/${format}/p${paddedPage}.${format}`;
  }
}

/**
 * Get the URL for the Uthmanic Hafs Unicode font (fallback)
 */
export function getUthmanicHafsFontUrl(format: FontFormat = "woff2"): string {
  return `${QURAN_FOUNDATION_CDN}/hafs/uthmanic_hafs/UthmanicHafs1Ver18.${format}`;
}

/**
 * Get the URL for the Surah Name Font V4
 */
export function getSurahNameFontUrl(format: FontFormat = "woff2"): string {
  const ext = format === "ttf" ? "ttf" : format;
  return `${TARTEEL_CDN}/surah-names/v4/surah-name-v4.${ext}`;
}

// ===== Font Name Generators =====

/**
 * Generate a unique font family name for a page
 */
export function getQPCFontName(
  pageNumber: number,
  version: QPCVersion = "v2"
): string {
  return `qpc-p${pageNumber}-${version}`;
}

// ===== Font Loading =====

// Track loaded fonts to avoid duplicate loading
const loadedFonts = new Set<string>();
const loadingPromises = new Map<string, Promise<void>>();

/**
 * Load a page-specific QPC font dynamically
 */
export async function loadQPCFont(
  pageNumber: number,
  version: QPCVersion = "v2"
): Promise<void> {
  const fontName = getQPCFontName(pageNumber, version);

  // Already loaded
  if (loadedFonts.has(fontName)) {
    return;
  }

  // Currently loading
  if (loadingPromises.has(fontName)) {
    return loadingPromises.get(fontName);
  }

  const loadPromise = (async () => {
    try {
      const url = getQPCFontUrl(pageNumber, version, "woff2");

      const fontFace = new FontFace(fontName, `url(${url})`, {
        display: "block", // Block rendering until font loads for current page
      });

      await fontFace.load();
      document.fonts.add(fontFace);
      loadedFonts.add(fontName);
    } catch (error) {
      console.error(`Failed to load QPC font for page ${pageNumber}:`, error);
      throw error;
    }
  })();

  loadingPromises.set(fontName, loadPromise);

  try {
    await loadPromise;
  } finally {
    loadingPromises.delete(fontName);
  }
}

/**
 * Prefetch a page font (non-blocking, uses swap display)
 */
export async function prefetchQPCFont(
  pageNumber: number,
  version: QPCVersion = "v2"
): Promise<void> {
  const fontName = getQPCFontName(pageNumber, version);

  if (loadedFonts.has(fontName) || loadingPromises.has(fontName)) {
    return;
  }

  const loadPromise = (async () => {
    try {
      const url = getQPCFontUrl(pageNumber, version, "woff2");

      const fontFace = new FontFace(fontName, `url(${url})`, {
        display: "swap", // Don't block for prefetched fonts
      });

      await fontFace.load();
      document.fonts.add(fontFace);
      loadedFonts.add(fontName);
    } catch (error) {
      // Silently fail for prefetch
      console.warn(`Failed to prefetch QPC font for page ${pageNumber}`);
    }
  })();

  loadingPromises.set(fontName, loadPromise);

  try {
    await loadPromise;
  } finally {
    loadingPromises.delete(fontName);
  }
}

/**
 * Load the Uthmanic Hafs Unicode font (for verse markers)
 */
export async function loadUthmanicHafsFont(): Promise<void> {
  const fontName = "UthmanicHafs";

  if (loadedFonts.has(fontName)) {
    return;
  }

  if (loadingPromises.has(fontName)) {
    return loadingPromises.get(fontName);
  }

  const loadPromise = (async () => {
    try {
      const url = getUthmanicHafsFontUrl("woff2");

      const fontFace = new FontFace(fontName, `url(${url})`, {
        display: "swap",
      });

      await fontFace.load();
      document.fonts.add(fontFace);
      loadedFonts.add(fontName);
    } catch (error) {
      console.error("Failed to load UthmanicHafs font:", error);
    }
  })();

  loadingPromises.set(fontName, loadPromise);

  try {
    await loadPromise;
  } finally {
    loadingPromises.delete(fontName);
  }
}

/**
 * Load the Surah Name Font V4
 */
export async function loadSurahNameFont(): Promise<void> {
  const fontName = "SurahNames";

  if (loadedFonts.has(fontName)) {
    return;
  }

  if (loadingPromises.has(fontName)) {
    return loadingPromises.get(fontName);
  }

  const loadPromise = (async () => {
    try {
      const url = getSurahNameFontUrl("woff2");

      const fontFace = new FontFace(fontName, `url(${url})`, {
        display: "swap",
      });

      await fontFace.load();
      document.fonts.add(fontFace);
      loadedFonts.add(fontName);
    } catch (error) {
      console.error("Failed to load SurahNames font:", error);
    }
  })();

  loadingPromises.set(fontName, loadPromise);

  try {
    await loadPromise;
  } finally {
    loadingPromises.delete(fontName);
  }
}

/**
 * Load all required fonts for a page
 */
export async function loadPageFonts(
  pageNumber: number,
  version: QPCVersion = "v2"
): Promise<void> {
  await Promise.all([
    loadQPCFont(pageNumber, version),
    loadUthmanicHafsFont(),
    loadSurahNameFont(),
  ]);
}

/**
 * Prefetch fonts for adjacent pages
 */
export async function prefetchAdjacentFonts(
  currentPage: number,
  totalPages: number = 604,
  version: QPCVersion = "v2"
): Promise<void> {
  const pagesToPrefetch: number[] = [];

  if (currentPage > 1) {
    pagesToPrefetch.push(currentPage - 1);
  }
  if (currentPage < totalPages) {
    pagesToPrefetch.push(currentPage + 1);
  }

  await Promise.all(
    pagesToPrefetch.map((page) => prefetchQPCFont(page, version))
  );
}

// ===== Utility Functions =====

/**
 * Check if a font is loaded
 */
export function isFontLoaded(
  pageNumber: number,
  version: QPCVersion = "v2"
): boolean {
  return loadedFonts.has(getQPCFontName(pageNumber, version));
}

/**
 * Get CSS font-family value for a page
 */
export function getPageFontFamily(
  pageNumber: number,
  version: QPCVersion = "v2"
): string {
  return `'${getQPCFontName(pageNumber, version)}', 'UthmanicHafs', serif`;
}

/**
 * Get CSS for Tajweed color palette (V4 fonts)
 */
export function getTajweedPaletteCSS(
  theme: "light" | "dark" | "sepia" = "light"
): string {
  const paletteIndex = theme === "dark" ? 1 : theme === "sepia" ? 2 : 0;

  return `
    @font-palette-values --tajweed-${theme} {
      font-family: inherit;
      base-palette: ${paletteIndex};
    }
  `;
}

/**
 * Generate @font-face CSS for a page (for SSR or static generation)
 */
export function generateFontFaceCSS(
  pageNumber: number,
  version: QPCVersion = "v2"
): string {
  const fontName = getQPCFontName(pageNumber, version);
  const woff2Url = getQPCFontUrl(pageNumber, version, "woff2");
  const woffUrl = getQPCFontUrl(pageNumber, version, "woff");

  return `
    @font-face {
      font-family: '${fontName}';
      src: url('${woff2Url}') format('woff2'),
           url('${woffUrl}') format('woff');
      font-display: block;
    }
  `;
}
