"use client";

import { useCallback, useRef } from "react";

import {
  playComboBreak,
  playComboUp,
  playCorrect,
  playMistake,
  playSessionComplete,
} from "../_lib/session-sounds";

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/**
 * Hook providing haptic + audio micro-feedback for memorization sessions.
 * All methods are stable (no deps change), safe to call from effects.
 */
export function useHapticFeedback() {
  const enabledRef = useRef(true);

  const onCorrectAyah = useCallback(() => {
    if (!enabledRef.current) return;
    vibrate(50);
    playCorrect();
  }, []);

  const onMistake = useCallback(() => {
    if (!enabledRef.current) return;
    vibrate([30, 30, 30]);
    playMistake();
  }, []);

  const onComboUp = useCallback((combo: number) => {
    if (!enabledRef.current) return;
    vibrate(30);
    playComboUp(combo);
  }, []);

  const onComboBreak = useCallback(() => {
    if (!enabledRef.current) return;
    vibrate([50, 50]);
    playComboBreak();
  }, []);

  const onSessionComplete = useCallback(() => {
    if (!enabledRef.current) return;
    vibrate([100, 50, 100, 50, 200]);
    playSessionComplete();
  }, []);

  const setEnabled = useCallback((on: boolean) => {
    enabledRef.current = on;
  }, []);

  return {
    onCorrectAyah,
    onMistake,
    onComboUp,
    onComboBreak,
    onSessionComplete,
    setEnabled,
  };
}
