"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

// 1) SWAP THESE: real photos, /public/gallery/img-1.jpg .. img-9.jpg.
const images = [
  "/gallery/img-1.jpg",
  "/gallery/img-2.jpg",
  "/gallery/img-3.jpg",
  "/gallery/img-4.jpg",
  "/gallery/img-5.jpg",
  "/gallery/img-6.jpg",
  "/gallery/img-7.jpg",
  "/gallery/img-8.jpg",
  "/gallery/img-9.jpg",
];

/**
 * Multi-column scroll parallax gallery — adapted from the "Skiper 30"
 * community component (itself inspired by siena.film's site). Ported to
 * this codebase's existing `motion` package (framer-motion's current
 * name, already installed for Dock/StaggeredMenu/ScrollStack) instead of
 * adding a second copy via `framer-motion`.
 *
 * Dropped the source's own local Lenis instance entirely — this site
 * already runs a single global Lenis smoother (see ScrollProvider,
 * mounted in app/layout.tsx). A second instance here would fight it for
 * scroll input, the same class of bug already hit once this session with
 * GSAP ScrollTrigger. `useScroll`/`useTransform` read real scroll
 * position directly and work fine against the existing smoother without
 * needing their own.
 */
export function ParallaxGallery() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const resize = () => setDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section aria-label="Photo gallery" className="w-full overflow-hidden bg-surface text-black">
      <div className="flex h-[45dvh] items-center justify-center">
        <span className="relative max-w-[12ch] text-center text-xs leading-tight tracking-wide text-black/40 uppercase after:absolute after:top-full after:left-1/2 after:h-16 after:w-px after:bg-linear-to-b after:from-black/30 after:to-transparent after:content-['']">
          Scroll to see
        </span>
      </div>

      <div ref={gallery} className="relative box-border flex h-[175dvh] gap-[2vw] overflow-hidden p-[2vw]">
        <Column images={[images[0], images[1], images[2]]} y={reducedMotion ? undefined : y} top="-45%" />
        <Column images={[images[3], images[4], images[5]]} y={reducedMotion ? undefined : y2} top="-95%" />
        <Column images={[images[6], images[7], images[8]]} y={reducedMotion ? undefined : y3} top="-45%" />
        <Column images={[images[6], images[7], images[8]]} y={reducedMotion ? undefined : y4} top="-75%" />
      </div>
    </section>
  );
}

interface ColumnProps {
  images: string[];
  y?: MotionValue<number>;
  top: string;
}

function Column({ images: columnImages, y, top }: ColumnProps) {
  return (
    <motion.div
      className="relative flex h-full w-1/4 min-w-0 flex-col gap-[2vw] sm:min-w-55"
      style={{ y, top }}
    >
      {columnImages.map((src, i) => (
        <div key={src + i} className="relative h-full w-full overflow-hidden rounded-card-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- scroll-parallax reads this element's layout directly, next/image's wrapper interferes with the column's height math */}
          <img src={src} alt="" className="pointer-events-none h-full w-full object-cover" />
        </div>
      ))}
    </motion.div>
  );
}
