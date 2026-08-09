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
        const body = await response.json();
        throw new Error(body?.error?.message ?? "Something went wrong.");
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
