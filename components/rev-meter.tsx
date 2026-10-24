"use client";

import { Power, Square } from "lucide-react";
import { motion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { MAX_RPM, useRpm } from "./rpm-context";

const TICKS = Array.from({ length: MAX_RPM + 1 }, (_, i) => i);

/**
 * Small horizontal tachometer with the "Engine start" button. Pressing it starts a test drive
 * (auto-scroll through the page); pressing it again, or scrolling yourself, stops it.
 */
export function RevMeter() {
  const { rpm, touring, toggleTour, prime } = useRpm();
  const width = useTransform(rpm, (v) => `${(v / MAX_RPM) * 100}%`);
  const readout = useTransform(rpm, (v) => (v * 1000).toFixed(0).padStart(4, "0"));

  return (
    <div className="flex w-full max-w-md items-center gap-4">
      <div className="group/engine relative">
        {/* hint card, shown on hover / keyboard focus */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-full left-0 z-20 mb-3 w-64 translate-y-1 rounded-xl border border-line bg-surface/95 p-3.5 opacity-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md transition-[opacity,transform] duration-200",
            "group-hover/engine:translate-y-0 group-hover/engine:opacity-100 group-focus-within/engine:translate-y-0 group-focus-within/engine:opacity-100",
          )}
        >
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
            <span className="size-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
            {touring ? "Test drive in progress" : "Test drive"}
          </p>
          <p className="mt-1.5 text-sm text-fg">{touring ? "Press to stop and take the wheel." : "Cruise through the whole page hands-free."}</p>
          <p className="mt-1 text-xs text-muted-foreground">{touring ? "Scrolling stops it too." : "Scroll or press any key to take over."}</p>
          {/* arrow */}
          <span className="absolute -bottom-[5px] left-[19px] size-2.5 rotate-45 border-r border-b border-line bg-surface" />
        </div>

      <button
        type="button"
        onClick={toggleTour}
        onPointerEnter={() => prime(true)}
        onPointerLeave={() => prime(false)}
        onFocus={() => prime(true)}
        onBlur={() => prime(false)}
        aria-pressed={touring}
        aria-label={touring ? "Stop the test drive" : "Engine start: take a test drive through the page"}
        className={cn(
          "group relative grid size-12 shrink-0 place-items-center rounded-full border bg-surface transition-[border-color,box-shadow] duration-300",
          touring
            ? "border-brand shadow-[0_0_22px_-2px_var(--color-brand)]"
            : "border-line hover:border-brand hover:shadow-[0_0_18px_-4px_var(--color-brand)]",
        )}
      >
        {!touring && (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-brand/40 [animation-duration:2.4s] motion-reduce:hidden" />
        )}
        {touring ? (
          <Square aria-hidden className="size-4 fill-brand text-brand" />
        ) : (
          <Power aria-hidden className="size-5 text-muted-foreground transition-colors group-hover:text-brand" />
        )}
      </button>
      </div>

      <div className="flex-1" aria-hidden>
        <div className="mb-1.5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className={cn(touring && "text-brand")}>{touring ? "Test drive · press to stop" : "Engine start · test drive"}</span>
          <span>
            <motion.span className="tabular-nums text-fg">{readout}</motion.span> rpm
          </span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-surface-2">
          {/* redline zone */}
          <div className="absolute inset-y-0 right-0 w-[12.5%] bg-brand/20" />
          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fg/70 via-fg/90 to-brand" style={{ width }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground/70">
          {TICKS.map((t) => (
            <span key={t} className={cn(t >= 7 && "text-brand/80")}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
