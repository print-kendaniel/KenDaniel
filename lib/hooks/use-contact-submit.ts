"use client";

import { useState } from "react";

export type ContactSubmitStatus = "idle" | "submitting" | "success" | "error";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
}

/** Shared submit state machine for the full /contact page form and the compact modal — both POST to the same /api/contact route. */
export function useContactSubmit() {
  const [status, setStatus] = useState<ContactSubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(payload: ContactPayload): Promise<boolean> {
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // A 500 from a crashed API route returns an HTML error page, not
        // JSON — parsing that as JSON throws its own confusing error
        // ("Unexpected token '<'...") that used to leak straight to the user
        // instead of a real message.
        const message = await response
          .json()
          .then((body) => body?.error?.message)
          .catch(() => null);
        throw new Error(message ?? "Something went wrong. Please try again in a moment.");
      }

      setStatus("success");
      return true;
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      return false;
    }
  }

  function reset() {
    setStatus("idle");
    setErrorMessage(null);
  }

  return { status, errorMessage, submit, reset };
}
