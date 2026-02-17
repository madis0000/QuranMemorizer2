"use client";

import { memo, useMemo, type MouseEvent } from "react";
import {
  TAJWEED_COLORS,
  type MushafWord as MushafWordType,
  type TajweedRule,
} from "@/types/quran";

import type { QPCVersion } from "@/lib/fonts/qpc-fonts";
import { cn } from "@/lib/utils";
import type {
  WeaknessLevel,
  WordFeedbackData,
} from "@/hooks/use-word-feedback";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface MushafWordProps {
  word: MushafWordType;
  pageNumber?: number;
  qpcVersion?: QPCVersion;
  showTajweed?: boolean;
  isHighlighted?: boolean;
  isCurrent?: boolean;
  isMistake?: boolean;
  isHidden?: boolean;
  isCurrentAyah?: boolean;
  hintText?: string; // e.g. "ب..." for first_letter mode
  mistakeDetail?: { recitedWord?: string };
  weaknessLevel?: WeaknessLevel;
  wordHistory?: WordFeedbackData;
  onClick?: (word: MushafWordType) => void;
  onHover?: (word: MushafWordType | null) => void;
  fontSize?: number;
  className?: string;
}

/**
 * Renders a single word in the Mushaf with optional Tajweed coloring
 * Uses QPC glyph codes for accurate font rendering when available
 */
