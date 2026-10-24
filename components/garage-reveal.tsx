"use client";

import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Group = { group: string; items: string[] };

/** One skill group as a tool board hanging on the pegboard. Fades in as the shutter clears it. */
function Board({ group, index, progress, reduce }: { group: Group; index: number; progress: MotionValue<number>; reduce: boolean }) {
  const start = 0.4 + index * 0.06;
  const opacity = useTransform(progress, [start, start + 0.25], [0, 1]);
  const y = useTransform(progress, [start, start + 0.25], [14, 0]);

  return (
    <motion.div
      style={reduce ? undefined : { opacity, y }}
      className="relative rounded-2xl border border-line bg-surface-2/95 p-5 pt-6 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(244,245,247,0.05)]"
    >
      {/* hanging hooks */}
      {["left-6", "right-6"].map((pos) => (
        <span key={pos} aria-hidden className={cn("absolute -top-2 h-4 w-1.5 rounded-full bg-gradient-to-b from-fg/50 to-fg/15", pos)} />
      ))}
      <h3 className="mb-3 font-mono text-xs font-normal uppercase tracking-[0.18em] text-muted-foreground">{group.group}</h3>
      <ul className="flex flex-wrap gap-2">
        {group.items.map((s) => (
          <li key={s} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm">
            {s}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * Skills inside a garage. A corrugated roller shutter covers the opening and rolls up into its
 * housing as the section scrolls into view; a ceiling tube light flickers on once it's open.
 * Content is always in the DOM; the shutter is decorative.
 */
export function GarageReveal({ skills }: { skills: Group[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 30%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const shutterY = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(progress, "change", (v) => setOpen(v > 0.85));
  const lit = reduce || open;

  return (
    <div ref={ref} className="relative">
      {/* roller housing */}
      <div
        aria-hidden
        className="relative z-20 h-7 rounded-t-2xl border border-b-0 border-line bg-[linear-gradient(180deg,#2c3037,#16181c)] shadow-[0_8px_16px_-6px_rgba(0,0,0,0.8)]"
      >
        <span className="absolute inset-x-6 bottom-1.5 h-px bg-fg/10" />
        {["left-3", "right-3"].map((pos) => (
          <span key={pos} className={cn("absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-fg/25", pos)} />
        ))}
      </div>

      {/* door frame + garage interior */}
      <div className="relative overflow-hidden rounded-b-2xl border-x-[6px] border-b border-x-[#22252b] border-b-line bg-bay">
        {/* pegboard wall */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.65)_1.6px,transparent_2px)] bg-[length:22px_22px] opacity-70"
        />
        {/* ceiling tube light */}
        <div aria-hidden className="absolute inset-x-[12%] top-3 z-10">
          <div
            className={cn(
              "h-1.5 rounded-full bg-[#eef4ff] transition-opacity",
              lit ? "opacity-100 shadow-[0_0_14px_2px_rgba(220,235,255,0.7)]" : "opacity-15",
              lit && !reduce && "animate-[tube-on_0.9s_steps(1,end)_1]",
            )}
          />
          <div
            className={cn(
              "mx-auto h-48 w-[90%] bg-[radial-gradient(ellipse_at_top,rgba(220,235,255,0.14),transparent_70%)] transition-opacity duration-500",
              lit ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        <div className="relative grid gap-5 p-4 pt-10 md:grid-cols-2 md:p-6 md:pt-12 lg:grid-cols-3">
          {skills.map((g, i) => (
            <Board key={g.group} group={g} index={i} progress={progress} reduce={reduce} />
          ))}
        </div>

        {/* floor line */}
        <div aria-hidden className="relative h-3 bg-gradient-to-b from-black/0 to-black/50" />

        {/* roller shutter */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ y: shutterY }}
            className={cn("absolute inset-0 z-10 flex flex-col", open && "pointer-events-none")}
          >
            <div className="flex-1 bg-[repeating-linear-gradient(180deg,#3a3f47_0_2px,#2a2e35_2px_14px,#1d2025_14px_18px,#0f1114_18px_20px)] shadow-[inset_0_-30px_40px_-20px_rgba(0,0,0,0.6)]" />
            {/* bottom rail with handle and hazard stripes */}
            <div className="relative h-7 border-t border-black/60 bg-[linear-gradient(180deg,#30343b,#1a1d22)]">
              <div className="absolute inset-x-0 bottom-0 h-2 bg-[repeating-linear-gradient(135deg,var(--color-brand)_0_10px,#0e0f11_10px_20px)] opacity-90" />
              <div className="absolute top-1.5 left-1/2 h-2.5 w-16 -translate-x-1/2 rounded-full bg-gradient-to-b from-fg/60 to-fg/20" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
