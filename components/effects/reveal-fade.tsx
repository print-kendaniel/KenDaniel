"use client";

import type { ReactNode } from "react";
import { useRevealVisible } from "@/components/effects/use-reveal-visible";

interface RevealFadeProps {
  children: ReactNode;
  delay?: number;
  translateY?: number;
  scaleFrom?: number;
  className?: string;
}

/** Generic scroll-into-view fade+slide (and optional scale-in), used for cards/rows/pills across Home. */
export function RevealFade({ children, delay = 0, translateY = 24, scaleFrom, className }: RevealFadeProps) {
  const { ref, visible } = useRevealVisible<HTMLDivElement>(false);

  const transforms = [visible ? "translateY(0)" : `translateY(${translateY}px)`];
  if (scaleFrom !== undefined) {
    transforms.push(visible ? "scale(1)" : `scale(${scaleFrom})`);
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms.join(" "),
        transition: `opacity 700ms var(--ease-spring) ${delay}ms, transform 700ms var(--ease-spring) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
