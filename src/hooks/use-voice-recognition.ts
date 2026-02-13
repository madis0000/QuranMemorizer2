"use client";

import { useCallback, useRef, useState } from "react";

import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import { FluencyTracker, type FluencyMetrics } from "@/lib/speech/fluency";
import { useSessionStore } from "@/stores/sessionStore";
import type { EngineType } from "@/components/voice/VoiceRecorder";

interface UseVoiceRecognitionOptions {
  originalText: string;
  surahNumber?: number;
  ayahNumber?: number;
  sensitivity?: "strict" | "normal" | "lenient";
  onComparisonResult?: (result: ComparisonResult) => void;
}

export function useVoiceRecognition({
  originalText,
  surahNumber,
  ayahNumber,
  sensitivity = "normal",
  onComparisonResult,
}: UseVoiceRecognitionOptions) {
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [engineType, setEngineType] = useState<EngineType>("web-speech");
  const [fluencyMetrics, setFluencyMetrics] = useState<FluencyMetrics | null>(
    null
  );

  const accumulatedTextRef = useRef("");
  const fluencyTrackerRef = useRef(new FluencyTracker());
  const previousWordCountRef = useRef(0);

  const { addMistake, incrementWordsRecited } = useSessionStore();

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      const newText = text.trim();
      if (!newText) return;

      const newWords = newText.split(/\s+/).filter((w) => w.length > 0);
      let uniqueNewWords = newWords;

      if (accumulatedTextRef.current) {
        // Web Speech API sometimes sends overlapping final results where the
        // beginning of the new result duplicates the end of accumulated text.
        // Detect and remove the overlap to prevent duplicate words that tank accuracy.
        const accWords = accumulatedTextRef.current
          .split(/\s+/)
          .filter((w) => w.length > 0);
        let bestOverlap = 0;
        const maxCheck = Math.min(accWords.length, newWords.length, 20);
        for (let len = 1; len <= maxCheck; len++) {
          let match = true;
          for (let i = 0; i < len; i++) {
            if (accWords[accWords.length - len + i] !== newWords[i]) {
              match = false;
              break;
            }
          }
          if (match) bestOverlap = len;
        }
        uniqueNewWords = newWords.slice(bestOverlap);
        if (uniqueNewWords.length > 0) {
          accumulatedTextRef.current += " " + uniqueNewWords.join(" ");
        }
        // If uniqueNewWords is empty, entire result was duplicate — skip
      } else {
        accumulatedTextRef.current = newText;
      }

      setFinalText(accumulatedTextRef.current);
      setInterimText("");

      // Record word timestamps for fluency tracking — only unique new words
      const tracker = fluencyTrackerRef.current;
      for (const word of uniqueNewWords) {
        tracker.recordWordTimestamp(word);
      }
      setFluencyMetrics(tracker.getMetrics());
    } else {
      setInterimText(text);

      // Track interim words for more granular fluency data.
      // Only record words we haven't seen yet in this interim batch.
      const interimWords = text.split(/\s+/).filter((w) => w.length > 0);
      if (interimWords.length > previousWordCountRef.current) {
        const tracker = fluencyTrackerRef.current;
        const newWords = interimWords.slice(previousWordCountRef.current);
        for (const word of newWords) {
          tracker.recordWordTimestamp(word);
        }
        previousWordCountRef.current = interimWords.length;
        setFluencyMetrics(tracker.getMetrics());
      }
    }
  }, []);

  const handleEngineChange = useCallback((engine: EngineType) => {
    setEngineType(engine);
  }, []);

  const compareAndScore = useCallback(async () => {
    if (!accumulatedTextRef.current || !originalText) return null;

    setIsProcessing(true);
    try {
      // Dynamic import to avoid SSR issues
      const { compareRecitation } =
        await import("@/lib/memorization/mistakeDetector");
      const result = compareRecitation(
        originalText,
        accumulatedTextRef.current,
        sensitivity
      );

      setComparisonResult(result);

      // Record mistakes in session store
      result.mistakes.forEach((mistake) => {
        addMistake({
          surahNumber: surahNumber ?? 0,
          ayahNumber: ayahNumber ?? 0,
          wordIndex: mistake.wordIndex,
          type: mistake.type,
          recitedText: mistake.recitedText,
          correctText: mistake.correctText,
          severity: mistake.severity,
        });
      });

      // Update word counts
      result.wordResults.forEach((wr) => {
        incrementWordsRecited(wr.status === "correct");
      });

      onComparisonResult?.(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [
    originalText,
    surahNumber,
    ayahNumber,
    sensitivity,
    addMistake,
    incrementWordsRecited,
    onComparisonResult,
  ]);

  const reset = useCallback(() => {
    accumulatedTextRef.current = "";
    previousWordCountRef.current = 0;
    setFinalText("");
    setInterimText("");
    setComparisonResult(null);
    setIsProcessing(false);
    fluencyTrackerRef.current.reset();
    setFluencyMetrics(null);
  }, []);

  return {
    interimText,
    finalText,
    isProcessing,
    comparisonResult,
    engineType,
    fluencyMetrics,
    handleTranscript,
    handleEngineChange,
    compareAndScore,
    reset,
  };
}
