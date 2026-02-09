"use client";

/**
 * useVoiceSearch hook
 *
 * Manages the "Shazam for Quran" voice search lifecycle:
 * start listening -> transcribe -> search -> results
 *
 * Uses ArabicSpeechRecognizer for real-time recognition in Chrome/Edge,
 * falls back to Whisper API for other browsers.
 */
import { useCallback, useRef, useState } from "react";

import {
  ArabicSpeechRecognizer,
  type RecognitionResult,
} from "@/lib/speech/recognition";
import { searchVerseByText, voiceSearch } from "@/lib/speech/voice-search";
import { createAudioBlob, shouldUseWhisper } from "@/lib/speech/whisper";

export type VoiceSearchStatus =
  | "idle"
  | "listening"
  | "processing"
  | "results"
  | "error";

export interface VoiceSearchResultItem {
  surahNumber: number;
  ayahNumber: number;
  text: string;
  matchScore: number;
  transcribedText: string;
}

interface UseVoiceSearchReturn {
  /** Current status of the voice search */
  status: VoiceSearchStatus;
  /** Whether the recognizer is actively listening */
  isListening: boolean;
  /** Current transcript (interim or final) */
  transcript: string;
  /** Search results */
  results: VoiceSearchResultItem[];
  /** Recognition confidence (0-1) */
  confidence: number;
  /** Error message if any */
  errorMessage: string | null;
  /** Start voice search */
  startSearch: () => void;
  /** Stop voice search */
  stopSearch: () => void;
  /** Reset to idle state */
  reset: () => void;
}

const DEBOUNCE_MS = 300;
const CONFIDENCE_THRESHOLD = 0.75;

export function useVoiceSearch(): UseVoiceSearchReturn {
  const [status, setStatus] = useState<VoiceSearchStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState<VoiceSearchResultItem[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognizerRef = useRef<ArabicSpeechRecognizer | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const lastSearchedTextRef = useRef("");

  // Clean up debounce timer
  const clearDebounce = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Perform a debounced text search
  const debouncedSearch = useCallback(
    (text: string) => {
      // Skip if text hasn't changed or is too short
      if (text === lastSearchedTextRef.current || text.length < 2) return;

      clearDebounce();
      debounceTimerRef.current = setTimeout(async () => {
        try {
          lastSearchedTextRef.current = text;
          const searchResults = await searchVerseByText(text);
          setResults(searchResults);
          if (searchResults.length > 0) {
            setStatus("results");
          }
        } catch {
          // Silently fail on interim search errors; user can still keep reciting
        }
      }, DEBOUNCE_MS);
    },
    [clearDebounce]
  );

  // Handle recognition results from Web Speech API
  const handleResult = useCallback(
    (result: RecognitionResult) => {
      setTranscript(result.transcript);
      setConfidence(result.confidence);

      if (result.isFinal && result.confidence >= CONFIDENCE_THRESHOLD) {
        // High-confidence final result - trigger search immediately
        debouncedSearch(result.transcript);
      } else {
        // Interim result or low-confidence final - debounced background search
        debouncedSearch(result.transcript);
      }
    },
    [debouncedSearch]
  );

  // Clean up audio resources
  const cleanupAudio = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Start Whisper-based search (fallback for non-Chrome browsers)
  const startWhisperSearch = useCallback(async () => {
    setStatus("listening");
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) return;

        setStatus("processing");
        setTranscript("Processing audio...");

        try {
          const audioBlob = createAudioBlob(audioChunksRef.current);
          const searchResults = await voiceSearch(audioBlob);

          setResults(searchResults);
          if (searchResults.length > 0) {
            setTranscript(searchResults[0].transcribedText);
          }
          setStatus("results");
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Voice search failed";
          setErrorMessage(message);
          setStatus("error");
        }
      };

      recorder.start();
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setErrorMessage(
          "Microphone access denied. Please allow microphone permission."
        );
      } else {
        setErrorMessage("Failed to start recording. Please try again.");
      }
      setStatus("error");
    }
  }, []);

  // Start voice search using Web Speech API
  const startWebSpeechSearch = useCallback(() => {
    setStatus("listening");
    setErrorMessage(null);

    const recognizer = new ArabicSpeechRecognizer({
      language: "ar-SA",
      continuous: true,
      interimResults: true,
      onResult: handleResult,
      onError: (error) => {
        setErrorMessage(error);
        setStatus("error");
      },
      onEnd: () => {
        // ArabicSpeechRecognizer handles auto-restart internally
        // This fires when recognition truly ends (manual stop or max retries)
      },
      onStart: () => {
        setStatus("listening");
      },
    });

    recognizerRef.current = recognizer;
    recognizer.start();
  }, [handleResult]);

  // Public: start search
  const startSearch = useCallback(() => {
    // Reset state
    setTranscript("");
    setResults([]);
    setConfidence(0);
    setErrorMessage(null);
    lastSearchedTextRef.current = "";

    if (shouldUseWhisper()) {
      startWhisperSearch();
    } else {
      startWebSpeechSearch();
    }
  }, [startWhisperSearch, startWebSpeechSearch]);

  // Public: stop search
  const stopSearch = useCallback(() => {
    clearDebounce();

    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }

    cleanupAudio();

    // If we have results, show them; otherwise try final search
    if (results.length > 0) {
      setStatus("results");
    } else if (transcript.length >= 2) {
      // We have a transcript but no results yet - do a final search
      setStatus("processing");
      const searchText = transcript;
      searchVerseByText(searchText)
        .then((searchResults) => {
          setResults(searchResults);
          setStatus(searchResults.length > 0 ? "results" : "idle");
        })
        .catch(() => {
          setStatus("idle");
        });
    } else {
      setStatus("idle");
    }
  }, [clearDebounce, cleanupAudio, results.length, transcript]);

  // Public: reset to idle
  const reset = useCallback(() => {
    clearDebounce();

    if (recognizerRef.current) {
      recognizerRef.current.abort();
      recognizerRef.current = null;
    }

    cleanupAudio();

    setStatus("idle");
    setTranscript("");
    setResults([]);
    setConfidence(0);
    setErrorMessage(null);
    lastSearchedTextRef.current = "";
  }, [clearDebounce, cleanupAudio]);

  return {
    status,
    isListening: status === "listening",
    transcript,
    results,
    confidence,
    errorMessage,
    startSearch,
    stopSearch,
    reset,
  };
}
