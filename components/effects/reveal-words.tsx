"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRevealVisible } from "@/components/effects/use-reveal-visible";

interface RevealWordsProps {
  /** Segments let part of the text carry a different className (e.g. a muted tail), like the About statement. */
  segments: { text: string; className?: string }[];
  className?: string;
  wordStagger?: number;
  delay?: number;
}

/** Splits text into words that slide-up-and-fade in, staggered per word. */
export function RevealWords({ segments, className, wordStagger = 35, delay = 0 }: RevealWordsProps) {
  const { ref, visible } = useRevealVisible<HTMLHeadingElement>(false);

  let wordIndex = 0;
  const rendered: ReactNode[] = [];

  segments.forEach((segment, segmentIndex) => {
    const words = segment.text.split(" ");
    words.forEach((word, i) => {
      const currentIndex = wordIndex;
      wordIndex += 1;
      const style: CSSProperties = {
        display: "inline-block",
        transform: visible ? "translateY(0)" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transition: `transform 700ms var(--ease-out-quart) ${delay + currentIndex * wordStagger}ms, opacity 700ms var(--ease-out-quart) ${delay + currentIndex * wordStagger}ms`,
      };

      rendered.push(
        <span key={`${segmentIndex}-${i}`} className={segment.className} style={style}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>,
      );
    });
  });

  return (
    <h2 ref={ref} className={className}>
      {rendered}
    </h2>
  );
}
