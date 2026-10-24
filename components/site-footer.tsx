import { Heart } from "lucide-react";
import { AskAi } from "./ask-ai";

/**
 * Minimal footer on a solid graphite strip: credit line on the left, "ask AI about me" buttons on
 * the right. Links and contact actions already live in the nav and the Contact section above.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between md:px-6">
        <p className="text-center font-mono text-xs text-muted-foreground sm:text-left">
          2026 © All Rights Reserved <span aria-hidden className="mx-1.5 hidden text-line sm:inline">|</span>
          {/* on phones "Built with ♥ by Heet" gets its own line so it never splits mid-phrase */}
          <br className="sm:hidden" />
          <span className="whitespace-nowrap">
            Built with <Heart aria-label="love" className="inline size-3.5 -translate-y-px fill-brand text-brand" /> by Heet
          </span>
        </p>
        <AskAi compact />
      </div>
    </footer>
  );
}
