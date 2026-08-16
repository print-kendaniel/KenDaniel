"use client";

import Image from "next/image";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const MAX_TILT_DEG = 8;

/** Portrait that tilts toward the cursor in 3D, like a physical print card. Disabled on touch and reduced-motion. */
export function TiltPortrait({ src, alt }: { src: string; alt: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    frame.style.transform = `perspective(1000px) rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(px * MAX_TILT_DEG).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseLeave() {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.transform = "";
  }

  return (
    <div
      className="[perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-card shadow-[0_30px_60px_-30px_rgba(10,10,15,0.35)] transition-transform duration-500 ease-(--ease-spring-soft) will-change-transform"
        style={{ aspectRatio: "3 / 4" }}
      >
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" priority />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-tr from-ink/15 via-transparent to-white/10"
        />
      </div>
    </div>
  );
}
