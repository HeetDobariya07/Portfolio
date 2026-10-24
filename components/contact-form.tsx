"use client";

import { Flag, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { type ContactState, sendContact } from "@/app/actions/contact";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-muted-foreground/60 transition-colors focus:border-brand focus:outline-none aria-[invalid=true]:border-brand";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  const err = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-muted-foreground">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" placeholder="Your name"
            aria-invalid={Boolean(err.name)} aria-describedby={err.name ? "name-error" : undefined} className={field} />
          {err.name ? <p id="name-error" className="mt-1.5 text-xs text-brand">{err.name}</p> : null}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted-foreground">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com"
            aria-invalid={Boolean(err.email)} aria-describedby={err.email ? "email-error" : undefined} className={field} />
          {err.email ? <p id="email-error" className="mt-1.5 text-xs text-brand">{err.email}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-muted-foreground">
          Message
        </label>
        <textarea id="message" name="message" required rows={4} placeholder="A role, a project, or just hello…"
          aria-invalid={Boolean(err.message)} aria-describedby={err.message ? "message-error" : undefined}
          className={cn(field, "resize-y")} />
        {err.message ? <p id="message-error" className="mt-1.5 text-xs text-brand">{err.message}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-bg transition-[transform,opacity] duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 sm:w-auto"
        >
          {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Flag aria-hidden className="size-4" />}
          {pending ? "Sending…" : "Send it"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={cn("text-sm", state.status === "success" ? "text-emerald-400" : "text-brand")}
        >
          {state.status !== "idle" ? state.message : null}
        </p>
      </div>
    </form>
  );
}
