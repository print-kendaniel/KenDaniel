"use client";

import { SplineScene } from "@/components/ui/spline-scene";
import { Spotlight } from "@/components/ui/spotlight";
import { LogoMark } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

// A generic demo scene (from the community "Spline hero" component this was
// ported from) — not designed for this site specifically. Swap this for a
// scene from your own Spline project once you have one.
const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Interactive 3D scene replacing the character sticker. Unlike the sticker/
 * video it replaces, this needs pointer events — Spline scenes are meant to
 * be dragged/orbited, so the wrapping slot in Hero must not be
 * pointer-events-none. Under prefers-reduced-motion, skips the WebGL scene
 * (and its multi-megabyte runtime download) entirely for a static panel.
 */
export function HeroSpline() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative h-[46dvh] w-[88vw] max-w-2xl overflow-hidden rounded-card bg-black/90 ring-1 ring-white/10 sm:h-[56dvh]">
      {!reducedMotion && <Spotlight className="-top-20 left-0 sm:left-40" size={280} />}
      {reducedMotion ? (
        <div className="grid h-full place-items-center">
          <LogoMark className="size-16 text-white/30" />
        </div>
      ) : (
        <SplineScene scene={SPLINE_SCENE_URL} className="h-full w-full" />
      )}
    </div>
  );
}
