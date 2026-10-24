"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";
import { BrandIcon } from "./brand-icons";

/** Step-by-step flow of a project, with a light pulse travelling along the line. */
function Pipeline({ steps, reduce }: { steps: string[]; reduce: boolean }) {
  return (
    <ol className="relative flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-2">
      {/* track: vertical on mobile, horizontal from sm */}
      <span aria-hidden className="absolute top-2 bottom-2 left-[6px] w-px bg-line sm:top-[6px] sm:right-[8%] sm:bottom-auto sm:left-[8%] sm:h-px sm:w-auto" />
      {!reduce && (
        <>
          <span aria-hidden className="absolute left-[3px] size-2 animate-[pulse-y_3.2s_linear_infinite] rounded-full bg-brand shadow-[0_0_10px_2px_var(--color-brand)] sm:hidden" />
          <span aria-hidden className="absolute top-[3px] hidden size-2 animate-[pulse-x_3.2s_linear_infinite] rounded-full bg-brand shadow-[0_0_10px_2px_var(--color-brand)] sm:block" />
        </>
      )}
      {steps.map((step, i) => (
        <motion.li
          key={step}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.3 }}
          className="relative flex items-center gap-3 sm:flex-1 sm:flex-col sm:gap-2 sm:text-center"
        >
          <span
            aria-hidden
            className={cn(
              "relative z-10 size-3.5 shrink-0 rounded-full border-2 bg-bg",
              i === steps.length - 1 ? "border-brand" : "border-fg/50",
            )}
          />
          <span className="text-xs leading-snug text-muted-foreground sm:max-w-[7rem]">{step}</span>
        </motion.li>
      ))}
    </ol>
  );
}

/**
 * Projects as a starting grid: P1–P4 down the side, the selected one opened up as a spec sheet
 * with its pipeline. Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them).
 */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const project = projects[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (active + 1) % projects.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (active - 1 + projects.length) % projects.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? projects.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
      {/* starting grid */}
      <div
        role="tablist"
        aria-label="Projects"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
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
              onClick={() => setActive(i)}
              className={cn(
                "group relative flex min-w-[11rem] shrink-0 items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-colors duration-200 lg:min-w-0",
                selected ? "border-brand/60 bg-surface" : "border-line bg-surface/40 hover:border-fg/25 hover:bg-surface/70",
              )}
            >
              <span
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums transition-colors",
                  selected ? "text-brand" : "text-muted-foreground group-hover:text-fg",
                )}
              >
                P{i + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{p.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{p.tagline}</span>
              </span>
              {/* brake light on the selected slot */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-brand shadow-[0_0_10px_var(--color-brand)] transition-opacity",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* spec sheet */}
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 md:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-brand/10 blur-3xl" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.name}
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                  P{active + 1} · {project.tagline}
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{project.name}</h3>
              </div>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-bg/40 px-4 py-2 text-sm transition-colors hover:border-fg/40"
                >
                  <BrandIcon name="github" className="size-4" />
                  View code
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ) : null}
            </div>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground">{project.description}</p>

            <dl className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {project.specs.map((s) => (
                <div key={s.label} className="bg-surface-2 px-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">How it works</p>
              <Pipeline steps={project.pipeline} reduce={reduce} />
            </div>

            <ul className="mt-8 flex flex-wrap gap-1.5 border-t border-line pt-6" aria-label="Tech stack">
              {project.stack.map((s) => (
                <li key={s} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg/80">
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
