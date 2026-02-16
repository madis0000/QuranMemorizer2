/**
 * Web Audio API tone generator for session micro-feedback.
 * No audio files — everything is synthesized on the fly.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx || ctx.state === "closed") {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function playTone(
  freq: number,
  type: OscillatorType,
  durationMs: number,
  volume = 0.15
) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ac.currentTime + durationMs / 1000
    );
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + durationMs / 1000);
  } catch {
    // AudioContext not available (SSR, unsupported browser)
  }
}

/** Soft ascending chime — correct ayah */
export function playCorrect() {
  playTone(880, "sine", 120, 0.12);
}

/** Low buzz — mistake detected */
export function playMistake() {
  playTone(220, "sawtooth", 150, 0.08);
}

/** Ascending pitch based on combo count */
export function playComboUp(combo: number) {
  const baseFreq = 440 + combo * 40; // rises with combo
  playTone(Math.min(baseFreq, 1200), "sine", 100, 0.1);
}

/** Quick descending tone — combo broken */
export function playComboBreak() {
  playTone(330, "triangle", 200, 0.08);
}

/** Victory melody: C5-E5-G5-C6 */
export function playSessionComplete() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, "sine", 250, 0.12), i * 200);
  });
}
