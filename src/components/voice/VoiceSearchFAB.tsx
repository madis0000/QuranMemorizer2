"use client";

/**
 * VoiceSearchFAB - Floating Action Button for "Shazam for Quran" voice search.
 *
 * A floating microphone button fixed at the bottom-right of the screen.
 * On click, opens a dialog for voice-based Quran verse search.
 *
 * States: idle -> listening -> processing -> results
 */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSurahs } from "@/hooks/use-quran";
import { useVoiceSearch } from "@/hooks/use-voice-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VoiceSearchFAB() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    status,
    isListening,
    transcript,
    results,
    confidence,
    errorMessage,
    startSearch,
    stopSearch,
    reset,
  } = useVoiceSearch();

  const { data: surahs = [] } = useSurahs();

  // Get surah name from number
  const getSurahName = useCallback(
    (surahNumber: number): string => {
      const surah = surahs.find((s) => s.number === surahNumber);
      return surah?.englishName ?? `Surah ${surahNumber}`;
    },
    [surahs]
  );

  // Global keyboard shortcut: press 'V' to open voice search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Only trigger if not typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // When dialog opens, auto-start listening
  useEffect(() => {
    if (open && status === "idle") {
      startSearch();
    }
  }, [open, status, startSearch]);

  // When dialog closes, reset
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        reset();
      }
    },
    [reset]
  );

  // Navigate to verse and close dialog
  const handleGoToVerse = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      setOpen(false);
      reset();
      router.push(`/quran?surah=${surahNumber}&ayah=${ayahNumber}`);
    },
    [router, reset]
  );

  // Search again
  const handleSearchAgain = useCallback(() => {
    reset();
    // Use setTimeout to allow state reset before starting new search
    setTimeout(() => {
      startSearch();
    }, 100);
  }, [reset, startSearch]);

  // Confidence display as percentage
  const confidencePercent = Math.round(confidence * 100);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-all",
          "h-14 w-14 bg-primary text-primary-foreground hover:bg-primary/90",
          "bottom-20 right-4 sm:bottom-6 sm:right-6",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        aria-label="Voice search - press V to activate"
        title="Voice search (V)"
      >
        <Mic className="h-6 w-6" />
      </button>

      {/* Voice Search Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Voice Search
            </DialogTitle>
            <DialogDescription>
              Recite a verse and we will find it instantly - like Shazam for
              Quran
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {/* Microphone Button */}
            <div className="relative">
              <button
                onClick={isListening ? stopSearch : startSearch}
                disabled={status === "processing"}
                className={cn(
                  "relative flex h-20 w-20 items-center justify-center rounded-full transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  isListening
                    ? "bg-destructive text-destructive-foreground focus:ring-destructive"
                    : status === "processing"
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
                )}
                aria-label={
                  isListening
                    ? "Stop listening"
                    : status === "processing"
                      ? "Processing"
                      : "Start listening"
                }
              >
                {/* Pulsing animation ring when listening */}
                {isListening && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
                    <span className="absolute inset-[-4px] rounded-full border-2 border-destructive/50 animate-pulse" />
                  </>
                )}
                {status === "processing" ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : isListening ? (
                  <MicOff className="h-8 w-8 relative z-10" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </button>
            </div>

            {/* Status text */}
            <div className="text-center">
              {status === "idle" && (
                <p className="text-sm text-muted-foreground">
                  Tap the microphone to start
                </p>
              )}
              {isListening && (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="inline-block h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-sm font-medium">
                      Listening... Recite now
                    </span>
                  </div>
                  {confidencePercent > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Confidence: {confidencePercent}%
                    </p>
                  )}
                </div>
              )}
              {status === "processing" && (
                <p className="text-sm text-muted-foreground">
                  Searching for matching verses...
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </div>

            {/* Transcript display */}
            {transcript && (
              <div className="w-full rounded-lg border bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Transcribed text:
                </p>
                <p className="text-base text-right" dir="rtl">
                  {transcript}
                </p>
              </div>
            )}

            {/* Results list */}
            {results.length > 0 && (
              <div className="w-full space-y-2">
                <p className="text-sm font-medium">
                  {results.length} match{results.length !== 1 ? "es" : ""} found
                </p>
                <div className="max-h-[40vh] overflow-y-auto space-y-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.surahNumber}-${result.ayahNumber}-${index}`}
                      onClick={() =>
                        handleGoToVerse(result.surahNumber, result.ayahNumber)
                      }
                      className={cn(
                        "w-full rounded-lg border p-3 text-left transition-colors",
                        "hover:bg-accent focus:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm font-medium">
                            {getSurahName(result.surahNumber)} (
                            {result.surahNumber}:{result.ayahNumber})
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            result.matchScore >= 0.8
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : result.matchScore >= 0.5
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {Math.round(result.matchScore * 100)}%
                        </span>
                      </div>
                      <p
                        className="text-base leading-relaxed text-right"
                        dir="rtl"
                      >
                        {result.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 w-full">
              {(status === "results" || status === "error") && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSearchAgain}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Search again
                </Button>
              )}
              <Button
                variant="ghost"
                className={
                  status === "results" || status === "error"
                    ? "flex-1"
                    : "w-full"
                }
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>

            {/* Keyboard shortcut hint */}
            <p className="text-xs text-muted-foreground">
              Press{" "}
              <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">
                V
              </kbd>{" "}
              anywhere to open voice search
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
