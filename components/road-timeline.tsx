"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Role } from "@/lib/content";
import { cn } from "@/lib/utils";

const CAR_W = 41;
const CAR_HEIGHT = 90;

/**
 * The car on the road: a top-down G-class photo (cut out and colour-graded by scripts/make-car-sprite.mjs),
 * nose down the road. A papaya underglow and rim light lift the dark paint off the asphalt.
 */
function Car() {
  return (
    <div className="relative" style={{ width: CAR_W, height: CAR_HEIGHT }}>
      {/* underglow */}
      <div aria-hidden className="absolute top-1/2 left-1/2 h-[78px] w-8 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-brand/45 blur-md" />
      {/* headlight beam (front is at the bottom) */}
      <div
        aria-hidden
        className="absolute left-1/2 h-20 w-11 -translate-x-1/2 bg-gradient-to-b from-[#fff3d6]/35 to-transparent [clip-path:polygon(30%_0,70%_0,100%_100%,0_100%)]"
        style={{ top: CAR_HEIGHT - 4 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/g63-top.webp"
        alt=""
        aria-hidden
        width={CAR_W}
        height={CAR_HEIGHT}
        draggable={false}
        className="relative block drop-shadow-[0_0_3px_rgba(255,122,26,0.55)] drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]"
      />
      {/* tail-light glow */}
      <div aria-hidden className="absolute top-3 left-1/2 h-3 w-8 -translate-x-1/2 rounded-full bg-[#ff2a2a]/35 blur-md" />
    </div>
  );
}

/**
 * Experience as a road: asphalt with edge lines and a dashed centre line. A car drives down it as
 * you scroll, lighting up the stretch it has covered. Each role is a mile-marker on the shoulder.
 */
export function RoadTimeline({ roles }: { roles: Role[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  // Keep the whole car on the road at both ends.
  const carTop = useTransform(progress, (v) => `calc(${v * 100}% - ${v * CAR_HEIGHT}px)`);
  const driven = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <ol ref={ref} className="relative">
      {/* road */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-12 md:w-14">
        <div className="absolute inset-0 rounded-md border-x-2 border-fg/35 bg-asphalt shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]" />
        {/* dashed centre line */}
        <div className="road-dashes absolute inset-y-2 left-1/2 w-[3px] -translate-x-1/2 text-[#f2c14e]/70" />
        {/* the stretch already driven glows red */}
        {!reduce && (
          <motion.div
            className="road-dashes absolute top-2 left-1/2 w-[3px] -translate-x-1/2 text-brand drop-shadow-[0_0_4px_var(--color-brand)]"
            style={{ height: driven }}
          />
        )}
        <motion.div className="absolute left-1/2 z-10 -translate-x-1/2" style={{ top: reduce ? 0 : carTop }}>
          <Car />
        </motion.div>
      </div>

      {roles.map((role, i) => (
        <li key={`${role.company}-${role.period}`} className="relative pb-14 pl-[4.5rem] last:pb-2 md:pl-20">
          {/* mile-marker on the shoulder */}
          <span
            aria-hidden
            className={cn("absolute top-[7px] left-[3.25rem] h-px w-3 md:left-[3.75rem]", role.current ? "bg-brand" : "bg-fg/40")}
          />

          <p className={cn("font-mono text-[10px] uppercase tracking-[0.2em]", role.current ? "text-brand" : "text-muted-foreground")}>
            Mile {String(roles.length - i).padStart(2, "0")}
            {role.current ? " · Now" : ""}
          </p>

          <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
            <h3 className="text-lg font-semibold tracking-tight">
              {role.title} <span className="text-muted-foreground">·</span>{" "}
              <span className={role.current ? "text-brand" : undefined}>{role.company}</span>
            </h3>
            <p className="shrink-0 font-mono text-xs text-muted-foreground">
              {role.period} · {role.place}
            </p>
          </div>

          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            {role.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-line" />
                <span className="text-pretty">{p}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools">
            {role.tags.map((t) => (
              <li key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
