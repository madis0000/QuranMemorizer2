/**
 * Whisper API fallback for speech recognition.
 * Sends recorded audio to the server for transcription
 * using the tarteel-ai/whisper-base-ar-quran model.
 */

interface WhisperResult {
  text: string;
  confidence: number;
  segments?: { start: number; end: number; text: string }[];
}

interface WhisperOptions {
  onProgress?: (progress: number) => void;
}

export async function transcribeWithWhisper(
  audioBlob: Blob,
  options: WhisperOptions = {}
): Promise<WhisperResult> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch("/api/recitation/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Transcription failed" }));
    throw new Error(error.error || "Transcription failed");
  }

  return response.json();
}

/**
 * Check if the browser's Web Speech API supports Arabic.
 * If not, we should use Whisper as the primary recognizer.
 */
export function shouldUseWhisper(): boolean {
  if (typeof window === "undefined") return true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as Record<string, any>;
  const SpeechRecognition =
    win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRecognition) return true;

  // Some browsers support SpeechRecognition but not Arabic well.
  // We can detect this by checking the user agent.
  const ua = navigator.userAgent;
  const isChrome = ua.includes("Chrome") && !ua.includes("Edg");
  const isEdge = ua.includes("Edg");

  // Chrome and Edge generally have good Arabic support
  if (isChrome || isEdge) return false;

  // For other browsers (Firefox, Safari), prefer Whisper
  return true;
}

/**
 * Create a Blob from MediaRecorder chunks suitable for Whisper API.
 */
export function createAudioBlob(chunks: Blob[]): Blob {
  // Determine the best available mime type
  const mimeType = getSupportedMimeType();
  return new Blob(chunks, { type: mimeType });
}

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "audio/webm";

  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }

  return "audio/webm";
}
