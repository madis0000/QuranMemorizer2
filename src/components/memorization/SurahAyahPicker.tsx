"use client";

import { useState } from "react";
import { useSurahs } from "@/hooks";
import type { Surah } from "@/types/quran";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SurahAyahPickerProps {
  onSelect: (surahNumber: number, startAyah: number, endAyah: number) => void;
  defaultSurah?: number;
  defaultStartAyah?: number;
  defaultEndAyah?: number;
}

export function SurahAyahPicker({
  onSelect,
  defaultSurah = 1,
  defaultStartAyah = 1,
  defaultEndAyah = 7,
}: SurahAyahPickerProps) {
  const { data: surahs, isLoading } = useSurahs();
  const [selectedSurah, setSelectedSurah] = useState(defaultSurah);
  const [startAyah, setStartAyah] = useState(defaultStartAyah);
  const [endAyah, setEndAyah] = useState(defaultEndAyah);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSurah = surahs?.find((s: Surah) => s.number === selectedSurah);
  const maxAyahs = currentSurah?.numberOfAyahs ?? 7;

  const filteredSurahs = surahs?.filter(
    (s: Surah) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.number.toString() === searchQuery
  );

  const handleSurahSelect = (surahNumber: number) => {
    const surah = surahs?.find((s: Surah) => s.number === surahNumber);
    setSelectedSurah(surahNumber);
    setStartAyah(1);
    setEndAyah(surah?.numberOfAyahs ?? 7);
  };

  const handleConfirm = () => {
    const clampedStart = Math.max(1, Math.min(startAyah, maxAyahs));
    const clampedEnd = Math.max(clampedStart, Math.min(endAyah, maxAyahs));
    onSelect(selectedSurah, clampedStart, clampedEnd);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Verses to Memorize</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Surah Search */}
        <div>
          <Label htmlFor="surah-search">Search Surah</Label>
          <Input
            id="surah-search"
            placeholder="Search by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Surah List */}
        <div className="max-h-48 overflow-y-auto rounded-md border">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading surahs...
            </div>
          ) : (
            filteredSurahs?.map((surah: Surah) => (
              <button
                key={surah.number}
                onClick={() => handleSurahSelect(surah.number)}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  selectedSurah === surah.number ? "bg-accent font-medium" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs">
                    {surah.number}
                  </span>
                  <span>{surah.englishName}</span>
                </span>
                <span className="font-arabic text-base" dir="rtl">
                  {surah.name}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Ayah Range */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="start-ayah">From Ayah</Label>
            <Input
              id="start-ayah"
              type="number"
              min={1}
              max={maxAyahs}
              value={startAyah}
              onChange={(e) => setStartAyah(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="end-ayah">To Ayah</Label>
            <Input
              id="end-ayah"
              type="number"
              min={startAyah}
              max={maxAyahs}
              value={endAyah}
              onChange={(e) => setEndAyah(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        {currentSurah && (
          <p className="text-sm text-muted-foreground">
            {currentSurah.englishName} has {maxAyahs} ayahs
          </p>
        )}

        <Button onClick={handleConfirm} className="w-full">
          Start Memorizing
        </Button>
      </CardContent>
    </Card>
  );
}
