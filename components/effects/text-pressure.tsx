"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import "./text-pressure.css";

export interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
}

interface Point {
  x: number;
  y: number;
}

const dist = (a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

function debounce<Args extends unknown[]>(func: (...args: Args) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Ported from a React Bits component (via a CodePen original) — variable-font
 * weight/width/italic axes driven by cursor distance per character. JS ->
 * strict TypeScript. Font loading is intentionally different from the
 * source: the original does a runtime `@import` of a Google Fonts URL inside
 * a `<style>` tag; this app already loads all fonts through `next/font`
 * (see `app/layout.tsx`), so the caller is expected to pass a `fontFamily`
 * resolved from a `next/font/google` variable font instead of a `fontUrl`.
 */
export function TextPressure({
  text = "Compressa",
  fontFamily = "sans-serif",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#ffffff",
  strokeColor = "#ff0000",
  className = "",
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const cursorRef = useRef<Point>({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const reducedMotion = usePrefersReducedMotion();

  const chars = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width: w, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + w / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [reducedMotion]);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }

      // The estimate above assumes ~0.5em average character advance, which
      // undershoots for some variable fonts (Roboto Flex measures wider) and
      // overflows a tight container — shrink once more to actually fit.
      const renderedWidth = titleRef.current.scrollWidth;
      if (renderedWidth > containerW && renderedWidth > 0) {
        setFontSize((prev) => prev * (containerW / renderedWidth) * 0.98);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener("resize", debouncedSetSize);
    return () => window.removeEventListener("resize", debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    if (reducedMotion) return;

    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter: Point = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

          const d = dist(mouseRef.current, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (span.style.fontVariationSettings !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings;
          }
          if (alpha && span.style.opacity !== String(alphaVal)) {
            span.style.opacity = String(alphaVal);
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, reducedMotion]);

  const dynamicClassName = [className, flex ? "text-pressure-flex" : "", stroke ? "text-pressure-stroke" : ""]
    .filter(Boolean)
    .join(" ");

  const titleStyle: CSSProperties = {
    fontFamily,
    textTransform: "uppercase",
    fontSize,
    lineHeight,
    transform: `scale(1, ${scaleY})`,
    transformOrigin: "center top",
    margin: 0,
    textAlign: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    fontWeight: 100,
    width: "100%",
    color: textColor,
    ...(stroke ? ({ "--tp-stroke-color": strokeColor } as CSSProperties) : {}),
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}>
      <h1 ref={titleRef} className={dynamicClassName} style={titleStyle}>
        {chars.map((char, i) => (
          <span
            key={`${char}-${i}`}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{ display: "inline-block", color: stroke ? undefined : textColor }}
          >
            {/* A lone whitespace text node inside an inline-block collapses to zero
                width in most browsers — only matters for multi-word text, which the
                original component's single-word demos never exercised. */}
            {char === " " ? " " : char}
          </span>
        ))}
      </h1>
    </div>
  );
}
