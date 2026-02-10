"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import type { RecordingMetadata } from "@/lib/audio/recording-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { WaveformDisplay } from "./WaveformDisplay";

interface RecitationReplayProps {
  recording: RecordingMetadata;
  className?: string;
}

export function RecitationReplay({
  recording,
  className,
}: RecitationReplayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Derive object URL from blob — stable across renders
  const audioUrl = useMemo(() => {
    if (recording.blob) {
      return URL.createObjectURL(recording.blob);
    }
    return null;
  }, [recording.blob]);

  // Cleanup URL on unmount or change
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Create audio element
  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });

    return () => {
      audio.pause();
      audio.removeAttribute("src");
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((position: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = position * audioRef.current.duration;
    setProgress(position);
  }, []);

  const restart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setProgress(0);
    audioRef.current.play();
    setIsPlaying(true);
  }, []);

  return (
    <div
      className={cn(
        "rounded-xl border border-[#D1E0D8] dark:border-[#00E5A0]/10 bg-white/80 dark:bg-[#0F1A14]/80 p-4 space-y-3",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">{recording.verseKey}</span>
          <div className="text-xs text-muted-foreground">
            {new Date(recording.createdAt).toLocaleDateString()} &middot;{" "}
            {Math.floor(recording.duration / 60)}:
            {String(recording.duration % 60).padStart(2, "0")}
          </div>
        </div>
        {recording.accuracy !== undefined && (
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
              recording.accuracy >= 90
                ? "bg-[#059669]/15 text-[#059669] dark:bg-[#00E5A0]/15 dark:text-[#00E5A0]"
                : recording.accuracy >= 70
                  ? "bg-[#0d9488]/15 text-[#0d9488] dark:bg-[#2dd4bf]/15 dark:text-[#2dd4bf]"
                  : "bg-[#FFD700]/15 text-[#B8860B] dark:text-[#FFD700]"
            )}
          >
            {recording.accuracy}%
          </span>
        )}
      </div>

      {/* Waveform */}
      <WaveformDisplay
        audioBlob={recording.blob}
        isPlaying={isPlaying}
        progress={progress}
        onSeek={handleSeek}
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="ghost" size="icon" onClick={restart}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          onClick={togglePlay}
          className="bg-[#059669] hover:bg-[#047857] text-white dark:bg-[#00E5A0] dark:hover:bg-[#00E5A0]/80 dark:text-[#0F1A14] w-10 h-10 rounded-full"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
