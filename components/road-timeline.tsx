"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Role } from "@/lib/content";
import { cn } from "@/lib/utils";

const CAR_HEIGHT = 44;

/** Top-down car, nose pointing down the road. */
function Car() {
  return (
    <div className="relative">
      {/* headlight beams */}
      <div
        aria-hidden
        className="absolute top-[38px] left-1/2 h-16 w-12 -translate-x-1/2 bg-gradient-to-b from-[#fff3d6]/35 to-transparent [clip-path:polygon(30%_0,70%_0,100%_100%,0_100%)]"
      />
      <svg width="24" height={CAR_HEIGHT} viewBox="0 0 24 44" className="relative drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
        {/* body */}
        <rect x="2" y="1" width="20" height="42" rx="7" fill="var(--color-brand)" />
        {/* side mirrors */}
        <rect x="0" y="27" width="3" height="4" rx="1" fill="var(--color-brand)" />
        <rect x="21" y="27" width="3" height="4" rx="1" fill="var(--color-brand)" />
        {/* rear window, roof, windshield (front is at the bottom) */}
        <path d="M6 9 Q12 7 18 9 L17 13 L7 13 Z" fill="var(--color-bg)" opacity="0.85" />
        <rect x="6" y="14" width="12" height="11" rx="2" fill="#000" opacity="0.25" />
        <path d="M6 33 Q12 35.5 18 33 L17 26 L7 26 Z" fill="var(--color-bg)" opacity="0.85" />
        {/* centre stripe */}
        <rect x="11" y="1.5" width="2" height="41" fill="var(--color-fg)" opacity="0.25" />
        {/* tail-lights (top) and headlights (bottom) */}
        <rect x="4" y="1.5" width="5" height="2" rx="1" fill="#ff2a2a" />
        <rect x="15" y="1.5" width="5" height="2" rx="1" fill="#ff2a2a" />
        <rect x="4" y="40.5" width="5" height="2" rx="1" fill="#fff3d6" />
        <rect x="15" y="40.5" width="5" height="2" rx="1" fill="#fff3d6" />
      </svg>
      {/* tail-light glow */}
      <div aria-hidden className="absolute -top-1 left-1/2 h-3 w-7 -translate-x-1/2 rounded-full bg-[#ff2a2a]/50 blur-md" />
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
      <div aria-hidden className="absolute inset-y-0 left-0 w-10 md:w-12">
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
        <li key={`${role.company}-${role.period}`} className="relative pb-14 pl-16 last:pb-2 md:pl-20">
          {/* mile-marker on the shoulder */}
          <span
            aria-hidden
            className={cn("absolute top-[7px] left-11 h-px w-3 md:left-[3.25rem]", role.current ? "bg-brand" : "bg-fg/40")}
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
