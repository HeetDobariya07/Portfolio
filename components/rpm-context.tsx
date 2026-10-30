"use client";

import { animate, type MotionValue, useMotionValue, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/lib/content";
import { EngineSound, soundPref, useSoundPref } from "@/lib/engine-sound";

export const MAX_RPM = 8;
export const IDLE = 0.9;
const CRUISE = 3.6;
const PRIMED = 2.2;
const CRUISE_SPEED = 300; // px per second while test-driving (slow enough to read along)

/** off: needles at 0 · idle: running, scroll is the throttle · driving: test drive (auto-scroll). */
export type Engine = "off" | "idle" | "driving";

type Rpm = {
  rpm: MotionValue<number>;
  engine: Engine;
  /** Kept for consumers that only care whether the test drive is running. */
  touring: boolean;
  /** Raise the idle while the Engine Start button is hovered or focused (only when running). */
  prime: (on: boolean) => void;
  /** The power button: off → start + test drive; driving or idle → switch off. */
  pressPower: () => void;
  /** Optional engine sound: off by default, remembered per browser. */
  soundOn: boolean;
  toggleSound: () => void;
};

const RpmContext = createContext<Rpm | null>(null);

export function useRpm() {
  const ctx = use(RpmContext);
  if (!ctx) throw new Error("useRpm must be used inside <RpmProvider>");
  return ctx;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Shared engine state for the hero: the small rev meter and the large tachometer read the same
 * rpm. The engine starts off (needles at 0). The power button cranks it and starts a test drive,
 * i.e. cruise-control auto-scroll; taking over (scroll, swipe, key) leaves it idling, where scroll
 * speed works as the throttle; pressing the button again switches it off.
 */
export function RpmProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const rpm = useMotionValue(0);
  const [engine, setEngineState] = useState<Engine>("off");
  const engineRef = useRef<Engine>("off");
  const revving = useRef(false);
  const primed = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundOn = useSoundPref();
  const sound = useRef<EngineSound | null>(null);

  const setEngine = useCallback((next: Engine) => {
    engineRef.current = next;
    setEngineState(next);
  }, []);

  const rest = () => (primed.current ? PRIMED : IDLE);

  /** Throttle blip while idling. */
  const blip = useCallback(
    (amount: number) => {
      if (reduce || revving.current || engineRef.current !== "idle") return;
      animate(rpm, Math.min(rest() + amount, 6.5), { duration: 0.25, ease: "easeOut" });
      if (settle.current) clearTimeout(settle.current);
      settle.current = setTimeout(() => {
        if (engineRef.current === "idle") animate(rpm, rest(), { duration: 1.1, ease: "easeOut" });
      }, 180);
    },
    [reduce, rpm],
  );

  const prime = useCallback(
    (on: boolean) => {
      primed.current = on;
      if (reduce || revving.current || engineRef.current !== "idle") return;
      animate(rpm, on ? PRIMED : IDLE, { duration: 0.6, ease: "easeOut" });
    },
    [reduce, rpm],
  );

  // Scrolling is the throttle, but only while the engine is idling near the top of the page.
  useEffect(() => {
    if (reduce) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const speed = Math.abs(window.scrollY - lastY) / Math.max(now - lastT, 1); // px per ms
      lastY = window.scrollY;
      lastT = now;
      if (window.scrollY < window.innerHeight * 1.2 && speed > 0.15) blip(Math.min(speed * 1.8, 5));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [blip, reduce]);

  const switchOff = useCallback(() => {
    setEngine("off");
    revving.current = false;
    if (reduce) rpm.set(0);
    else animate(rpm, 0, { duration: 1.2, ease: "easeOut" });
  }, [reduce, rpm, setEngine]);

  /** The driver takes over (or the drive reaches the end): keep the engine running at idle. */
  const takeOver = useCallback(() => {
    if (engineRef.current !== "driving") return;
    setEngine("idle");
    if (reduce) rpm.set(IDLE);
    else animate(rpm, rest(), { duration: 1, ease: "easeOut" });
  }, [reduce, rpm, setEngine]);

  const startDrive = useCallback(async () => {
    setEngine("driving");

    if (reduce) {
      // No continuous motion: needles straight to cruise, then hop section to section.
      rpm.set(CRUISE);
      for (const s of sections) {
        if (engineRef.current !== "driving") return;
        document.getElementById(s.id)?.scrollIntoView({ behavior: "auto" });
        await wait(2600);
      }
      takeOver();
      return;
    }

    // Crank, catch, rev, then pull away and hold a steady cruise down the page.
    revving.current = true;
    await animate(rpm, [0, 1.3, 0.7, 1.6, 6.8, CRUISE], { duration: 1.6, times: [0, 0.12, 0.22, 0.34, 0.65, 1], ease: "easeInOut" });
    revving.current = false;
    if (engineRef.current !== "driving") return;

    let last = performance.now();
    const started = last;
    const step = (now: number) => {
      if (engineRef.current !== "driving") return;
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      // Ease in over the first second, like pulling away.
      const ramp = Math.min((now - started) / 1000, 1);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = Math.min(window.scrollY + CRUISE_SPEED * ramp * dt, max);
      window.scrollTo({ top: next, behavior: "instant" });
      rpm.set(CRUISE + Math.sin(now / 260) * 0.12);
      if (next >= max - 1) {
        takeOver();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [reduce, rpm, setEngine, takeOver]);

  const pressPower = useCallback(() => {
    // Create/resume the audio context inside the click, which iOS and Chrome's autoplay rules require.
    if (soundPref.get()) (sound.current ??= new EngineSound()).prepare();
    if (engineRef.current === "off") void startDrive();
    else switchOff();
  }, [startDrive, switchOff]);

  const toggleSound = useCallback(() => {
    const next = !soundPref.get();
    soundPref.set(next);
    if (next) (sound.current ??= new EngineSound()).prepare();
  }, []);

  // The note follows the rpm while the engine runs and the sound is on; it fades out otherwise,
  // and while the tab is hidden.
  const running = engine !== "off";
  useEffect(() => {
    if (!soundOn || !running) return;
    const s = (sound.current ??= new EngineSound());
    s.setRpm(rpm.get());
    s.start();
    const off = rpm.on("change", (v) => s.setRpm(v));
    const onVisibility = () => (document.hidden ? s.stop() : s.start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      off();
      document.removeEventListener("visibilitychange", onVisibility);
      s.stop();
    };
  }, [soundOn, running, rpm]);

  // Any manual input during a test drive hands the wheel back (engine keeps idling).
  useEffect(() => {
    if (engine !== "driving") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" && e.key !== "Enter" && e.key !== " ") takeOver();
    };
    window.addEventListener("wheel", takeOver, { passive: true });
    window.addEventListener("touchstart", takeOver, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("touchstart", takeOver);
      window.removeEventListener("keydown", onKey);
    };
  }, [engine, takeOver]);

  const value = useMemo(
    () => ({ rpm, engine, touring: engine === "driving", prime, pressPower, soundOn, toggleSound }),
    [rpm, engine, prime, pressPower, soundOn, toggleSound],
  );
  return <RpmContext value={value}>{children}</RpmContext>;
}