export const MushafWord = memo(function MushafWord({
  word,
  pageNumber,
  qpcVersion = "v2",
  showTajweed = false,
  isHighlighted = false,
  isCurrent = false,
  isMistake = false,
  isHidden = false,
  isCurrentAyah = false,
  hintText,
  mistakeDetail,
  weaknessLevel,
  wordHistory,
  onClick,
  onHover,
  fontSize,
  className,
}: MushafWordProps) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick?.(word);
  };

  const handleMouseEnter = () => {
    onHover?.(word);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  // Get the appropriate glyph code based on QPC version
  // IMPORTANT: Must match the font version being loaded
  const glyphCode = useMemo(() => {
    // v1 fonts use qpcV1 glyph codes
    if (qpcVersion === "v1") {
      return word.qpcV1 || null;
    }
    // v2, v4 fonts use qpcV2 glyph codes
    if (qpcVersion.startsWith("v2") || qpcVersion.startsWith("v4")) {
      return word.qpcV2 || null;
    }
    // Default to v2 glyph codes
    return word.qpcV2 || word.qpcV1 || null;
  }, [word.qpcV1, word.qpcV2, qpcVersion]);

  // Use glyph code for QPC rendering, fallback to text
  const displayText = word.text;

  // Use glyph code if available, otherwise fall back to text
  const renderText = glyphCode || displayText;

  // Render ayah end marker differently
  // Note: QPC ayah-end glyphs contain TWO characters: word-glyph + number-glyph.
  // When hidden, show a blank placeholder for the word part + the visible number.
  // IMPORTANT: QPC glyph codes MUST use dangerouslySetInnerHTML per Quran Foundation docs
  if (word.isAyahEnd) {
    const parts = renderText.split(" ");
    const numberGlyph = parts.length > 1 ? parts[parts.length - 1] : renderText;
    const wordGlyph = parts.length > 1 ? parts.slice(0, -1).join(" ") : null;

    if (isHidden && wordGlyph) {
      // Render: [blank placeholder for word] + [visible ayah number]
      return (
        <span
          className={cn(
            "mushaf-word ayah-end select-none inline-flex items-center",
            className
          )}
          style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}
        >
          <span
            className={cn(
              "cursor-pointer bg-muted/50 rounded px-1 hover:bg-muted transition-colors",
              isCurrentAyah && "ring-1 ring-primary/30 bg-primary/5"
            )}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label={
              hintText ? `Hint: ${hintText}` : "Hidden word - tap to reveal"
            }
          >
            {hintText ? (
              <span className="text-muted-foreground text-[0.6em] font-arabic">
                {hintText}
              </span>
            ) : (
              <span
                className="invisible"
                dangerouslySetInnerHTML={{ __html: wordGlyph }}
              />
            )}
          </span>
          <span
            aria-label={`Ayah ${word.ayahNumber}`}
            dangerouslySetInnerHTML={{ __html: numberGlyph }}
            suppressHydrationWarning
          />
        </span>
      );
    }
    // Non-hidden ayah-end: show word+number with optional mistake/highlight/current styling
    if (wordGlyph && (isMistake || isHighlighted || isCurrent)) {
      return (
        <span
          className={cn(
            "mushaf-word ayah-end select-none inline-flex items-center",
            className
          )}
          style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}
        >
          <span
            className={cn(
              "rounded px-0.5 transition-colors duration-150",
              isHighlighted && "bg-primary/20",
              isCurrent && "bg-primary/30",
              isMistake && "bg-destructive/20 text-destructive"
            )}
            dangerouslySetInnerHTML={{ __html: wordGlyph }}
            suppressHydrationWarning
          />
          <span
            aria-label={`Ayah ${word.ayahNumber}`}
            dangerouslySetInnerHTML={{ __html: numberGlyph }}
            suppressHydrationWarning
          />
        </span>
      );
    }
    return (
      <span
        className={cn("mushaf-word ayah-end select-none", className)}
        style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}
        aria-label={`Ayah ${word.ayahNumber}`}
        dangerouslySetInnerHTML={{ __html: renderText }}
        suppressHydrationWarning
      />
    );
  }

  // Hidden mode for memorization
  if (isHidden) {
    return (
      <span
        className={cn(
          "mushaf-word cursor-pointer",
          "bg-muted/50 rounded px-1",
          "hover:bg-muted transition-colors",
          isCurrentAyah && "ring-1 ring-primary/30 bg-primary/5",
          className
        )}
        style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={
          hintText ? `Hint: ${hintText}` : "Hidden word - tap to reveal"
        }
      >
        {hintText ? (
          <span className="text-muted-foreground text-[0.6em] font-arabic">
            {hintText}
          </span>
        ) : (
          <span className="invisible">{displayText}</span>
        )}
      </span>
    );
  }

  // Weakness underline classes
  const weaknessClass =
    weaknessLevel === "weak"
      ? "border-b-2 border-amber-400/70"
      : weaknessLevel === "moderate"
        ? "border-b border-amber-300/40"
        : undefined;

  // Helper: wrap a span with history tooltip (if available) or mistake tooltip
  const wrapWithTooltip = (span: React.ReactElement) => {
    // Mistake tooltip takes priority
    if (isMistake && mistakeDetail?.recitedWord) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{span}</TooltipTrigger>
          <TooltipContent
            className="bg-popover text-popover-foreground border shadow-md"
            sideOffset={4}
          >
            <div className="text-xs space-y-0.5 font-sans" dir="rtl">
              <div className="text-red-500">
                You said: {mistakeDetail.recitedWord}
              </div>
              <div className="text-emerald-500">Correct: {word.text}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    // History tooltip for previously-attempted words
    if (wordHistory && wordHistory.totalAttempts > 0) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{span}</TooltipTrigger>
          <TooltipContent
            className="bg-popover text-popover-foreground border shadow-md px-3 py-2"
            sideOffset={4}
          >
            <WordHistoryTooltip history={wordHistory} />
          </TooltipContent>
        </Tooltip>
      );
    }
    return span;
  };

  // IMPORTANT: QPC glyph codes MUST use dangerouslySetInnerHTML per Quran Foundation docs
  // Regular text can use normal React children
  if (glyphCode) {
    const glyphSpan = (
      <span
        className={cn(
          "mushaf-word",
          "cursor-pointer select-none",
          "transition-colors duration-150",
          "rounded px-0.5",
          isHighlighted && "bg-primary/20",
          isCurrent && "bg-primary/30 text-primary",
          isMistake && "bg-destructive/20 text-destructive",
          !isHighlighted && !isCurrent && !isMistake && "hover:bg-primary/10",
          weaknessClass,
          className
        )}
        style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        data-word-key={word.wordKey}
        data-surah={word.surahNumber}
        data-ayah={word.ayahNumber}
        data-position={word.wordPosition}
        data-current={isCurrent || undefined}
        dangerouslySetInnerHTML={{ __html: glyphCode }}
        suppressHydrationWarning
      />
    );
    return wrapWithTooltip(glyphSpan);
  }

  // Fallback to regular text rendering (no glyph code available)
  const fallbackSpan = (
    <span
      className={cn(
        "mushaf-word",
        "cursor-pointer select-none",
        "transition-colors duration-150",
        "rounded px-0.5",
        isHighlighted && "bg-primary/20",
        isCurrent && "bg-primary/30 text-primary",
        isMistake && "bg-destructive/20 text-destructive",
        !isHighlighted && !isCurrent && !isMistake && "hover:bg-primary/10",
        weaknessClass,
        className
      )}
      style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      data-word-key={word.wordKey}
      data-surah={word.surahNumber}
      data-ayah={word.ayahNumber}
      data-position={word.wordPosition}
      data-current={isCurrent || undefined}
    >
      {showTajweed && word.tajweedRules && word.tajweedRules.length > 0 ? (
        <TajweedText text={displayText} rules={word.tajweedRules} />
      ) : (
        displayText
      )}
    </span>
  );
  return wrapWithTooltip(fallbackSpan);
});

