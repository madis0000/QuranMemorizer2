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
  hintWordKeys?: Map<string, string>;
  currentAyahWordKeys?: Set<string>;
  mistakeDetailsMap?: Map<string, { recitedWord?: string }>;
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
  hintWordKeys,
  currentAyahWordKeys,
  mistakeDetailsMap,
  onWordClick,
  onWordHover,
  className,
}: MushafPageProps) {
  const editionConfig = MUSHAF_EDITIONS[edition];
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const isSpecialPage = page.pageNumber === 1 || page.pageNumber === 2;

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

  const aspectRatio = editionConfig?.aspectRatio || 1.618;

  if (isSpecialPage) {
    return (
      <div
        className={cn(
          "mushaf-page special-page",
          "relative",
          "flex flex-col",
          "bg-[#FFFEFB] dark:bg-[#263E34]",
          "border border-transparent dark:border-[#2A4038] rounded-lg",
          "dark:shadow-[0_1px_6px_rgba(0,0,0,0.3)]",
          "text-foreground",
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
          aspectRatio: `1 / ${aspectRatio}`,
          width: `min(100%, calc((100vh - 12rem) / ${aspectRatio}))`,
        }}
      >
        {/* Corner ornaments */}
        <CornerOrnament position="top-right" />
        <CornerOrnament position="top-left" />
        <CornerOrnament position="bottom-right" />
        <CornerOrnament position="bottom-left" />

        {/* Special page content with extra padding */}
        <div className="flex-1 flex flex-col px-[8%] py-[6%] gap-3 relative z-[2]">
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
              hintWordKeys={hintWordKeys}
              currentAyahWordKeys={currentAyahWordKeys}
              mistakeDetailsMap={mistakeDetailsMap}
              onWordClick={onWordClick}
              onWordHover={onWordHover}
            />
          ))}
        </div>

        {/* Centered page number inside frame */}
        {showPageNumber && (
          <div className="flex items-center justify-center py-3 relative z-[2]">
            <span className="page-number text-sm text-muted-foreground font-amiri">
              {toArabicNumber(page.pageNumber)}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mushaf-page",
        "relative",
        "flex flex-col",
        "bg-[#FFFEFB] dark:bg-[#263E34]",
        "border border-[#E5DDD0]/50 dark:border-[#2A4038] rounded-lg",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.3)]",
        "text-foreground",
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
        aspectRatio: `1 / ${aspectRatio}`,
        width: `min(100%, calc((100vh - 12rem) / ${aspectRatio}))`,
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

      {/* Page content - lines distributed evenly to fill page height */}
      <div className="flex-1 flex flex-col px-[5%] py-[2%]">
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
            currentAyahWordKeys={currentAyahWordKeys}
            mistakeDetailsMap={mistakeDetailsMap}
            onWordClick={onWordClick}
            onWordHover={onWordHover}
            className="flex-1"
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
 * Islamic geometric corner ornament for special pages 1-2
 * Rub el Hizb inspired design, rotated per corner position
 */
function CornerOrnament({
  position,
}: {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) {
  const positionClasses: Record<typeof position, string> = {
    "top-right": "top-[8px] right-[8px]",
    "top-left": "top-[8px] left-[8px]",
    "bottom-right": "bottom-[8px] right-[8px]",
    "bottom-left": "bottom-[8px] left-[8px]",
  };

  const rotations: Record<typeof position, number> = {
    "top-right": 0,
    "top-left": 90,
    "bottom-right": 270,
    "bottom-left": 180,
  };

  return (
    <div
      className={cn(
        "absolute z-[3] pointer-events-none corner-ornament",
        positionClasses[position]
      )}
    >
      <svg
        viewBox="0 0 60 60"
        fill="none"
        className="w-[50px] h-[50px] text-primary/50"
        style={{ transform: `rotate(${rotations[position]}deg)` }}
      >
        {/* Concentric arcs from corner */}
        <path
          d="M2 2 Q2 30, 30 30"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M2 2 Q2 20, 20 20"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M2 2 Q2 42, 42 42"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="none"
          opacity="0.6"
        />
        {/* Small medallion at corner */}
        <circle cx="5" cy="5" r="3" fill="currentColor" opacity="0.25" />
        <circle cx="5" cy="5" r="1.5" fill="currentColor" opacity="0.4" />
        {/* Leaf/floral along edges */}
        <path
          d="M2 14 Q6 12, 8 8 Q10 12, 14 14"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="currentColor"
          fillOpacity="0.08"
        />
        <path
          d="M14 2 Q12 6, 8 8 Q12 10, 14 14"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="currentColor"
          fillOpacity="0.08"
        />
      </svg>
    </div>
  );
}

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
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5DDD0]/30 dark:border-[#2A4038] text-xs text-muted-foreground">
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
    <div className="flex items-center justify-center py-2 border-t border-[#E5DDD0]/30 dark:border-[#2A4038]">
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
  aspectRatio = 1.618,
}: {
  linesPerPage?: number;
  aspectRatio?: number;
}) {
  return (
    <div
      className="mushaf-page bg-[#FFFEFB] dark:bg-[#263E34] border border-[#E5DDD0]/50 dark:border-[#2A4038] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.3)] overflow-hidden animate-pulse"
      style={{
        aspectRatio: `1 / ${aspectRatio}`,
        width: `min(100%, calc((100vh - 12rem) / ${aspectRatio}))`,
      }}
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5DDD0]/30 dark:border-[#2A4038]">
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
      <div className="flex items-center justify-center py-2 border-t border-[#E5DDD0]/30 dark:border-[#2A4038]">
        <div className="h-4 w-8 bg-muted rounded" />
      </div>
    </div>
  );
}

export default MushafPage;
