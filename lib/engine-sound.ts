import { useSyncExternalStore } from "react";

/** Everything worth tuning by ear lives here. */
export const TUNING = {
  /** Output level at full revs, 0–1. Kept low: it is an easter egg, not an alarm. */
  master: 0.14,
  /** Share of master level at idle, so revving sounds louder than ticking over. */
  idleLevel: 0.6,
  /** Growl: how hard the waveform is pushed into the soft clipper (higher = gruffer). */
  drive: 2.4,
  /** Body filter: cutoff = base + perKrpm × rpm (in thousands), opening up as the revs climb. */
  bodyBase: 240,
  bodyPerKrpm: 330,
  /** Exhaust rasp: filtered noise that pulses once per cylinder firing. Level and band centre. */
  raspLevel: 0.5,
  raspBase: 180,
  raspPerKrpm: 230,
  /** Organic wander: random pitch (cents) and level drift, refreshed every `wanderMs`. */
  wanderCents: 14,
  wanderLevel: 0.1,
  wanderMs: 70,
  fadeIn: 0.25,
  fadeOut: 0.4,
};

/**
 * Engine orders of a cross-plane V8, as [order, level, phase]. An "order" is a multiple of the
 * crankshaft frequency. The four-per-revolution firing order (4) leads, with the 2nd and 6th/8th
 * alongside, and weaker 1st/3rd/5th that give the uneven, lumpy burble a cross-plane V8 has at idle
 * (its exhaust pulses alternate unevenly between the two banks).
 */
const ORDERS: [number, number, number][] = [
  [1, 0.2, 0.4],
  [2, 0.6, 1.9],
  [3, 0.16, 3.4],
  [4, 1.0, 0.0],
  [5, 0.22, 2.6],
  [6, 0.5, 4.1],
  [7, 0.12, 1.2],
  [8, 0.68, 0.7],
  [10, 0.26, 5.2],
  [12, 0.3, 2.2],
  [16, 0.2, 3.9],
  [20, 0.1, 0.9],
  [24, 0.07, 4.6],
];

const FIRINGS_PER_REV = 4; // V8, four-stroke

/** Soft-clip curve: drive pushes the waveform into tanh, adding the harmonic grit of a loud exhaust. */
function clipCurve(drive: number) {
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * drive) / Math.tanh(drive);
  }
  return curve;
}

type Nodes = {
  crank: OscillatorNode;
  pulse: OscillatorNode;
  noise: AudioBufferSourceNode;
  body: BiquadFilterNode;
  rasp: BiquadFilterNode;
  level: GainNode;
  gain: GainNode;
  wander: ReturnType<typeof setInterval>;
};

/**
 * A synthesised V8 (no audio files). Three layers, all driven by the same rpm (in thousands):
 *  1. the crank waveform: the engine orders above, as one periodic wave at the crank frequency,
 *     soft-clipped for growl and low-passed (the body);
 *  2. exhaust rasp: band-passed noise whose volume is chopped once per firing (the crackle on each pulse);
 *  3. slow random drift in pitch and level, so it never sounds like a steady tone.
 * The context is created in a user gesture (`prepare`), then `start`/`stop` fade it in and out.
 */
export class EngineSound {
  private ctx: AudioContext | null = null;
  private nodes: Nodes | null = null;
  private wave: PeriodicWave | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private rpm = 0;

