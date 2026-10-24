"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Stat } from "@/lib/content";

// Dial geometry: a 240° sweep, from -120° (min) to +120° (max).
const SWEEP = 240;
const START = -120;
const R = 52;
const C = 60;
const TICK_COUNT = 13;

function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
}

function arc(from: number, to: number, radius: number) {
  const s = polar(from, radius);
  const e = polar(to, radius);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
}

const TRACK = arc(START, START + SWEEP, R);
const REDLINE = arc(START + SWEEP * 0.85, START + SWEEP, R);
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const angle = START + (SWEEP / (TICK_COUNT - 1)) * i;
  const major = i % 3 === 0;
  return { angle, a: polar(angle, R - 6), b: polar(angle, R - (major ? 13 : 9)), major };
});

/** Speedometer-style stat. The needle sweeps to its value the first time it scrolls into view. */
export function Gauge({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const target = START + SWEEP * Math.min(Math.max(stat.needle, 0), 1);
  const shown = reduce || inView ? target : START;

  return (
    <figure ref={ref} className="rounded-2xl border border-line bg-surface p-5">
      <svg viewBox="0 0 120 104" className="mx-auto w-full max-w-[180px]" aria-hidden>
        <path d={TRACK} fill="none" stroke="var(--color-line)" strokeWidth="3" strokeLinecap="round" />
        <path d={REDLINE} fill="none" stroke="var(--color-brand)" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
        {TICKS.map((t) => (
          <line
            key={t.angle}
            x1={t.a.x}
            y1={t.a.y}
            x2={t.b.x}
            y2={t.b.y}
            stroke="var(--color-muted-foreground)"
            strokeOpacity={t.major ? 0.9 : 0.45}
            strokeWidth={t.major ? 1.5 : 1}
          />
        ))}
        <g
          style={{
            transform: `rotate(${shown}deg)`,
            transformOrigin: `${C}px ${C}px`,
            transformBox: "view-box",
            // Slight overshoot, like a needle settling.
            transition: reduce ? "none" : "transform 1.4s cubic-bezier(0.34, 1.45, 0.64, 1) 150ms",
          }}
        >
          <line x1={C} y1={C + 6} x2={C} y2={C - R + 12} stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle cx={C} cy={C} r="5" fill="var(--color-surface-2)" stroke="var(--color-brand)" strokeWidth="1.5" />
      </svg>
      <figcaption className="-mt-2 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
          {stat.value}
          {stat.unit ? <span className="ml-1 font-mono text-xs font-normal text-muted-foreground">{stat.unit}</span> : null}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.caption}</p>
      </figcaption>
    </figure>
  );
}
