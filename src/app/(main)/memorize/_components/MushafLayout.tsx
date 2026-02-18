"use client";

import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

import type { FlowerStage, Season } from "@/lib/gamification/surah-trees";
import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import type { HideMode } from "@/stores/sessionStore";
import {
  HideQuickToggles,
  MushafModePanel,
} from "@/components/memorization/MushafModePanel";
import { MushafSidebar } from "@/components/memorization/MushafSidebar";
import { Button } from "@/components/ui/button";
import { RecitationTracker } from "@/components/voice/RecitationTracker";
import {
  VoiceRecorder,
  type EngineType,
} from "@/components/voice/VoiceRecorder";

import type { LiveTrackingResult } from "../_lib/live-tracking";
import { LiveTrackerBar } from "./LiveTrackerBar";

interface MushafLayoutProps {
  // Session data
  surahNumber: number;
  currentAyah: number;
  startAyah: number;
  endAyah: number;
  hideMode: HideMode;
  hideDifficulty: number;
  isHidden: boolean;
  isActive: boolean;
  activeSessionId: string | null;

  // Live tracking
  liveResult: LiveTrackingResult;
  confirmedResult: LiveTrackingResult;

  // Voice
  isRecording: boolean;
  interimText: string;
  finalText: string;
  overlayCollapsed: boolean;
  /** Auto-start mic on next ayah */
  autoStartMic?: boolean;
  onOverlayCollapse: (collapsed: boolean) => void;
  onTranscript: (text: string, isFinal: boolean) => void;
  onRecordingChange: (recording: boolean) => void;
  onEngineChange: (engine: EngineType) => void;
  onVoiceReset: () => void;
  onCheckRecitation: () => void;

  // Navigation
  onPrevAyah: () => void;
  onNextAyah: () => void;
  onRetryAyah: () => void;
  autoAdvance: boolean;
  onAutoAdvanceChange: (v: boolean) => void;

  // Mushaf callbacks
  comparisonResult: ComparisonResult | null;
  onMushafAyahChange: (
    surah: number,
    ayah: number,
    text: string,
    wordKeys: string[],
    wordTexts: string[],
    nextFirstWord: string | null
  ) => void;

  // Sidebar
  onSurahSelect: (surahNumber: number) => void;
  sessionAccuracy: number;
  masteryPercent: number;
  season: Season;
  flowerStage: FlowerStage;
  totalAyahs: number;

  // Toolbar extras (mobile sidebar toggle)
  toolbarExtras?: React.ReactNode;

  // Save handler
  onSaveAndExit?: () => void;
}

