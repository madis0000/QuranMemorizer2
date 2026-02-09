"use client";

import { useCallback, useState } from "react";
import { useQuranStore } from "@/stores";
import {
  MUSHAF_EDITIONS,
  type MushafEditionId,
  type MushafWord as MushafWordType,
} from "@/types/quran";
import { BookOpen, Languages, List, Palette, Settings2, X } from "lucide-react";

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

  // Get last reading position
  const { data: lastPosition } = useReadingProgress();

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#D1E0D8] bg-white/80 backdrop-blur-sm dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]/90">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile surah list toggle */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Surahs</SheetTitle>
                </SheetHeader>
                <SurahList
                  surahs={surahs || []}
                  isLoading={surahsLoading}
                  onSelect={(surahNumber, startPage) => {
                    setCurrentPage(startPage);
                    setSidebarOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">Quran Reader</span>
            </h1>

            {/* Page indicator */}
            <PageIndicator
              currentPage={currentPage}
              totalPages={editionConfig?.totalPages || 604}
              className="hidden md:flex"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Edition selector */}
            <div className="hidden md:block">
              <MushafEditionSelector
                value={mushafEdition}
                onChange={handleEditionChange}
              />
            </div>

            {/* Settings dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-5 w-5" />
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
                <DropdownMenuLabel className="text-xs md:hidden">
                  Mushaf Edition
                </DropdownMenuLabel>
                <div className="px-2 py-1.5 md:hidden">
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

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Mushaf Viewer */}
        <main className="flex-1 container max-w-4xl mx-auto py-6 px-4 xl:mr-64">
          <MushafViewer
            initialPage={lastPosition?.pageNumber || currentPage}
            edition={mushafEdition}
            showTajweed={showTajweed}
            showPageNumber={true}
            showJuzInfo={true}
            onWordClick={handleWordClick}
            onWordHover={handleWordHover}
            onPageChange={handlePageChange}
          />

          {/* Word info popup */}
          {selectedWord && !selectedWord.isAyahEnd && (
            <WordInfoPanel
              word={selectedWord}
              onClose={() => setSelectedWord(null)}
            />
          )}
        </main>

        {/* Desktop Surah Sidebar */}
        <aside className="fixed right-0 top-14 bottom-0 w-64 border-l border-[#D1E0D8] bg-white/80 backdrop-blur-sm dark:border-[#00E5A0]/10 dark:bg-[#0F1A14]/90 hidden xl:block overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <List className="h-4 w-4" />
              Surahs
            </h2>
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
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-[#059669]/5 dark:bg-[#00E5A0]/5 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
      {surahs.map((surah) => (
        <button
          key={surah.number}
          onClick={() => onSelect(surah.number, surah.startPage || 1)}
          className={cn(
            "w-full flex items-center justify-between",
            "px-3 py-2 rounded-lg text-sm",
            "hover:bg-accent transition-colors"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#059669]/10 text-[#059669] dark:bg-[#00E5A0]/10 dark:text-[#00E5A0] flex items-center justify-center text-xs font-medium">
              {surah.number}
            </span>
            <div className="text-left">
              <p className="font-medium">
                {surah.englishName || `Surah ${surah.number}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {surah.numberOfAyahs || 0} Ayahs
              </p>
            </div>
          </div>
          <span className="font-uthmani text-base text-right" dir="rtl">
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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
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
