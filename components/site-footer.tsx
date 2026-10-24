import { Heart } from "lucide-react";

/**
 * Minimal footer on a solid graphite strip. Links and contact actions already live in the nav and
 * the Contact section just above, so they aren't repeated here.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <p className="mx-auto max-w-5xl px-4 py-6 text-center font-mono text-xs text-muted-foreground md:px-6">
        2026 © All Rights Reserved <span aria-hidden className="mx-1.5 text-line">|</span> Built with{" "}
        <Heart aria-label="love" className="inline size-3.5 -translate-y-px fill-brand text-brand" /> by Heet
      </p>
    </footer>
  );
}
