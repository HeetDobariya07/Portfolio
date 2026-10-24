import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";
import { BrandIcon } from "./brand-icons";

/** Project card. On hover it lifts slightly and a red "brake light" lights up along the bottom edge. */
export function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{project.tagline}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{project.name}</h3>
        </div>
        {project.href ? (
          <span className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors group-hover:border-fg group-hover:text-fg">
            <BrandIcon name="github" className="size-3.5" />
            Code
            <ArrowUpRight aria-hidden className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted-foreground">{project.note}</span>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-pretty text-muted-foreground">{project.description}</p>

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Tech stack">
        {project.stack.map((s) => (
          <li key={s} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg/80">
            {s}
          </li>
        ))}
      </ul>

      <span
        aria-hidden
        className="absolute inset-x-6 bottom-0 h-px origin-center scale-x-0 bg-brand shadow-[0_0_12px_2px_var(--color-brand)] transition-transform duration-500 ease-drive group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </>
  );

  const shell =
    "group relative flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-[transform,border-color] duration-300 ease-drive hover:-translate-y-1 hover:border-fg/25 motion-reduce:hover:translate-y-0";

  return project.href ? (
    <a href={project.href} target="_blank" rel="noreferrer" className={shell}>
      {body}
    </a>
  ) : (
    <article className={shell}>{body}</article>
  );
}
