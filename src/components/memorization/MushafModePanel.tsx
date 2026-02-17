"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type {
  MushafEditionId,
  MushafWord as MushafWordType,
} from "@/types/quran";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Shuffle,
  Type,
} from "lucide-react";

import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import {
  computeCorrectWordKeys,
  computeHiddenWordKeys,
  computeHintWordKeys,
  computeMistakeWordKeys,
  getAyahsOnPage,
  getAyahTextFromPage,
  getWordKeysForAyah,
  getWordTextsForAyah,
  type AyahOnPage,
} from "@/lib/memorization/mushaf-hide-bridge";
import { useAccuratePage } from "@/hooks/use-mushaf-layout";
import {
  computeWeaknessLevel,
  useWordFeedback,
  type WeaknessLevel,
  type WordFeedbackData,
} from "@/hooks/use-word-feedback";
import { useQuranStore } from "@/stores/quranStore";
import { useSessionStore, type HideMode } from "@/stores/sessionStore";
import { MushafPage, MushafPageSkeleton } from "@/components/quran/MushafPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ---------- shared hook for mushaf navigation state ----------

export function useMushafNav(
  surahNumber: number,
  startAyah: number,
  endAyah: number
) {
  const session = useSessionStore();
  const edition = useQuranStore((s) => s.mushafEdition) as MushafEditionId;
  const pageNumber = session.currentPageNumber;

  // NOTE: No init effect needed — startSession() already sets currentPageNumber
  // from config.pageNumber. An init effect here would override user page navigation.

  // Fetch accurate page layout
  const { data: pageData, isLoading } = useAccuratePage(pageNumber, edition);

  // Ayahs on page within session range
  const ayahsOnPage = useMemo<AyahOnPage[]>(() => {
    if (!pageData) return [];
    return getAyahsOnPage(pageData).filter(
      (a) =>
        a.surahNumber === surahNumber &&
        a.ayahNumber >= startAyah &&
        a.ayahNumber <= endAyah
    );
  }, [pageData, surahNumber, startAyah, endAyah]);

  // Current ayah index
  const currentKey = session.mushafCurrentAyahKey;
  const currentAyahIdx = useMemo(() => {
    if (!currentKey) return 0;
    return Math.max(
      0,
      ayahsOnPage.findIndex(
        (a) => `${a.surahNumber}:${a.ayahNumber}` === currentKey
      )
    );
  }, [ayahsOnPage, currentKey]);

  const currentAyah = ayahsOnPage[currentAyahIdx] ?? null;

  // Initialise mushaf ayah key when page loads
  useEffect(() => {
    if (ayahsOnPage.length > 0 && !currentKey) {
      const first = ayahsOnPage[0];
      session.setMushafCurrentAyahKey(
        `${first.surahNumber}:${first.ayahNumber}`
      );
    }
  }, [ayahsOnPage, currentKey, session]);

  // Navigation — keep already-revealed words visible (don't reset)
  const handlePrevAyah = useCallback(() => {
    if (currentAyahIdx > 0) {
      const prev = ayahsOnPage[currentAyahIdx - 1];
      session.setMushafCurrentAyahKey(`${prev.surahNumber}:${prev.ayahNumber}`);
    }
  }, [currentAyahIdx, ayahsOnPage, session]);

  const handleNextAyah = useCallback(() => {
    if (currentAyahIdx < ayahsOnPage.length - 1) {
      const next = ayahsOnPage[currentAyahIdx + 1];
      session.setMushafCurrentAyahKey(`${next.surahNumber}:${next.ayahNumber}`);
    } else {
      // Advance to next page — clear revealed since it's a new page
      const nextPage = pageNumber + 1;
      if (nextPage <= 604) {
        useSessionStore.setState({
          currentPageNumber: nextPage,
          mushafCurrentAyahKey: null,
          revealedWordKeys: new Set<string>(),
        });
      }
    }
  }, [currentAyahIdx, ayahsOnPage, pageNumber, session]);

  const isFirstAyah = currentAyahIdx === 0;
  const isLastAyah = currentAyahIdx === ayahsOnPage.length - 1;

  return {
    pageData,
    pageNumber,
    edition,
    isLoading,
    ayahsOnPage,
    currentAyah,
    currentAyahIdx,
    isFirstAyah,
    isLastAyah,
    handlePrevAyah,
    handleNextAyah,
  };
}

// ---------- MushafControlsBar (extracted) ----------

interface MushafControlsBarProps {
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  isHidden: boolean;
  comparisonResult: ComparisonResult | null;
}

