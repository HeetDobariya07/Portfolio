type Props = {
  gear: string;
  label: string;
  title: string;
  intro?: string;
};

/** Section title with a gear-knob badge, e.g. [2] EXPERIENCE. */
export function SectionHeading({ gear, label, title, intro }: Props) {
  return (
    <header className="mb-10 md:mb-14">
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {/* tracking-normal: the parent's letter-spacing would push the digit off-centre */}
        <span className="grid size-7 place-items-center rounded-full border border-line bg-surface leading-none font-semibold tracking-normal text-brand">
          {gear}
        </span>
        {label}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">{title}</h2>
      {intro ? <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">{intro}</p> : null}
    </header>
  );
}
