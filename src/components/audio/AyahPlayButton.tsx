"use client";

import { Loader2, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Button } from "@/components/ui/button";

interface AyahPlayButtonProps {
  surahNumber: number;
  ayahNumber: number;
  className?: string;
}

/**
 * AyahPlayButton -- a small play/pause button intended to sit next to an
 * individual ayah. It plays (or pauses) the specific ayah and shows visual
 * feedback when the ayah is the one currently being played.
 */
export function AyahPlayButton({
  surahNumber,
  ayahNumber,
  className,
}: AyahPlayButtonProps) {
  const {
    isPlaying,
    isLoading,
    currentSurah,
    currentAyah,
    playAyah,
    togglePlay,
  } = useAudioPlayer();

  const isThisAyahActive =
    currentSurah === surahNumber && currentAyah === ayahNumber;
  const isThisAyahPlaying = isThisAyahActive && isPlaying;
  const isThisAyahLoading = isThisAyahActive && isLoading;

  const handleClick = () => {
    if (isThisAyahActive) {
      // Already this ayah, toggle play/pause
      togglePlay();
    } else {
      // Play this specific ayah
      playAyah(surahNumber, ayahNumber);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full shrink-0",
        isThisAyahPlaying && "text-primary animate-pulse",
        isThisAyahActive && !isThisAyahPlaying && "text-primary",
        className
      )}
      onClick={handleClick}
      aria-label={
        isThisAyahPlaying
          ? `Pause ayah ${ayahNumber}`
          : `Play ayah ${ayahNumber}`
      }
    >
      {isThisAyahLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isThisAyahPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4 ml-0.5" />
      )}
    </Button>
  );
}
