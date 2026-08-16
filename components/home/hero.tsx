"use client";

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import type { Project } from "@/types/project";
import { TagChip } from "@/components/ui/tag-chip";
import {
  SiNextdotjs,
  SiFirebase,
  SiReact,
  SiDocker,
  SiPython,
  SiTensorflow,
  SiOpencv,
  SiN8N,
  SiTailwindcss,
  SiRaspberrypi,
  SiCloudinary,
  SiFastapi,
  SiGooglechrome,
  SiGooglegemini,
} from "react-icons/si";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowRight, ArrowDown, ArrowUpRight } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { DriftWall, type DriftWallItem } from "@/components/effects/drift-wall";
import { DecryptText } from "@/components/effects/decrypt-text";
import { profile, programYears } from "@/lib/content/profile";

// The real tech stack across this site's projects (scripts/seed.ts) plus
// the "Built with" list — nothing invented.
const techStack: DriftWallItem[] = [
  { icon: SiNextdotjs, label: "Next.js" },
  { icon: SiFirebase, label: "Firebase" },
  { icon: SiReact, label: "React" },
  { icon: SiDocker, label: "Docker" },
  { icon: SiPython, label: "Python" },
  { icon: SiTensorflow, label: "TensorFlow" },
  { icon: SiOpencv, label: "OpenCV" },
  { icon: SiN8N, label: "n8n" },
  { icon: SiTailwindcss, label: "Tailwind CSS" },
  { icon: SiRaspberrypi, label: "Raspberry Pi" },
  { icon: SiCloudinary, label: "Cloudinary" },
  { icon: SiFastapi, label: "FastAPI" },
  { icon: SiGooglechrome, label: "Chrome Extension" },
  { icon: SiGooglegemini, label: "Gemini AI" },
];

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
export function Hero({ projectsCount, latestProject }: { projectsCount: number; latestProject: Project | null }) {
  const { openContactModal } = useContactModal();
  const reducedMotion = usePrefersReducedMotion();

  const stats = [
    { value: projectsCount, label: "Projects shipped" },
    { value: profile.certifications.length, label: "Certifications" },
    { value: programYears(), label: "Years in CpE" },
  ];

  return (
    <section className="relative isolate min-h-[90vh] overflow-hidden rounded-b-card text-white">
      <motion.div
        className="relative flex min-h-[90vh] w-full flex-col overflow-hidden"
        initial={reducedMotion ? "visible" : "hidden"}
        animate="visible"
        variants={sectionVariants}
      >
        <motion.div variants={photoVariants} className="pointer-events-none absolute inset-0">
          <DriftWall items={techStack} columns={6} tileWidth={160} tileHeight={106} gap={16} speed={30} />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/45" />

        <div className="shell relative z-10 flex flex-1 items-center px-5 pt-28 pb-20 sm:px-8 lg:pt-32 lg:pb-24">
          <div className="grid w-full gap-12 lg:grid-cols-12 lg:items-center">
            <div className="max-w-xl lg:col-span-7">
            <motion.div variants={copyVariants}>
              <DecryptText
                lines={["Associate Software Engineer"]}
                as="p"
                gateOnReady
                delay={300}
                className="text-xs font-medium tracking-wide text-white/80 uppercase"
              />
            </motion.div>

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

              <motion.div variants={buttonVariants} className="flex items-center gap-2">
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="grid size-10 place-items-center rounded-pill border border-white/20 bg-white/10 text-white/85 backdrop-blur-xs transition-colors hover:bg-white/20 hover:text-white"
                >
                  <FaGithub className="size-4" />
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="grid size-10 place-items-center rounded-pill border border-white/20 bg-white/10 text-white/85 backdrop-blur-xs transition-colors hover:bg-white/20 hover:text-white"
                >
                  <FaLinkedin className="size-4" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div variants={buttonRowVariants} className="mt-14 flex flex-wrap items-center gap-10">
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={buttonVariants}>
                  <span className="tabular-nums text-3xl font-semibold tracking-tight sm:text-4xl">{stat.value}</span>
                  <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            </div>

            {latestProject && (
              <motion.div variants={copyVariants} className="lg:col-span-5 lg:flex lg:justify-end">
                <Link
                  href={`/projects/${latestProject.slug}`}
                  className="group block w-full max-w-sm rounded-card border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/15 sm:p-7"
                >
                  <div className="flex items-center justify-between text-xs font-medium tracking-wide text-white/60 uppercase">
                    <span>Featured project</span>
                    <span className="grid size-9 place-items-center rounded-pill bg-white/10 ring-1 ring-white/15 transition-transform duration-300 ease-(--ease-spring-snappy) group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-medium tracking-tight sm:text-2xl">
                    {latestProject.title.split("–")[0].trim()}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{latestProject.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {latestProject.techStack.slice(0, 3).map((tech) => (
                      <TagChip key={tech} tone="light">
                        {tech}
                      </TagChip>
                    ))}
                  </div>
                </Link>
              </motion.div>
            )}
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
