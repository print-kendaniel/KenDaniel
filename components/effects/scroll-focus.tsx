"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { rafTicker } from "@/lib/raf-ticker";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

/** Fraction of viewport height that stays fully sharp/at scale, centered vertically. */
const FOCUS_BAND_RATIO = 0.4;
const MAX_BLUR_PX = 4;
const MIN_SCALE = 0.97;

interface ScrollFocusProps {
  children: ReactNode;
  className?: string;
}

/**
 * Blurs and scales down elements as they drift away from the vertical
 * center of the viewport, sharpening back to normal as they re-enter the
 * focus band. Written via direct style mutation each tick (not React state)
 * to avoid re-render thrash — same approach as `Parallax`. Compose this as
 * an outer wrapper around existing Reveal and TiltCard components rather
 * than replacing them; each controls its own DOM node so the effects layer
 * without fighting each other.
 */
export function ScrollFocus({ children, className }: ScrollFocusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      if (ref.current) {
        ref.current.style.filter = "";
        ref.current.style.transform = "";
      }
      return;
    }

    const unsubscribe = rafTicker.subscribe(() => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const focusBandHalf = (viewportHeight * FOCUS_BAND_RATIO) / 2;

      const distance = Math.abs(elementCenter - viewportCenter);
      const beyond = Math.max(0, distance - focusBandHalf);
      const maxDistance = viewportHeight / 2;
      const progress = Math.min(1, beyond / maxDistance);

      const blur = progress * MAX_BLUR_PX;
      const scale = 1 - progress * (1 - MIN_SCALE);

      node.style.filter = blur > 0.05 ? `blur(${blur}px)` : "";
      node.style.transform = scale < 0.999 ? `scale(${scale})` : "";
    });

    return unsubscribe;
  }, [reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
