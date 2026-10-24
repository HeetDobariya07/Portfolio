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

const BOLTS = ["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"];

/** One skill group, styled like a component bolted into the bay. Fades in as the hood clears it. */
function Part({ group, index, progress, reduce }: { group: Group; index: number; progress: MotionValue<number>; reduce: boolean }) {
  const start = 0.45 + index * 0.06;
  const opacity = useTransform(progress, [start, start + 0.25], [0, 1]);
  const y = useTransform(progress, [start, start + 0.25], [12, 0]);

  return (
    <motion.div
      style={reduce ? undefined : { opacity, y }}
      className="relative rounded-2xl border border-line bg-surface-2/90 p-5 shadow-[inset_0_1px_0_rgba(250,246,241,0.05)]"
    >
      {BOLTS.map((pos) => (
        <span key={pos} aria-hidden className={cn("absolute size-1.5 rounded-full bg-fg/15 ring-1 ring-black/40", pos)} />
      ))}
      <h3 className="mb-3 font-mono text-xs font-normal uppercase tracking-[0.18em] text-muted-foreground">
        {group.group}
      </h3>
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

/** Front view of a bonnet: sheen, creases, badge, grille and headlights. Purely decorative. */
function Bonnet() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-fg/10 bg-[linear-gradient(180deg,#2a221e_0%,#1b1613_55%,#120f0d_100%)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
      {/* paint sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(250,246,241,0.10),transparent_70%)]" />
      {/* body creases */}
      <div className="absolute top-[6%] bottom-[34%] left-[33%] w-px bg-gradient-to-b from-fg/0 via-fg/20 to-fg/0" />
      <div className="absolute top-[6%] bottom-[34%] right-[33%] w-px bg-gradient-to-b from-fg/0 via-fg/20 to-fg/0" />
      {/* badge */}
      <div className="absolute top-[52%] left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand/70 bg-bg/60 font-mono text-[11px] font-semibold text-fg shadow-[0_0_14px_-4px_var(--color-brand)]">
        HD
      </div>
      {/* accent line */}
      <div className="absolute inset-x-[12%] bottom-[24%] h-px bg-gradient-to-r from-brand/0 via-brand/80 to-brand/0" />
      {/* headlights */}
      <div className="absolute bottom-[9%] left-[6%] h-4 w-[20%] rounded-full bg-gradient-to-r from-[#fff3d6] to-[#fff3d6]/40 shadow-[0_0_24px_4px_rgba(255,243,214,0.25)]" />
      <div className="absolute right-[6%] bottom-[9%] h-4 w-[20%] rounded-full bg-gradient-to-l from-[#fff3d6] to-[#fff3d6]/40 shadow-[0_0_24px_4px_rgba(255,243,214,0.25)]" />
      {/* grille */}
      <div className="absolute bottom-[5%] left-1/2 h-[12%] max-h-16 w-[38%] -translate-x-1/2 rounded-xl border border-fg/10 bg-[repeating-linear-gradient(180deg,#0c0a09_0_5px,#2a221e_5px_7px)]" />
    </div>
  );
}

/**
 * Skills in an "engine bay" under a bonnet. Scrolling the section into view swings the bonnet
 * open on its top hinge. Content is always in the DOM; the bonnet is decorative.
 */
export function HoodReveal({ skills }: { skills: Group[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 30%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });
  const rotateX = useTransform(progress, [0, 1], [0, -100]);
  const bonnetOpacity = useTransform(progress, [0.75, 0.95], [1, 0]);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(progress, "change", (v) => setOpen(v > 0.9));

  return (
    <div ref={ref} className="relative [perspective:1400px]">
      {/* engine bay */}
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-[#0f0c0b] p-4 shadow-[inset_0_0_40px_rgba(0,0,0,0.7)] md:p-6">
        {/* hose running behind the parts */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 70 C 25 40, 45 95, 70 55 S 95 35, 100 45" fill="none" stroke="var(--color-brand)" strokeOpacity="0.18" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          <path d="M0 30 C 30 55, 55 10, 100 25" fill="none" stroke="var(--color-fg)" strokeOpacity="0.07" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((g, i) => (
            <Part key={g.group} group={g} index={i} progress={progress} reduce={reduce} />
          ))}
        </div>
      </div>

      {!reduce && (
        <motion.div
          aria-hidden
          className={cn("absolute inset-0 origin-top [transform-style:preserve-3d]", open && "pointer-events-none")}
          style={{ rotateX, opacity: bonnetOpacity }}
        >
          <Bonnet />
        </motion.div>
      )}
    </div>
  );
}