export function MushafLayout({
  surahNumber,
  currentAyah,
  startAyah,
  endAyah,
  hideMode,
  hideDifficulty,
  isHidden,
  isActive,
  liveResult,
  confirmedResult,
  isRecording,
  interimText,
  finalText,
  overlayCollapsed,
  autoStartMic,
  onOverlayCollapse,
  onTranscript,
  onRecordingChange,
  onEngineChange,
  onVoiceReset,
  onCheckRecitation,
  onPrevAyah,
  onNextAyah,
  onRetryAyah,
  autoAdvance,
  onAutoAdvanceChange,
  comparisonResult,
  onMushafAyahChange,
  onSurahSelect,
  sessionAccuracy,
  masteryPercent,
  season,
  flowerStage,
  totalAyahs,
}: MushafLayoutProps) {
  const sidebarProps = {
    surahNumber,
    onSurahSelect,
    sessionAccuracy,
    masteryPercent,
    season,
    flowerStage,
    totalAyahs,
    bloomingAyahs: [] as number[],
  };

  return (
    <div className="flex-1 min-h-0 flex bg-[#F2F0ED] dark:bg-[#0A1210]">
      {/* Center: Mushaf page with overlay + action bar */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Live Tracker Bar — compact horizontal replacement for old left panel */}
        <LiveTrackerBar
          liveResult={liveResult}
          surahNumber={surahNumber}
          ayahNumber={currentAyah}
          onPrevAyah={onPrevAyah}
          onNextAyah={onNextAyah}
          onRetryAyah={onRetryAyah}
          isFirstAyah={currentAyah <= startAyah}
          isLastAyah={currentAyah >= endAyah}
          isRecording={isRecording}
          autoAdvance={autoAdvance}
          onAutoAdvanceChange={onAutoAdvanceChange}
        />
        {/* Scrollable mushaf area */}
        <div className="flex-1 min-h-0 overflow-y-auto relative">
          {/* Desktop view */}
          <div className="hidden lg:block py-4 px-2">
            <MushafModePanel
              surahNumber={surahNumber}
              startAyah={startAyah}
              endAyah={endAyah}
              hideMode={hideMode}
              hideDifficulty={hideDifficulty}
              isHidden={isHidden}
              comparisonResult={comparisonResult}
              onCurrentAyahChange={onMushafAyahChange}
              showInlineControls={false}
              liveCorrectKeys={confirmedResult.correctKeys}
              liveMistakeKeys={confirmedResult.mistakeKeys}
              liveCurrentKey={confirmedResult.currentKey}
              isListening={isRecording}
              liveMistakeDetails={confirmedResult.mistakeDetails}
            />
          </div>

          {/* Mobile view */}
          <div className="lg:hidden py-4 px-2">
            <MushafModePanel
              surahNumber={surahNumber}
              startAyah={startAyah}
              endAyah={endAyah}
              hideMode={hideMode}
              hideDifficulty={hideDifficulty}
              isHidden={isHidden}
              comparisonResult={comparisonResult}
              onCurrentAyahChange={onMushafAyahChange}
              showInlineControls
              liveCorrectKeys={confirmedResult.correctKeys}
              liveMistakeKeys={confirmedResult.mistakeKeys}
              liveCurrentKey={confirmedResult.currentKey}
              isListening={isRecording}
              liveMistakeDetails={confirmedResult.mistakeDetails}
            />
          </div>
        </div>

        {/* Recitation Overlay — collapsible, above action bar */}
        {(finalText || interimText || isRecording) && (
          <div className="mx-2 lg:mx-4 -mb-1">
            <div className="bg-white/80 dark:bg-[#0F1A14]/80 backdrop-blur-md rounded-t-xl border border-b-0 border-[#D1E0D8]/60 dark:border-[#1E3228] shadow-lg">
              {overlayCollapsed ? (
                <button
                  className="w-full flex items-center gap-2 p-2 text-xs text-muted-foreground hover:bg-muted/30 transition-colors"
                  onClick={() => onOverlayCollapse(false)}
                >
                  <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                  <span
                    className="truncate text-right flex-1 font-arabic"
                    dir="rtl"
                  >
                    {finalText || interimText}
                  </span>
                </button>
              ) : (
                <div className="relative">
                  <div className="max-h-24 overflow-y-auto p-3">
                    <RecitationTracker
                      interimText={interimText}
                      finalText={finalText}
                      isListening={isRecording}
                    />
                  </div>
                  <button
                    className="absolute top-1 left-1 p-0.5 rounded hover:bg-muted/50 text-muted-foreground"
                    onClick={() => onOverlayCollapse(true)}
                    aria-label="Collapse overlay"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mushaf Action Bar — always at bottom */}
        <div
          className={`shrink-0 bg-white/90 dark:bg-[#0F1A14]/90 backdrop-blur-md border-t ${isRecording ? "border-t-red-400/50 border-t-2" : "border-[#D1E0D8]/40 dark:border-[#1E3228]"}`}
        >
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <HideQuickToggles />
            <div className="w-px h-8 bg-[#D1E0D8]/60 dark:bg-[#1E3228] shrink-0" />
            <VoiceRecorder
              onTranscript={onTranscript}
              onRecordingChange={onRecordingChange}
              onEngineChange={onEngineChange}
              disabled={!isActive}
              compact
              autoStart={autoStartMic}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={onVoiceReset}
              disabled={!finalText}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" onClick={onCheckRecitation} disabled={!finalText}>
              Check
            </Button>
          </div>
        </div>
      </main>

      {/* Right: Sidebar (lg+) */}
      <MushafSidebar {...sidebarProps} />
    </div>
  );
}
