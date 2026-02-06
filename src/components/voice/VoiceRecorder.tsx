"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Square } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onTranscript: (text: string, isFinal: boolean) => void;
  onRecordingChange?: (isRecording: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceRecorder({
  onTranscript,
  onRecordingChange,
  disabled = false,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const recognizerRef = useRef<ReturnType<typeof createRecognizer> | null>(
    null
  );
  const animationFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const updateVolume = useCallback(() => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setVolume(avg / 255);
    }
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    }
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, updateVolume]);

  const startRecording = async () => {
    setError(null);
    setIsInitializing(true);

    try {
      // Check browser support
      const SpeechRecognition =
        typeof window !== "undefined"
          ? (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition // eslint-disable-line @typescript-eslint/no-explicit-any
          : null;

      if (!SpeechRecognition) {
        setError(
          "Speech recognition is not supported in your browser. Try Chrome or Edge."
        );
        setIsInitializing(false);
        return;
      }

      // Get audio stream for volume visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Create speech recognizer
      const recognizer = createRecognizer(
        SpeechRecognition,
        onTranscript,
        (err) => {
          setError(err);
          stopRecording();
        }
      );
      recognizerRef.current = recognizer;
      recognizer.start();

      setIsRecording(true);
      onRecordingChange?.(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError(
          "Microphone access denied. Please allow microphone permission."
        );
      } else {
        setError("Failed to start recording. Please try again.");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const stopRecording = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setIsRecording(false);
    setVolume(0);
    onRecordingChange?.(false);
  }, [onRecordingChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Record Button */}
      <Button
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        className={cn(
          "relative h-16 w-16 rounded-full p-0 transition-all",
          isRecording && "animate-pulse"
        )}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isInitializing}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {/* Volume ring */}
        {isRecording && (
          <span
            className="absolute inset-0 rounded-full border-4 border-red-400 opacity-50 transition-transform"
            style={{ transform: `scale(${1 + volume * 0.5})` }}
          />
        )}
        {isInitializing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>

      {/* Status */}
      <p className="text-sm text-muted-foreground">
        {isInitializing
          ? "Initializing..."
          : isRecording
            ? "Listening... Recite now"
            : "Tap to start reciting"}
      </p>

      {/* Error */}
      {error && (
        <p className="max-w-xs text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function createRecognizer(
  SpeechRecognitionCtor: any,
  onResult: (text: string, isFinal: boolean) => void,
  onError: (error: string) => void
) {
  const recognition = new SpeechRecognitionCtor();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let restartCount = 0;
  const maxRestarts = 3;

  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (finalTranscript) {
      onResult(finalTranscript, true);
    } else if (interimTranscript) {
      onResult(interimTranscript, false);
    }
  };

  recognition.onerror = (event: any) => {
    const errorMessages: Record<string, string> = {
      "no-speech": "No speech detected. Please try again.",
      "audio-capture": "No microphone found.",
      "not-allowed": "Microphone permission denied.",
      network: "Network error. Check your connection.",
      aborted: "",
    };
    const msg =
      errorMessages[event.error] ?? `Recognition error: ${event.error}`;
    if (msg) onError(msg);
  };

  recognition.onend = () => {
    // Auto-restart if ended unexpectedly
    if (restartCount < maxRestarts) {
      restartCount++;
      try {
        recognition.start();
      } catch {
        // Already running or destroyed
      }
    }
  };

  return {
    start: () => {
      restartCount = 0;
      recognition.start();
    },
    stop: () => {
      restartCount = maxRestarts; // Prevent auto-restart
      recognition.stop();
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
