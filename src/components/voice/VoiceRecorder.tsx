"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square, Wifi, WifiOff } from "lucide-react";

import {
  createAudioBlob,
  shouldUseWhisper,
  transcribeWithWhisper,
} from "@/lib/speech/whisper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ===== Types =====

export type EngineType = "web-speech" | "whisper";

interface VoiceRecorderProps {
  onTranscript: (text: string, isFinal: boolean) => void;
  onRecordingChange?: (isRecording: boolean) => void;
  onEngineChange?: (engine: EngineType) => void;
  disabled?: boolean;
  className?: string;
}

/** Shape of the object returned by createWebSpeechRecognizer. */
interface WebSpeechHandle {
  start: () => void;
  stop: () => void;
}

// ===== Constants =====

/** Number of consecutive Web Speech failures before auto-switching to Whisper. */
const MAX_WEB_SPEECH_FAILURES = 3;

/** Interval (ms) at which Whisper mode sends audio chunks for transcription. */
const WHISPER_CHUNK_INTERVAL_MS = 3_000;

// ===== Component =====

export function VoiceRecorder({
  onTranscript,
  onRecordingChange,
  onEngineChange,
  disabled = false,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const [activeEngine, setActiveEngine] = useState<EngineType>(() =>
    shouldUseWhisper() ? "whisper" : "web-speech"
  );

  // Refs for Web Speech mode
  const recognizerRef = useRef<WebSpeechHandle | null>(null);
  const webSpeechFailuresRef = useRef(0);

  // Refs for volume visualisation (shared by both engines)
  const animationFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Refs for Whisper mode
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const whisperChunksRef = useRef<Blob[]>([]);
  const whisperIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const isRecordingRef = useRef(false);

  // Keep isRecordingRef in sync
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // ===== Volume animation =====

  const updateVolume = useCallback(() => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setVolume(avg / 255);
    }
    if (isRecordingRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    }
  }, []);

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

  // ===== Shared audio setup for volume visualisation =====

  const setupAudioAnalyser = useCallback(async (): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    return stream;
  }, []);

  // ===== Engine switching =====

  const switchEngine = useCallback(
    (engine: EngineType) => {
      setActiveEngine(engine);
      onEngineChange?.(engine);
    },
    [onEngineChange]
  );

  // ===== Whisper mode: send chunks periodically =====

  const sendWhisperChunk = useCallback(async () => {
    if (whisperChunksRef.current.length === 0) return;

    const blob = createAudioBlob([...whisperChunksRef.current]);
    // Keep accumulating for context, but we send the full recording so far
    // so that Whisper can improve its output with more context.
    try {
      const result = await transcribeWithWhisper(blob);
      if (result.text) {
        // Whisper returns the full transcription so far; treat as interim
        // until recording stops
        onTranscript(result.text, false);
      }
    } catch {
      // Silently ignore transient transcription errors in streaming mode
    }
  }, [onTranscript]);

  // ===== Start recording =====

  const startRecording = async () => {
    setError(null);
    setIsInitializing(true);

    try {
      const stream = await setupAudioAnalyser();

      if (activeEngine === "whisper") {
        await startWhisperRecording(stream);
      } else {
        startWebSpeechRecording(stream);
      }

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

  // ===== Web Speech recording =====

  const startWebSpeechRecording = (stream: MediaStream) => {
    // Access the SpeechRecognition constructor
    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognitionCtor =
      win.SpeechRecognition ?? win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      // No Web Speech support at all: switch to Whisper
      switchEngine("whisper");
      void startWhisperRecording(stream);
      return;
    }

    const recognizer = createWebSpeechRecognizer(
      SpeechRecognitionCtor as new () => SpeechRecognitionInstanceLocal,
      onTranscript,
      (err: string) => {
        webSpeechFailuresRef.current += 1;

        if (webSpeechFailuresRef.current >= MAX_WEB_SPEECH_FAILURES) {
          // Auto-switch to Whisper after repeated failures
          switchEngine("whisper");
          setError(null);

          // Stop the Web Speech recognizer and start Whisper with the existing stream
          if (recognizerRef.current) {
            recognizerRef.current.stop();
            recognizerRef.current = null;
          }
          if (streamRef.current) {
            void startWhisperRecording(streamRef.current);
          }
          return;
        }

        setError(err);
      }
    );
    recognizerRef.current = recognizer;
    recognizer.start();
  };

  // ===== Whisper recording =====

  const startWhisperRecording = async (stream: MediaStream) => {
    whisperChunksRef.current = [];

    // Determine supported MIME type
    const mimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];
    let selectedMime: string | undefined;
    for (const mime of mimeTypes) {
      if (
        typeof MediaRecorder !== "undefined" &&
        MediaRecorder.isTypeSupported(mime)
      ) {
        selectedMime = mime;
        break;
      }
    }

    const options: MediaRecorderOptions = {};
    if (selectedMime) {
      options.mimeType = selectedMime;
    }

    const recorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = recorder;

    recorder.addEventListener("dataavailable", (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        whisperChunksRef.current.push(event.data);
      }
    });

    recorder.start(250); // Collect chunks every 250ms

    // Send accumulated audio to Whisper every ~3 seconds
    whisperIntervalRef.current = setInterval(() => {
      void sendWhisperChunk();
    }, WHISPER_CHUNK_INTERVAL_MS);
  };

  // ===== Stop recording =====

  const stopRecording = useCallback(async () => {
    // Stop Web Speech recognizer
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current = null;
    }

    // Stop Whisper interval
    if (whisperIntervalRef.current) {
      clearInterval(whisperIntervalRef.current);
      whisperIntervalRef.current = null;
    }

    // Stop MediaRecorder and send final chunk
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;

      // Final transcription of accumulated audio
      if (whisperChunksRef.current.length > 0) {
        try {
          const blob = createAudioBlob([...whisperChunksRef.current]);
          const result = await transcribeWithWhisper(blob);
          if (result.text) {
            onTranscript(result.text, true);
          }
        } catch {
          // Ignore error on final send
        }
        whisperChunksRef.current = [];
      }
    }

    // Release audio resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {
        // Ignore close errors
      });
      audioCtxRef.current = null;
    }
    analyserRef.current = null;

    setIsRecording(false);
    setVolume(0);
    onRecordingChange?.(false);
  }, [onRecordingChange, onTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Fire-and-forget cleanup; cannot await in a cleanup function
      void stopRecording();
    };
  }, [stopRecording]);

  // ===== Render =====

  const engineLabel = activeEngine === "whisper" ? "Whisper AI" : "Web Speech";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Engine indicator */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {activeEngine === "whisper" ? (
          <WifiOff className="h-3 w-3" />
        ) : (
          <Wifi className="h-3 w-3" />
        )}
        <span>{engineLabel}</span>
      </div>

      {/* Record Button */}
      <Button
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        className={cn(
          "relative h-16 w-16 rounded-full p-0 transition-all",
          isRecording && "animate-pulse"
        )}
        onClick={isRecording ? () => void stopRecording() : startRecording}
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

// ===== Web Speech API local types =====
// Minimal local interfaces to avoid importing global Speech types
// which may conflict with other declarations.

interface SpeechRecognitionAlternativeLocal {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultLocal {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLocal;
}

interface SpeechRecognitionResultListLocal {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLocal;
}

interface SpeechRecognitionEventLocal {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLocal;
}

interface SpeechRecognitionErrorEventLocal {
  readonly error: string;
}

interface SpeechRecognitionInstanceLocal {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((ev: SpeechRecognitionEventLocal) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLocal) => void) | null;
  onend: (() => void) | null;
}

// ===== Web Speech recognizer factory =====

function createWebSpeechRecognizer(
  SpeechRecognitionCtor: new () => SpeechRecognitionInstanceLocal,
  onResult: (text: string, isFinal: boolean) => void,
  onError: (error: string) => void
): WebSpeechHandle {
  const recognition = new SpeechRecognitionCtor();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let restartCount = 0;
  const maxRestarts = 3;

  recognition.onresult = (event: SpeechRecognitionEventLocal) => {
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

  recognition.onerror = (event: SpeechRecognitionErrorEventLocal) => {
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
