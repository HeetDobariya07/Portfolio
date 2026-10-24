"use client";

import { Power, Square } from "lucide-react";
import { motion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { type Engine, MAX_RPM, useRpm } from "./rpm-context";

const TICKS = Array.from({ length: MAX_RPM + 1 }, (_, i) => i);

const COPY: Record<Engine, { tag: string; title: string; note: string; meter: string; aria: string }> = {
  off: {
    tag: "Engine off",
    title: "Start the engine for a hands-free test drive.",
    note: "It cruises through the whole page. Scroll or press any key to take over.",
    meter: "Engine off · press to start",
    aria: "Start the engine and take a test drive through the page",
  },
  driving: {
    tag: "Test drive in progress",
    title: "Press to switch the engine off.",
    note: "Scroll or press any key to take the wheel instead.",
    meter: "Test drive · press to stop",
    aria: "Switch the engine off and stop the test drive",
  },
  idle: {
    tag: "Engine running",
    title: "Scrolling is your throttle now.",
    note: "Press to switch the engine off.",
    meter: "Idling · scroll to rev",
    aria: "Switch the engine off",
  },
};

/**
 * Small horizontal tachometer with the power button. The engine starts off (0 rpm); the button
 * cranks it and starts a test drive, and switches it off again when it's running.
 */
export function RevMeter() {
  const { rpm, engine, pressPower, prime } = useRpm();
  const width = useTransform(rpm, (v) => `${(v / MAX_RPM) * 100}%`);
  const readout = useTransform(rpm, (v) => (v * 1000).toFixed(0).padStart(4, "0"));
  const copy = COPY[engine];
  const running = engine !== "off";

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
            <span
              className={cn(
                "size-1.5 rounded-full",
                engine === "off" ? "bg-muted-foreground" : engine === "idle" ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-brand shadow-[0_0_8px_var(--color-brand)]",
              )}
            />
            {copy.tag}
          </p>
          <p className="mt-1.5 text-sm text-fg">{copy.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{copy.note}</p>
          {/* arrow */}
          <span className="absolute -bottom-[5px] left-[19px] size-2.5 rotate-45 border-r border-b border-line bg-surface" />
        </div>

        <button
          type="button"
          onClick={pressPower}
          onPointerEnter={() => prime(true)}
          onPointerLeave={() => prime(false)}
          onFocus={() => prime(true)}
          onBlur={() => prime(false)}
          aria-pressed={running}
          aria-label={copy.aria}
          className={cn(
            "group relative grid size-12 shrink-0 place-items-center rounded-full border bg-surface transition-[border-color,box-shadow] duration-300",
            engine === "driving"
              ? "border-brand shadow-[0_0_22px_-2px_var(--color-brand)]"
              : engine === "idle"
                ? "border-brand/70 shadow-[0_0_14px_-4px_var(--color-brand)]"
                : "border-line hover:border-brand hover:shadow-[0_0_18px_-4px_var(--color-brand)]",
          )}
        >
          {engine === "off" && (
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-brand/40 [animation-duration:2.4s] motion-reduce:hidden" />
          )}
          {engine === "driving" ? (
            <Square aria-hidden className="size-4 fill-brand text-brand" />
          ) : (
            <Power
              aria-hidden
              className={cn("size-5 transition-colors", engine === "idle" ? "text-brand" : "text-muted-foreground group-hover:text-brand")}
            />
          )}
        </button>
      </div>

      <div className="flex-1" aria-hidden>
        <div className="mb-1.5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className={cn(running && "text-brand")}>{copy.meter}</span>
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
