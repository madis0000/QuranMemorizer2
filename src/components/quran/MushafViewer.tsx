"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MUSHAF_EDITIONS,
  type MushafEditionId,
  type MushafWord as MushafWordType,
} from "@/types/quran";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { getPageNavigation, toArabicNumber } from "@/lib/quran/mushaf-layout";
import { cn } from "@/lib/utils";
import { useAccuratePage, usePrefetchLayout } from "@/hooks/use-mushaf-layout";
import { useSaveReadingProgress } from "@/hooks/use-quran";
import { Button } from "@/components/ui/button";

import { MushafPage, MushafPageSkeleton } from "./MushafPage";

export interface MushafViewerProps {
  initialPage?: number;
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
  onPageChange?: (pageNumber: number) => void;
  className?: string;
}

/**
 * Main Mushaf viewer with page navigation
 */
export function MushafViewer({
  initialPage = 1,
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
  onPageChange,
  className,
}: MushafViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const editionConfig = MUSHAF_EDITIONS[edition];
  const totalPages = editionConfig?.totalPages || 604;

  // Sync internal page state when parent changes initialPage (e.g. surah sidebar click)
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Fetch accurate page layout from QUL data
  const {
    data: pageLayout,
    isLoading,
    error,
  } = useAccuratePage(currentPage, edition);
  const prefetchLayout = usePrefetchLayout();
  const saveProgress = useSaveReadingProgress();

  // Navigation
  const navigation = getPageNavigation(currentPage, edition);

  // Prefetch adjacent pages
  useEffect(() => {
    if (navigation.hasNext) {
      prefetchLayout(currentPage + 1, edition);
    }
    if (navigation.hasPrevious) {
      prefetchLayout(currentPage - 1, edition);
    }
  }, [
    currentPage,
    edition,
    navigation.hasNext,
    navigation.hasPrevious,
    prefetchLayout,
  ]);

  // Save reading progress
  useEffect(() => {
    if (pageLayout && pageLayout.surahsOnPage.length > 0) {
      // Get first surah on page for progress tracking
      const firstSurah = pageLayout.surahsOnPage[0];
      // Get first ayah number from first text line
      const firstTextLine = pageLayout.lines.find(
        (line) => line.lineType === "ayah" && line.words.length > 0
      );
      const firstAyahNumber = firstTextLine?.words[0]?.ayahNumber || 1;

      saveProgress.mutate({
        surahNumber: firstSurah,
        ayahNumber: firstAyahNumber,
        pageNumber: currentPage,
      });
    }
  }, [currentPage, pageLayout, saveProgress]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(totalPages, page));
      setCurrentPage(validPage);
      onPageChange?.(validPage);
    },
    [totalPages, onPageChange]
  );

  const goToPreviousPage = useCallback(() => {
    if (navigation.hasPrevious && navigation.previousPage) {
      goToPage(navigation.previousPage);
    }
  }, [navigation, goToPage]);

  const goToNextPage = useCallback(() => {
    if (navigation.hasNext && navigation.nextPage) {
      goToPage(navigation.nextPage);
    }
  }, [navigation, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case "ArrowLeft":
          // In RTL, left arrow goes to next page
          goToNextPage();
          break;
        case "ArrowRight":
          // In RTL, right arrow goes to previous page
          goToPreviousPage();
          break;
        case "Home":
          goToFirstPage();
          break;
        case "End":
          goToLastPage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPreviousPage, goToFirstPage, goToLastPage]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        <p>Error loading page. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={cn("mushaf-viewer flex flex-col gap-4", className)}>
      {/* Page content */}
      <div className="relative flex justify-center">
        {isLoading ? (
          <MushafPageSkeleton
            linesPerPage={editionConfig?.linesPerPage}
            aspectRatio={editionConfig?.aspectRatio}
          />
        ) : pageLayout ? (
          <MushafPage
            page={pageLayout}
            edition={edition}
            showTajweed={showTajweed}
            showPageNumber={showPageNumber}
            showJuzInfo={showJuzInfo}
            highlightedWords={highlightedWords}
            currentWordKey={currentWordKey}
            mistakeWordKeys={mistakeWordKeys}
            hiddenWordKeys={hiddenWordKeys}
            onWordClick={onWordClick}
            onWordHover={onWordHover}
          />
        ) : null}
      </div>

      {/* Navigation controls */}
      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onGoToPage={goToPage}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        onFirst={goToFirstPage}
        onLast={goToLastPage}
        hasPrevious={navigation.hasPrevious}
        hasNext={navigation.hasNext}
      />
    </div>
  );
}

/**
 * Page navigation controls
 */
interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onGoToPage: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

function PageNavigation({
  currentPage,
  totalPages,
  onGoToPage,
  onPrevious,
  onNext,
  onFirst,
  onLast,
  hasPrevious,
  hasNext,
}: PageNavigationProps) {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputValue, 10);
    if (!isNaN(page)) {
      onGoToPage(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2" dir="ltr">
      {/* First page (in LTR: left side) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onFirst}
        disabled={!hasPrevious}
        aria-label="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous page */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={cn(
            "w-16 text-center",
            "border border-input rounded-md",
            "bg-background px-2 py-1",
            "text-sm font-medium",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          aria-label="Page number"
        />
        <span className="text-sm text-muted-foreground">/ {totalPages}</span>
      </form>

      {/* Next page */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last page */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onLast}
        disabled={!hasNext}
        aria-label="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Compact page indicator for mobile
 */
export function PageIndicator({
  currentPage,
  totalPages,
  juz,
  className,
}: {
  currentPage: number;
  totalPages: number;
  juz?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3",
        "text-sm text-muted-foreground",
        className
      )}
    >
      {juz && (
        <span className="text-primary font-medium">
          الجزء {toArabicNumber(juz)}
        </span>
      )}
      <span>
        صفحة {toArabicNumber(currentPage)} من {toArabicNumber(totalPages)}
      </span>
    </div>
  );
}

export default MushafViewer;
