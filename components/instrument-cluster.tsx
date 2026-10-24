"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dial as DialData } from "@/lib/content";
import { cn } from "@/lib/utils";
import { dialAngle, TACH, TachFace } from "./tach-face";

/** One About-section gauge, drawn with the same face as the hero tachometer. */
function Dial({ dial, on, reduce }: { dial: DialData; on: boolean; reduce: boolean }) {
  const angle = on || reduce ? dialAngle(dial.reading, dial.min, dial.max) : TACH.START;

  return (
    <figure>
      <TachFace
        className="w-full"
        min={dial.min}
        max={dial.max}
        labelStep={dial.labelStep}
        redline={dial.redline}
        needleStyle={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${TACH.C}px ${TACH.C}px`,
          transformBox: "view-box",
          transition: reduce ? "none" : "transform 1.8s cubic-bezier(0.34, 1.35, 0.64, 1) 250ms",
        }}
        caption={
          <>
            <text x={TACH.C} y={TACH.C + 82} textAnchor="middle" fill="var(--color-fg)" className="font-sans text-[56px] font-semibold">
              {dial.value}
              <tspan fill="var(--color-fg)" fillOpacity="0.5" className="font-mono text-[20px] font-normal">
                {" "}
                {dial.unit}
              </tspan>
            </text>
            <text x={TACH.C} y={TACH.C + 122} textAnchor="middle" fill="var(--color-fg)" fillOpacity="0.45" className="font-mono text-[16px] tracking-[0.3em]">
              {dial.label.toUpperCase()}
            </text>
          </>
        }
      />
    </figure>
  );
}

/** Centre display that cycles through short readouts, like a trip computer. */
function TripComputer({ readouts, on, reduce }: { readouts: readonly { tag: string; text: string }[]; on: boolean; reduce: boolean }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!on || reduce || paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % readouts.length), 3200);
    return () => clearInterval(id);
  }, [on, reduce, paused, readouts.length]);

  const current = readouts[i];

  return (
    <div
      className="rounded-2xl border border-line bg-screen-deep p-4 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full list for assistive tech; the animated display is visual only. */}
      <ul className="sr-only">
        {readouts.map((r) => (
          <li key={r.tag}>
            {r.tag}: {r.text}
          </li>
        ))}
      </ul>

      <div aria-hidden className="relative h-11 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.tag}
            initial={reduce ? false : { y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -18, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <p className="font-mono text-[10px] tracking-[0.25em] text-brand">{current.tag}</p>
            <p className="mt-1 truncate font-mono text-sm text-fg">{current.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex gap-1.5">
        {readouts.map((r, n) => (
          <button
            key={r.tag}
            type="button"
            onClick={() => {
              setI(n);
              setPaused(true);
            }}
            aria-label={`Show ${r.tag}`}
            aria-pressed={n === i}
            className={cn("h-1.5 rounded-full transition-all duration-300", n === i ? "w-6 bg-brand" : "w-1.5 bg-fg/25 hover:bg-fg/50")}
          />
        ))}
      </div>
    </div>
  );
}

/** About-section instrument cluster: two dials and a trip-computer display. */
export function InstrumentCluster({ dials, readouts }: { dials: DialData[]; readouts: readonly { tag: string; text: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion() ?? false;

  return (
    <div
      ref={ref}
      className="relative self-start overflow-hidden rounded-[2rem] border border-line bg-gradient-to-b from-surface to-panel p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] md:p-6"
    >
      <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative grid grid-cols-2 gap-3">
        {dials.map((d) => (
          <Dial key={d.label} dial={d} on={on} reduce={reduce} />
        ))}
      </div>
      {/* Screen-reader summary of the dials. */}
      <p className="sr-only">{dials.map((d) => `${d.label}: ${d.value} ${d.unit}`).join(". ")}</p>
      <div className="relative mt-4">
        <TripComputer readouts={readouts} on={on} reduce={reduce} />
      </div>
    </div>
  );
}
