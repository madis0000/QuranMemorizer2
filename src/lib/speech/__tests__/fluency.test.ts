import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FluencyTracker } from "../fluency";

describe("FluencyTracker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns zeroed metrics with fewer than 2 words", () => {
    const tracker = new FluencyTracker();
    const metrics = tracker.getMetrics();
    expect(metrics.wordsPerMinute).toBe(0);
    expect(metrics.pauseCount).toBe(0);
    expect(metrics.averagePauseDuration).toBe(0);
    expect(metrics.longestPause).toBe(0);
    expect(metrics.fluencyScore).toBe(0);
  });

  it("returns zeroed metrics with exactly 1 word", () => {
    const tracker = new FluencyTracker();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    tracker.recordWordTimestamp("word1");

    const metrics = tracker.getMetrics();
    expect(metrics.wordsPerMinute).toBe(0);
    expect(metrics.fluencyScore).toBe(0);
  });

  it("calculates WPM correctly for known timing", () => {
    const tracker = new FluencyTracker();

    // Record 60 words over 60 seconds = 60 WPM
    const startTime = new Date("2025-01-01T00:00:00Z");
    vi.setSystemTime(startTime);

    for (let i = 0; i < 60; i++) {
      vi.setSystemTime(new Date(startTime.getTime() + i * 1000));
      tracker.recordWordTimestamp(`word${i}`);
    }

    const metrics = tracker.getMetrics();
    // 60 words in ~59 seconds should be approximately 60 WPM (slightly above)
    expect(metrics.wordsPerMinute).toBeGreaterThanOrEqual(58);
    expect(metrics.wordsPerMinute).toBeLessThanOrEqual(65);
  });

  it("detects pauses when gap exceeds threshold (1500ms default)", () => {
    const tracker = new FluencyTracker();
    const start = new Date("2025-01-01T00:00:00Z");

    // Word 1 at t=0
    vi.setSystemTime(start);
    tracker.recordWordTimestamp("word1");

    // Word 2 at t=500ms (no pause)
    vi.setSystemTime(new Date(start.getTime() + 500));
    tracker.recordWordTimestamp("word2");

    // Word 3 at t=2500ms (2000ms gap > 1500ms threshold = pause)
    vi.setSystemTime(new Date(start.getTime() + 2500));
    tracker.recordWordTimestamp("word3");

    const metrics = tracker.getMetrics();
    expect(metrics.pauseCount).toBe(1);
    expect(metrics.longestPause).toBe(2000);
    expect(metrics.averagePauseDuration).toBe(2000);
  });

  it("does not count gaps below threshold as pauses", () => {
    const tracker = new FluencyTracker();
    const start = new Date("2025-01-01T00:00:00Z");

    vi.setSystemTime(start);
    tracker.recordWordTimestamp("word1");

    // 1000ms gap is below 1500ms threshold
    vi.setSystemTime(new Date(start.getTime() + 1000));
    tracker.recordWordTimestamp("word2");

    // Another 1000ms gap
    vi.setSystemTime(new Date(start.getTime() + 2000));
    tracker.recordWordTimestamp("word3");

    const metrics = tracker.getMetrics();
    expect(metrics.pauseCount).toBe(0);
  });

  it("uses custom pause threshold", () => {
    const tracker = new FluencyTracker(500); // 500ms threshold
    const start = new Date("2025-01-01T00:00:00Z");

    vi.setSystemTime(start);
    tracker.recordWordTimestamp("word1");

    // 600ms gap exceeds 500ms threshold
    vi.setSystemTime(new Date(start.getTime() + 600));
    tracker.recordWordTimestamp("word2");

    const metrics = tracker.getMetrics();
    expect(metrics.pauseCount).toBe(1);
  });

  it("composite score is in 0-100 range", () => {
    const tracker = new FluencyTracker();
    const start = new Date("2025-01-01T00:00:00Z");

    // Simulate a reasonable recitation
    for (let i = 0; i < 20; i++) {
      vi.setSystemTime(new Date(start.getTime() + i * 1200));
      tracker.recordWordTimestamp(`word${i}`);
    }

    const metrics = tracker.getMetrics();
    expect(metrics.fluencyScore).toBeGreaterThanOrEqual(0);
    expect(metrics.fluencyScore).toBeLessThanOrEqual(100);
  });

  it("high-fluency recitation scores well", () => {
    const tracker = new FluencyTracker();
    const start = new Date("2025-01-01T00:00:00Z");

    // 50 WPM with no pauses (within 30-80 target range)
    // 50 words/min = 1 word per 1200ms
    for (let i = 0; i < 50; i++) {
      vi.setSystemTime(new Date(start.getTime() + i * 1200));
      tracker.recordWordTimestamp(`word${i}`);
    }

    const metrics = tracker.getMetrics();
    expect(metrics.pauseCount).toBe(0);
    expect(metrics.fluencyScore).toBeGreaterThanOrEqual(70);
  });

  it("reset clears all data", () => {
    const tracker = new FluencyTracker();
    const start = new Date("2025-01-01T00:00:00Z");

    vi.setSystemTime(start);
    tracker.recordWordTimestamp("word1");
    vi.setSystemTime(new Date(start.getTime() + 1000));
    tracker.recordWordTimestamp("word2");
    vi.setSystemTime(new Date(start.getTime() + 5000));
    tracker.recordWordTimestamp("word3");

    // Verify there is data
    let metrics = tracker.getMetrics();
    expect(metrics.wordsPerMinute).toBeGreaterThan(0);

    // Reset and verify
    tracker.reset();
    metrics = tracker.getMetrics();
    expect(metrics.wordsPerMinute).toBe(0);
    expect(metrics.pauseCount).toBe(0);
    expect(metrics.averagePauseDuration).toBe(0);
    expect(metrics.longestPause).toBe(0);
    expect(metrics.fluencyScore).toBe(0);
  });

  it("recordPause manually adds a pause", () => {
    const tracker = new FluencyTracker();
    const start = new Date("2025-01-01T00:00:00Z");

    vi.setSystemTime(start);
    tracker.recordWordTimestamp("word1");

    // Manually record a pause
    vi.setSystemTime(new Date(start.getTime() + 3000));
    tracker.recordPause();

    // Record another word
    vi.setSystemTime(new Date(start.getTime() + 4000));
    tracker.recordWordTimestamp("word2");

    const metrics = tracker.getMetrics();
    // Should have at least the manually recorded pause
    expect(metrics.pauseCount).toBeGreaterThanOrEqual(1);
  });

  it("handles multiple pauses and computes average correctly", () => {
    const tracker = new FluencyTracker();
    const start = new Date("2025-01-01T00:00:00Z");

    vi.setSystemTime(start);
    tracker.recordWordTimestamp("word1");

    // Pause 1: 2000ms gap
    vi.setSystemTime(new Date(start.getTime() + 2000));
    tracker.recordWordTimestamp("word2");

    // No pause: 500ms gap
    vi.setSystemTime(new Date(start.getTime() + 2500));
    tracker.recordWordTimestamp("word3");

    // Pause 2: 3000ms gap
    vi.setSystemTime(new Date(start.getTime() + 5500));
    tracker.recordWordTimestamp("word4");

    const metrics = tracker.getMetrics();
    expect(metrics.pauseCount).toBe(2);
    // Average of 2000 and 3000 = 2500
    expect(metrics.averagePauseDuration).toBe(2500);
    expect(metrics.longestPause).toBe(3000);
  });
});