/**
 * Renders text with Tajweed color coding
 */
interface TajweedTextProps {
  text: string;
  rules: TajweedRule[];
}

function TajweedText({ text, rules }: TajweedTextProps) {
  if (rules.length === 0) {
    return <>{text}</>;
  }

  // Sort rules by start position
  const sortedRules = [...rules].sort((a, b) => a.startChar - b.startChar);

  const segments: Array<{ text: string; color?: string }> = [];
  let currentIndex = 0;

  for (const rule of sortedRules) {
    // Add text before this rule
    if (rule.startChar > currentIndex) {
      segments.push({
        text: text.slice(currentIndex, rule.startChar),
      });
    }

    // Add the rule segment
    segments.push({
      text: text.slice(rule.startChar, rule.endChar + 1),
      color: TAJWEED_COLORS[rule.type] || rule.color,
    });

    currentIndex = rule.endChar + 1;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    segments.push({
      text: text.slice(currentIndex),
    });
  }

  return (
    <>
      {segments.map((segment, index) =>
        segment.color ? (
          <span key={index} style={{ color: segment.color }}>
            {segment.text}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}

/**
 * Tooltip showing word-level history: attempts, success rate, dot indicators
 */
function WordHistoryTooltip({ history }: { history: WordFeedbackData }) {
  const rate = Math.round(history.successRate * 100);
  const lastMistakeAgo = history.lastMistake
    ? formatTimeAgo(new Date(history.lastMistake))
    : null;

  // Show last 5 attempts as dots (approximate from counts)
  const recentCount = Math.min(history.totalAttempts, 5);
  const recentCorrect = Math.min(history.correctCount, recentCount);
  const dots: boolean[] = [];
  // Fill with mistakes first, then corrects (approximation)
  const mistakes = recentCount - recentCorrect;
  for (let i = 0; i < mistakes; i++) dots.push(false);
  for (let i = 0; i < recentCorrect; i++) dots.push(true);

  return (
    <div className="text-xs space-y-1 font-sans min-w-[140px]" dir="ltr">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">
          {history.totalAttempts} attempt
          {history.totalAttempts !== 1 ? "s" : ""}
        </span>
        <span
          className={cn(
            "font-medium",
            rate >= 85
              ? "text-emerald-500"
              : rate >= 60
                ? "text-amber-500"
                : "text-red-500"
          )}
        >
          {rate}% rate
        </span>
      </div>
      {recentCount > 0 && (
        <div className="flex items-center gap-1">
          {dots.map((correct, i) => (
            <span
              key={i}
              className={cn(
                "inline-block w-2 h-2 rounded-full",
                correct ? "bg-emerald-400" : "bg-red-400"
              )}
            />
          ))}
          <span className="text-muted-foreground ml-1">last {recentCount}</span>
        </div>
      )}
      {lastMistakeAgo && (
        <div className="text-muted-foreground">
          Last mistake: {lastMistakeAgo}
        </div>
      )}
    </div>
  );
}

/** Format a Date as relative time ago (e.g. "2d ago", "3h ago") */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default MushafWord;
