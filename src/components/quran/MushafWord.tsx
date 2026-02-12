"use client";

import { memo, useMemo, type MouseEvent } from "react";
import {
  TAJWEED_COLORS,
  type MushafWord as MushafWordType,
  type TajweedRule,
} from "@/types/quran";

import type { QPCVersion } from "@/lib/fonts/qpc-fonts";
import { cn } from "@/lib/utils";
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
    if (isMistake && mistakeDetail?.recitedWord) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{glyphSpan}</TooltipTrigger>
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
    return glyphSpan;
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
  if (isMistake && mistakeDetail?.recitedWord) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{fallbackSpan}</TooltipTrigger>
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
  return fallbackSpan;
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

export default MushafWord;
