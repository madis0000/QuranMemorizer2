"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Sparkles, TreePine } from "lucide-react";

import type { SurahTree } from "@/lib/gamification/surah-trees";
import { useJannati } from "@/hooks/use-progress";

import { JuzGate } from "./JuzGate";
import { ParadiseGate } from "./ParadiseGate";
import {
  computeNodePositions,
  findCurrentProgressIndex,
  JUZ_SURAH_RANGES,
  NODE_SPACING_Y,
  ROAD_WIDTH,
  SVG_HEIGHT,
} from "./road-utils";
import { RoadBackground } from "./RoadBackground";
import { RoadMinimap } from "./RoadMinimap";
import { RoadNode } from "./RoadNode";
import { RoadPath } from "./RoadPath";
import { SurahPopup } from "./SurahPopup";

// Detect dark mode from document
function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export function RoadToJannah() {
  const { data, isLoading, error } = useJannati();
  const isDark = useIsDark();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const hasScrolledRef = useRef(false);

  const trees: SurahTree[] = data?.trees ?? [];
  const gardenStats = data?.gardenStats;

  // Pre-compute all 114 node positions
  const positions = useMemo(() => computeNodePositions(), []);

  // Tree lookup
  const treeMap = useMemo(
    () => new Map(trees.map((t) => [t.surahNumber, t])),
    [trees]
  );

  // Current progress node
  const currentIndex = useMemo(
    () => (trees.length > 0 ? findCurrentProgressIndex(trees) : 0),
    [trees]
  );

  // Juz gate positions & completion
  const juzGates = useMemo(() => {
    const gates: Array<{
      juzNumber: number;
      y: number;
      completionPct: number;
    }> = [];

    for (let j = 2; j <= 30; j++) {
      const [startSurah] = JUZ_SURAH_RANGES[j - 1];
      const prevJuzEnd = JUZ_SURAH_RANGES[j - 2][1];

      // Position gate between last surah of prev juz and first of this juz
      const posEnd = positions.find((p) => p.surahNumber === prevJuzEnd);
      const posStart = positions.find((p) => p.surahNumber === startSurah);
      if (!posEnd || !posStart) continue;

      const gateY = (posEnd.y + posStart.y) / 2;

      // Compute completion of the previous juz
      const [pStart, pEnd] = JUZ_SURAH_RANGES[j - 2];
      let totalAyahs = 0;
      let bloomedAyahs = 0;
      for (let s = pStart; s <= pEnd; s++) {
        const t = treeMap.get(s);
        if (t) {
          totalAyahs += t.totalAyahs;
          bloomedAyahs += t.bloomCount;
        }
      }
      const completionPct =
        totalAyahs > 0 ? Math.round((bloomedAyahs / totalAyahs) * 100) : 0;

      gates.push({ juzNumber: j, y: gateY, completionPct });
    }

    return gates;
  }, [positions, treeMap]);

  // Auto-scroll to current progress on mount
  useEffect(() => {
    if (trees.length > 0 && !hasScrolledRef.current && scrollRef.current) {
      const currentPos = positions[currentIndex];
      if (currentPos) {
        const scrollTarget = currentPos.y - scrollRef.current.clientHeight / 2;
        scrollRef.current.scrollTop = Math.max(0, scrollTarget);
        hasScrolledRef.current = true;
      }
    }
  }, [trees.length, currentIndex, positions]);

  // Track scroll position & container height
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setContainerHeight(el.clientHeight);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Minimap scroll-to handler
  const handleMinimapScrollTo = useCallback((fraction: number) => {
    if (scrollRef.current) {
      const target = fraction * SVG_HEIGHT - scrollRef.current.clientHeight / 2;
      scrollRef.current.scrollTo({
        top: Math.max(0, target),
        behavior: "smooth",
      });
    }
  }, []);

  // Node click handler
  const handleNodeClick = useCallback((surahNumber: number) => {
    setSelectedSurah(surahNumber);
  }, []);

  // Get tree for popup
  const selectedTree = selectedSurah ? treeMap.get(selectedSurah) : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-3" />
        <p className="text-sm">Loading your journey...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <TreePine className="h-8 w-8 mb-3 opacity-50" />
        <p className="text-sm">
          Could not load garden data. Start memorizing to grow your first tree!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {gardenStats && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">
              {gardenStats.bloomPercentage}% Blooming
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              {gardenStats.totalBloom}/{gardenStats.totalAyahs} ayahs
            </span>
            <span>Level {gardenStats.gardenLevel}</span>
            <span>{gardenStats.hasanat} hasanat</span>
          </div>
        </div>
      )}

      {/* Scrollable road container */}
      <div className="relative rounded-xl border border-border overflow-hidden bg-card">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto overflow-x-hidden"
          style={{ height: "70vh", maxHeight: 700 }}
        >
          <svg
            width={ROAD_WIDTH}
            height={SVG_HEIGHT}
            viewBox={`0 0 ${ROAD_WIDTH} ${SVG_HEIGHT}`}
            className="mx-auto block"
            style={{ minWidth: 360 }}
          >
            {/* Biome backgrounds */}
            <RoadBackground positions={positions} isDark={isDark} />

            {/* Winding road path */}
            <RoadPath positions={positions} isDark={isDark} />

            {/* Paradise Gate at top */}
            <ParadiseGate
              isUnlocked={gardenStats?.isParadise ?? false}
              isDark={isDark}
            />

            {/* Juz gates between zones */}
            {juzGates.map((gate) => (
              <JuzGate
                key={gate.juzNumber}
                juzNumber={gate.juzNumber}
                y={gate.y}
                completionPct={gate.completionPct}
                isDark={isDark}
              />
            ))}

            {/* Surah nodes */}
            {positions.map((pos) => {
              const tree = treeMap.get(pos.surahNumber);
              if (!tree) return null;
              return (
                <RoadNode
                  key={pos.surahNumber}
                  tree={tree}
                  x={pos.x}
                  y={pos.y}
                  isCurrent={pos.surahNumber === currentIndex + 1}
                  onClick={handleNodeClick}
                />
              );
            })}
          </svg>
        </div>

        {/* Minimap */}
        <RoadMinimap
          positions={positions}
          trees={trees}
          scrollTop={scrollTop}
          containerHeight={containerHeight}
          onScrollTo={handleMinimapScrollTo}
        />
      </div>

      {/* Surah popup dialog */}
      {selectedTree && (
        <SurahPopup
          tree={selectedTree}
          open={selectedSurah !== null}
          onClose={() => setSelectedSurah(null)}
        />
      )}
    </div>
  );
}
