"use client";

import { Play } from "lucide-react";

import { cn } from "@/lib/utils";
import type { HideMode } from "@/stores/sessionStore";
import { Button } from "@/components/ui/button";

interface ProgressiveHideModesProps {
  words: string[];
  hideMode: HideMode;
  hideDifficulty: number;
  revealedIndices: number[];
  isHidden: boolean;
  onWordClick: (index: number) => void;
  wordResults?: {
    status: "correct" | "wrong" | "skipped" | "tashkeel" | "pending";
  }[];
  translation?: string;
  previousVerse?: string;
  nextVerse?: string;
  onPlayAudio?: () => void;
  verseKey?: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  correct:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  wrong: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  skipped:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  tashkeel:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  pending: "",
};

// Arabic particles to hide in keyword_mode
const ARABIC_PARTICLES = new Set([
  "من",
  "في",
  "على",
  "إلى",
  "عن",
  "إن",
  "أن",
  "ما",
  "لا",
  "هو",
  "هي",
  "الذي",
  "التي",
  "هذا",
  "هذه",
  "ذلك",
  "تلك",
  "كل",
  "بعض",
  "غير",
  "عند",
  "بين",
  "حتى",
  "إذا",
  "إذ",
  "لم",
  "لن",
  "قد",
  "سوف",
  "ثم",
  "أو",
  "و",
  "ف",
  "ب",
  "ل",
  "ك",
]);

// Get first Arabic letter of a word (skip diacritics)
function getFirstLetter(word: string): string {
  for (const char of word) {
    if (/[\u0621-\u064A]/.test(char)) return char;
  }
  return word[0] || "";
}

// Seeded random for consistent word hiding
function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + index;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 100) / 100;
}

// Check if word should be hidden based on difficulty
function shouldHideWord(
  index: number,
  totalWords: number,
  difficulty: number,
  seed: string
): boolean {
  const hidePercentage = difficulty * 20; // 1->20%, 2->40%, etc.
  const random = seededRandom(seed, index);
  return random * 100 < hidePercentage;
}

// Check if word is an Arabic particle
function isParticle(word: string): boolean {
  // Remove diacritics for comparison
  const cleanWord = word.replace(/[\u064B-\u065F]/g, "");
  return ARABIC_PARTICLES.has(cleanWord);
}

