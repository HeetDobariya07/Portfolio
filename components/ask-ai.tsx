import { aiReviewPrompt } from "@/lib/content";
import { cn } from "@/lib/utils";

type Assistant = {
  name: string;
  /** Official logo in public/logos/ai. */
  logo: string;
  /** Builds a URL that opens the assistant with the prompt pre-filled. */
  url: (prompt: string) => string;
};

const encode = encodeURIComponent;

/** Google AI Mode treats the prompt as one search query and drops line breaks. */
const flatten = (prompt: string) => prompt.replace(/\s*\n+\s*/g, " ").trim();

const ASSISTANTS: Assistant[] = [
  { name: "ChatGPT", logo: "/logos/ai/chatgpt.svg", url: (q) => `https://chatgpt.com/?q=${encode(q)}` },
  { name: "Claude", logo: "/logos/ai/claude.svg", url: (q) => `https://claude.ai/new?q=${encode(q)}` },
  { name: "Perplexity", logo: "/logos/ai/perplexity.svg", url: (q) => `https://www.perplexity.ai/search?q=${encode(q)}` },
  {
    name: "Gemini",
    logo: "/logos/ai/gemini.svg",
    url: (q) => `https://www.google.com/search?udm=50&q=${encode(flatten(q))}`,
  },
  { name: "Grok", logo: "/logos/ai/grok.svg", url: (q) => `https://grok.com/?q=${encode(q)}` },
];

/**
 * "Ask AI about me": opens each assistant with a hiring-manager review prompt pre-filled. The
 * prompt points the model at /llms.txt and the site, so its answer comes from real content.
 */
export function AskAi({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn(!compact && "pb-6")}>
      {compact ? null : (
        <p className="mb-2.5 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">Ask AI about me</p>
      )}
      <ul className={cn("flex flex-wrap gap-2", compact && "justify-center sm:justify-end")} aria-label="Ask AI about me">
        {ASSISTANTS.map((a) => (
          <li key={a.name}>
            <a
              href={a.url(aiReviewPrompt)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ask ${a.name} about Heet Dobariya`}
              title={`Ask ${a.name} about Heet Dobariya`}
              className={cn(
                "group grid place-items-center rounded-xl border border-line bg-surface/80 transition-[transform,border-color,box-shadow] duration-200 hover:border-brand/60 hover:shadow-[0_8px_20px_-10px_var(--color-brand)] motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95",
                compact ? "size-9 rounded-lg bg-bg" : "size-11",
              )}
            >
              {/* biome-ignore lint/performance/noImgElement: tiny static SVGs, no optimisation needed */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.logo} alt="" width={20} height={20} className={cn("transition-transform duration-200 motion-safe:group-hover:scale-110", compact ? "size-4" : "size-5")} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
