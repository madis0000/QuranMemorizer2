"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuranStore } from "@/stores";
import {
  MUSHAF_EDITIONS,
  type MushafEditionId,
  type MushafWord as MushafWordType,
} from "@/types/quran";
import { Languages, List, Palette, Settings2, X } from "lucide-react";

import { SURAH_NAMES } from "@/lib/quran/mushaf-layout";
import { cn } from "@/lib/utils";
import { useReadingProgress, useSurahs } from "@/hooks/use-quran";
import {
  MushafEditionSelector,
  MushafViewer,
  PageIndicator,
} from "@/components/quran";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function QuranPage() {
  const {
    currentPage,
    showTajweed,
    showTranslation,
    mushafEdition,
    setCurrentPage,
    toggleTajweed,
    toggleTranslation,
    setMushafEdition,
  } = useQuranStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<MushafWordType | null>(null);

  // Fetch surahs for navigation
  const { data: surahs, isLoading: surahsLoading } = useSurahs();

  // Get last reading position — only used on initial mount
  const { data: lastPosition } = useReadingProgress();

  // Restore last reading position on initial load
  useEffect(() => {
    if (lastPosition?.pageNumber && currentPage === 1) {
      setCurrentPage(lastPosition.pageNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPosition?.pageNumber]);

  // Handle word click for tooltip/info
  const handleWordClick = useCallback((word: MushafWordType) => {
    setSelectedWord(word);
  }, []);

  // Handle word hover
  const handleWordHover = useCallback((word: MushafWordType | null) => {
    // Could show quick tooltip here
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  // Handle edition change
  const handleEditionChange = useCallback(
    (edition: MushafEditionId) => {
      setMushafEdition(edition);
      // Reset to page 1 when changing edition (page layouts differ)
      setCurrentPage(1);
    },
    [setMushafEdition, setCurrentPage]
  );

  const editionConfig = MUSHAF_EDITIONS[mushafEdition];

  return (
    <div className="flex flex-col h-[calc(100dvh-8.5rem)] lg:h-[calc(100dvh-4rem)]">
      {/* Compact Toolbar */}
      <header className="shrink-0 border-b border-[#D1E0D8]/40 bg-[#F8FAF9] dark:border-[#1E3228] dark:bg-[#121E18]">
        <div className="flex h-11 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Mobile surah list toggle */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 xl:hidden"
                >
                  <List className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="px-4 py-3 border-b border-[#D1E0D8]/40 dark:border-[#1E3228]">
                  <SheetTitle className="text-sm">Surahs</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100dvh-4rem)] overflow-y-auto">
                  <SurahList
                    surahs={surahs || []}
                    isLoading={surahsLoading}
                    onSelect={(surahNumber, startPage) => {
                      setCurrentPage(startPage);
                      setSidebarOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Page indicator — always visible */}
            <PageIndicator
              currentPage={currentPage}
              totalPages={editionConfig?.totalPages || 604}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Edition selector — visible on sm+ */}
            <div className="hidden sm:block">
              <MushafEditionSelector
                value={mushafEdition}
                onChange={handleEditionChange}
              />
            </div>

            {/* Settings dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Display Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTajweed}>
                  <Palette className="mr-2 h-4 w-4" />
                  Tajweed Colors
                  <span className="ml-auto text-xs text-muted-foreground">
                    {showTajweed ? "On" : "Off"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTranslation}>
                  <Languages className="mr-2 h-4 w-4" />
                  Translation
                  <span className="ml-auto text-xs text-muted-foreground">
                    {showTranslation ? "On" : "Off"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs sm:hidden">
                  Mushaf Edition
                </DropdownMenuLabel>
                <div className="px-2 py-1.5 sm:hidden">
                  <MushafEditionSelector
                    value={mushafEdition}
                    onChange={handleEditionChange}
                    className="w-full"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content — flex with independent scrolling */}
      <div className="flex-1 flex min-h-0">
        {/* Mushaf Viewer */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#F2F0ED] dark:bg-[#0A1210]">
          <div className="max-w-3xl mx-auto py-5 px-4">
            <MushafViewer
              initialPage={currentPage}
              edition={mushafEdition}
              showTajweed={showTajweed}
              showPageNumber={true}
              showJuzInfo={true}
              onWordClick={handleWordClick}
              onWordHover={handleWordHover}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Word info popup */}
          {selectedWord && !selectedWord.isAyahEnd && (
            <WordInfoPanel
              word={selectedWord}
              onClose={() => setSelectedWord(null)}
            />
          )}
        </main>

        {/* Desktop Surah Sidebar — flex child, not fixed */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 border-l border-[#D1E0D8]/40 bg-[#F8FAF9] dark:border-[#1E3228] dark:bg-[#121E18]">
          <div className="px-4 py-3 shrink-0">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Surahs
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SurahList
              surahs={surahs || []}
              isLoading={surahsLoading}
              onSelect={(surahNumber, startPage) => {
                setCurrentPage(startPage);
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

/**
 * Surah list component
 */
interface SurahListProps {
  surahs: Array<{
    number: number;
    name?: string;
    englishName?: string;
    numberOfAyahs?: number;
    startPage?: number;
  }>;
  isLoading: boolean;
  onSelect: (surahNumber: number, startPage: number) => void;
}

function SurahList({ surahs, isLoading, onSelect }: SurahListProps) {
  if (isLoading) {
    return (
      <div className="px-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-11 bg-muted/30 rounded-md animate-pulse mb-1"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-2 pb-2">
      {surahs.map((surah) => (
        <button
          key={surah.number}
          onClick={() => onSelect(surah.number, surah.startPage || 1)}
          className={cn(
            "w-full flex items-center justify-between",
            "px-2.5 py-2 rounded-md text-sm",
            "border-b border-[#D1E0D8]/20 dark:border-[#1E3228] last:border-b-0",
            "hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5 transition-colors"
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md bg-[#059669]/8 text-[#059669] dark:bg-[#00E5A0]/8 dark:text-[#00E5A0] flex items-center justify-center text-[11px] font-medium shrink-0">
              {surah.number}
            </span>
            <div className="text-left">
              <p className="text-[13px] font-medium leading-tight">
                {surah.englishName || `Surah ${surah.number}`}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {surah.numberOfAyahs || 0} Ayahs
              </p>
            </div>
          </div>
          <span
            className="font-uthmani text-sm text-foreground/60 text-right"
            dir="rtl"
          >
            {SURAH_NAMES[surah.number] || surah.name}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * Word information panel
 */
interface WordInfoPanelProps {
  word: MushafWordType;
  onClose: () => void;
}

function WordInfoPanel({ word, onClose }: WordInfoPanelProps) {
  return (
    <div className="fixed bottom-24 lg:bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white/90 border border-[#D1E0D8] rounded-2xl shadow-[0_0_30px_rgba(0,229,160,0.06)] backdrop-blur-sm dark:bg-[#0F1A14]/90 dark:border-[#00E5A0]/10 p-4 min-w-[280px]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-uthmani text-2xl text-primary" dir="rtl">
              {word.text}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Surah {word.surahNumber}, Ayah {word.ayahNumber}, Word{" "}
              {word.wordPosition}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {word.transliteration && (
          <p className="text-sm text-muted-foreground italic">
            {word.transliteration}
          </p>
        )}

        {word.translation && (
          <p className="text-sm mt-2 pt-2 border-t border-border">
            {word.translation}
          </p>
        )}
      </div>
    </div>
  );
}
