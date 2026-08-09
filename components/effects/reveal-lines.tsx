"use client";

import type { CSSProperties } from "react";
import { useRevealVisible } from "@/components/effects/use-reveal-visible";

interface RevealLinesProps {
  lines: string[];
  className?: string;
  lineStagger?: number;
  delay?: number;
  gateOnReady?: boolean;
  level?: 1 | 2;
}

/** Splits a heading into lines that clip-reveal (slide up from behind an overflow mask), staggered per line. */
export function RevealLines({
  lines,
  className,
  lineStagger = 0,
  delay = 0,
  gateOnReady = false,
  level = 2,
}: RevealLinesProps) {
  const { ref, visible } = useRevealVisible<HTMLHeadingElement>(gateOnReady);

  const content = lines.map((line, index) => {
    const style: CSSProperties = {
      display: "block",
      transform: visible ? "translateY(0%)" : "translateY(100%)",
      opacity: visible ? 1 : 0,
      transition: `transform 900ms var(--ease-out-cubic) ${delay + index * lineStagger}ms, opacity 900ms var(--ease-out-cubic) ${delay + index * lineStagger}ms`,
    };

    return (
      <span key={line} style={{ display: "block", overflow: "hidden" }}>
        <span style={style}>{line}</span>
      </span>
    );
  });

  if (level === 1) {
    return (
      <h1 ref={ref} className={className}>
        {content}
      </h1>
    );
  }

  return (
    <h2 ref={ref} className={className}>
      {content}
    </h2>
  );
}