  /** Call from a click handler: creates the context and resumes it (autoplay and iOS rules). */
  prepare() {
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === "suspended") void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  start() {
    this.prepare();
    const ctx = this.ctx;
    if (!ctx || this.nodes) return;

    if (!this.wave) {
      const real = new Float32Array(ORDERS[ORDERS.length - 1][0] + 1);
      const imag = new Float32Array(real.length);
      for (const [order, level, phase] of ORDERS) {
        real[order] = level * Math.sin(phase);
        imag[order] = level * Math.cos(phase);
      }
      this.wave = ctx.createPeriodicWave(real, imag);
    }
    if (!this.noiseBuf) {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    }

    // 1. crank waveform → soft clip → body low-pass
    const crank = ctx.createOscillator();
    crank.setPeriodicWave(this.wave);
    const shaper = ctx.createWaveShaper();
    shaper.curve = clipCurve(TUNING.drive);
    shaper.oversample = "2x";
    const body = ctx.createBiquadFilter();
    body.type = "lowpass";
    body.Q.value = 0.9;
    crank.connect(shaper).connect(body);

    // 2. exhaust rasp: noise → band-pass → level chopped by a sawtooth at the firing rate
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuf;
    noise.loop = true;
    const rasp = ctx.createBiquadFilter();
    rasp.type = "bandpass";
    rasp.Q.value = 0.8;
    const chop = ctx.createGain();
    chop.gain.value = 0.5;
    const pulse = ctx.createOscillator();
    pulse.type = "sawtooth";
    const depth = ctx.createGain();
    depth.gain.value = -0.5; // falling ramp: a sharp attack on each firing, then decay
    pulse.connect(depth).connect(chop.gain);
    const raspLevel = ctx.createGain();
    raspLevel.gain.value = TUNING.raspLevel;
    noise.connect(rasp).connect(chop).connect(raspLevel);

    // mix → level (wander) → master → compressor → out
    const mix = ctx.createGain();
    body.connect(mix);
    raspLevel.connect(mix);
    const level = ctx.createGain();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    mix.connect(level).connect(gain).connect(comp).connect(ctx.destination);

    crank.start();
    pulse.start();
    noise.start();

    const wander = setInterval(() => {
      const t = ctx.currentTime;
      const r = () => Math.random() * 2 - 1;
      crank.detune.setTargetAtTime(r() * TUNING.wanderCents, t, TUNING.wanderMs / 1000);
      level.gain.setTargetAtTime(1 + r() * TUNING.wanderLevel, t, TUNING.wanderMs / 1000);
    }, TUNING.wanderMs);

    this.nodes = { crank, pulse, noise, body, rasp, level, gain, wander };
    this.apply(TUNING.fadeIn);
  }

  /** Follow the engine: rpm in thousands (0–8). */
  setRpm(rpm: number) {
    this.rpm = rpm;
    this.apply(0.04);
  }

  private apply(glide: number) {
    const n = this.nodes;
    const ctx = this.ctx;
    if (!n || !ctx) return;
    const t = ctx.currentTime;
    const crankHz = (Math.max(this.rpm, 0.25) * 1000) / 60;
    n.crank.frequency.setTargetAtTime(crankHz, t, 0.03);
    n.pulse.frequency.setTargetAtTime(crankHz * FIRINGS_PER_REV, t, 0.03);
    n.body.frequency.setTargetAtTime(TUNING.bodyBase + TUNING.bodyPerKrpm * this.rpm, t, 0.05);
    n.rasp.frequency.setTargetAtTime(TUNING.raspBase + TUNING.raspPerKrpm * this.rpm, t, 0.05);
    const level = TUNING.master * (TUNING.idleLevel + (1 - TUNING.idleLevel) * Math.min(this.rpm / 6, 1));
    n.gain.gain.setTargetAtTime(level, t, glide);
  }

  /** Fade out, then stop and release the sources. The context is kept for the next start. */
  stop() {
    const n = this.nodes;
    const ctx = this.ctx;
    if (!n || !ctx) return;
    this.nodes = null;
    clearInterval(n.wander);
    const t = ctx.currentTime;
    n.gain.gain.cancelScheduledValues(t);
    n.gain.gain.setTargetAtTime(0, t, TUNING.fadeOut / 4);
    const end = t + TUNING.fadeOut + 0.1;
    n.crank.stop(end);
    n.pulse.stop(end);
    n.noise.stop(end);
    n.noise.onended = () => n.gain.disconnect();
  }
}

// Preference store: off by default, remembered per browser. Reads are guarded (private windows throw).
const KEY = "engine-sound";
const listeners = new Set<() => void>();
// Fallback for when storage is unavailable, so the toggle still flips within a page view.
let memory: boolean | null = null;

export const soundPref = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  get(): boolean {
    try {
      return localStorage.getItem(KEY) === "on";
    } catch {
      return false;
    }
  },
  set(on: boolean) {
    try {
      localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* not persisted; the toggle still works for this page view */
    }
    memory = on;
    for (const l of listeners) l();
  },
};

const read = () => (memory ?? soundPref.get());

export function useSoundPref(): boolean {
  return useSyncExternalStore(soundPref.subscribe, read, () => false);
}
