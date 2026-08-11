"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

// The 3D canvas touches WebGL/`window` on mount — keep it out of the
// server-rendered HTML entirely rather than just deferring it client-side.
const MacBookScene = dynamic(() => import("./macbook-scene").then((mod) => mod.MacBookScene), { ssr: false });

// 3) FINALIZE THIS: the big overlay headline — edit freely, this is a plain string.
const OVERLAY_TEXT = "KEN DANIEL";

export interface HeroInfoItem {
  label: string;
  value: string;
}

// 4) ADJUST THESE: footer info-bar values.
const DEFAULT_INFO_ITEMS: HeroInfoItem[] = [
  { label: "Role", value: "Computer Engineer" },
  { label: "Stack", value: "Next.js / Firebase" },
  { label: "Year", value: "2026" },
  { label: "Focus", value: "AI & Security" },
];

export interface HeroMacBookProps {
  overlayText?: string;
  infoItems?: HeroInfoItem[];
  /**
   * 5) PROVIDE YOUR OWN SCREENSHOTS: paths under /public/hero-screens/, e.g.
   *    ["/hero-screens/image-1.jpg", "/hero-screens/image-2.jpg"]. Empty by
   *    default — the screen renders as a plain dark panel until you add some.
   */
  screenImages?: string[];
}

/**
 * Pinned, scroll-scrubbed 3D MacBook hero — inspired by Framer's "Vidmo"
 * template. GSAP ScrollTrigger owns the pin and drives a single shared
 * `progress` ref (0..1); the R3F scene reads it directly in useFrame (no
 * React re-renders for 60fps rotation), and the same value feeds two
 * Framer Motion values driving the overlay text's fade/rise — one
 * scroll-progress source for both, so they can't drift out of sync.
 */
export function HeroMacBook({ overlayText = OVERLAY_TEXT, infoItems = DEFAULT_INFO_ITEMS, screenImages = [] }: HeroMacBookProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const overlayOpacity = useMotionValue(1);
  const overlayY = useMotionValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" }, (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };
      // Shorter pin range on mobile — the same 180vh of scroll feels much
      // heavier on a small screen with faster natural scroll velocity.
      // A function (not a "+=180vh" string) so it's a real pixel value
      // computed from the actual viewport height, and re-evaluated correctly
      // by ScrollTrigger on refresh/resize.
      const distanceMultiplier = isMobile ? 1.0 : 1.8;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * distanceMultiplier}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          overlayOpacity.set(1 - self.progress);
          overlayY.set(-40 * self.progress);
        },
      });

      return () => trigger.kill();
    });

    return () => mm.revert();
  }, [reducedMotion, overlayOpacity, overlayY]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-screen overflow-hidden rounded-b-card text-white"
      style={{
        background: "radial-gradient(120% 90% at 50% 12%, #2b0c14 0%, #0a0607 55%, #050304 100%)",
      }}
    >
      <div className="absolute inset-0">
        <MacBookScene progress={progressRef} screenImages={screenImages} />
      </div>

      <motion.div
        style={{ opacity: overlayOpacity, y: overlayY }}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 text-center"
      >
        <h1 className="text-[clamp(3rem,12vw,9rem)] leading-none font-semibold tracking-tight text-balance text-white/95 select-none">
          {overlayText}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/25 backdrop-blur-sm"
      >
        <div className="shell grid grid-cols-2 gap-6 px-5 py-6 sm:px-8 md:grid-cols-4">
          {infoItems.map((item) => (
            <div key={item.label}>
              <p className="text-[0.65rem] font-medium tracking-wide text-white/45 uppercase">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-white/90">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
