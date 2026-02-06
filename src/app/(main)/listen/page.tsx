"use client";

import { useState } from "react";
import { useAudioStore } from "@/stores";
import {
  Headphones,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

// Sample reciters
const reciters = [
  {
    id: "ar.alafasy",
    name: "Mishary Rashid Alafasy",
    arabicName: "مشاري راشد العفاسي",
  },
  {
    id: "ar.abdulsamad",
    name: "Abdul Samad",
    arabicName: "عبد الباسط عبد الصمد",
  },
  {
    id: "ar.husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
  },
  {
    id: "ar.sudais",
    name: "Abdul Rahman Al-Sudais",
    arabicName: "عبد الرحمن السديس",
  },
];

export default function ListenPage() {
  const {
    isPlaying,
    volume,
    playbackSpeed,
    repeatMode,
    currentReciter,
    togglePlay,
    setVolume,
    setPlaybackSpeed,
    setRepeatMode,
    setCurrentReciter,
  } = useAudioStore();

  const [progress, setProgress] = useState(35);

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

        {/* Now Playing Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Now Playing</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Current Surah Info */}
            <div className="text-center mb-6">
              <h2 className="text-3xl arabic-text mb-2">الفاتحة</h2>
              <p className="text-lg">Al-Fatihah (The Opening)</p>
              <p className="text-sm text-muted-foreground">
                Recited by {reciters.find((r) => r.id === currentReciter)?.name}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>0:35</span>
                <span>1:42</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setRepeatMode(repeatMode === "none" ? "ayah" : "none")
                }
                className={repeatMode !== "none" ? "text-primary" : ""}
              >
                <Repeat className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="lg"
                className="rounded-full h-14 w-14"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>

              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <Shuffle className="h-5 w-5" />
              </Button>
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
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
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
              {reciters.map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => setCurrentReciter(reciter.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    currentReciter === reciter.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div>
                    <p className="font-medium">{reciter.name}</p>
                    <p className="text-sm text-muted-foreground arabic-text">
                      {reciter.arabicName}
                    </p>
                  </div>
                  {currentReciter === reciter.id && (
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
