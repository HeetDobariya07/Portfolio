"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/content";

/**
 * Experience as a road: a dashed lane marking with a red line that "drives" down it as you scroll.
 * Each role is a mile-marker.
 */
export function RoadTimeline({ roles }: { roles: Role[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative">
      {/* lane marking */}
      <div aria-hidden className="lane-dashes absolute top-2 bottom-2 left-[11px] w-0.5 opacity-40" />
      <motion.div
        aria-hidden
        className="absolute top-2 bottom-2 left-[11px] w-0.5 origin-top rounded-full bg-brand shadow-[0_0_10px_var(--color-brand)]"
        style={{ scaleY: reduce ? 1 : progress }}
      />

      {roles.map((role, i) => (
        <li key={`${role.company}-${role.period}`} className="relative pb-12 pl-12 last:pb-0">
          <span
            aria-hidden
            className={cn(
              "absolute top-1 left-0 grid size-6 place-items-center rounded-full border bg-bg font-mono text-[9px]",
              role.current ? "border-brand text-brand" : "border-line text-muted-foreground",
            )}
          >
            {String(roles.length - i).padStart(2, "0")}
          </span>

          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
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
