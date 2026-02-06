"use client";

import { useState } from "react";
import { BookOpen, Mic, MicOff, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Sample search results
const sampleResults = [
  {
    surah: 2,
    surahName: "Al-Baqarah",
    ayah: 255,
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    translation:
      "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
  },
  {
    surah: 112,
    surahName: "Al-Ikhlas",
    ayah: 1,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Say, He is Allah, [who is] One.",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState(sampleResults);

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice search would be implemented here
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Search Quran
          </h1>
          <p className="text-muted-foreground">
            Search by text or recite to find verses instantly
          </p>
        </div>

        {/* Search Input */}
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by Arabic text, translation, or topic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoiceSearch}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isListening && (
              <div className="mt-4 flex items-center justify-center gap-2 text-primary">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                Listening... Recite a verse to search
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Search Feature */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Voice Search</h3>
                <p className="text-sm text-muted-foreground">
                  Like Shazam for Quran - recite any verse and we&apos;ll find
                  it instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">
            {results.length} Results Found
          </h2>

          {results.map((result, index) => (
            <Card key={index} className="hover:bg-accent/50 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {result.surahName} ({result.surah}:{result.ayah})
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Go to verse
                  </Button>
                </div>

                <p className="arabic-text text-xl text-right mb-2" dir="rtl">
                  {result.arabic}
                </p>

                <p className="text-muted-foreground text-sm">
                  {result.translation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
