// ===== Arabic Speech Recognition =====
// Wraps the Web Speech API for Arabic Quran recitation recognition.

// ===== Web Speech API type declarations =====
// Local interface definitions that mirror the Web Speech API.
// We use these instead of augmenting `declare global` to avoid
// conflicts with other files that also declare SpeechRecognition on Window.

interface SpeechRecognitionAlternativeLocal {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultLocal {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternativeLocal;
  [index: number]: SpeechRecognitionAlternativeLocal;
}

interface SpeechRecognitionResultListLocal {
  readonly length: number;
  item(index: number): SpeechRecognitionResultLocal;
  [index: number]: SpeechRecognitionResultLocal;
}

interface SpeechRecognitionEventLocal extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListLocal;
}

interface SpeechRecognitionErrorEventLocal extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  grammars: unknown;

  start(): void;
  stop(): void;
  abort(): void;

  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult:
    | ((
        this: SpeechRecognitionInstance,
        ev: SpeechRecognitionEventLocal
      ) => void)
    | null;
  onerror:
    | ((
        this: SpeechRecognitionInstance,
        ev: SpeechRecognitionErrorEventLocal
      ) => void)
    | null;
  onaudiostart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onaudioend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onsoundstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onsoundend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onspeechstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onspeechend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onnomatch: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
}

interface SpeechRecognitionCtor {
  new (): SpeechRecognitionInstance;
}

// ===== Public types =====

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface RecognizerOptions {
  /** BCP-47 language tag. Default: 'ar-SA' */
  language?: string;
  /** Keep recognising after each utterance. Default: true */
  continuous?: boolean;
  /** Deliver interim (non-final) results. Default: true */
  interimResults?: boolean;
  /** Called for every recognition result (interim and final). */
  onResult?: (result: RecognitionResult) => void;
  /** Called when an error occurs, with a user-friendly message. */
  onError?: (error: string) => void;
  /** Called when recognition ends (either normally or unexpectedly). */
  onEnd?: () => void;
  /** Called when recognition starts successfully. */
  onStart?: () => void;
}

// ===== User-friendly error messages =====

const ERROR_MESSAGES: Record<string, string> = {
  "no-speech":
    "No speech was detected. Please try again and speak clearly into your microphone.",
  "audio-capture":
    "No microphone was found. Please ensure a microphone is connected and permissions are granted.",
  "not-allowed":
    "Microphone access was denied. Please allow microphone permissions in your browser settings.",
  network:
    "A network error occurred during speech recognition. Please check your internet connection.",
  aborted: "Speech recognition was aborted.",
  "service-not-available":
    "Speech recognition service is not available. Please try again later.",
  "language-not-supported":
    "The selected language is not supported by your browser's speech recognition.",
};

function getUserFriendlyError(errorEvent: string): string {
  return (
    ERROR_MESSAGES[errorEvent] ??
    `Speech recognition error: ${errorEvent}. Please try again.`
  );
}

// ===== Internal helpers =====

/**
 * Retrieve the SpeechRecognition constructor from the browser, if available.
 * Returns undefined in SSR or unsupported browsers.
 */
function getSpeechRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return (win.SpeechRecognition || win.webkitSpeechRecognition) as
    | SpeechRecognitionCtor
    | undefined;
}

// ===== Constants =====

const MAX_AUTO_RESTART_RETRIES = 3;

// ===== ArabicSpeechRecognizer =====

export class ArabicSpeechRecognizer {
  private recognition: SpeechRecognitionInstance | null = null;
  private options: Required<
    Pick<RecognizerOptions, "language" | "continuous" | "interimResults">
  > &
    RecognizerOptions;
  private listening = false;
  private manualStop = false;
  private restartCount = 0;

  /**
   * Check whether the Web Speech API is available in the current browser.
   */
  static isSupported(): boolean {
    return !!getSpeechRecognitionCtor();
  }

  constructor(options: RecognizerOptions = {}) {
    this.options = {
      language: options.language ?? "ar-SA",
      continuous: options.continuous ?? true,
      interimResults: options.interimResults ?? true,
      onResult: options.onResult,
      onError: options.onError,
      onEnd: options.onEnd,
      onStart: options.onStart,
    };
  }

  /**
   * Start speech recognition.
   * If the Web Speech API is not supported, calls onError instead of throwing.
   */
  start(): void {
    if (!ArabicSpeechRecognizer.isSupported()) {
      this.options.onError?.(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    // If already listening, stop first to avoid duplicate sessions.
    if (this.listening && this.recognition) {
      this.recognition.stop();
    }

    this.manualStop = false;
    this.restartCount = 0;
    this.initRecognition();
    this.recognition!.start();
  }

  /**
   * Gracefully stop recognition (final results will still fire).
   */
  stop(): void {
    this.manualStop = true;
    if (this.recognition) {
      this.recognition.stop();
    }
    this.listening = false;
  }

  /**
   * Immediately abort recognition (no further results).
   */
  abort(): void {
    this.manualStop = true;
    if (this.recognition) {
      this.recognition.abort();
    }
    this.listening = false;
  }

  /**
   * Whether the recognizer is currently listening.
   */
  isListening(): boolean {
    return this.listening;
  }

  // ===== Private helpers =====

  private initRecognition(): void {
    const Ctor = getSpeechRecognitionCtor();

    if (!Ctor) {
      this.options.onError?.(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    this.recognition = new Ctor();
    this.recognition.lang = this.options.language;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;

    // Prefer a single best alternative to minimise noise.
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.listening = true;
      this.restartCount = 0;
      this.options.onStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEventLocal) => {
      if (!this.options.onResult) return;

      // Process only the latest result set.
      const lastIndex = event.results.length - 1;
      const result = event.results[lastIndex];
      if (!result || result.length === 0) return;

      const best = result[0];
      this.options.onResult({
        transcript: best.transcript,
        confidence: best.confidence,
        isFinal: result.isFinal,
      });
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEventLocal) => {
      const errorCode = event.error;

      // 'no-speech' and 'aborted' during a manual stop are expected and
      // should not be surfaced as errors.
      if (
        this.manualStop &&
        (errorCode === "no-speech" || errorCode === "aborted")
      ) {
        return;
      }

      this.options.onError?.(getUserFriendlyError(errorCode));

      // Fatal errors that should not trigger an auto-restart.
      const fatalErrors = new Set([
        "not-allowed",
        "audio-capture",
        "service-not-available",
        "language-not-supported",
      ]);

      if (fatalErrors.has(errorCode)) {
        this.listening = false;
      }
    };

    this.recognition.onend = () => {
      this.listening = false;

      // Auto-restart in continuous mode if the end was unexpected.
      if (
        !this.manualStop &&
        this.options.continuous &&
        this.restartCount < MAX_AUTO_RESTART_RETRIES
      ) {
        this.restartCount++;
        try {
          this.recognition!.start();
        } catch {
          // If restart fails, notify the caller that recognition has ended.
          this.options.onEnd?.();
        }
        return;
      }

      this.options.onEnd?.();
    };
  }
}
