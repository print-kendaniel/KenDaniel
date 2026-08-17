"use client";

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

/**
 * Minimal CSS-drawn laptop mockup — no stock product photo, just a dark
 * bezel + a thin hinge bar — with an ambient looping video standing in for
 * the character sticker. The purple-tinted overlay keeps the video from
 * reading as a flat rectangular embed dropped onto the backdrop; it blends
 * into the same radial glow the rest of the hero uses.
 */
export function HeroMacbook() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="mx-auto w-[82vw] max-w-sm sm:max-w-lg lg:max-w-xl">
      <div
        className="relative overflow-hidden rounded-2xl border-4 border-black/70 bg-black shadow-[0_50px_100px_-30px_rgba(161,0,255,0.5)] sm:border-[6px]"
        style={{ aspectRatio: "16 / 10" }}
      >
        <video
          src="/hero/reel.webm"
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/40 via-transparent to-black/10 mix-blend-multiply"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
        <span aria-hidden className="absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white/20 sm:top-1.5" />
      </div>
      <div className="mx-auto h-1.5 w-[94%] rounded-b-lg bg-linear-to-b from-white/15 to-white/0 sm:h-2" />
      <div className="mx-auto h-1 w-[36%] rounded-full bg-white/10" />
    </div>
  );
}
