"use client";

import { useState } from "react";
import { SURAH_NAMES as SURAH_NAMES_EN } from "@/data/hizb-data";
import { List } from "lucide-react";

import type { FlowerStage, Season } from "@/lib/gamification/surah-trees";
import { SURAH_NAMES as SURAH_NAMES_AR } from "@/lib/quran/mushaf-layout";
import { cn } from "@/lib/utils";
import { useSurahs } from "@/hooks/use-quran";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { CalligraphyTree } from "./CalligraphyTree";

// ---------- Surah ayah counts for tree sizing ----------
const SURAH_AYAH_COUNTS: Record<number, number> = {
  1: 7,
  2: 286,
  3: 200,
  4: 176,
  5: 120,
  6: 165,
  7: 206,
  8: 75,
  9: 129,
  10: 109,
  11: 123,
  12: 111,
  13: 43,
  14: 52,
  15: 99,
  16: 128,
  17: 111,
  18: 110,
  19: 98,
  20: 135,
  21: 112,
  22: 78,
  23: 118,
  24: 64,
  25: 77,
  26: 227,
  27: 93,
  28: 88,
  29: 69,
  30: 60,
  31: 34,
  32: 30,
  33: 73,
  34: 54,
  35: 45,
  36: 83,
  37: 182,
  38: 88,
  39: 75,
  40: 85,
  41: 54,
  42: 53,
  43: 89,
  44: 59,
  45: 37,
  46: 35,
  47: 38,
  48: 29,
  49: 18,
  50: 45,
  51: 60,
  52: 49,
  53: 62,
  54: 55,
  55: 78,
  56: 96,
  57: 29,
  58: 22,
  59: 24,
  60: 13,
  61: 14,
  62: 11,
  63: 11,
  64: 18,
  65: 12,
  66: 12,
  67: 30,
  68: 52,
  69: 52,
  70: 44,
  71: 28,
  72: 28,
  73: 20,
  74: 56,
  75: 40,
  76: 31,
  77: 50,
  78: 40,
  79: 46,
  80: 42,
  81: 29,
  82: 19,
  83: 36,
  84: 25,
  85: 22,
  86: 17,
  87: 19,
  88: 26,
  89: 30,
  90: 20,
  91: 15,
  92: 21,
  93: 11,
  94: 8,
  95: 8,
  96: 19,
  97: 5,
  98: 8,
  99: 8,
  100: 11,
  101: 11,
  102: 8,
  103: 3,
  104: 9,
  105: 5,
  106: 4,
  107: 7,
  108: 3,
  109: 6,
  110: 3,
  111: 5,
  112: 4,
  113: 5,
  114: 6,
};

interface MushafSidebarProps {
  surahNumber: number;
  onSurahSelect: (surahNumber: number) => void;
  sessionAccuracy: number;
  masteryPercent: number;
  season: Season;
  flowerStage: FlowerStage;
  totalAyahs: number;
  bloomingAyahs?: number[];
}

// ---------- Surah browser list ----------

