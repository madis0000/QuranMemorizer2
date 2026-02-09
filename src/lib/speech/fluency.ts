// ===== Fluency Metrics Engine =====
// Tracks word timing during Quran recitation and computes fluency metrics
// including words-per-minute, pause detection, and a composite score.

// ===== Public types =====

export interface FluencyMetrics {
  /** Words recited per minute. */
  wordsPerMinute: number;
  /** Total number of pauses detected (gaps > pauseThresholdMs). */
  pauseCount: number;
  /** Average duration of detected pauses in milliseconds. */
  averagePauseDuration: number;
  /** Duration of the longest pause in milliseconds. */
  longestPause: number;
  /** Composite fluency score from 0 to 100. */
  fluencyScore: number;
}

// ===== Internal types =====

interface WordTimestamp {
  word: string;
  time: number; // Date.now() when the word was recorded
}

// ===== Constants =====

/** A gap longer than this (ms) between consecutive words counts as a pause. */
const DEFAULT_PAUSE_THRESHOLD_MS = 1500;

/**
 * Weights used for the composite fluency score.
 * The score is a weighted average of sub-scores (each 0--100).
 */
const SCORE_WEIGHTS = {
  wpm: 0.4,
  pauseFrequency: 0.3,
  pauseDuration: 0.3,
} as const;

/** Target WPM range for Quran recitation (Tarteel/moderate pace). */
const TARGET_WPM_MIN = 30;
const TARGET_WPM_MAX = 80;

// ===== FluencyTracker =====

export class FluencyTracker {
  private timestamps: WordTimestamp[] = [];
  private pauses: number[] = []; // durations in ms
  private pauseThresholdMs: number;
  private lastWordTime: number | null = null;

  constructor(pauseThresholdMs: number = DEFAULT_PAUSE_THRESHOLD_MS) {
    this.pauseThresholdMs = pauseThresholdMs;
  }

  /**
   * Record the timestamp of a recognised word.
   * This should be called each time the speech engine produces a new word.
   */
  recordWordTimestamp(word: string): void {
    const now = Date.now();

    // Detect pause since the previous word
    if (this.lastWordTime !== null) {
      const gap = now - this.lastWordTime;
      if (gap >= this.pauseThresholdMs) {
        this.pauses.push(gap);
      }
    }

    this.timestamps.push({ word, time: now });
    this.lastWordTime = now;
  }

  /**
   * Manually record a pause. Useful when the engine detects silence
   * without producing a word event.
   */
  recordPause(): void {
    const now = Date.now();
    if (this.lastWordTime !== null) {
      const gap = now - this.lastWordTime;
      this.pauses.push(gap);
    }
    this.lastWordTime = now;
  }

  /**
   * Compute the current fluency metrics based on recorded data.
   * Returns zeroed metrics if fewer than two words have been recorded.
   */
  getMetrics(): FluencyMetrics {
    if (this.timestamps.length < 2) {
      return {
        wordsPerMinute: 0,
        pauseCount: this.pauses.length,
        averagePauseDuration: 0,
        longestPause: this.pauses.length > 0 ? Math.max(...this.pauses) : 0,
        fluencyScore: 0,
      };
    }

    const firstTime = this.timestamps[0].time;
    const lastTime = this.timestamps[this.timestamps.length - 1].time;
    const totalDurationMs = lastTime - firstTime;

    // Words per minute
    const totalDurationMinutes = totalDurationMs / 60_000;
    const wordCount = this.timestamps.length;
    const wpm = totalDurationMinutes > 0 ? wordCount / totalDurationMinutes : 0;

    // Pause statistics
    const pauseCount = this.pauses.length;
    const avgPause =
      pauseCount > 0 ? this.pauses.reduce((a, b) => a + b, 0) / pauseCount : 0;
    const longestPause = pauseCount > 0 ? Math.max(...this.pauses) : 0;

    // Composite score
    const fluencyScore = this.computeCompositeScore(
      wpm,
      pauseCount,
      avgPause,
      wordCount
    );

    return {
      wordsPerMinute: Math.round(wpm),
      pauseCount,
      averagePauseDuration: Math.round(avgPause),
      longestPause: Math.round(longestPause),
      fluencyScore: Math.round(fluencyScore),
    };
  }

  /**
   * Reset all tracked data, preparing for a new session.
   */
  reset(): void {
    this.timestamps = [];
    this.pauses = [];
    this.lastWordTime = null;
  }

  // ===== Private helpers =====

  /**
   * Compute a composite fluency score (0--100) from the sub-metrics.
   *
   * Sub-scores:
   *  - WPM score: peaks at TARGET_WPM range, drops off linearly outside.
   *  - Pause frequency score: fewer pauses per word is better.
   *  - Pause duration score: shorter average pause is better.
   */
  private computeCompositeScore(
    wpm: number,
    pauseCount: number,
    avgPauseDuration: number,
    wordCount: number
  ): number {
    // --- WPM sub-score ---
    let wpmScore: number;
    if (wpm >= TARGET_WPM_MIN && wpm <= TARGET_WPM_MAX) {
      wpmScore = 100;
    } else if (wpm < TARGET_WPM_MIN) {
      // Linear ramp from 0 to 100 as wpm goes from 0 to TARGET_WPM_MIN
      wpmScore = Math.max(0, (wpm / TARGET_WPM_MIN) * 100);
    } else {
      // Above the target range – slight penalty
      const excess = wpm - TARGET_WPM_MAX;
      wpmScore = Math.max(0, 100 - excess * 0.5);
    }

    // --- Pause frequency sub-score ---
    // Ideal: 0 pauses per word. Each pause per word reduces the score.
    const pausesPerWord = wordCount > 0 ? pauseCount / wordCount : 0;
    // At 0.5 pauses/word the score is 0
    const pauseFreqScore = Math.max(0, 100 - pausesPerWord * 200);

    // --- Pause duration sub-score ---
    // Ideal: 0ms average pause. At 5000ms the score is 0.
    const pauseDurScore =
      pauseCount > 0 ? Math.max(0, 100 - (avgPauseDuration / 5000) * 100) : 100;

    // Weighted composite
    return (
      wpmScore * SCORE_WEIGHTS.wpm +
      pauseFreqScore * SCORE_WEIGHTS.pauseFrequency +
      pauseDurScore * SCORE_WEIGHTS.pauseDuration
    );
  }
}
