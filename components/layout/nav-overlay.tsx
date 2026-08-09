"use client";

import { useEffect } from "react";
import { useScrollLock } from "@/components/effects/scroll-provider";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { profile } from "@/lib/content/profile";
import { StaggeredMenu, type StaggeredMenuItem } from "@/components/effects/staggered-menu";

const navItems: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to home page", href: "/" },
  { label: "Projects", ariaLabel: "View projects", href: "/projects" },
  { label: "About", ariaLabel: "Learn about me", href: "/about" },
  { label: "Blog", ariaLabel: "Read the blog", href: "/blog" },
  { label: "Contact", ariaLabel: "Get in touch", href: null },
];

const socialItems = [
  { label: "GitHub", link: profile.links.github },
  { label: "LinkedIn", link: profile.links.linkedin },
  { label: "Email", link: `mailto:${profile.email}` },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
  const { stopScroll, startScroll } = useScrollLock();
  const { openContactModal } = useContactModal();

  useEffect(() => {
    if (!isOpen) return;
    stopScroll();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      startScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stopScroll/startScroll/onClose are stable callbacks
  }, [isOpen]);

  function handleNavigate(item: StaggeredMenuItem) {
    onClose();
    if (!item.href) openContactModal();
  }

  return (
    <div className="fixed inset-0 z-115" style={{ pointerEvents: isOpen ? "auto" : "none" }} aria-hidden={!isOpen}>
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        aria-hidden
      />
      <StaggeredMenu
        open={isOpen}
        onClose={onClose}
        onNavigate={handleNavigate}
        items={navItems}
        socialItems={socialItems}
        colors={["#80011f", "#e0c9a0", "#f7e7ce"]}
        accentColor="#80011f"
      />
    </div>
  );
}
