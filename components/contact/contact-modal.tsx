"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { useScrollLock } from "@/components/effects/scroll-provider";
import { useContactSubmit } from "@/lib/hooks/use-contact-submit";
import { LogoMark, XIcon } from "@/components/ui/icons";
import { PillButton } from "@/components/ui/pill-button";

export function ContactModal() {
  const { isOpen, closeContactModal } = useContactModal();
  const { stopScroll, startScroll } = useScrollLock();
  const { status, errorMessage, submit, reset } = useContactSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    stopScroll();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeContactModal();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      startScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stopScroll/startScroll/closeContactModal are stable context callbacks
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    const timeout = setTimeout(() => {
      reset();
      formRef.current?.reset();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset is a stable hook callback
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await submit({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: "Project inquiry",
      message: String(formData.get("project") ?? ""),
      company: String(formData.get("company") ?? ""),
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/30 p-4 backdrop-blur-lg sm:items-center"
      onClick={closeContactModal}
    >
      <div
        className="relative w-full max-w-md rounded-card bg-white p-6 shadow-2xl ring-1 ring-line sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeContactModal}
          aria-label="Close"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-pill bg-surface text-black/60 transition-colors hover:bg-surface-2 hover:text-black"
        >
          <XIcon className="size-4" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="grid size-14 place-items-center rounded-pill bg-ink text-accent-from">
              <LogoMark className="size-6" />
            </div>
            <h2 className="text-2xl font-semibold">Request received</h2>
            <p className="max-w-[32ch] text-sm text-black/60">
              Thanks for reaching out — I&apos;ll get back to you soon.
            </p>
            <PillButton variant="dark" onClick={closeContactModal}>
              Close
            </PillButton>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-black/60">
                <span className="h-1.5 w-1.5 rounded-pill bg-accent" />
                Start a project
              </span>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Tell me what you&apos;re building.
              </h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium tracking-wide text-black/50 uppercase">Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-control border border-line bg-surface/50 px-4 py-3 text-sm outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium tracking-wide text-black/50 uppercase">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-control border border-line bg-surface/50 px-4 py-3 text-sm outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium tracking-wide text-black/50 uppercase">Project</span>
                <textarea
                  name="project"
                  required
                  rows={4}
                  placeholder="A few words about your project, timeline, and goals."
                  className="w-full resize-none rounded-control border border-line bg-surface/50 px-4 py-3 text-sm outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </label>

              {/* Honeypot */}
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

              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="text-xs text-black/45">I reply within one business day.</p>
                <PillButton variant="dark" arrow="up-right" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending…" : "Send request"}
                </PillButton>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
