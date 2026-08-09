"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { rafTicker } from "@/lib/raf-ticker";
import { useScrollLock } from "@/components/effects/scroll-provider";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const MAX_OFFSET_PX = 2;
const VELOCITY_TO_OFFSET = 0.05;
/** Multiplicative decay per tick — offset falls to ~0 within roughly 250ms at 60fps once scroll stops. */
const DECAY = 0.85;

interface ChromaticAberrationProps {
  children: ReactNode;
  className?: string;
}

/** Wraps children with an SVG filter that RGB-splits by scroll velocity, easing back to normal once scrolling stops. */
export function ChromaticAberration({ children, className }: ChromaticAberrationProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const filterId = `chromatic-${rawId}`;
  const redOffsetRef = useRef<SVGFEOffsetElement>(null);
  const blueOffsetRef = useRef<SVGFEOffsetElement>(null);
  const currentOffsetRef = useRef(0);
  const { getScrollVelocity } = useScrollLock();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      currentOffsetRef.current = 0;
      redOffsetRef.current?.setAttribute("dx", "0");
      blueOffsetRef.current?.setAttribute("dx", "0");
      return;
    }

    const unsubscribe = rafTicker.subscribe(() => {
      const velocity = Math.abs(getScrollVelocity());
      const target = Math.min(velocity * VELOCITY_TO_OFFSET, MAX_OFFSET_PX);
      const current = currentOffsetRef.current;
      const next = target > current ? target : current * DECAY;
      currentOffsetRef.current = next < 0.01 ? 0 : next;

      redOffsetRef.current?.setAttribute("dx", String(-currentOffsetRef.current));
      blueOffsetRef.current?.setAttribute("dx", String(currentOffsetRef.current));
    });

    return unsubscribe;
  }, [reducedMotion, getScrollVelocity]);

  return (
    <div className={className} style={reducedMotion ? undefined : { filter: `url(#${filterId})` }}>
      <svg aria-hidden focusable="false" className="absolute h-0 w-0 overflow-hidden">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feOffset ref={redOffsetRef} in="red" dx="0" dy="0" result="redOffset" />

            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />

            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feOffset ref={blueOffsetRef} in="blue" dx="0" dy="0" result="blueOffset" />

            <feBlend in="redOffset" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blueOffset" mode="screen" />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
}
