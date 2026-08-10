"use client";

import type { Ref } from "react";
import { useDecryptText } from "@/lib/hooks/use-decrypt-text";

interface DecryptTextProps {
  lines: string[];
  level?: 1 | 2 | 3;
  /** Render as a plain paragraph instead of a heading — for non-heading text (e.g. an eyebrow) that still wants the scramble effect. */
  as?: "p";
  className?: string;
  gateOnReady?: boolean;
  delay?: number;
}

/** Character-scramble reveal for headings — drop-in replacement for RevealLines. */
export function DecryptText({ lines, level = 2, as, className, gateOnReady = false, delay = 0 }: DecryptTextProps) {
  const fullText = lines.join("");
  const { ref, display, isScrambling } = useDecryptText<HTMLHeadingElement>(fullText, { gateOnReady, delay });

  const displayLines: string[] = [];
  let cursor = 0;
  for (const line of lines) {
    displayLines.push(display.slice(cursor, cursor + line.length));
    cursor += line.length;
  }

  const content = displayLines.map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));

  const fontClass = isScrambling ? "font-mono" : "";
  const combinedClassName = `${className ?? ""} ${fontClass}`.trim();

  if (as === "p") {
    return (
      <p ref={ref as unknown as Ref<HTMLParagraphElement>} className={combinedClassName}>
        {content}
      </p>
    );
  }

  if (level === 1) {
    return (
      <h1 ref={ref} className={combinedClassName}>
        {content}
      </h1>
    );
  }

  if (level === 3) {
    return (
      <h3 ref={ref} className={combinedClassName}>
        {content}
      </h3>
    );
  }

  return (
    <h2 ref={ref} className={combinedClassName}>
      {content}
    </h2>
  );
}
