"use client";

import { memo, useEffect, useMemo, useState } from "react";
import {
  MUSHAF_EDITIONS,
  type MushafEditionId,
  type MushafPage as MushafPageType,
  type MushafWord as MushafWordType,
} from "@/types/quran";

import {
  getPageFontFamily,
  loadPageFonts,
  prefetchAdjacentFonts,
  type QPCVersion,
} from "@/lib/fonts/qpc-fonts";
import { toArabicNumber } from "@/lib/quran/mushaf-layout";
import { cn } from "@/lib/utils";

import { MushafLine } from "./MushafLine";

export interface MushafPageProps {
  page: MushafPageType;
  edition?: MushafEditionId;
  showTajweed?: boolean;
  showPageNumber?: boolean;
  showJuzInfo?: boolean;
  highlightedWords?: Set<string>;
  currentWordKey?: string;
  mistakeWordKeys?: Set<string>;
  hiddenWordKeys?: Set<string>;
  onWordClick?: (word: MushafWordType) => void;
  onWordHover?: (word: MushafWordType | null) => void;
  className?: string;
}

/**
 * Renders a complete Mushaf page with all lines
 */
export const MushafPage = memo(function MushafPage({
  page,
  edition = "madinah_1421",
  showTajweed = false,
  showPageNumber = true,
  showJuzInfo = true,
  highlightedWords,
  currentWordKey,
  mistakeWordKeys,
  hiddenWordKeys,
  onWordClick,
  onWordHover,
  className,
}: MushafPageProps) {
  const editionConfig = MUSHAF_EDITIONS[edition];
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Determine QPC version based on edition
  const qpcVersion: QPCVersion = useMemo(() => {
    switch (edition) {
      case "madinah_1405":
        return "v1";
      case "madinah_1441":
        return showTajweed ? "v4-colrv1" : "v2";
      default:
        return "v2";
    }
  }, [edition, showTajweed]);

  // Get page-specific font family (must be before useEffect that uses it)
  const pageFontFamily = useMemo(() => {
    return getPageFontFamily(page.pageNumber, qpcVersion);
  }, [page.pageNumber, qpcVersion]);

  // Load QPC fonts for this page
  useEffect(() => {
    let mounted = true;

    async function loadFonts() {
      try {
        console.log(
          `[QPC] Loading fonts for page ${page.pageNumber}, edition: ${edition}, version: ${qpcVersion}`
        );
        console.log(`[QPC] Font family will be: ${pageFontFamily}`);
        await loadPageFonts(page.pageNumber, qpcVersion);
        console.log(
          `[QPC] Fonts loaded successfully for page ${page.pageNumber}`
        );
        if (mounted) {
          setFontsLoaded(true);
        }
        // Prefetch adjacent pages in background
        prefetchAdjacentFonts(
          page.pageNumber,
          editionConfig?.totalPages || 604,
          qpcVersion
        );
      } catch (error) {
        console.error("[QPC] Failed to load fonts:", error);
        if (mounted) {
          setFontsLoaded(true); // Continue with fallback fonts
        }
      }
    }

    // Debug: Log first word data to check glyph codes
    if (page.lines.length > 0) {
      const firstTextLine = page.lines.find(
        (l) => l.lineType === "ayah" && l.words.length > 0
      );
      if (firstTextLine && firstTextLine.words[0]) {
        const firstWord = firstTextLine.words[0];
        console.log("[QPC] First word data:", {
          text: firstWord.text,
          qpcV1: firstWord.qpcV1,
          qpcV2: firstWord.qpcV2,
          hasGlyphCodes: Boolean(firstWord.qpcV1 || firstWord.qpcV2),
          usingGlyph: qpcVersion === "v1" ? firstWord.qpcV1 : firstWord.qpcV2,
        });
      }
    }

    loadFonts();
    return () => {
      mounted = false;
    };
  }, [
    page.pageNumber,
    qpcVersion,
    editionConfig?.totalPages,
    page.lines,
    edition,
    pageFontFamily,
  ]);

  // Calculate optimal font size based on lines per page
  const fontSize = useMemo(() => {
    const baseFontSize = 28; // Slightly larger for QPC fonts
    const linesPerPage = editionConfig?.linesPerPage || 15;

    // Adjust font size based on lines per page
    if (linesPerPage <= 13) return baseFontSize * 1.15;
    if (linesPerPage >= 16) return baseFontSize * 0.9;
    return baseFontSize;
  }, [editionConfig?.linesPerPage]);

  // Get font class based on script type (only used as fallback before QPC fonts load)
  // Once QPC fonts are loaded, the inline fontFamily style takes precedence
  const fontClass = useMemo(() => {
    // Don't apply font class when using QPC fonts - the inline style handles it
    if (qpcVersion.startsWith("v")) {
      return undefined;
    }
    const scriptType = editionConfig?.scriptType || "uthmani";
    return scriptType === "indopak" ? "font-indopak" : "font-uthmani";
  }, [editionConfig?.scriptType, qpcVersion]);

  return (
    <div
      className={cn(
        "mushaf-page",
        "relative",
        "bg-background",
        "border border-border rounded-lg",
        "shadow-sm",
        "overflow-hidden",
        fontClass,
        !fontsLoaded && "opacity-0",
        fontsLoaded && "opacity-100 transition-opacity duration-200",
        className
      )}
      dir="rtl"
      lang="ar"
      style={{
        fontFamily: pageFontFamily,
      }}
    >
      {/* Page header with Juz/Hizb info */}
      {showJuzInfo && (
        <PageHeader
          pageNumber={page.pageNumber}
          juz={page.juz}
          hizb={page.hizb}
          surahsOnPage={page.surahsOnPage}
        />
      )}

      {/* Page content */}
      <div className="px-4 py-2 space-y-1">
        {page.lines.map((line, index) => (
          <MushafLine
            key={`${page.pageNumber}-${line.lineNumber}-${index}`}
            line={line}
            pageNumber={page.pageNumber}
            qpcVersion={qpcVersion}
            showTajweed={showTajweed}
            highlightedWords={highlightedWords}
            currentWordKey={currentWordKey}
            mistakeWordKeys={mistakeWordKeys}
            hiddenWordKeys={hiddenWordKeys}
            onWordClick={onWordClick}
            onWordHover={onWordHover}
            fontSize={fontSize}
          />
        ))}
      </div>

      {/* Page footer with page number */}
      {showPageNumber && (
        <PageFooter pageNumber={page.pageNumber} edition={edition} />
      )}
    </div>
  );
});

