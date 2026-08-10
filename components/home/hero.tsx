"use client";

import { motion, type Variants } from "motion/react";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowRight, ArrowDown } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.14 } },
};

const photoVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04, filter: "blur(12px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: "spring", duration: 1.08, bounce: 0 } },
};

const copyVariants: Variants = {
  hidden: { opacity: 0, x: -22, filter: "blur(8px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", duration: 0.78, bounce: 0 } },
};

const buttonRowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { type: "spring", duration: 0.58, bounce: 0 } },
};

/**
 * Full-bleed photo hero, adapted from the "hero-19" community layout. The
 * template's own nav bar is dropped — this site already has a global
 * `Header` (logo, links, live clock, menu) rendered above every page in
 * `app/layout.tsx`, so a second nav here would just duplicate it.
 */
export function Hero() {
  const { openContactModal } = useContactModal();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative isolate min-h-screen overflow-hidden rounded-b-card text-white">
      <motion.div
        className="relative flex min-h-screen w-full flex-col overflow-hidden"
        initial={reducedMotion ? "visible" : "hidden"}
        animate="visible"
        variants={sectionVariants}
      >
        <motion.img
          variants={photoVariants}
          src="/about/portrait.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/25" />

        <div className="shell relative z-10 flex flex-1 items-center px-5 pt-28 pb-20 sm:px-8 lg:pt-36 lg:pb-28">
          <div className="max-w-xl">
            <motion.p variants={copyVariants} className="text-xs font-medium tracking-wide text-white/80 uppercase">
              Computer Engineer, Class of 2026
            </motion.p>

            <motion.h1
              variants={copyVariants}
              className="mt-5 text-[clamp(2.5rem,5.5vw,4.4rem)] leading-[1.04] font-semibold tracking-tight text-balance"
            >
              <span className="block">Engineering ideas,</span>
              <span className="block">shipped with precision</span>
            </motion.h1>

            <motion.p variants={copyVariants} className="mt-5 max-w-md text-sm leading-relaxed text-white/80">
              AI security tools, computer vision systems, and workflow automation that ships.
            </motion.p>

            <motion.div variants={buttonRowVariants} className="mt-8 flex flex-wrap items-center gap-5">
              <motion.div variants={buttonVariants}>
                <PillButton variant="light" arrow="right" onClick={openContactModal}>
                  Let&apos;s Talk
                </PillButton>
              </motion.div>
              <motion.a
                variants={buttonVariants}
                href="/projects"
                className="group inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                View Work
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.a>
            </motion.div>
          </div>
        </div>

        <motion.a
          variants={copyVariants}
          href="#main"
          className="absolute right-6 bottom-6 z-10 hidden items-center gap-3 text-xs font-medium tracking-wide text-white/80 uppercase transition-colors hover:text-white sm:inline-flex lg:right-10 lg:bottom-10"
        >
          Scroll to explore
          <ArrowDown className="size-3.5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
