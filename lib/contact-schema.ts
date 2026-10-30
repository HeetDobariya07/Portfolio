import { z } from "zod";

/** Shared by the contact form (inline checks) and the server action (the source of truth). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email."),
  message: z.string().trim().min(10, "A little more detail, please (10+ characters).").max(4000),
});

export type ContactField = keyof typeof contactSchema.shape;

/** First error message for one field's value, or undefined when it is valid. */
export function validateField(field: ContactField, value: string): string | undefined {
  const result = contactSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
