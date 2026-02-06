"use client";

import { memo } from "react";
import type { Surah } from "@/types/quran";

import { SURAH_NAMES, toArabicNumber } from "@/lib/quran/mushaf-layout";
import { cn } from "@/lib/utils";

export interface SurahHeaderProps {
  surah: Surah | { number: number; name?: string; englishName?: string };
  variant?: "full" | "compact" | "minimal";
  showEnglishName?: boolean;
  showAyahCount?: boolean;
  showRevelationType?: boolean;
  className?: string;
}

/**
 * Decorative Surah header with Islamic ornaments
 */
export const SurahHeader = memo(function SurahHeader({
  surah,
  variant = "full",
  showEnglishName = true,
  showAyahCount = true,
  showRevelationType = true,
  className,
}: SurahHeaderProps) {
  const arabicName =
    SURAH_NAMES[surah.number] || surah.name || `سورة ${surah.number}`;
  const englishName = "englishName" in surah ? surah.englishName : undefined;
  const ayahCount = "numberOfAyahs" in surah ? surah.numberOfAyahs : undefined;
  const revelationType =
    "revelationType" in surah ? surah.revelationType : undefined;

  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "surah-header-minimal",
          "text-center py-2",
          "font-uthmani text-primary",
          className
        )}
      >
        <span className="text-xl">{arabicName}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "surah-header-compact",
          "flex items-center justify-between",
          "px-4 py-3",
          "bg-primary/5 border-y border-primary/20",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <SurahNumber number={surah.number} />
          <div>
            <h2 className="font-uthmani text-lg text-primary">{arabicName}</h2>
            {showEnglishName && englishName && (
              <p className="text-sm text-muted-foreground">{englishName}</p>
            )}
          </div>
        </div>
        {showAyahCount && ayahCount && (
          <span className="text-sm text-muted-foreground">
            {ayahCount} آيات
          </span>
        )}
      </div>
    );
  }

  // Full variant with decorative elements
  return (
    <div
      className={cn(
        "surah-header-full",
        "relative",
        "py-6 px-4",
        "bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5",
        "border-y-2 border-primary/30",
        className
      )}
    >
      {/* Decorative frame */}
      <div className="absolute inset-0 pointer-events-none">
        <DecorativeFrame />
      </div>

      <div className="relative z-10 text-center">
        {/* Surah number badge */}
        <div className="flex justify-center mb-3">
          <SurahNumber number={surah.number} size="lg" />
        </div>

        {/* Arabic name */}
        <h2 className="font-uthmani text-2xl md:text-3xl text-primary mb-2">
          {arabicName}
        </h2>

        {/* English name */}
        {showEnglishName && englishName && (
          <p className="text-lg text-foreground/80 mb-1">{englishName}</p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-3">
          {showRevelationType && revelationType && (
            <span className="flex items-center gap-1">
              <RevelationIcon type={revelationType} />
              {revelationType === "Meccan" ? "مكية" : "مدنية"}
            </span>
          )}
          {showAyahCount && ayahCount && (
            <span>{toArabicNumber(ayahCount)} آية</span>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Surah number in decorative badge
 */
interface SurahNumberProps {
  number: number;
  size?: "sm" | "md" | "lg";
}

function SurahNumber({ number, size = "md" }: SurahNumberProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "rounded-full",
        "bg-primary text-primary-foreground",
        "font-amiri font-bold",
        sizeClasses[size]
      )}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-110" />
      <span>{toArabicNumber(number)}</span>
    </div>
  );
}

/**
 * Revelation type icon
 */
function RevelationIcon({ type }: { type: "Meccan" | "Medinan" }) {
  if (type === "Meccan") {
    // Kaaba icon for Meccan surahs
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  // Mosque dome icon for Medinan surahs
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2C8 6 4 10 4 14v6h16v-6c0-4-4-8-8-12z" />
      <path d="M12 2v4" />
    </svg>
  );
}

/**
 * Decorative Islamic frame
 */
function DecorativeFrame() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 400 120"
      fill="none"
      preserveAspectRatio="none"
    >
      {/* Corner ornaments */}
      <g className="text-primary/20" fill="currentColor">
        {/* Top left */}
        <path d="M10 10 Q20 5 30 10 Q25 20 30 30 Q20 25 10 30 Q15 20 10 10" />
        {/* Top right */}
        <path d="M390 10 Q380 5 370 10 Q375 20 370 30 Q380 25 390 30 Q385 20 390 10" />
        {/* Bottom left */}
        <path d="M10 110 Q20 115 30 110 Q25 100 30 90 Q20 95 10 90 Q15 100 10 110" />
        {/* Bottom right */}
        <path d="M390 110 Q380 115 370 110 Q375 100 370 90 Q380 95 390 90 Q385 100 390 110" />
      </g>

      {/* Border lines */}
      <rect
        x="20"
        y="20"
        width="360"
        height="80"
        rx="4"
        stroke="currentColor"
        strokeWidth="1"
        className="text-primary/10"
        fill="none"
      />
    </svg>
  );
}

export default SurahHeader;
