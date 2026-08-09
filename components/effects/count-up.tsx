"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
}

/**
 * Scroll-progress-driven counter: 0 when the element's top reaches the
 * viewport bottom, 1 when its center reaches the viewport center. Scrubs
 * continuously (not a one-shot animation) while scrolling through that range.
 *
 * Derivation: let topA = rect.top when progress=0 (element top at viewport
 * bottom) = viewportHeight. Let topB = rect.top when progress=1 (element
 * center at viewport center) = viewportHeight/2 - rect.height/2. Progress is
 * the linear interpolation of rect.top between topA and topB.
 */
export function CountUp({ value, suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    function update() {
      tickingRef.current = false;
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const denom = viewportHeight / 2 + rect.height / 2;
      const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / denom));

      setDisplay(Math.round(progress * value));
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
