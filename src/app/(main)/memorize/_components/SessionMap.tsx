"use client";

import { useEffect, useRef } from "react";
import { SURAH_NAMES } from "@/data/hizb-data";
import { Bookmark } from "lucide-react";

import type { AyahAttempt, VerseRef } from "@/stores/sessionStore";

interface SessionMapProps {
  /** Current surah:ayah being practiced */
  currentSurah: number;
  currentAyah: number;
  /** Session range */
  startAyah: number;
  endAyah: number;
  /** Cross-surah verse list (juz/hizb/subject modes) */
  verseList: VerseRef[];
  currentVerseIndex: number;
  /** Per-ayah tracking data */
  ayahHistory: Record<string, AyahAttempt>;
  /** Bookmarked ayahs */
  bookmarkedAyahs: VerseRef[];
  /** Navigate to a specific verse */
  onNavigate: (surah: number, ayah: number) => void;
}

function getNodeColor(attempt: AyahAttempt | undefined, isCurrent: boolean) {
  if (isCurrent)
    return "bg-emerald-500 dark:bg-emerald-400 ring-2 ring-emerald-300 dark:ring-emerald-600 animate-pulse";
  if (!attempt) return "bg-muted-foreground/20 hover:bg-muted-foreground/30";
  if (attempt.bestAccuracy >= 95) return "bg-emerald-500 dark:bg-emerald-400";
  if (attempt.bestAccuracy >= 70) return "bg-amber-400 dark:bg-amber-500";
  return "bg-red-400 dark:bg-red-500";
}

export function SessionMap({
  currentSurah,
  currentAyah,
  startAyah,
  endAyah,
  verseList,
  currentVerseIndex,
  ayahHistory,
  bookmarkedAyahs,
  onNavigate,
}: SessionMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to current node
  useEffect(() => {
    if (currentNodeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const node = currentNodeRef.current;
      const containerCenter = container.clientWidth / 2;
      const nodeCenter = node.offsetLeft + node.clientWidth / 2;
      container.scrollTo({
        left: nodeCenter - containerCenter,
        behavior: "smooth",
      });
    }
  }, [currentAyah, currentVerseIndex]);

  const isCrossSurah = verseList.length > 0;

  // Build node list
  const nodes: Array<{
    surah: number;
    ayah: number;
    key: string;
    isCurrent: boolean;
    isBookmarked: boolean;
    showSurahLabel?: string;
  }> = [];

  if (isCrossSurah) {
    let lastSurah = -1;
    verseList.forEach((v, idx) => {
      const isCurrent = idx === currentVerseIndex;
      const isBookmarked = bookmarkedAyahs.some(
        (b) => b.surahNumber === v.surahNumber && b.ayahNumber === v.ayahNumber
      );
      const showSurahLabel =
        v.surahNumber !== lastSurah
          ? (SURAH_NAMES[v.surahNumber] ?? `${v.surahNumber}`)
          : undefined;
      lastSurah = v.surahNumber;

      nodes.push({
        surah: v.surahNumber,
        ayah: v.ayahNumber,
        key: `${v.surahNumber}:${v.ayahNumber}`,
        isCurrent,
        isBookmarked,
        showSurahLabel,
      });
    });
  } else {
    for (let a = startAyah; a <= endAyah; a++) {
      const isCurrent = a === currentAyah;
      const isBookmarked = bookmarkedAyahs.some(
        (b) => b.surahNumber === currentSurah && b.ayahNumber === a
      );
      nodes.push({
        surah: currentSurah,
        ayah: a,
        key: `${currentSurah}:${a}`,
        isCurrent,
        isBookmarked,
      });
    }
  }

  // Cap display for very large ranges (juz = ~560 ayahs) — show window around current
  const MAX_NODES = 100;
  let displayNodes = nodes;
  let truncatedBefore = 0;
  let truncatedAfter = 0;
  if (nodes.length > MAX_NODES) {
    const currentIdx = nodes.findIndex((n) => n.isCurrent);
    const half = Math.floor(MAX_NODES / 2);
    const start = Math.max(0, currentIdx - half);
    const end = Math.min(nodes.length, start + MAX_NODES);
    displayNodes = nodes.slice(start, end);
    truncatedBefore = start;
    truncatedAfter = nodes.length - end;
  }

  return (
    <div className="shrink-0 border-b border-[#D1E0D8]/40 dark:border-[#1E3228] bg-[#F8FAF9]/80 dark:bg-[#121E18]/80 backdrop-blur-sm">
      <div
        ref={scrollRef}
        className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {truncatedBefore > 0 && (
          <span className="text-[10px] text-muted-foreground shrink-0 px-1">
            +{truncatedBefore}
          </span>
        )}

        {displayNodes.map((node) => {
          const attempt = ayahHistory[node.key];
          const colorClass = getNodeColor(attempt, node.isCurrent);

          return (
            <div key={node.key} className="flex items-center gap-1 shrink-0">
              {node.showSurahLabel && (
                <span className="text-[9px] text-muted-foreground font-medium mr-0.5 whitespace-nowrap">
                  {node.showSurahLabel}
                </span>
              )}
              <button
                ref={node.isCurrent ? currentNodeRef : undefined}
                onClick={() => onNavigate(node.surah, node.ayah)}
                className={`relative w-6 h-6 rounded-full text-[9px] font-medium transition-all duration-200 ${colorClass} ${
                  node.isCurrent
                    ? "text-white dark:text-white scale-110"
                    : attempt
                      ? "text-white/90"
                      : "text-muted-foreground"
                }`}
                title={`${node.surah}:${node.ayah}${attempt ? ` — ${attempt.bestAccuracy}%` : ""}`}
              >
                {node.ayah}
                {node.isBookmarked && (
                  <Bookmark className="absolute -top-1 -right-1 h-2.5 w-2.5 text-blue-500 fill-blue-500" />
                )}
              </button>
            </div>
          );
        })}

        {truncatedAfter > 0 && (
          <span className="text-[10px] text-muted-foreground shrink-0 px-1">
            +{truncatedAfter}
          </span>
        )}
      </div>
    </div>
  );
}
