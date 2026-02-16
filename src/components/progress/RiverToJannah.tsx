"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Sparkles, TreePine } from "lucide-react";

import type { SurahTree } from "@/lib/gamification/surah-trees";
import { useJannati } from "@/hooks/use-progress";

import { JuzGate } from "./JuzGate";
import { ParadiseGate } from "./ParadiseGate";
import {
  computeNodePositions,
  detectAnimationTier,
  findCurrentProgressIndex,
  JUZ_SURAH_RANGES,
  RIVER_SVG_WIDTH,
  SVG_HEIGHT,
  type AnimationTier,
} from "./river-utils";
import { RiverAnimations } from "./RiverAnimations";
import { RiverAtmosphere } from "./RiverAtmosphere";
import { RiverChannel } from "./RiverChannel";
import { RiverLandscape } from "./RiverLandscape";
import { RiverMinimap } from "./RiverMinimap";
import { RiverNode } from "./RiverNode";
import { SurahPopup } from "./SurahPopup";

// ============================================================
// Dark mode detection hook
// ============================================================

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

// ============================================================
// Main component
// ============================================================

export function RiverToJannah() {
  const { data, isLoading, error } = useJannati();
  const isDark = useIsDark();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [scrollHeight, setScrollHeight] = useState(SVG_HEIGHT);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [animTier] = useState<AnimationTier>(() => detectAnimationTier());
  const hasScrolledRef = useRef(false);

  const trees = useMemo<SurahTree[]>(() => data?.trees ?? [], [data?.trees]);
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
      riverCenterX: number;
    }> = [];

    for (let j = 2; j <= 30; j++) {
      const [startSurah] = JUZ_SURAH_RANGES[j - 1];
      const prevJuzEnd = JUZ_SURAH_RANGES[j - 2][1];

      const posEnd = positions.find((p) => p.surahNumber === prevJuzEnd);
      const posStart = positions.find((p) => p.surahNumber === startSurah);
      if (!posEnd || !posStart) continue;

      const gateY = (posEnd.y + posStart.y) / 2;
      const riverCX = (posEnd.riverCenterX + posStart.riverCenterX) / 2;

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

      gates.push({
        juzNumber: j,
        y: gateY,
        completionPct,
        riverCenterX: riverCX,
      });
    }

    return gates;
  }, [positions, treeMap]);

  // Viewport culling — convert pixel scroll to SVG coordinates
  // The SVG viewBox height (SVG_HEIGHT) differs from the rendered pixel height,
  // so we must scale pixel scrollTop into SVG coordinate space for accurate culling.
  const visibleRange = useMemo(() => {
    const scale = scrollHeight > 0 ? SVG_HEIGHT / scrollHeight : 1;
    return {
      top: scrollTop * scale - 400,
      bottom: (scrollTop + containerHeight) * scale + 400,
    };
  }, [scrollTop, containerHeight, scrollHeight]);

  // Auto-scroll to current progress on mount
  useEffect(() => {
    if (trees.length > 0 && !hasScrolledRef.current && scrollRef.current) {
      const currentPos = positions[currentIndex];
      if (currentPos) {
        // Convert SVG coordinates → pixel coordinates for scrollTo
        const scale = scrollRef.current.scrollHeight / SVG_HEIGHT;
        const scrollTarget =
          currentPos.y * scale - scrollRef.current.clientHeight / 2;
        scrollRef.current.scrollTop = Math.max(0, scrollTarget);
        hasScrolledRef.current = true;
      }
    }
  }, [trees.length, currentIndex, positions]);

  // Track scroll position & container height
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop);
      setScrollHeight(scrollRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setContainerHeight(el.clientHeight);
    setScrollHeight(el.scrollHeight);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
        if (scrollRef.current) setScrollHeight(scrollRef.current.scrollHeight);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Minimap scroll-to handler
  const handleMinimapScrollTo = useCallback((fraction: number) => {
    if (scrollRef.current) {
      // fraction is 0-1 of SVG space; convert to pixel space
      const target =
        fraction * scrollRef.current.scrollHeight -
        scrollRef.current.clientHeight / 2;
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

      {/* Scrollable river container — full width */}
      <div className="relative rounded-xl border border-border overflow-hidden bg-card">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto overflow-x-hidden"
          style={{ height: "70vh", maxHeight: 700 }}
        >
          <svg
            width="100%"
            viewBox={`0 0 ${RIVER_SVG_WIDTH} ${SVG_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            className="block"
          >
            {/* Layered landscape backgrounds */}
            <RiverLandscape positions={positions} isDark={isDark} />

            {/* River channel (water, banks, shimmer, ripples) */}
            <RiverChannel
              positions={positions}
              isDark={isDark}
              animTier={animTier}
            />

            {/* Atmospheric effects (clouds, paradise glow) */}
            {animTier >= 2 && (
              <RiverAtmosphere
                positions={positions}
                isDark={isDark}
                animTier={animTier}
              />
            )}

            {/* Water animations (particles, leaves) */}
            {animTier >= 2 && (
              <RiverAnimations
                positions={positions}
                isDark={isDark}
                animTier={animTier}
              />
            )}

            {/* Paradise Gate at top */}
            <ParadiseGate
              isUnlocked={gardenStats?.isParadise ?? false}
              isDark={isDark}
            />

            {/* Juz bridges */}
            {juzGates.map((gate) => (
              <JuzGate
                key={gate.juzNumber}
                juzNumber={gate.juzNumber}
                y={gate.y}
                completionPct={gate.completionPct}
                isDark={isDark}
                riverCenterX={gate.riverCenterX}
              />
            ))}

            {/* Surah nodes (garden islands on alternating banks) */}
            {positions.map((pos) => {
              const tree = treeMap.get(pos.surahNumber);
              if (!tree) return null;
              const inView =
                pos.y >= visibleRange.top && pos.y <= visibleRange.bottom;
              return (
                <RiverNode
                  key={pos.surahNumber}
                  tree={tree}
                  x={pos.x}
                  y={pos.y}
                  bankSide={pos.bankSide}
                  isCurrent={pos.surahNumber === currentIndex + 1}
                  isSimplified={!inView}
                  onClick={handleNodeClick}
                />
              );
            })}
          </svg>
        </div>

        {/* Minimap */}
        <RiverMinimap
          positions={positions}
          trees={trees}
          scrollTop={scrollTop}
          containerHeight={containerHeight}
          scrollHeight={scrollHeight}
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
