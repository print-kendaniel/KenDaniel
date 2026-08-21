"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin fixed bar reflecting how far through the page the visitor has scrolled — a position readout, not a decorative animation, so it isn't gated behind prefers-reduced-motion. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-40 h-1 origin-left bg-accent" style={{ scaleX }} />;
}
