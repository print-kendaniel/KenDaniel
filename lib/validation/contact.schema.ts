import { z } from "zod";

/**
 * Schema for the raw contact form submission, including the honeypot field.
 * `company` is a decoy field hidden from real users via CSS; bots that fill
 * every input on the form will populate it. It's intentionally unconstrained
 * here — the route handler decides what to do with a non-empty value (and
 * responds with a fake success so bots can't tell they were caught). Adding
 * a `max(0)` here instead would make Zod itself reject the request with a
 * 400 naming the field, defeating the point of a honeypot.
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.email("Enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  company: z.string().optional().default(""),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
