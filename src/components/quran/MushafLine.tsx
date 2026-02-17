"use client";

import { memo } from "react";
import type {
  MushafLine as MushafLineType,
  MushafWord as MushafWordType,
} from "@/types/quran";

import type { QPCVersion } from "@/lib/fonts/qpc-fonts";
import { cn } from "@/lib/utils";
import type {
  WeaknessLevel,
  WordFeedbackData,
} from "@/hooks/use-word-feedback";

import { MushafWord } from "./MushafWord";

export interface MushafLineProps {
  line: MushafLineType;
  pageNumber?: number;
  qpcVersion?: QPCVersion;
  showTajweed?: boolean;
  highlightedWords?: Set<string>;
  currentWordKey?: string;
  mistakeWordKeys?: Set<string>;
  hiddenWordKeys?: Set<string>;
  hintWordKeys?: Map<string, string>;
  currentAyahWordKeys?: Set<string>;
  mistakeDetailsMap?: Map<string, { recitedWord?: string }>;
  weaknessLevels?: Map<string, WeaknessLevel>;
  wordHistories?: Map<string, WordFeedbackData>;
  onWordClick?: (word: MushafWordType) => void;
  onWordHover?: (word: MushafWordType | null) => void;
  fontSize?: number;
  className?: string;
}

/**
 * Renders a single line in the Mushaf with proper Arabic justification
 */
export const MushafLine = memo(function MushafLine({
  line,
  pageNumber,
  qpcVersion = "v2",
  showTajweed = false,
  highlightedWords,
  currentWordKey,
  mistakeWordKeys,
  hiddenWordKeys,
  hintWordKeys,
  currentAyahWordKeys,
  mistakeDetailsMap,
  weaknessLevels,
  wordHistories,
  onWordClick,
  onWordHover,
  fontSize,
  className,
}: MushafLineProps) {
  // Render based on line type
  switch (line.lineType) {
    case "surah_name":
      return (
        <SurahNameLine line={line} fontSize={fontSize} className={className} />
      );

    case "basmallah":
      return (
        <BasmallahLine
          line={line}
          qpcVersion={qpcVersion}
          fontSize={fontSize}
          className={className}
        />
      );

    case "empty":
      return <div className={cn("mushaf-line", className)} />;

    case "ayah":
    default:
      return (
        <AyahLine
          line={line}
          pageNumber={pageNumber}
          qpcVersion={qpcVersion}
          showTajweed={showTajweed}
          highlightedWords={highlightedWords}
          currentWordKey={currentWordKey}
          mistakeWordKeys={mistakeWordKeys}
          hiddenWordKeys={hiddenWordKeys}
          hintWordKeys={hintWordKeys}
          currentAyahWordKeys={currentAyahWordKeys}
          mistakeDetailsMap={mistakeDetailsMap}
          weaknessLevels={weaknessLevels}
          wordHistories={wordHistories}
          onWordClick={onWordClick}
          onWordHover={onWordHover}
          fontSize={fontSize}
          className={className}
        />
      );
  }
});

/**
 * Surah name header line (centered)
 * Uses Surah Names Font V4 with ligature codes (e.g., "surah001")
 */
interface SurahNameLineProps {
  line: MushafLineType;
  fontSize?: number;
  className?: string;
}

function SurahNameLine({ line, fontSize, className }: SurahNameLineProps) {
  // Get the actual Arabic surah name from the data
  const surahName = line.words[0]?.text || "";
  const surahNumber = line.surahNumber || 1;

  return (
    <div
      className={cn(
        "mushaf-line surah-header",
        "flex items-center justify-center",
        className
      )}
    >
      {/* Decorative surah header with ornamental frame */}
      <div className="surah-header-frame relative flex items-center justify-center px-8 py-2 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20">
        {/* Left ornament */}
        <SurahHeaderOrnament side="left" />

        {/* Surah name in Arabic */}
        <span
          className="surah-header-name text-foreground px-6"
          style={{
            fontFamily:
              "'UthmanicHafs', 'KFGQPC Hafs Uthmanic Script', 'Amiri Quran', serif",
            fontWeight: 600,
          }}
        >
          {surahName || `سورة ${surahNumber}`}
        </span>

        {/* Right ornament */}
        <SurahHeaderOrnament side="right" />
      </div>
    </div>
  );
}

