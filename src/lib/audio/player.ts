import { getAudioUrl, POPULAR_RECITERS } from "@/lib/quran/api";
import type { RepeatMode } from "@/stores/audioStore";

// ===== Types =====

export interface PlaylistItem {
  surah: number;
  ayah: number;
  url: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  currentSurah: number;
  currentAyah: number;
}

export type StateChangeCallback = (state: AudioPlayerState) => void;

// ===== Ayah counts per surah (1-indexed by surah number) =====

const AYAH_COUNTS: Record<number, number> = {
  1: 7,
  2: 286,
  3: 200,
  4: 176,
  5: 120,
  6: 165,
  7: 206,
  8: 75,
  9: 129,
  10: 109,
  11: 123,
  12: 111,
  13: 43,
  14: 52,
  15: 99,
  16: 128,
  17: 111,
  18: 110,
  19: 98,
  20: 135,
  21: 112,
  22: 78,
  23: 118,
  24: 64,
  25: 77,
  26: 227,
  27: 93,
  28: 88,
  29: 69,
  30: 60,
  31: 34,
  32: 30,
  33: 73,
  34: 54,
  35: 45,
  36: 83,
  37: 182,
  38: 88,
  39: 75,
  40: 85,
  41: 54,
  42: 53,
  43: 89,
  44: 59,
  45: 37,
  46: 35,
  47: 38,
  48: 29,
  49: 18,
  50: 45,
  51: 60,
  52: 49,
  53: 62,
  54: 55,
  55: 78,
  56: 96,
  57: 29,
  58: 22,
  59: 24,
  60: 13,
  61: 14,
  62: 11,
  63: 11,
  64: 18,
  65: 12,
  66: 12,
  67: 30,
  68: 52,
  69: 52,
  70: 44,
  71: 28,
  72: 28,
  73: 20,
  74: 56,
  75: 40,
  76: 31,
  77: 50,
  78: 40,
  79: 46,
  80: 42,
  81: 29,
  82: 19,
  83: 36,
  84: 25,
  85: 22,
  86: 17,
  87: 19,
  88: 26,
  89: 30,
  90: 20,
  91: 15,
  92: 21,
  93: 11,
  94: 8,
  95: 8,
  96: 19,
  97: 5,
  98: 8,
  99: 8,
  100: 11,
  101: 11,
  102: 8,
  103: 3,
  104: 9,
  105: 5,
  106: 4,
  107: 7,
  108: 3,
  109: 6,
  110: 3,
  111: 5,
  112: 4,
  113: 5,
  114: 6,
};

/**
 * Get the total number of ayahs in a surah.
 */
function getAyahCount(surahNumber: number): number {
  return AYAH_COUNTS[surahNumber] ?? 0;
}

// ===== AudioPlayer Class =====

/**
 * AudioPlayer wraps a single HTMLAudioElement and manages a playlist of
 * ayah audio URLs. It communicates state changes via a callback so that
 * external consumers (e.g. a Zustand store) can react to playback events.
 */
export class AudioPlayer {
  private audio: HTMLAudioElement;
  private playlist: PlaylistItem[];
  private currentIndex: number;
  private onStateChange: StateChangeCallback;
  private currentReciterId: string;
  private repeatMode: RepeatMode;
  private autoPlay: boolean;
  private preloadedAudio: HTMLAudioElement | null;
  private timeUpdateRAF: number | null;
  private destroyed: boolean;

  constructor(onStateChange: StateChangeCallback) {
    this.audio = new Audio();
    this.audio.preload = "auto";
    this.playlist = [];
    this.currentIndex = -1;
    this.onStateChange = onStateChange;
    this.currentReciterId = "";
    this.repeatMode = "none";
    this.autoPlay = true;
    this.preloadedAudio = null;
    this.timeUpdateRAF = null;
    this.destroyed = false;

    this.bindAudioEvents();
  }

  // ===== Event Binding =====

  private bindAudioEvents(): void {
    this.audio.addEventListener("loadstart", this.handleLoadStart);
    this.audio.addEventListener("canplay", this.handleCanPlay);
    this.audio.addEventListener("play", this.handlePlay);
    this.audio.addEventListener("pause", this.handlePause);
    this.audio.addEventListener("timeupdate", this.handleTimeUpdate);
    this.audio.addEventListener("ended", this.handleEnded);
    this.audio.addEventListener("error", this.handleError);
    this.audio.addEventListener("waiting", this.handleWaiting);
    this.audio.addEventListener("durationchange", this.handleDurationChange);
  }

  private unbindAudioEvents(): void {
    this.audio.removeEventListener("loadstart", this.handleLoadStart);
    this.audio.removeEventListener("canplay", this.handleCanPlay);
    this.audio.removeEventListener("play", this.handlePlay);
    this.audio.removeEventListener("pause", this.handlePause);
    this.audio.removeEventListener("timeupdate", this.handleTimeUpdate);
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("error", this.handleError);
    this.audio.removeEventListener("waiting", this.handleWaiting);
    this.audio.removeEventListener("durationchange", this.handleDurationChange);
  }

