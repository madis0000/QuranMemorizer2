"use client";

import { useRouter } from "next/navigation";
import { Loader2, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useSurahs } from "@/hooks/use-quran";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

/**
 * Format seconds to "m:ss" display string.
 */
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * MiniPlayer -- a compact bottom bar that persists across pages when audio
 * is playing or paused (not when stopped). Shows current surah/ayah info,
 * playback controls, and a progress bar. Click the track info to navigate
 * to the full listen page.
 */
export function MiniPlayer() {
  const router = useRouter();
  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    currentSurah,
    currentAyah,
    togglePlay,
    stop,
    next,
    previous,
    seekTo,
  } = useAudioPlayer();

  const { data: surahs } = useSurahs();

  // Only visible when there is an active track (playing or paused with a loaded surah)
  const isActive = currentSurah > 0 && (isPlaying || duration > 0);

  if (!isActive) {
    return null;
  }

  const surahInfo = surahs?.find((s) => s.number === currentSurah);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number[]) => {
    if (duration > 0) {
      const newTime = (value[0] / 100) * duration;
      seekTo(newTime);
    }
  };

  const handleNavigateToListen = () => {
    router.push("/listen");
  };

  const handleDismiss = () => {
    stop();
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "border-t border-border",
        "bg-background/80 backdrop-blur-lg",
        "lg:left-0"
      )}
    >
      {/* Progress bar at the very top of the mini player */}
      <div className="px-2 pt-1">
        <Slider
          value={[progressPercent]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full h-1"
          disabled={duration === 0}
        />
      </div>

      {/* Main content row */}
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:gap-3">
        {/* Track info (clickable to go to /listen) */}
        <button
          type="button"
          onClick={handleNavigateToListen}
          className="flex-1 min-w-0 text-left"
        >
          <p className="text-sm font-medium truncate">
            {surahInfo
              ? `${surahInfo.englishName} - Ayah ${currentAyah}`
              : `Surah ${currentSurah} - Ayah ${currentAyah}`}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {surahInfo?.name ?? ""}{" "}
            <span className="hidden sm:inline">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </p>
        </button>

        {/* Playback controls */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={previous}
            aria-label="Previous ayah"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={togglePlay}
            disabled={isLoading}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={next}
            aria-label="Next ayah"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
          aria-label="Stop and dismiss player"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
