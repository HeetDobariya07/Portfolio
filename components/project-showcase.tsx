"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { type KeyboardEvent, type PointerEvent, useEffect, useId, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const SCREWS = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

/** Label …… value row, like a scanner's live-data list. */
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="-mx-1.5 flex items-baseline gap-2 rounded px-1.5 py-1 font-mono text-[13px] transition-colors duration-150 hover:bg-fg/5">
      <dt className="shrink-0 uppercase tracking-wider text-muted-foreground">{label}</dt>
      <span aria-hidden className="mb-1 min-w-4 flex-1 border-b border-dotted border-fg/20" />
      <dd className="text-right text-fg">{value}</dd>
    </div>
  );
}

/** Pipeline shown as a running test sequence: steps tick from RUN to OK, then loop. */
function Sequence({ steps, running, reduce }: { steps: string[]; running: boolean; reduce: boolean }) {
  const [at, setAt] = useState(reduce ? steps.length : 0);

  useEffect(() => {
    if (reduce || !running) return;
    const id = setInterval(() => setAt((n) => (n >= steps.length + 2 ? 0 : n + 1)), 650);
    return () => clearInterval(id);
  }, [reduce, running, steps.length]);

  return (
    <ol className="space-y-0.5">
      {steps.map((step, i) => {
        const done = i < at;
        const active = i === at;
        return (
          <li
            key={step}
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-1 font-mono text-[13px] transition-colors duration-200",
              active ? "bg-brand/15 text-fg" : done ? "text-fg/85" : "text-muted-foreground/70",
            )}
          >
            <span className="w-6 shrink-0 tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 truncate">{step}</span>
            <span
              className={cn(
                "w-10 shrink-0 text-right text-[11px] font-semibold tracking-wider",
                active ? "text-brand" : done ? "text-emerald-400" : "text-muted-foreground/50",
              )}
            >
              {active ? "RUN" : done ? "OK" : "--"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const H4 = "mb-2 border-b border-line/70 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand";

/** One project's opened view. Hidden panels stay in the layout (same grid cell) but are inert. */
function ModulePanel({ project, shown, running, reduce }: { project: Project; shown: boolean; running: boolean; reduce: boolean }) {
  const notes = project.work ?? project.highlights;
  return (
    <motion.div
      aria-hidden={!shown}
      inert={!shown}
      className={cn("min-w-0 [grid-area:1/1]", !shown && "invisible")}
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <p className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Projects <ChevronRight aria-hidden className="size-3" /> <span className="text-brand">{project.name}</span>
        {project.badge ? <span className="ml-2 rounded border border-brand/50 px-1.5 py-0.5 tracking-[0.15em] text-fg">{project.badge}</span> : null}
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h3>
      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">{project.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">{project.description}</p>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <section aria-label="Live data">
          <h4 className={H4}>Live data</h4>
          <dl>
            {project.specs.map((s) => (
              <DataRow key={s.label} label={s.label} value={s.value} />
            ))}
          </dl>
          <h4 className={cn(H4, "mt-5")}>Modules</h4>
          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.stack.map((s) => (
              <li key={s} className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] uppercase text-fg/80 transition-colors duration-150 hover:border-brand/60 hover:text-fg">
                {s}
              </li>
            ))}
          </ul>
        </section>
        <section aria-label="How it works">
          <h4 className={H4}>Sequence</h4>
          <Sequence key={running ? "run" : "idle"} steps={project.pipeline} running={running} reduce={reduce} />
        </section>
      </div>

      {notes ? (
        <section aria-label={project.work ? "My work" : "Highlights"} className="mt-5">
          <h4 className={H4}>{project.work ? "My work" : "Highlights"}</h4>
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {notes.map((n) => (
              <li key={n} className="flex gap-2 text-[13px] leading-snug text-muted-foreground">
                <span aria-hidden className="mt-px font-mono text-brand">▸</span>
                <span className="text-pretty">{n}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </motion.div>
  );
}

/**
 * Projects presented as a car diagnostic scanner: a module menu on the left, and the selected
 * module "opened" on the right with live data, a test sequence and installed modules.
 * The menu follows the WAI-ARIA tabs pattern (arrow keys move between items).
 */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const screen = useRef<HTMLDivElement>(null);
  const inView = useInView(screen, { amount: 0.3 });
  // The spotlight follows the pointer through CSS variables, so moving the mouse never re-renders.
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const id = useId();
  const project = projects[active];
  const total = projects.length;

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (active + 1) % total
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (active - 1 + total) % total
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? total - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    // device housing
    <div className="relative rounded-[2rem] border border-line bg-gradient-to-b from-housing to-panel p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] sm:p-4">
      {SCREWS.map((pos) => (
        <span key={pos} aria-hidden className={cn("absolute hidden size-2 rounded-full bg-fg/15 ring-1 ring-black/50 sm:block", pos)} />
      ))}

      {/* screen */}
      <div
        ref={screen}
        onPointerMove={reduce ? undefined : onPointerMove}
        className="group/screen relative overflow-hidden rounded-2xl border border-black/60 bg-screen shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]"
      >
        {/* cursor spotlight (desktop pointers only) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/screen:opacity-100 motion-reduce:hidden"
          style={{ background: "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(255,122,26,0.09), transparent 65%)" }}
        />
        {/* scanlines + glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,rgba(244,245,247,0.025)_0_1px,transparent_1px_3px)]"
        />
        <div aria-hidden className="pointer-events-none absolute -top-1/2 -left-1/4 z-10 h-full w-3/4 rotate-12 bg-gradient-to-br from-white/[0.04] to-transparent" />

        {/* status bar */}
        <div className="flex items-center justify-between gap-4 border-b border-line/70 bg-black/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] sm:px-5">
          <span className="flex items-center gap-2 text-fg">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            HD-SCAN · Projects
          </span>
          <span className="text-muted-foreground">
            Modules {total}/{total} · <span className="text-emerald-400">OK</span>
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[17.5rem_minmax(0,1fr)]">
          {/* module menu */}
          <div className="min-w-0 border-b border-line/70 p-2 lg:border-r lg:border-b-0 lg:p-3">
            <p aria-hidden className="hidden px-2 pt-1 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:block">
              Select module
            </p>
          <div
            role="tablist"
            aria-label="Projects"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-1 lg:flex-col"
          >
            {projects.map((p, i) => {
              const selected = i === active;
              return (
                <button
                  key={p.name}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    "group/tab flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-left font-mono text-[13px] uppercase transition-[transform,background-color,color] duration-150",
                    selected ? "bg-brand text-bg" : "text-fg/80 hover:bg-fg/5 hover:text-fg motion-safe:hover:translate-x-0.5",
                  )}
                >
                  <span className={cn("tabular-nums transition-colors", selected ? "text-bg/70" : "text-muted-foreground group-hover/tab:text-brand")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 truncate">{p.name}</span>
                  {p.live ? (
                    <span
                      className={cn(
                        "flex items-center gap-1 text-[9px] tracking-[0.15em]",
                        selected ? "text-bg/80" : "text-emerald-400",
                      )}
                    >
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                      </span>
                      Live
                    </span>
                  ) : null}
                  <ChevronRight aria-hidden className={cn("hidden size-4 lg:block", selected ? "opacity-100" : "opacity-0")} />
                </button>
              );
            })}
          </div>
          </div>

          {/* opened module: every project is stacked in the same grid cell, so the screen always
              sizes to the tallest one and never jumps when switching */}
          <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} className="relative grid min-w-0 grid-cols-[minmax(0,1fr)] p-4 sm:px-6 sm:py-5">
            {/* reading-data bar on every switch */}
            {!reduce && (
              <motion.div
                key={`bar-${active}`}
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left bg-brand shadow-[0_0_8px_var(--color-brand)]"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ scaleX: { duration: 0.45, ease: "easeOut" }, opacity: { delay: 0.45, duration: 0.3 } }}
              />
            )}
            {projects.map((p, i) => (
              <ModulePanel key={p.name} project={p} shown={i === active} running={inView && i === active} reduce={reduce} />
            ))}
          </div>
        </div>

        {/* soft-key bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 bg-black/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:px-5">
          <span className="hidden sm:inline">
            <kbd className="rounded border border-line px-1 text-fg">↑</kbd> <kbd className="rounded border border-line px-1 text-fg">↓</kbd> Select
          </span>
          <div className="flex items-center gap-2">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-md border border-brand bg-brand px-3 py-1.5 text-bg transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_0_14px_-2px_var(--color-brand)]"
              >
                Visit site <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </a>
            ) : null}
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-md border border-brand/60 px-3 py-1.5 text-fg transition-colors hover:bg-brand hover:text-bg"
              >
                View code <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => select((active + 1) % total)}
              className="group inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-fg transition-colors hover:border-brand/60"
            >
              Next <ChevronRight aria-hidden className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
