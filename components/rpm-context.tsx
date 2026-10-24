"use client";

import { animate, type MotionValue, useMotionValue, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/lib/content";

export const MAX_RPM = 8;
export const IDLE = 0.9;
const CRUISE = 3.6;
const PRIMED = 2.2;
const CRUISE_SPEED = 300; // px per second while test-driving (slow enough to read along)

type Rpm = {
  rpm: MotionValue<number>;
  /** Short rev to near the redline and back to idle. */
  rev: () => void;
  /** Brief throttle blip. `amount` is extra rpm (x1000). */
  blip: (amount: number) => void;
  /** Raise the idle while the Engine Start button is hovered or focused. */
  prime: (on: boolean) => void;
  touring: boolean;
  toggleTour: () => void;
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
 * rpm. "Engine start" runs a test drive, i.e. cruise-control auto-scroll down the page, which any
 * user scroll, swipe or key press cancels.
 */
export function RpmProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const rpm = useMotionValue(reduce ? IDLE : 0);
  const [touring, setTouring] = useState(false);
  const tourRef = useRef(false);
  const revving = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rev = useCallback(() => {
    if (reduce) {
      rpm.set(IDLE);
      return;
    }
    revving.current = true;
    animate(rpm, [rpm.get(), 7.4, 6.2, 7.8, IDLE], { duration: 1.8, times: [0, 0.32, 0.45, 0.62, 1], ease: "easeInOut" }).then(
      () => {
        revving.current = false;
      },
    );
  }, [reduce, rpm]);

  const primed = useRef(false);
  const rest = () => (primed.current ? PRIMED : IDLE);

  const blip = useCallback(
    (amount: number) => {
      if (reduce || revving.current || tourRef.current) return;
      animate(rpm, Math.min(rest() + amount, 6.5), { duration: 0.25, ease: "easeOut" });
      if (settle.current) clearTimeout(settle.current);
      settle.current = setTimeout(() => animate(rpm, rest(), { duration: 1.1, ease: "easeOut" }), 180);
    },
    [reduce, rpm],
  );

  const prime = useCallback(
    (on: boolean) => {
      primed.current = on;
      if (reduce || revving.current || tourRef.current) return;
      animate(rpm, on ? PRIMED : IDLE, { duration: 0.6, ease: "easeOut" });
    },
    [reduce, rpm],
  );

  // Scrolling is the throttle: scroll speed near the top of the page pushes the needles up.
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

  const stopTour = useCallback(() => {
    if (!tourRef.current) return;
    tourRef.current = false;
    setTouring(false);
    if (!reduce) animate(rpm, IDLE, { duration: 1, ease: "easeOut" });
  }, [reduce, rpm]);

  const startTour = useCallback(async () => {
    tourRef.current = true;
    setTouring(true);

    if (reduce) {
      // No continuous motion: hop section to section.
      for (const s of sections) {
        if (!tourRef.current) return;
        document.getElementById(s.id)?.scrollIntoView({ behavior: "auto" });
        await wait(2600);
      }
      stopTour();
      return;
    }

    // Rev, then pull away and hold a steady cruise down the page.
    revving.current = true;
    await animate(rpm, [rpm.get(), 6.8, CRUISE], { duration: 1.1, times: [0, 0.45, 1], ease: "easeInOut" });
    revving.current = false;
    if (!tourRef.current) return;

    let last = performance.now();
    let started = last;
    const step = (now: number) => {
      if (!tourRef.current) return;
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      // Ease in over the first second, like pulling away.
      const ramp = Math.min((now - started) / 1000, 1);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = Math.min(window.scrollY + CRUISE_SPEED * ramp * dt, max);
      window.scrollTo({ top: next, behavior: "instant" });
      rpm.set(CRUISE + Math.sin(now / 260) * 0.12);
      if (next >= max - 1) {
        stopTour();
        return;
      }
      requestAnimationFrame(step);
    };
    started = performance.now();
    requestAnimationFrame(step);
  }, [reduce, rpm, stopTour]);

  const toggleTour = useCallback(() => {
    if (tourRef.current) stopTour();
    else void startTour();
  }, [startTour, stopTour]);

  // Any manual input takes back control.
  useEffect(() => {
    if (!touring) return;
    const cancel = () => stopTour();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" && e.key !== "Enter" && e.key !== " ") stopTour();
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", onKey);
    };
  }, [touring, stopTour]);

  // Rev once shortly after load.
  useEffect(() => {
    const t = setTimeout(rev, 500);
    return () => clearTimeout(t);
  }, [rev]);

  const value = useMemo(() => ({ rpm, rev, blip, prime, touring, toggleTour }), [rpm, rev, blip, prime, touring, toggleTour]);
  return <RpmContext value={value}>{children}</RpmContext>;
}
