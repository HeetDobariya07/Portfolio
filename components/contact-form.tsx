"use client";

import { Flag, Loader2 } from "lucide-react";
import { type FocusEvent, type FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { type ContactState, sendContact } from "@/app/actions/contact";
import { type ContactField, validateField } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };
const MIN_MESSAGE = 10;
const FIELDS: ContactField[] = ["name", "email", "message"];

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-muted-foreground/60 transition-[border-color,box-shadow] duration-200 hover:border-fg/30 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-brand)_18%,transparent)] focus:outline-none aria-[invalid=true]:border-brand";

type Errors = Partial<Record<ContactField, string>>;

/** Shown in place of the form after a message goes out: a papaya check that draws itself. */
function Sent({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      className="flex min-h-[22rem] flex-col items-center justify-center gap-4 rounded-2xl border border-brand/40 bg-surface p-8 text-center shadow-[0_0_40px_-20px_var(--color-brand)]"
    >
      <svg aria-hidden viewBox="0 0 52 52" className="size-16 fill-none stroke-brand" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle
          cx="26"
          cy="26"
          r="23"
          pathLength="1"
          strokeDasharray="1"
          className="animate-[draw_0.7s_ease-out_both] motion-reduce:animate-none"
        />
        <path
          d="M15 27l8 8 14-16"
          pathLength="1"
          strokeDasharray="1"
          className="animate-[draw_0.45s_0.55s_ease-out_both] motion-reduce:animate-none"
        />
      </svg>
      <div>
        <p className="text-xl font-semibold tracking-tight">Message sent.</p>
        <p className="mt-1 text-sm text-muted-foreground">Thanks for reaching out. I&apos;ll reply soon.</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-line px-4 py-2 font-mono text-xs transition-colors hover:border-brand hover:text-brand"
      >
        Send another
      </button>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  const formRef = useRef<HTMLFormElement>(null);
  // What the user did since the last server response (blur checks, typing). It is tied to that
  // response, so a new one starts clean and the server's field errors show through.
  const [local, setLocal] = useState<{ base: ContactState; edits: Errors; length: number | null }>({ base: initial, edits: {}, length: null });
  // The success card hides once dismissed; the next submission produces a new state object.
  const [dismissed, setDismissed] = useState<ContactState | null>(null);

  const values = state.status === "error" ? state.values : undefined;
  const current = local.base === state ? local : { base: state, edits: {}, length: null };
  const errors: Errors = { ...(state.status === "error" ? state.fieldErrors : undefined), ...current.edits };
  const length = current.length ?? values?.message.length ?? 0;

  // After a server error, put the cursor in the first invalid field.
  useEffect(() => {
    if (state.status !== "error") return;
    const first = FIELDS.find((f) => state.fieldErrors?.[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  const edit = (patch: Errors, nextLength: number | null = current.length) =>
    setLocal({ base: state, edits: { ...current.edits, ...patch }, length: nextLength });

  const check = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.currentTarget.name as ContactField;
    edit({ [name]: validateField(name, e.currentTarget.value) });
  };
  const clear = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.currentTarget.name as ContactField;
    edit(errors[name] ? { [name]: undefined } : {}, name === "message" ? e.currentTarget.value.length : current.length);
  };

  if (state.status === "success" && state !== dismissed) {
    return <Sent onReset={() => setDismissed(state)} />;
  }

  const short = length > 0 && length < MIN_MESSAGE;

  return (
    <form ref={formRef} action={action} className="space-y-4" noValidate>
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
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            defaultValue={values?.name}
            onBlur={check}
            onInput={clear}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={field}
          />
          {errors.name ? (
            <p id="name-error" className="mt-1.5 text-xs text-brand">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            defaultValue={values?.email}
            onBlur={check}
            onInput={clear}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={field}
          />
          {errors.email ? (
            <p id="email-error" className="mt-1.5 text-xs text-brand">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="A role, a project, or just hello…"
          defaultValue={values?.message}
          onBlur={check}
          onInput={clear}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(field, "resize-y")}
        />
        <div className="mt-1.5 flex items-start justify-between gap-3">
          {errors.message ? (
            <p id="message-error" className="text-xs text-brand">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span aria-hidden className={cn("ml-auto shrink-0 font-mono text-[11px] tabular-nums transition-colors", short ? "text-brand" : "text-muted-foreground/70")}>
            {length < MIN_MESSAGE ? `${length}/${MIN_MESSAGE} min` : length}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-bg transition-[transform,opacity,box-shadow] duration-200 hover:shadow-[0_10px_28px_-10px_var(--color-brand)] disabled:opacity-60 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] sm:w-auto"
        >
          {pending ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Flag aria-hidden className="size-4 origin-bottom-left motion-safe:group-hover:animate-[wave_0.7s_ease-in-out]" />
          )}
          {pending ? "Sending…" : "Send it"}
        </button>
        <p role="status" aria-live="polite" className="text-sm text-brand">
          {state.status === "error" ? state.message : null}
        </p>
      </div>
    </form>
  );
}
