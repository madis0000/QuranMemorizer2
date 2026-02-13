"use client";

import { useEffect, useState } from "react";
import { SURAH_NAMES } from "@/data/hizb-data";
import { SUBJECT_THEMES } from "@/data/subject-themes";

import type { MemorizeMode } from "@/stores/quranStore";

interface SessionProgressBarProps {
  mode: MemorizeMode;
  surahNumber: number;
  currentAyah: number;
  startAyah: number;
  endAyah: number;
  accuracy: number;
  startTime: number | null;
  currentPageNumber: number;
  juzNumber: number | null;
  hizbNumber: number | null;
  subjectId: string | null;
  verseListLength: number;
  currentVerseIndex: number;
}

export function SessionProgressBar({
  mode,
  surahNumber,
  currentAyah,
  startAyah,
  endAyah,
  accuracy,
  startTime,
  currentPageNumber,
  juzNumber,
  hizbNumber,
  subjectId,
  verseListLength,
  currentVerseIndex,
}: SessionProgressBarProps) {
  const [elapsed, setElapsed] = useState("0:00");

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      setElapsed(`${m}:${s.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const isCrossSurah = verseListLength > 0;
  const totalVerses = isCrossSurah ? verseListLength : endAyah - startAyah + 1;
  const currentPos = isCrossSurah
    ? currentVerseIndex + 1
    : currentAyah - startAyah + 1;
  const progress =
    totalVerses > 0 ? Math.round((currentPos / totalVerses) * 100) : 0;

  const statusText = getStatusText(mode, {
    surahNumber,
    currentAyah,
    startAyah,
    endAyah,
    currentPageNumber,
    juzNumber,
    hizbNumber,
    subjectId,
    currentPos,
    totalVerses,
    currentVerseIndex,
    verseListLength,
  });

  return (
    <div className="shrink-0 border-b border-[#D1E0D8]/20 dark:border-[#1E3228]/50 bg-[#F8FAF9]/50 dark:bg-[#121E18]/50">
      {/* Thin progress bar */}
      <div className="h-0.5 bg-[#D1E0D8]/30 dark:bg-[#1E3228]/50">
        <div
          className="h-full bg-[#059669] dark:bg-[#00E5A0] transition-all duration-300"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      {/* Status line */}
      <div className="flex items-center justify-between px-3 py-1">
        <span className="text-[10px] text-muted-foreground truncate">
          {statusText}
        </span>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0">
          <span>{accuracy}%</span>
          <span>{elapsed}</span>
        </div>
      </div>
    </div>
  );
}

function getStatusText(
  mode: MemorizeMode,
  ctx: {
    surahNumber: number;
    currentAyah: number;
    startAyah: number;
    endAyah: number;
    currentPageNumber: number;
    juzNumber: number | null;
    hizbNumber: number | null;
    subjectId: string | null;
    currentPos: number;
    totalVerses: number;
    currentVerseIndex: number;
    verseListLength: number;
  }
): string {
  const surahName = SURAH_NAMES[ctx.surahNumber] ?? `Surah ${ctx.surahNumber}`;

  switch (mode) {
    case "mushaf":
      return `Page ${ctx.currentPageNumber} | Ayah ${ctx.currentPos} of ${ctx.totalVerses}`;
    case "ayah":
      return `${surahName} | Ayah ${ctx.currentAyah} of ${ctx.startAyah}-${ctx.endAyah}`;
    case "surah":
      return `${surahName} — Ayah ${ctx.currentAyah} of ${ctx.totalVerses}`;
    case "juz":
      return `Juz ${ctx.juzNumber ?? "?"} — ${surahName} ${ctx.surahNumber}:${ctx.currentAyah} | ${ctx.currentPos} of ${ctx.totalVerses}`;
    case "hizb":
      return `Hizb ${ctx.hizbNumber ?? "?"} — ${surahName} ${ctx.surahNumber}:${ctx.currentAyah} | ${ctx.currentPos} of ${ctx.totalVerses}`;
    case "subject": {
      const theme = SUBJECT_THEMES.find((t) => t.id === ctx.subjectId);
      return `${theme?.nameEn ?? "Subject"} — ${ctx.currentPos} of ${ctx.totalVerses}`;
    }
  }
}