/**
 * Page header showing Juz and Surah information
 */
interface PageHeaderProps {
  pageNumber: number;
  juz: number;
  hizb: number;
  surahsOnPage: number[];
}

function PageHeader({ juz, hizb }: PageHeaderProps) {
  const hizbQuarter = ((hizb - 1) % 4) + 1;
  const quarterSymbols = ["۞", "۩", "۝", "۞"];

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="juz-marker bg-primary/10 text-primary px-2 py-0.5 rounded">
          الجزء {toArabicNumber(juz)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-primary/60">
          {quarterSymbols[hizbQuarter - 1]}
        </span>
        <span>الحزب {toArabicNumber(hizb)}</span>
      </div>
    </div>
  );
}

/**
 * Page footer showing page number
 */
interface PageFooterProps {
  pageNumber: number;
  edition: MushafEditionId;
}

function PageFooter({ pageNumber }: PageFooterProps) {
  return (
    <div className="flex items-center justify-center py-2 border-t border-border/50">
      <span className="page-number text-sm text-muted-foreground font-amiri">
        {toArabicNumber(pageNumber)}
      </span>
    </div>
  );
}

/**
 * Loading skeleton for MushafPage
 */
export function MushafPageSkeleton({
  linesPerPage = 15,
}: {
  linesPerPage?: number;
}) {
  return (
    <div className="mushaf-page bg-background border border-border rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-4 w-12 bg-muted rounded" />
      </div>

      {/* Lines skeleton - use deterministic widths to avoid hydration mismatch */}
      <div className="px-4 py-2 space-y-3">
        {Array.from({ length: linesPerPage }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-muted/50 rounded"
            style={{
              // Use deterministic width based on index to avoid hydration issues
              width: `${85 + ((i * 7) % 15)}%`,
              marginRight: i % 3 === 0 ? "auto" : 0,
            }}
          />
        ))}
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-center py-2 border-t border-border/50">
        <div className="h-4 w-8 bg-muted rounded" />
      </div>
    </div>
  );
}

export default MushafPage;
