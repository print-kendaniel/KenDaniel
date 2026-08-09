"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollLockContextValue {
  stopScroll: () => void;
  startScroll: () => void;
  /** Instantaneous scroll velocity from Lenis (px/frame, signed). Used for scroll-driven effects like chromatic aberration. */
  getScrollVelocity: () => number;
}

const ScrollLockContext = createContext<ScrollLockContextValue | null>(null);

/**
 * Owns the single Lenis smooth-scroll instance for the whole app and
 * exposes stop/start so overlays (loader, nav menu, contact modal) can
 * lock scrolling while they're open. Lock state is reference-counted so
 * nested/overlapping locks (rare, but possible) don't unlock too early.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockCountRef = useRef(0);
  const [, forceRender] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis({ smoothWheel: true });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Each route has different content height. Without this, Lenis keeps the
  // previous page's scroll bounds/momentum, which is what makes navigating
  // between pages feel laggy/janky — it's scrolling against stale math.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    // Let the new route's content paint before recalculating scroll height.
    const timeout = setTimeout(() => lenis.resize(), 50);
    return () => clearTimeout(timeout);
  }, [pathname]);

  function stopScroll() {
    lockCountRef.current += 1;
    lenisRef.current?.stop();
    document.documentElement.style.position = "relative";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    forceRender((n) => n + 1);
  }

  function startScroll() {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current > 0) return;
    lenisRef.current?.start();
    document.documentElement.style.removeProperty("position");
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("height");
    forceRender((n) => n + 1);
  }

  function getScrollVelocity() {
    return lenisRef.current?.velocity ?? 0;
  }

  return (
    <ScrollLockContext.Provider value={{ stopScroll, startScroll, getScrollVelocity }}>
      {children}
    </ScrollLockContext.Provider>
  );
}

export function useScrollLock(): ScrollLockContextValue {
  const context = useContext(ScrollLockContext);
  if (!context) {
    throw new Error("useScrollLock must be used within a ScrollProvider");
  }
  return context;
}
