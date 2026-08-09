"use client";

import type { FormEvent } from "react";
import { useContactSubmit } from "@/lib/hooks/use-contact-submit";
import { PillButton } from "@/components/ui/pill-button";

const inputClass =
  "w-full rounded-control border border-line bg-surface/50 px-4 py-3 text-sm outline-none transition-colors focus:border-black/30 focus:bg-white";

export function ContactForm() {
  const { status, errorMessage, submit } = useContactSubmit();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const ok = await submit({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
    });

    if (ok) form.reset();
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-card-sm border border-line bg-surface/40 px-5 py-4 text-sm">
        Thanks — your message has been sent.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wide text-black/50 uppercase">Name</span>
        <input name="name" type="text" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wide text-black/50 uppercase">Email</span>
        <input name="email" type="email" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wide text-black/50 uppercase">Subject</span>
        <input name="subject" type="text" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wide text-black/50 uppercase">Message</span>
        <textarea name="message" required rows={6} className={`${inputClass} resize-none`} />
      </label>

      {/* Honeypot: hidden from real users, bots that fill every field will trip it */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <PillButton type="submit" variant="dark" arrow="right" disabled={status === "submitting"} className="self-start">
        {status === "submitting" ? "Sending…" : "Send message"}
      </PillButton>
    </form>
  );
}
