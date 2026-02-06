"use client";

import { useCallback, useRef, useState } from "react";

import type { ComparisonResult } from "@/lib/memorization/mistakeDetector";
import { useSessionStore } from "@/stores/sessionStore";

interface UseVoiceRecognitionOptions {
  originalText: string;
  sensitivity?: "strict" | "normal" | "lenient";
  onComparisonResult?: (result: ComparisonResult) => void;
}

export function useVoiceRecognition({
  originalText,
  sensitivity = "normal",
  onComparisonResult,
}: UseVoiceRecognitionOptions) {
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const accumulatedTextRef = useRef("");

  const { addMistake, incrementWordsRecited } = useSessionStore();

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      accumulatedTextRef.current +=
        (accumulatedTextRef.current ? " " : "") + text;
      setFinalText(accumulatedTextRef.current);
      setInterimText("");
    } else {
      setInterimText(text);
    }
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
      result.mistakes.forEach((mistake, index) => {
        addMistake({
          surahNumber: 0, // Should be set by caller
          ayahNumber: 0,
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
    sensitivity,
    addMistake,
    incrementWordsRecited,
    onComparisonResult,
  ]);

  const reset = useCallback(() => {
    accumulatedTextRef.current = "";
    setFinalText("");
    setInterimText("");
    setComparisonResult(null);
    setIsProcessing(false);
  }, []);

  return {
    interimText,
    finalText,
    isProcessing,
    comparisonResult,
    handleTranscript,
    compareAndScore,
    reset,
  };
}