/**
 * Decorative ornament for surah headers
 */
function SurahHeaderOrnament({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "surah-ornament flex-shrink-0",
        side === "left" ? "mr-2" : "ml-2"
      )}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="w-10 h-10 text-primary/60"
        style={{ transform: side === "left" ? "scaleX(-1)" : undefined }}
      >
        <path
          d="M35 20c0-8.284-6.716-15-15-15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M30 20c0-5.523-4.477-10-10-10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}

/**
 * Basmallah line (centered)
 */
interface BasmallahLineProps {
  line: MushafLineType;
  qpcVersion?: QPCVersion;
  fontSize?: number;
  className?: string;
}

function BasmallahLine({ line, fontSize, className }: BasmallahLineProps) {
  const word = line.words[0];
  // Always use plain Arabic text for basmallah — QPC glyph codes for basmallah
  // use page-specific font mappings that don't render correctly across all pages.
  const text = word?.text || "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

  return (
    <div
      className={cn(
        "mushaf-line basmallah",
        "flex items-center justify-center",
        className
      )}
    >
      <span className="text-foreground font-amiri text-lg">{text}</span>
    </div>
  );
}

/**
 * Regular ayah line with justified Arabic text
 */
interface AyahLineProps {
  line: MushafLineType;
  pageNumber?: number;
  qpcVersion?: QPCVersion;
  showTajweed?: boolean;
  highlightedWords?: Set<string>;
  currentWordKey?: string;
  mistakeWordKeys?: Set<string>;
  hiddenWordKeys?: Set<string>;
  hintWordKeys?: Map<string, string>;
  currentAyahWordKeys?: Set<string>;
  mistakeDetailsMap?: Map<string, { recitedWord?: string }>;
  weaknessLevels?: Map<string, WeaknessLevel>;
  wordHistories?: Map<string, WordFeedbackData>;
  onWordClick?: (word: MushafWordType) => void;
  onWordHover?: (word: MushafWordType | null) => void;
  fontSize?: number;
  className?: string;
}

function AyahLine({
  line,
  pageNumber,
  qpcVersion = "v2",
  showTajweed,
  highlightedWords,
  currentWordKey,
  mistakeWordKeys,
  hiddenWordKeys,
  hintWordKeys,
  currentAyahWordKeys,
  mistakeDetailsMap,
  weaknessLevels,
  wordHistories,
  onWordClick,
  onWordHover,
  fontSize,
  className,
}: AyahLineProps) {
  return (
    <div
      className={cn(
        "mushaf-line",
        "flex items-center",
        line.isCentered ? "justify-center" : "justify-between",
        className
      )}
      dir="rtl"
    >
      {line.words.map((word) => (
        <MushafWord
          key={word.wordKey}
          word={word}
          pageNumber={pageNumber}
          qpcVersion={qpcVersion}
          showTajweed={showTajweed}
          isHighlighted={highlightedWords?.has(word.wordKey)}
          isCurrent={currentWordKey === word.wordKey}
          isMistake={mistakeWordKeys?.has(word.wordKey)}
          isHidden={hiddenWordKeys?.has(word.wordKey)}
          isCurrentAyah={currentAyahWordKeys?.has(word.wordKey)}
          hintText={
            hiddenWordKeys?.has(word.wordKey)
              ? hintWordKeys?.get(word.wordKey)
              : undefined
          }
          mistakeDetail={mistakeDetailsMap?.get(word.wordKey)}
          weaknessLevel={weaknessLevels?.get(word.wordKey)}
          wordHistory={wordHistories?.get(word.wordKey)}
          onClick={onWordClick}
          onHover={onWordHover}
        />
      ))}
    </div>
  );
}

export default MushafLine;
