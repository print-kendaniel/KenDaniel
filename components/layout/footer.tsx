"use client";

import { profile } from "@/lib/content/profile";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { PillButton } from "@/components/ui/pill-button";
import { AnimatedLink } from "@/components/ui/animated-link";
import { LogoMark } from "@/components/ui/icons";
import { DecryptText } from "@/components/effects/decrypt-text";
import { useRevealVisible } from "@/components/effects/use-reveal-visible";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
];

export function Footer() {
  const { openContactModal } = useContactModal();
  // Footer never unmounts across client-side navigation (it lives outside
  // PageTransition in the root layout), so this only ever fires once per
  // session — the first time it's visible, whether that's immediately on a
  // short page or after scrolling on a longer one. Without it, the footer
  // just sat there fully opaque from frame one while everything above it
  // faded in, which read as an abrupt, ungraceful "pop" on short pages.
  const { ref, visible } = useRevealVisible<HTMLElement>(false);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden rounded-t-card bg-ink text-white"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 700ms var(--ease-spring), transform 700ms var(--ease-spring)",
      }}
    >
      <div className="shell relative z-10 px-5 pt-20 pb-10 sm:px-8 lg:pt-24">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-16 lg:flex-row lg:items-end lg:justify-between">
          <DecryptText
            lines={["Have a project in mind? Let's get to work."]}
            className="max-w-[16ch] text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          />
          <PillButton variant="light" arrow="up-right" onClick={openContactModal}>
            Start a project
          </PillButton>
        </div>

        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 text-lg font-semibold">
              <LogoMark className="size-5" />
              ASE Daniel
            </span>
            <p className="max-w-80 text-sm text-white/55">
              {profile.name} — {profile.title}, building projects at the intersection of software and hardware.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs tracking-wide text-white/40 uppercase">Site</span>
            <ul className="flex flex-col gap-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <AnimatedLink href={link.href}>{link.label}</AnimatedLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openContactModal}
                  className="group inline-flex text-left"
                >
                  <span className="inline-block text-white/65 transition-transform duration-300 ease-(--ease-spring-soft) group-hover:translate-x-1 group-hover:text-white">
                    Contact
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs tracking-wide text-white/40 uppercase">Social</span>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <AnimatedLink href={profile.links.github} external>
                  GitHub
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink href={profile.links.linkedin} external>
                  LinkedIn
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink href={`mailto:${profile.email}`}>Email</AnimatedLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-0 text-center leading-none font-bold whitespace-nowrap text-white/5 select-none"
        style={{ bottom: "-1.5rem", fontSize: "var(--text-watermark)" }}
      >
        ASE DANIEL
      </div>
    </footer>
  );
}
