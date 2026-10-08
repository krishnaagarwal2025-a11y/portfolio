// Web Audio API retro sound synthesis for KrishnaOS
// Zero external audio files required, instant playback, mute-toggleable.

let ctx: AudioContext | null = null;
let enabled = true;

export const setSoundEnabled = (v: boolean) => {
  enabled = v;
};

export const isSoundEnabled = () => enabled;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();
    }
  }
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function beep(freq = 520, dur = 0.04, type: OscillatorType = "square") {
  if (!enabled) return;
  try {
    const c = getContext();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(0.03, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start();
    osc.stop(c.currentTime + dur);
  } catch {
    // audio context unsupported or blocked
  }
}

export function playWindowOpen() {
  if (!enabled) return;
  try {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    [
      { f: 440, delay: 0, dur: 0.05 },
      { f: 660, delay: 0.04, dur: 0.07 },
    ].forEach(({ f, delay, dur }) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, t + delay);
      gain.gain.setValueAtTime(0.03, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t + delay);
      osc.stop(t + delay + dur);
    });
  } catch {
    // ignore
  }
}

export function playWindowClose() {
  if (!enabled) return;
  try {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    [
      { f: 550, delay: 0, dur: 0.05 },
      { f: 330, delay: 0.04, dur: 0.07 },
    ].forEach(({ f, delay, dur }) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, t + delay);
      gain.gain.setValueAtTime(0.025, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t + delay);
      osc.stop(t + delay + dur);
    });
  } catch {
    // ignore
  }
}

export function playStartupChime() {
  if (!enabled) return;
  try {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    const notes = [
      { f: 392.0, d: 0.0, len: 0.15 }, // G4
      { f: 523.25, d: 0.12, len: 0.18 }, // C5
      { f: 659.25, d: 0.24, len: 0.22 }, // E5
      { f: 783.99, d: 0.38, len: 0.35 }, // G5
    ];
    notes.forEach(({ f, d, len }) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + d);
      gain.gain.setValueAtTime(0.04, t + d);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + d + len);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t + d);
      osc.stop(t + d + len);
    });
  } catch {
    // ignore
  }
}

export function playActionClick() {
  beep(800, 0.02, "square");
}

export function playErrorBeep() {
  beep(220, 0.12, "sawtooth");
}