export function ProgressiveHideModes({
  words,
  hideMode,
  hideDifficulty,
  revealedIndices,
  isHidden,
  onWordClick,
  wordResults,
  translation,
  previousVerse,
  nextVerse,
  onPlayAudio,
  verseKey = "",
  className,
}: ProgressiveHideModesProps) {
  // FULL_HIDE mode - standard blur with tap to reveal
  if (hideMode === "full_hide") {
    return (
      <div
        className={cn(
          "flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose",
          className
        )}
        dir="rtl"
      >
        {words.map((word, index) => {
          const isRevealed = !isHidden || revealedIndices.includes(index);
          const result = wordResults?.[index];
          const statusColor = result ? statusColors[result.status] : "";

          return (
            <button
              key={index}
              onClick={() => onWordClick(index)}
              className={cn(
                "rounded-lg px-2 py-1 transition-all duration-200",
                isRevealed
                  ? cn("cursor-default", statusColor || "hover:bg-accent")
                  : "cursor-pointer bg-muted/80 hover:bg-muted",
                !isRevealed && "select-none"
              )}
              aria-label={
                isRevealed
                  ? `Word: ${word}`
                  : `Hidden word ${index + 1}, tap to reveal`
              }
            >
              <span
                className={cn(
                  "inline-block transition-all duration-300",
                  !isRevealed && "blur-md opacity-30 select-none"
                )}
                aria-hidden={!isRevealed}
              >
                {word}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // FIRST_LETTER mode - show only first Arabic letter
  if (hideMode === "first_letter") {
    return (
      <div
        className={cn(
          "flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose",
          className
        )}
        dir="rtl"
      >
        {words.map((word, index) => {
          const isRevealed = !isHidden || revealedIndices.includes(index);
          const result = wordResults?.[index];
          const statusColor = result ? statusColors[result.status] : "";
          const firstLetter = getFirstLetter(word);

          return (
            <button
              key={index}
              onClick={() => onWordClick(index)}
              className={cn(
                "rounded-lg px-2 py-1 transition-all duration-200",
                isRevealed
                  ? cn("cursor-default", statusColor || "hover:bg-accent")
                  : "cursor-pointer bg-muted/80 hover:bg-muted"
              )}
              aria-label={
                isRevealed
                  ? `Word: ${word}`
                  : `First letter hint: ${firstLetter}`
              }
            >
              {isRevealed ? (
                <span>{word}</span>
              ) : (
                <span className="flex items-center gap-0.5">
                  <span className="font-bold">{firstLetter}</span>
                  <span className="text-muted-foreground">...</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // RANDOM_BLANK mode - progressive hiding based on difficulty
  if (hideMode === "random_blank") {
    return (
      <div
        className={cn(
          "flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose",
          className
        )}
        dir="rtl"
      >
        {words.map((word, index) => {
          const shouldHide =
            isHidden &&
            shouldHideWord(index, words.length, hideDifficulty, verseKey);
          const isRevealed = !shouldHide || revealedIndices.includes(index);
          const result = wordResults?.[index];
          const statusColor = result ? statusColors[result.status] : "";

          return (
            <button
              key={index}
              onClick={() => onWordClick(index)}
              className={cn(
                "rounded-lg px-2 py-1 transition-all duration-200",
                isRevealed
                  ? cn("cursor-default", statusColor || "hover:bg-accent")
                  : "cursor-pointer bg-muted/80 hover:bg-muted",
                !isRevealed && "select-none"
              )}
              aria-label={
                isRevealed
                  ? `Word: ${word}`
                  : `Hidden word ${index + 1}, tap to reveal`
              }
            >
              <span
                className={cn(
                  "inline-block transition-all duration-300",
                  !isRevealed && "blur-md opacity-30 select-none"
                )}
                aria-hidden={!isRevealed}
              >
                {word}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // KEYWORD_MODE - hide particles, show content words
  if (hideMode === "keyword_mode") {
    return (
      <div
        className={cn(
          "flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose",
          className
        )}
        dir="rtl"
      >
        {words.map((word, index) => {
          const isParticleWord = isParticle(word);
          const shouldHide = isHidden && isParticleWord;
          const isRevealed = !shouldHide || revealedIndices.includes(index);
          const result = wordResults?.[index];
          const statusColor = result ? statusColors[result.status] : "";

          return (
            <button
              key={index}
              onClick={() => onWordClick(index)}
              className={cn(
                "rounded-lg px-2 py-1 transition-all duration-200",
                isRevealed
                  ? cn("cursor-default", statusColor || "hover:bg-accent")
                  : "cursor-pointer bg-muted/80 hover:bg-muted",
                !isRevealed && "select-none"
              )}
              aria-label={
                isRevealed
                  ? `Word: ${word}`
                  : `Hidden particle ${index + 1}, tap to reveal`
              }
            >
              <span
                className={cn(
                  "inline-block transition-all duration-300",
                  !isRevealed && "blur-md opacity-30 select-none"
                )}
                aria-hidden={!isRevealed}
              >
                {word}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // TRANSLATION_RECALL mode - show translation, hide Arabic
  if (hideMode === "translation_recall") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Translation Display */}
        <div className="rounded-lg bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Translation
          </p>
          <p className="text-lg italic text-foreground">
            {translation || "Translation not available"}
          </p>
        </div>

        {/* Hidden/Revealed Arabic Text */}
        {!isHidden && (
          <div
            className="flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose"
            dir="rtl"
          >
            {words.map((word, index) => {
              const result = wordResults?.[index];
              const statusColor = result ? statusColors[result.status] : "";

              return (
                <span
                  key={index}
                  className={cn("rounded-lg px-2 py-1", statusColor)}
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}

        {isHidden && (
          <p className="text-center text-sm text-muted-foreground">
            Recite the Arabic verse from memory, then click &quot;Peek&quot; to
            check
          </p>
        )}
      </div>
    );
  }

  // AUDIO_RECALL mode - play audio, no text visible
  if (hideMode === "audio_recall") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Audio Player Button */}
        {isHidden && onPlayAudio && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Button onClick={onPlayAudio} size="lg" variant="outline">
              <Play className="mr-2 h-5 w-5" />
              Play Audio
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Listen to the recitation and recite from memory
            </p>
          </div>
        )}

        {/* Revealed Arabic Text */}
        {!isHidden && (
          <div
            className="flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose"
            dir="rtl"
          >
            {words.map((word, index) => {
              const result = wordResults?.[index];
              const statusColor = result ? statusColors[result.status] : "";

              return (
                <span
                  key={index}
                  className={cn("rounded-lg px-2 py-1", statusColor)}
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // CONTEXT_RECALL mode - show surrounding verses, hide current
  if (hideMode === "context_recall") {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Previous Verse */}
        {previousVerse && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Previous Verse
            </p>
            <p
              className="font-arabic text-xl leading-loose text-muted-foreground"
              dir="rtl"
            >
              {previousVerse}
            </p>
          </div>
        )}

        {/* Current Verse (Hidden or Revealed) */}
        <div className="rounded-lg border-2 border-primary/20 p-6">
          <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
            Current Verse (Recite this)
          </p>
          {isHidden ? (
            <div className="py-8">
              <p className="text-center text-muted-foreground italic">
                [Hidden - recite from context]
              </p>
            </div>
          ) : (
            <div
              className="flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose"
              dir="rtl"
            >
              {words.map((word, index) => {
                const result = wordResults?.[index];
                const statusColor = result ? statusColors[result.status] : "";

                return (
                  <span
                    key={index}
                    className={cn("rounded-lg px-2 py-1", statusColor)}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Next Verse */}
        {nextVerse && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Next Verse
            </p>
            <p
              className="font-arabic text-xl leading-loose text-muted-foreground"
              dir="rtl"
            >
              {nextVerse}
            </p>
          </div>
        )}
      </div>
    );
  }

  // REVERSE_RECALL mode - show last word, recite complete verse
  if (hideMode === "reverse_recall") {
    const lastWord = words[words.length - 1];

    return (
      <div className={cn("space-y-6", className)}>
        {/* Last Word Hint */}
        <div className="rounded-lg bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            The verse ends with:
          </p>
          <p className="font-arabic text-3xl" dir="rtl">
            {lastWord}
          </p>
        </div>

        {/* Hidden/Revealed Full Verse */}
        {isHidden ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Recite the complete verse that ends with this word
          </p>
        ) : (
          <div
            className="flex flex-wrap justify-center gap-2 font-arabic text-2xl leading-loose"
            dir="rtl"
          >
            {words.map((word, index) => {
              const result = wordResults?.[index];
              const statusColor = result ? statusColors[result.status] : "";

              return (
                <span
                  key={index}
                  className={cn("rounded-lg px-2 py-1", statusColor)}
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Fallback to full_hide if mode not recognized
  return null;
}