  // ===== Event Handlers =====

  private handleLoadStart = (): void => {
    this.emitState({ isLoading: true });
  };

  private handleCanPlay = (): void => {
    this.emitState({ isLoading: false });
  };

  private handlePlay = (): void => {
    this.emitState({ isPlaying: true, isLoading: false });
  };

  private handlePause = (): void => {
    this.emitState({ isPlaying: false });
  };

  private handleTimeUpdate = (): void => {
    // Throttle timeupdate emissions using the current values directly
    // instead of scheduling with rAF, to keep the store in sync.
    this.emitState({
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
    });
  };

  private handleDurationChange = (): void => {
    this.emitState({ duration: this.audio.duration || 0 });
  };

  private handleWaiting = (): void => {
    this.emitState({ isLoading: true });
  };

  private handleEnded = (): void => {
    this.handleTrackEnd();
  };

  private handleError = (): void => {
    const error = this.audio.error;
    console.error(
      "[AudioPlayer] Playback error:",
      error?.message ?? "Unknown error",
      `(code: ${error?.code})`
    );

    this.emitState({ isPlaying: false, isLoading: false });

    // On error, try to skip to the next track in the playlist
    if (this.hasNext()) {
      console.warn("[AudioPlayer] Skipping to next track after error.");
      this.next();
    }
  };

  // ===== State Emission =====

  private emitState(partial: Partial<AudioPlayerState>): void {
    if (this.destroyed) return;

    const currentItem = this.playlist[this.currentIndex];

    const state: AudioPlayerState = {
      isPlaying: !this.audio.paused && !this.audio.ended,
      isLoading:
        this.audio.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA &&
        !this.audio.paused,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      currentSurah: currentItem?.surah ?? 0,
      currentAyah: currentItem?.ayah ?? 0,
      ...partial,
    };

    this.onStateChange(state);
  }

  // ===== Playback =====

  /**
   * Play a single ayah. Builds a one-item playlist and starts playback.
   */
  async playAyah(
    reciterId: string,
    surahNumber: number,
    ayahNumber: number
  ): Promise<void> {
    this.currentReciterId = reciterId;
    const url = getAudioUrl(reciterId, surahNumber, ayahNumber);

    this.playlist = [{ surah: surahNumber, ayah: ayahNumber, url }];
    this.currentIndex = 0;

    await this.loadAndPlay(url);
  }

  /**
   * Play a range of ayahs. Builds a playlist from startAyah to endAyah
   * within the given surah.
   */
  async playRange(
    reciterId: string,
    surahNumber: number,
    startAyah: number,
    endAyah: number
  ): Promise<void> {
    this.currentReciterId = reciterId;

    // Build playlist
    this.playlist = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      const url = getAudioUrl(reciterId, surahNumber, ayah);
      this.playlist.push({ surah: surahNumber, ayah, url });
    }

    this.currentIndex = 0;

