"use client";

import type { ReactNode } from "react";
import { useRevealVisible } from "@/components/effects/use-reveal-visible";

interface Reveal3DProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Flip-in reveal: rotates down from a tilted-back position into place, like a card being set down. */
export function Reveal3D({ children, delay = 0, className }: Reveal3DProps) {
  const { ref, visible } = useRevealVisible<HTMLDivElement>(false);

  return (
    <div ref={ref} className={className} style={{ perspective: "1000px" }}>
      <div
        style={{
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          transform: visible ? "rotateX(0deg) translateY(0)" : "rotateX(-50deg) translateY(24px)",
          opacity: visible ? 1 : 0,
          transition: `transform 800ms var(--ease-spring) ${delay}ms, opacity 800ms var(--ease-spring) ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