function SurahBrowser({
  currentSurah,
  onSelect,
}: {
  currentSurah: number;
  onSelect: (surahNumber: number) => void;
}) {
  const { data: surahs, isLoading } = useSurahs();

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

  // If API surahs not available, fall back to static data
  const surahList = surahs?.length
    ? surahs
    : Array.from({ length: 114 }, (_, i) => ({
        number: i + 1,
        englishName: SURAH_NAMES_EN[i + 1] ?? `Surah ${i + 1}`,
        numberOfAyahs: SURAH_AYAH_COUNTS[i + 1] ?? 0,
      }));

  return (
    <div className="px-2 pb-2">
      {surahList.map((surah) => {
        const num = surah.number;
        const isActive = num === currentSurah;
        return (
          <button
            key={num}
            onClick={() => onSelect(num)}
            className={cn(
              "w-full flex items-center justify-between",
              "px-2.5 py-2 rounded-md text-sm",
              "border-b border-[#D1E0D8]/20 dark:border-[#1E3228] last:border-b-0",
              "hover:bg-[#059669]/5 dark:hover:bg-[#00E5A0]/5 transition-colors",
              isActive &&
                "bg-[#059669]/10 dark:bg-[#00E5A0]/10 border-[#059669]/30 dark:border-[#00E5A0]/20"
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-medium shrink-0",
                  isActive
                    ? "bg-[#059669] dark:bg-[#00E5A0] text-white dark:text-[#0A1210]"
                    : "bg-[#059669]/8 text-[#059669] dark:bg-[#00E5A0]/8 dark:text-[#00E5A0]"
                )}
              >
                {num}
              </span>
              <div className="text-left">
                <p className="text-[13px] font-medium leading-tight">
                  {surah.englishName || SURAH_NAMES_EN[num] || `Surah ${num}`}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {surah.numberOfAyahs || SURAH_AYAH_COUNTS[num] || 0} Ayahs
                </p>
              </div>
            </div>
            <span
              className="font-uthmani text-sm text-foreground/60 text-right"
              dir="rtl"
            >
              {SURAH_NAMES_AR[num] || ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Sidebar content (shared between desktop & mobile) ----------

function SidebarContent({
  surahNumber,
  onSurahSelect,
  sessionAccuracy,
  masteryPercent,
  season,
  flowerStage,
  totalAyahs,
  bloomingAyahs,
}: MushafSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Tree visualization */}
      <div className="shrink-0 px-3 pt-3 pb-2">
        <div className="rounded-xl border border-[#D1E0D8]/40 dark:border-[#00E5A0]/10 bg-white/60 dark:bg-[#0F1A14]/60 p-2 backdrop-blur-sm">
          <CalligraphyTree
            surahNumber={surahNumber}
            totalAyahs={totalAyahs}
            masteryPercent={masteryPercent}
            sessionAccuracy={sessionAccuracy}
            bloomingAyahs={bloomingAyahs}
            season={season}
            flowerStage={flowerStage}
            compact
          />
          <div className="text-center mt-1">
            <p className="text-xs font-medium text-foreground">
              {SURAH_NAMES_EN[surahNumber] || `Surah ${surahNumber}`}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {flowerStage} &middot; {season}
            </p>
          </div>
          {/* Mastery bar */}
          <div className="mt-2 px-1">
            <div className="h-1.5 bg-[#D1E0D8] dark:bg-[#00E5A0]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#059669] dark:bg-[#00E5A0] rounded-full transition-all duration-700"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-0.5">
              {masteryPercent}% mastery
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="shrink-0 px-4 py-1">
        <div className="border-t border-[#D1E0D8]/40 dark:border-[#1E3228]" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
          Surahs
        </h3>
      </div>

      {/* Surah browser (scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <SurahBrowser currentSurah={surahNumber} onSelect={onSurahSelect} />
      </div>
    </div>
  );
}

// ---------- Mobile trigger button (exported for toolbar) ----------

export function MushafSidebarTrigger({
  children,
}: {
  children?: React.ReactNode;
}) {
  return children as React.ReactElement;
}

// ---------- Desktop sidebar ----------

export function MushafSidebar(props: MushafSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 border-l border-[#D1E0D8]/40 bg-[#F8FAF9] dark:border-[#1E3228] dark:bg-[#121E18]">
      <SidebarContent {...props} />
    </aside>
  );
}

// ---------- Mobile sidebar (Sheet) ----------

export function MushafSidebarMobile(props: MushafSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
          <List className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="px-4 py-3 border-b border-[#D1E0D8]/40 dark:border-[#1E3228]">
          <SheetTitle className="text-sm">Shajarat al-Hikmah</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100dvh-4rem)]">
          <SidebarContent
            {...props}
            onSurahSelect={(num) => {
              props.onSurahSelect(num);
              setOpen(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