    if (this.playlist.length > 0) {
      await this.loadAndPlay(this.playlist[0].url);
    }
  }

  /**
   * Pause the current playback.
   */
  pause(): void {
    this.audio.pause();
  }

  /**
   * Resume playback if paused.
   */
  resume(): void {
    if (this.audio.src && this.audio.paused) {
      this.audio.play().catch((err) => {
        console.error("[AudioPlayer] Resume failed:", err);
      });
    }
  }

  /**
   * Stop playback completely, reset time, and clear the source.
   */
  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.removeAttribute("src");
    this.audio.load(); // Reset the element

    this.cancelPreload();
    this.playlist = [];
    this.currentIndex = -1;

    this.emitState({
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      currentSurah: 0,
      currentAyah: 0,
    });
  }

  // ===== Navigation =====

  /**
   * Play the next item in the playlist. If no next item, playback stops.
   */
  async next(): Promise<void> {
    if (!this.hasNext()) {
      this.emitState({ isPlaying: false });
      return;
    }

    this.currentIndex++;
    const item = this.playlist[this.currentIndex];
    await this.loadAndPlay(item.url);
  }

  /**
   * Play the previous item in the playlist. If at the start, restart current.
   */
  async previous(): Promise<void> {
    // If more than 3 seconds in, restart current track
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    if (this.currentIndex > 0) {
      this.currentIndex--;
      const item = this.playlist[this.currentIndex];
      await this.loadAndPlay(item.url);
    } else {
      // At the beginning, just restart
      this.audio.currentTime = 0;
    }
  }

  /**
   * Seek to a specific time (in seconds) within the current track.
   */
  seekTo(time: number): void {
    if (!isNaN(this.audio.duration) && this.audio.duration > 0) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
    }
  }

  // ===== Settings =====

  /**
   * Set volume (0 to 1).
   */
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set playback speed (0.5 to 2.0).
   */
  setPlaybackSpeed(speed: number): void {
    this.audio.playbackRate = Math.max(0.5, Math.min(2, speed));
  }

  /**
   * Mute or unmute the audio.
   */
  setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  /**
   * Update the repeat mode. This affects behavior when a track ends.
   */
  setRepeatMode(mode: RepeatMode): void {
    this.repeatMode = mode;
  }

  /**
   * Update the auto-play setting. When true, playback continues to the
   * next ayah after the current track finishes (in "none" repeat mode).
   */
  setAutoPlay(autoPlay: boolean): void {
    this.autoPlay = autoPlay;
  }

  // ===== Getters =====

  /**
   * Returns true if there is a next item in the playlist.
   */
  hasNext(): boolean {
    return this.currentIndex < this.playlist.length - 1;
  }

  /**
   * Returns true if there is a previous item in the playlist.
   */
  hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Returns the current playlist.
   */
  getPlaylist(): PlaylistItem[] {
    return [...this.playlist];
  }

  /**
   * Returns the current playlist index.
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  // ===== Cleanup =====

  /**
   * Destroy the player, unbinding all events and releasing resources.
   * After calling destroy(), the instance should not be reused.
   */
  destroy(): void {
    this.destroyed = true;
    this.stop();
    this.unbindAudioEvents();
    this.cancelPreload();

    if (this.timeUpdateRAF !== null) {
      cancelAnimationFrame(this.timeUpdateRAF);
      this.timeUpdateRAF = null;
    }
  }

  // ===== Internal Helpers =====

  /**
   * Load a URL into the audio element and start playback.
   */
  private async loadAndPlay(url: string): Promise<void> {
    this.emitState({
      isLoading: true,
      currentSurah: this.playlist[this.currentIndex]?.surah ?? 0,
      currentAyah: this.playlist[this.currentIndex]?.ayah ?? 0,
    });

    this.audio.src = url;
    this.audio.load();

    try {
      await this.audio.play();
    } catch (err) {
      // AbortError can happen when play() is interrupted by a new load.
      // NotAllowedError happens when autoplay is blocked by the browser.
      if (err instanceof DOMException && err.name === "AbortError") {
        // Ignored: this is a normal interruption from a new load call.
        return;
      }
      console.error("[AudioPlayer] Play failed:", err);
      this.emitState({ isPlaying: false, isLoading: false });
    }

    // Preload the next track in the playlist
    this.preloadNext();
  }

  /**
   * Preload the next audio track by creating a temporary Audio object.
   * This warms the browser cache so that transitioning is seamless.
   */
  private preloadNext(): void {
    this.cancelPreload();

    if (!this.hasNext()) return;

    const nextItem = this.playlist[this.currentIndex + 1];
    if (!nextItem) return;

    this.preloadedAudio = new Audio();
    this.preloadedAudio.preload = "auto";
    this.preloadedAudio.src = nextItem.url;
    // The browser will start fetching. We don't need to call load() or play().
  }

  /**
   * Cancel any in-progress preload.
   */
  private cancelPreload(): void {
    if (this.preloadedAudio) {
      this.preloadedAudio.removeAttribute("src");
      this.preloadedAudio.load();
      this.preloadedAudio = null;
    }
  }

  /**
   * Handle the end of a track, respecting repeat mode and autoPlay.
   */
  private handleTrackEnd(): void {
    const currentItem = this.playlist[this.currentIndex];

    switch (this.repeatMode) {
      case "ayah": {
        // Replay the same ayah
        this.audio.currentTime = 0;
        this.audio.play().catch((err) => {
          console.error("[AudioPlayer] Repeat-ayah play failed:", err);
        });
        break;
      }

      case "surah":
      case "page": {
        // Loop through the entire playlist, wrapping around
        if (this.hasNext()) {
          this.next();
        } else {
          // Restart from the beginning of the playlist
          this.currentIndex = 0;
          const firstItem = this.playlist[0];
          if (firstItem) {
            this.loadAndPlay(firstItem.url);
          }
        }
        break;
      }

      case "none":
      default: {
        if (this.hasNext() && this.autoPlay) {
          this.next();
        } else {
          // Playback finished
          this.emitState({ isPlaying: false, currentTime: 0 });
        }
        break;
      }
    }
  }
}

// ===== Singleton =====

let playerInstance: AudioPlayer | null = null;

/**
 * Get or create the singleton AudioPlayer instance.
 * Pass a StateChangeCallback that will receive all playback state updates.
 */
export function getAudioPlayer(
  onStateChange: StateChangeCallback
): AudioPlayer {
  if (!playerInstance) {
    playerInstance = new AudioPlayer(onStateChange);
  }
  return playerInstance;
}

/**
 * Destroy the singleton AudioPlayer instance and release its resources.
 */
export function destroyAudioPlayer(): void {
  if (playerInstance) {
    playerInstance.destroy();
    playerInstance = null;
  }
}
