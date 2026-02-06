// ===== Types =====

export type RecorderState = "inactive" | "recording" | "paused";

// Preferred MIME types in order of preference.
// WebM with Opus is the best option for modern browsers. OGG is a fallback
// for Firefox. MP4 is the fallback for Safari.
const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/mp4",
];

/**
 * Determine the best supported MIME type for recording on this browser.
 * Returns undefined if none of the preferred types are supported (the
 * browser will then use its default).
 */
function getSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;

  for (const mimeType of PREFERRED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return undefined;
}

// ===== AudioRecorder Class =====

/**
 * AudioRecorder wraps the MediaRecorder API to provide a simple interface
 * for recording audio from the user's microphone. It handles permission
 * requests, chunk collection, and cleanup of media streams.
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null;
  private chunks: Blob[];
  private stream: MediaStream | null;
  private mimeType: string | undefined;

  constructor() {
    this.mediaRecorder = null;
    this.chunks = [];
    this.stream = null;
    this.mimeType = undefined;
  }

  // ===== Static Methods =====

  /**
   * Check whether the current browser supports audio recording.
   * Requires both getUserMedia and MediaRecorder.
   */
  static isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      typeof navigator.mediaDevices !== "undefined" &&
      typeof navigator.mediaDevices.getUserMedia === "function" &&
      typeof MediaRecorder !== "undefined"
    );
  }

  // ===== Recording Lifecycle =====

  /**
   * Request microphone permission and start recording. Throws if the user
   * denies permission or the browser does not support recording.
   */
  async start(): Promise<void> {
    if (!AudioRecorder.isSupported()) {
      throw new Error(
        "Audio recording is not supported in this browser. " +
          "Please use a modern browser such as Chrome, Firefox, or Safari."
      );
    }

    // If there is already an active recording, stop it first
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.cancel();
    }

    // Request microphone access
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err) {
      if (err instanceof DOMException) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          throw new Error(
            "Microphone access was denied. Please grant microphone " +
              "permission in your browser settings and try again."
          );
        }
        if (err.name === "NotFoundError") {
          throw new Error(
            "No microphone found. Please connect a microphone and try again."
          );
        }
      }
      throw err;
    }

    // Determine MIME type
    this.mimeType = getSupportedMimeType();
    this.chunks = [];

    // Create MediaRecorder
    const options: MediaRecorderOptions = {};
    if (this.mimeType) {
      options.mimeType = this.mimeType;
    }

    this.mediaRecorder = new MediaRecorder(this.stream, options);

    // Collect data chunks as they become available
    this.mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });

    // Start recording. Request data every 250ms so we get frequent chunks
    // for a smoother stop experience.
    this.mediaRecorder.start(250);
  }

  /**
   * Stop recording and return the recorded audio as a single Blob.
   * The returned Blob uses the best available MIME type.
   */
  async stop(): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        reject(new Error("No active recording to stop."));
        return;
      }

      // Listen for the final stop event to combine all chunks
      this.mediaRecorder.addEventListener(
        "stop",
        () => {
          const blobType = this.mimeType ?? "audio/webm";
          const blob = new Blob(this.chunks, { type: blobType });
          this.chunks = [];
          this.releaseStream();
          resolve(blob);
        },
        { once: true }
      );

      this.mediaRecorder.addEventListener(
        "error",
        (event) => {
          this.chunks = [];
          this.releaseStream();
          reject(
            new Error(
              `Recording error: ${(event as ErrorEvent).message ?? "Unknown error"}`
            )
          );
        },
        { once: true }
      );

      this.mediaRecorder.stop();
    });
  }

  /**
   * Pause the current recording. Does nothing if not recording.
   */
  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
    }
  }

  /**
   * Resume a paused recording. Does nothing if not paused.
   */
  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
    }
  }

  /**
   * Cancel the current recording, discarding all data and releasing the
   * microphone. Does nothing if not recording.
   */
  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    this.chunks = [];
    this.releaseStream();
    this.mediaRecorder = null;
  }

  // ===== State Inspection =====

  /**
   * Returns true if the recorder is currently recording (not paused).
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  /**
   * Returns the current state of the recorder.
   */
  getState(): RecorderState {
    if (!this.mediaRecorder) return "inactive";
    return this.mediaRecorder.state as RecorderState;
  }

  // ===== Cleanup =====

  /**
   * Release the microphone stream by stopping all tracks.
   */
  private releaseStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }
  }

  /**
   * Fully destroy the recorder, releasing all resources. After calling
   * this, the instance can still be reused by calling start() again.
   */
  destroy(): void {
    this.cancel();
  }
}
