"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email."),
  message: z.string().trim().min(10, "A little more detail, please (10+ characters).").max(4000),
});

// Best-effort, per-instance rate limit: 3 messages per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real users never see or fill this field.
  if (formData.get("company")) return { status: "success", message: "Thanks! Message sent." };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip, Date.now())) {
    return { status: "error", message: "Too many messages. Please try again in a few minutes." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.");
    return { status: "error", message: "The form isn't configured yet. Please email me directly." };
  }

  const { name, email, message } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("Contact form: Resend error", error);
    return { status: "error", message: "Something went wrong sending that. Please email me directly." };
  }
  return { status: "success", message: "Thanks! Your message is on its way. I'll reply soon." };
}
