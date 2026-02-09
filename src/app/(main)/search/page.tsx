"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Loader2,
  Mic,
  MicOff,
  Search as SearchIcon,
} from "lucide-react";

import {
  ArabicSpeechRecognizer,
  type RecognitionResult,
} from "@/lib/speech/recognition";
import { useSearch, useSurahs } from "@/hooks/use-quran";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognizerRef = useRef<ArabicSpeechRecognizer | null>(null);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results
  const {
    data: results = [],
    isLoading,
    error,
  } = useSearch(debouncedQuery, debouncedQuery.length >= 2);

  // Fetch surahs for name lookup
  const { data: surahs = [] } = useSurahs();

  // Helper to get surah name
  const getSurahName = (surahNumber: number) => {
    const surah = surahs.find((s) => s.number === surahNumber);
    return surah?.englishName || `Surah ${surahNumber}`;
  };

  // Stop recognition and clean up
  const stopRecognition = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
        recognizerRef.current = null;
      }
    };
  }, []);

  // Handle voice search button click: toggle speech recognition
  const handleVoiceSearch = useCallback(() => {
    if (isListening) {
      stopRecognition();
      return;
    }

    setVoiceError(null);

    if (!ArabicSpeechRecognizer.isSupported()) {
      setVoiceError(
        "Speech recognition is not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    const recognizer = new ArabicSpeechRecognizer({
      language: "ar-SA",
      continuous: true,
      interimResults: true,
      onResult: (result: RecognitionResult) => {
        // Update query with recognized text
        setQuery(result.transcript);
        if (result.isFinal) {
          // Trigger immediate search on final result
          setDebouncedQuery(result.transcript);
        }
      },
      onError: (errorMsg: string) => {
        setVoiceError(errorMsg);
        stopRecognition();
      },
      onEnd: () => {
        // Recognition ended (after auto-restart retries exhausted)
        setIsListening(false);
        recognizerRef.current = null;
      },
      onStart: () => {
        setIsListening(true);
      },
    });

    recognizerRef.current = recognizer;
    recognizer.start();
  }, [isListening, stopRecognition]);

  // Handle Enter key to search immediately
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setDebouncedQuery(query);
    }
  };

  // Navigate to verse
  const handleGoToVerse = (surahNumber: number, ayahNumber: number) => {
    router.push(`/quran?surah=${surahNumber}&ayah=${ayahNumber}`);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SearchIcon className="h-6 w-6 text-primary" />
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
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by Arabic text, translation, or topic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                Listening... Recite a verse to search
              </div>
            )}

            {voiceError && (
              <p className="mt-2 text-center text-sm text-destructive">
                {voiceError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Voice Search Feature */}
        <Card className="mb-6 bg-gradient-to-r from-[#059669]/10 to-[#059669]/5 border-[#059669]/20 dark:from-[#00E5A0]/10 dark:to-[#00E5A0]/5 dark:border-[#00E5A0]/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#059669]/20 dark:bg-[#00E5A0]/20 flex items-center justify-center">
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-6 text-center">
              <p className="text-destructive">
                Failed to search. Please check your connection and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && query.length >= 2 && results.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try different keywords or use Arabic text
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {!isLoading && !error && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">
              {results.length} Result{results.length !== 1 ? "s" : ""} Found
            </h2>

            {results.map((result, index) => (
              <Card
                key={index}
                className="hover:bg-accent/50 transition-colors"
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {getSurahName(result.surahNumber)} ({result.surahNumber}
                        :{result.ayahNumber})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleGoToVerse(result.surahNumber, result.ayahNumber)
                      }
                    >
                      Go to verse
                    </Button>
                  </div>

                  {/* Arabic text with highlighting */}
                  <div
                    className="arabic-text text-xl text-right mb-2"
                    dir="rtl"
                    dangerouslySetInnerHTML={{
                      __html: result.highlightedText || result.text,
                    }}
                  />

                  {/* Translation */}
                  {result.translation && (
                    <p className="text-muted-foreground text-sm">
                      {result.translation}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Initial State (no search yet) */}
        {!query && (
          <Card>
            <CardContent className="py-12 text-center">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Start typing to search the Quran
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Search in Arabic, English translation, or by topic
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
