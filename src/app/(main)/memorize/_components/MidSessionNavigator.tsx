"use client";

import { useState } from "react";
import { SURAH_AYAH_COUNTS, SURAH_NAMES } from "@/data/hizb-data";
import { Compass, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MidSessionNavigatorProps {
  currentSurah: number;
  currentAyah: number;
  onNavigate: (surah: number, ayah: number) => void;
}

export function MidSessionNavigator({
  currentSurah,
  currentAyah,
  onNavigate,
}: MidSessionNavigatorProps) {
  const [open, setOpen] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahInput, setAyahInput] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSurahClick = (surahNum: number) => {
    setSelectedSurah(surahNum);
    setAyahInput("1");
  };

  const handleGo = () => {
    if (selectedSurah === null) return;
    const maxAyahs = SURAH_AYAH_COUNTS[selectedSurah] ?? 7;
    const ayah = Math.max(1, Math.min(parseInt(ayahInput) || 1, maxAyahs));
    onNavigate(selectedSurah, ayah);
    setOpen(false);
    setSelectedSurah(null);
    setSearchQuery("");
  };

  const filteredSurahs = Object.entries(SURAH_NAMES)
    .map(([num, name]) => ({ number: parseInt(num), name }))
    .filter(
      (s) =>
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.number.toString().includes(searchQuery)
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          title="Navigate to any surah or ayah"
        >
          <Compass className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Navigate</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96 p-0 flex flex-col">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="text-sm">Navigate to Verse</SheetTitle>
          <p className="text-xs text-muted-foreground">
            Currently at {SURAH_NAMES[currentSurah]} {currentSurah}:
            {currentAyah}
          </p>
        </SheetHeader>

        {selectedSurah === null ? (
          // Surah list
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search surah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {filteredSurahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => handleSurahClick(s.number)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors ${
                    s.number === currentSurah
                      ? "bg-[#059669]/10 dark:bg-[#00E5A0]/10"
                      : ""
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium tabular-nums">
                    {s.number}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-xs">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {SURAH_AYAH_COUNTS[s.number] ?? "?"} ayahs
                    </div>
                  </div>
                  {s.number === currentSurah && (
                    <span className="text-[10px] text-[#059669] dark:text-[#00E5A0] font-medium">
                      Current
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Ayah picker
          <div className="flex-1 p-4 space-y-4">
            <button
              onClick={() => setSelectedSurah(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to surah list
            </button>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">
                {selectedSurah}. {SURAH_NAMES[selectedSurah]}
              </h3>
              <p className="text-xs text-muted-foreground">
                {SURAH_AYAH_COUNTS[selectedSurah] ?? "?"} ayahs
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Go to Ayah</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={SURAH_AYAH_COUNTS[selectedSurah] ?? 7}
                  value={ayahInput}
                  onChange={(e) => setAyahInput(e.target.value)}
                  className="h-9 w-20 text-center"
                />
                <span className="text-xs text-muted-foreground">
                  of {SURAH_AYAH_COUNTS[selectedSurah] ?? "?"}
                </span>
              </div>
            </div>

            {/* Quick jump buttons for common positions */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Quick Jump
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  1,
                  Math.floor((SURAH_AYAH_COUNTS[selectedSurah] ?? 7) / 4),
                  Math.floor((SURAH_AYAH_COUNTS[selectedSurah] ?? 7) / 2),
                  Math.floor((3 * (SURAH_AYAH_COUNTS[selectedSurah] ?? 7)) / 4),
                  SURAH_AYAH_COUNTS[selectedSurah] ?? 7,
                ]
                  .filter((v, i, a) => v > 0 && a.indexOf(v) === i)
                  .map((ayah) => (
                    <Button
                      key={ayah}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setAyahInput(String(ayah))}
                    >
                      Ayah {ayah}
                    </Button>
                  ))}
              </div>
            </div>

            <Button onClick={handleGo} className="w-full gap-1.5">
              <Compass className="h-4 w-4" />
              Go to {SURAH_NAMES[selectedSurah]} {selectedSurah}:{ayahInput}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
