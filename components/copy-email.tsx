"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left transition-[transform,border-color,box-shadow] duration-200 hover:border-brand/60 hover:shadow-[0_8px_24px_-12px_var(--color-brand)] motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.99]"
    >
      <span className="truncate font-mono text-sm">{email}</span>
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-brand">
        {copied ? <Check aria-hidden className="size-3.5 text-emerald-400" /> : <Copy aria-hidden className="size-3.5 transition-transform duration-200 motion-safe:group-hover:scale-110" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </span>
    </button>
  );
}