export function MushafControlsBar({
  surahNumber,
  startAyah,
  endAyah,
  isHidden,
  comparisonResult,
}: MushafControlsBarProps) {
  const session = useSessionStore();
  const nav = useMushafNav(surahNumber, startAyah, endAyah);

  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={nav.handlePrevAyah}
            disabled={nav.isFirstAyah && nav.pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center gap-1">
            {nav.currentAyah ? (
              <>
                <span className="text-sm font-medium">
                  Reciting: Surah {nav.currentAyah.surahNumber} : Ayah{" "}
                  {nav.currentAyah.ayahNumber}
                </span>
                <span className="text-xs text-muted-foreground">
                  Ayah {nav.currentAyahIdx + 1} of {nav.ayahsOnPage.length} on
                  page {nav.pageNumber}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={nav.handleNextAyah}
            disabled={nav.isLastAyah && nav.currentAyah?.ayahNumber === endAyah}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Peek/Hide toggle */}
        <div className="flex justify-center mt-2">
          <Button variant="ghost" size="sm" onClick={session.toggleHidden}>
            {isHidden ? (
              <>
                <Eye className="mr-1 h-4 w-4" />
                Peek
              </>
            ) : (
              <>
                <EyeOff className="mr-1 h-4 w-4" />
                Hide
              </>
            )}
          </Button>
        </div>

        {/* Current ayah comparison stats */}
        {comparisonResult && nav.currentAyah && (
          <div className="flex justify-center gap-4 text-sm mt-2 pt-2 border-t">
            <span className="text-[#059669] dark:text-[#00E5A0]">
              {comparisonResult.correctWords} correct
            </span>
            <span className="text-red-600 dark:text-red-400">
              {comparisonResult.mistakes.length} mistakes
            </span>
            <span className="font-medium">
              {comparisonResult.accuracy}% accuracy
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- HideQuickToggles ----------

export function HideQuickToggles() {
  const session = useSessionStore();
  const { hideMode, isHidden } = session;

  const buttons = [
    {
      key: "full_hide" as const,
      label: "All",
      icon: EyeOff,
      action: () => {
        session.setHideMode("full_hide");
        session.resetRevealed(); // Clear revealed words + force isHidden=true
        session.resetRevealedWordKeys(); // Clear mushaf revealed keys too
      },
    },
    {
      key: "random_blank" as const,
      label: "Random",
      icon: Shuffle,
      action: () => {
        session.setHideMode("random_blank");
        if (!isHidden) session.toggleHidden();
      },
    },
    {
      key: "first_letter" as const,
      label: "Letter",
      icon: Type,
      action: () => {
        session.setHideMode("first_letter");
        if (!isHidden) session.toggleHidden();
      },
    },
    {
      key: "show" as const,
      label: "Show",
      icon: Eye,
      action: () => {
        session.revealAll(); // Sets isHidden=false
      },
    },
  ] as const;

  return (
    <div className="flex flex-wrap gap-1.5">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        const isActive =
          btn.key === "show" ? !isHidden : isHidden && hideMode === btn.key;
        return (
          <Button
            key={btn.key}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className="flex-1 min-w-0 gap-1 text-xs px-1.5 sm:px-2"
            onClick={btn.action}
            aria-label={btn.label}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">{btn.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

// ---------- MushafModePanel (page only) ----------

interface MushafModePanelProps {
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  hideMode: HideMode;
  hideDifficulty: number;
  isHidden: boolean;
  comparisonResult: ComparisonResult | null;
  /** Called when the mushaf-mode current ayah changes, so the parent can
   *  update `originalText` for voice comparison.
   *  `nextAyahFirstWord` is the first word of the next ayah (for first-word trigger). */
  onCurrentAyahChange: (
    surah: number,
    ayah: number,
    text: string,
    wordKeys: string[],
    wordTexts: string[],
    nextAyahFirstWord: string | null
  ) => void;
  /** When true, render the controls card inline below the page (mobile).
   *  When false, only render the mushaf page (desktop 3-col uses separate MushafControlsBar). */
  showInlineControls?: boolean;
  /** Live overlay: word keys to force-reveal and highlight green (correct recitation) */
  liveCorrectKeys?: Set<string>;
  /** Live overlay: word keys to force-reveal and highlight red (wrong recitation) */
  liveMistakeKeys?: Set<string>;
  /** Live overlay: word key currently being tracked (glow) */
  liveCurrentKey?: string;
  /** When true, add a subtle pulse to the current word to show speech is being processed */
  isListening?: boolean;
  /** Live overlay: per-word mistake details (recited word) keyed by wordKey */
  liveMistakeDetails?: Map<string, { recitedWord?: string }>;
}

export function MushafModePanel({
  surahNumber,
  startAyah,
  endAyah,
  hideMode,
  hideDifficulty,
  isHidden,
  comparisonResult,
  onCurrentAyahChange,
  showInlineControls = true,
  liveCorrectKeys,
  liveMistakeKeys,
  liveCurrentKey,
  isListening = false,
  liveMistakeDetails,
}: MushafModePanelProps) {
  const session = useSessionStore();
  const nav = useMushafNav(surahNumber, startAyah, endAyah);

  // Fetch per-word historical feedback for this session range
  const { data: wordFeedbackMap } = useWordFeedback(
    surahNumber,
    startAyah,
    endAyah
  );

  // Compute weakness levels + word histories Maps for MushafPage
  const { weaknessLevels, wordHistories } = useMemo(() => {
    const levels = new Map<string, WeaknessLevel>();
    const histories = new Map<string, WordFeedbackData>();
    if (!wordFeedbackMap)
      return { weaknessLevels: levels, wordHistories: histories };
    for (const [wordKey, fb] of wordFeedbackMap) {
      levels.set(wordKey, computeWeaknessLevel(fb));
      histories.set(wordKey, fb);
    }
    return { weaknessLevels: levels, wordHistories: histories };
  }, [wordFeedbackMap]);

  // Accumulated comparison results per ayah key (ref to avoid setState-in-effect)
  const accumulatedResultsRef = useRef<Map<string, ComparisonResult>>(
    new Map()
  );

  // Notify parent of current ayah text + word keys for voice comparison
  useEffect(() => {
    if (!nav.pageData || !nav.currentAyah) return;
    const text = getAyahTextFromPage(
      nav.pageData,
      nav.currentAyah.surahNumber,
      nav.currentAyah.ayahNumber
    );
    const wordKeys = getWordKeysForAyah(
      nav.pageData,
      nav.currentAyah.surahNumber,
      nav.currentAyah.ayahNumber
    );
    const wordTexts = getWordTextsForAyah(
      nav.pageData,
      nav.currentAyah.surahNumber,
      nav.currentAyah.ayahNumber
    );
    // Compute next ayah's first word for first-word trigger
    let nextAyahFirstWord: string | null = null;
    const nextAyah = nav.ayahsOnPage[nav.currentAyahIdx + 1];
    if (nextAyah) {
      const nextTexts = getWordTextsForAyah(
        nav.pageData,
        nextAyah.surahNumber,
        nextAyah.ayahNumber
      );
      if (nextTexts.length > 0) nextAyahFirstWord = nextTexts[0];
    }
    onCurrentAyahChange(
      nav.currentAyah.surahNumber,
      nav.currentAyah.ayahNumber,
      text,
      wordKeys,
      wordTexts,
      nextAyahFirstWord
    );
  }, [
    nav.pageData,
    nav.currentAyah,
    nav.ayahsOnPage,
    nav.currentAyahIdx,
    onCurrentAyahChange,
  ]);

  // When a new comparisonResult arrives, accumulate it (ref mutation + version bump)
  const prevComparisonRef = useRef<ComparisonResult | null>(null);
  if (
    comparisonResult &&
    nav.currentAyah &&
    comparisonResult !== prevComparisonRef.current
  ) {
    prevComparisonRef.current = comparisonResult;
    const key = `${nav.currentAyah.surahNumber}:${nav.currentAyah.ayahNumber}`;
    accumulatedResultsRef.current = new Map(accumulatedResultsRef.current);
    accumulatedResultsRef.current.set(key, comparisonResult);
  }

  // --- Computed overlay sets ---
  const ayahRange = useMemo(
    () => ({ surahNumber, startAyah, endAyah }),
    [surahNumber, startAyah, endAyah]
  );

  // Compute the set of word keys belonging to the current ayah (for ring glow + weak word reveal)
  const currentAyahWordKeys = useMemo(() => {
    if (!nav.pageData || !nav.currentAyah) return undefined;
    const keys = getWordKeysForAyah(
      nav.pageData,
      nav.currentAyah.surahNumber,
      nav.currentAyah.ayahNumber
    );
    return new Set(keys);
  }, [nav.pageData, nav.currentAyah]);

  const hiddenWordKeys = useMemo(() => {
    if (!nav.pageData) return new Set<string>();
    const hidden = computeHiddenWordKeys(
      nav.pageData,
      hideMode,
      hideDifficulty,
      isHidden,
      session.revealedWordKeys,
      ayahRange
    );
    // Live overlay: reveal words that have been recited (correct or wrong)
    if (liveCorrectKeys) for (const k of liveCorrectKeys) hidden.delete(k);
    if (liveMistakeKeys) for (const k of liveMistakeKeys) hidden.delete(k);
    // Auto-reveal weak words when user starts reciting the current ayah
    if (isListening && currentAyahWordKeys && weaknessLevels.size > 0) {
      for (const k of currentAyahWordKeys) {
        if (weaknessLevels.get(k) === "weak" && hidden.has(k)) {
          hidden.delete(k);
        }
      }
    }
    // Note: liveCurrentKey is NOT removed from hidden — it only affects the
    // "current word" glow styling once the word becomes visible through
    // recitation. Revealing the tracking cursor would defeat full_hide mode.
    return hidden;
  }, [
    nav.pageData,
    hideMode,
    hideDifficulty,
    isHidden,
    session.revealedWordKeys,
    ayahRange,
    liveCorrectKeys,
    liveMistakeKeys,
    isListening,
    currentAyahWordKeys,
    weaknessLevels,
  ]);

  const hintWordKeys = useMemo(() => {
    if (!nav.pageData || hideMode !== "first_letter") return undefined;
    return computeHintWordKeys(nav.pageData, ayahRange);
  }, [nav.pageData, hideMode, ayahRange]);

  // Merge mistake + correct keys from all accumulated results
  const accumulatedResults = accumulatedResultsRef.current;
  const { mistakeWordKeys, highlightedWords } = useMemo(() => {
    const mistakes = new Set<string>();
    const highlights = new Set<string>();
    if (!nav.pageData)
      return { mistakeWordKeys: mistakes, highlightedWords: highlights };

    for (const [key, result] of accumulatedResults) {
      const [s, a] = key.split(":").map(Number);
      const mKeys = computeMistakeWordKeys(nav.pageData, s, a, result);
      const cKeys = computeCorrectWordKeys(nav.pageData, s, a, result);
      for (const k of mKeys) mistakes.add(k);
      for (const k of cKeys) highlights.add(k);
    }
    // Merge live overlay keys
    if (liveCorrectKeys) for (const k of liveCorrectKeys) highlights.add(k);
    if (liveMistakeKeys) for (const k of liveMistakeKeys) mistakes.add(k);
    return { mistakeWordKeys: mistakes, highlightedWords: highlights };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nav.pageData,
    accumulatedResults,
    comparisonResult,
    liveCorrectKeys,
    liveMistakeKeys,
  ]);

  // Current ayah glow — live tracking overrides default
  const currentWordKey = useMemo(() => {
    if (liveCurrentKey) return liveCurrentKey;
    if (!nav.currentAyah || !nav.pageData) return undefined;
    // First pass: find the first non-ayah-end word in this ayah
    for (const line of nav.pageData.lines) {
      if (line.lineType !== "ayah") continue;
      for (const w of line.words) {
        if (
          w.surahNumber === nav.currentAyah.surahNumber &&
          w.ayahNumber === nav.currentAyah.ayahNumber &&
          w.isFirstInAyah &&
          !w.isAyahEnd
        ) {
          return w.wordKey;
        }
      }
    }
    // Fallback: ayah-end-only ayahs (muqatta'at like الٓمٓ 2:1)
    for (const line of nav.pageData.lines) {
      if (line.lineType !== "ayah") continue;
      for (const w of line.words) {
        if (
          w.surahNumber === nav.currentAyah.surahNumber &&
          w.ayahNumber === nav.currentAyah.ayahNumber
        ) {
          return w.wordKey;
        }
      }
    }
    return undefined;
  }, [nav.currentAyah, nav.pageData, liveCurrentKey]);

  // Merge live mistake details into a map for tooltip rendering on mushaf words
  const mistakeDetailsMap = useMemo(() => {
    if (!liveMistakeDetails || liveMistakeDetails.size === 0) return undefined;
    return liveMistakeDetails;
  }, [liveMistakeDetails]);

  const handleWordClick = useCallback(
    (word: MushafWordType) => {
      session.revealWordKey(word.wordKey);
    },
    [session]
  );

  if (nav.isLoading || !nav.pageData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <MushafPageSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={showInlineControls ? "space-y-4" : ""}
      data-listening={isListening || undefined}
    >
      {/* Mushaf Page */}
      <div className="flex justify-center">
        <MushafPage
          page={nav.pageData}
          edition={nav.edition}
          hiddenWordKeys={hiddenWordKeys}
          hintWordKeys={hintWordKeys}
          mistakeWordKeys={mistakeWordKeys}
          highlightedWords={highlightedWords}
          currentWordKey={currentWordKey}
          currentAyahWordKeys={currentAyahWordKeys}
          mistakeDetailsMap={mistakeDetailsMap}
          weaknessLevels={weaknessLevels}
          wordHistories={wordHistories}
          onWordClick={handleWordClick}
          showPageNumber
          showJuzInfo
        />
      </div>

      {/* Inline controls (mobile / fallback) */}
      {showInlineControls && (
        <MushafControlsBar
          surahNumber={surahNumber}
          startAyah={startAyah}
          endAyah={endAyah}
          isHidden={isHidden}
          comparisonResult={comparisonResult}
        />
      )}
    </div>
  );
}
