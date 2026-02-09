"use client";

import { useState } from "react";
import {
  Headphones,
  Loader2,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import { POPULAR_RECITERS } from "@/lib/quran/api";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useSurahs } from "@/hooks/use-quran";
import { useAudioStore, type RepeatMode } from "@/stores/audioStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

// Helper for time formatting
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ListenPage() {
  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    repeatMode,
    currentReciter,
    currentSurah,
    currentAyah,
    playRange,
    togglePlay,
    next,
    previous,
    seekTo,
    setVolume,
    setSpeed,
    setRepeatMode,
  } = useAudioPlayer();

  // Store action for setting reciter
  const setCurrentReciter = useAudioStore((s) => s.setCurrentReciter);

  // Fetch all surahs
  const { data: surahs, isLoading: surahsLoading } = useSurahs();

  // Selected surah for playback (defaults to currentSurah from store)
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(currentSurah);

  // Get current surah info
  const currentSurahInfo = surahs?.find((s) => s.number === currentSurah);
  const selectedSurahInfo = surahs?.find(
    (s) => s.number === selectedSurahNumber
  );

  // Get current reciter info
  const reciter = POPULAR_RECITERS.find((r) => r.id === currentReciter);

  // Handle play button
  const handlePlay = () => {
    if (currentSurah === selectedSurahNumber && (isPlaying || duration > 0)) {
      // Already playing this surah, just toggle
      togglePlay();
    } else {
      // Play the selected surah
      const surah = surahs?.find((s) => s.number === selectedSurahNumber);
      if (surah) {
        playRange(selectedSurahNumber, 1, surah.numberOfAyahs);
      }
    }
  };

  // Handle progress bar change
  const handleSeek = (value: number[]) => {
    if (duration > 0) {
      const newTime = (value[0] / 100) * duration;
      seekTo(newTime);
    }
  };

  // Handle repeat mode cycling: none → ayah → surah → none
  const handleRepeatToggle = () => {
    const modes: RepeatMode[] = ["none", "ayah", "surah"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  // Get repeat mode label
  const getRepeatLabel = () => {
    if (repeatMode === "ayah") return "Repeat: Ayah";
    if (repeatMode === "surah") return "Repeat: Surah";
    return "Repeat: Off";
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            Listen to Quran
          </h1>
          <p className="text-muted-foreground">
            Listen to beautiful recitations from renowned Qaris
          </p>
        </div>

        {/* Surah Selection Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Surah</CardTitle>
          </CardHeader>
          <CardContent>
            {surahsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <select
                value={selectedSurahNumber}
                onChange={(e) => setSelectedSurahNumber(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {surahs?.map((surah) => (
                  <option key={surah.number} value={surah.number}>
                    {surah.number}. {surah.englishName} - {surah.name} (
                    {surah.numberOfAyahs} verses)
                  </option>
                ))}
              </select>
            )}
          </CardContent>
        </Card>

        {/* Now Playing Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {isLoading
                ? "Loading..."
                : isPlaying
                  ? "Now Playing"
                  : "Ready to Play"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Current Surah Info */}
            <div className="text-center mb-6">
              <h2 className="text-3xl arabic-text mb-2">
                {currentSurahInfo?.name || "القرآن الكريم"}
              </h2>
              <p className="text-lg">
                {currentSurahInfo?.englishName || "Select a Surah"}{" "}
                {currentSurahInfo?.englishNameTranslation &&
                  `(${currentSurahInfo.englishNameTranslation})`}
              </p>
              {currentSurahInfo && (
                <p className="text-sm text-muted-foreground mt-1">
                  Ayah {currentAyah} of {currentSurahInfo.numberOfAyahs}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Recited by {reciter?.name || "Unknown Reciter"}
              </p>
              {reciter?.style && (
                <p className="text-xs text-muted-foreground">
                  {reciter.style} style
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
                disabled={duration === 0}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRepeatToggle}
                className={repeatMode !== "none" ? "text-primary" : ""}
                title={getRepeatLabel()}
              >
                <Repeat className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={previous}
                disabled={!isPlaying && duration === 0}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="lg"
                className="rounded-full h-14 w-14"
                onClick={handlePlay}
                disabled={isLoading || !selectedSurahInfo}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                disabled={!isPlaying && duration === 0}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="w-5" />
            </div>

            {/* Volume & Speed Controls */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2 w-32">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  max={100}
                  step={1}
                />
              </div>

              <select
                value={playbackSpeed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="bg-transparent border border-border rounded px-2 py-1 text-sm"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Reciter Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Reciter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {POPULAR_RECITERS.map((reciterOption) => (
                <button
                  key={reciterOption.id}
                  onClick={() => setCurrentReciter(reciterOption.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    currentReciter === reciterOption.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div>
                    <p className="font-medium">{reciterOption.name}</p>
                    <p className="text-sm text-muted-foreground arabic-text">
                      {reciterOption.arabicName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reciterOption.style}
                    </p>
                  </div>
                  {currentReciter === reciterOption.id && (
                    <div className="h-4 w-4 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
