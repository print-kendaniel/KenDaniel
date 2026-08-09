"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useIntroReady } from "@/components/effects/intro-ready-context";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { useLiveClock } from "@/lib/hooks/use-live-clock";
import { LogoMark, GridIcon } from "@/components/ui/icons";
import { NavOverlay } from "@/components/layout/nav-overlay";
import { MagneticNavLink } from "@/components/ui/magnetic-nav-link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: null },
];

export function Header() {
  const { ready } = useIntroReady();
  const { openContactModal } = useContactModal();
  const { time, date } = useLiveClock();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <header
        // Only Home has a full-bleed hero to float over; everywhere else the
        // header needs to sit in normal flow, or it overlaps the page's own
        // heading instead of pushing it down.
        className={isHome ? "absolute inset-x-0 top-0 z-50" : "sticky top-0 z-50 border-b border-line/60 bg-background/80 backdrop-blur-sm"}
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(-14px)",
          transition: "opacity 700ms var(--ease-spring) 150ms, transform 700ms var(--ease-spring) 150ms",
        }}
      >
        <div className="shell flex items-center justify-between gap-6 px-5 py-5 sm:px-8 sm:py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight transition-transform duration-300 ease-(--ease-spring-snappy) hover:scale-104"
          >
            <LogoMark className="size-5 text-accent" />
            ASE Daniel
          </Link>

          <ul className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {navItems.map((item) => (
              <li key={item.label}>
                <MagneticNavLink
                  label={item.label}
                  href={item.href}
                  onClick={openContactModal}
                  className="inline-block opacity-80 transition-transform duration-300 ease-(--ease-spring-snappy) hover:-translate-y-0.5 hover:opacity-100"
                />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-control border border-line/80 bg-white/40 px-3 py-2 text-xs text-black/70 backdrop-blur-xs md:flex">
              <span className="text-black/45">Local time</span>
              <span className="tabular-nums min-w-14 font-medium text-black">{time}</span>
              <span className="text-black/30">•</span>
              <span className="font-medium">{date}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsNavOpen(true)}
              className="rounded-control border border-line/80 bg-white/40 backdrop-blur-xs transition-colors hover:bg-white/70"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide uppercase transition-transform duration-300 ease-(--ease-spring-snappy) hover:scale-105">
                <GridIcon className="size-3.5" />
                <span className="hidden sm:inline">Menu</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <NavOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
}
