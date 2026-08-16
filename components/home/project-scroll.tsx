"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { DecryptText } from "@/components/effects/decrypt-text";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { LogoMark, ArrowUpRight } from "@/components/ui/icons";
import { TagChip } from "@/components/ui/tag-chip";
import type { Project } from "@/types/project";
import "./project-scroll.css";

/** Presentation-only category label per project — not a stored field, just a display hint. Mirrors project-card.tsx's mapping. */
const CATEGORY_BY_SLUG: Record<string, string> = {
  "trustmebro-ai": "Cybersecurity",
  swinewatch: "Computer Vision",
  "digital-ears": "Signal Processing",
  "recruitment-workflow-automation": "Automation",
};

const CARD_CLASS = "w-[85vw] shrink-0 sm:w-[26rem]";

/**
 * A pinned section whose horizontal track slides sideways as the page
 * scrolls down — vertical scroll drives horizontal motion, distinct from
 * the vertical pin-stack Services uses. The clip-path focus animation on
 * each card (clipped band -> full reveal) is adapted from the "Skiper 54"
 * Carousel_006 component, driven by scroll position instead of embla
 * clicks/autoplay.
 */
export function ProjectScroll({ projects }: { projects: Project[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxShift, setMaxShift] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  useLayoutEffect(() => {
    function measure() {
      const track = trackRef.current;
      const viewport = sectionRef.current;
      if (!track || !viewport) return;
      setMaxShift(Math.max(0, track.scrollWidth - viewport.clientWidth));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.min(projects.length - 1, Math.floor(value * projects.length));
    setActive((prev) => (prev === index ? prev : index));
  });

  if (reducedMotion) {
    return (
      <div className="project-scroll-track flex gap-6 overflow-x-auto pb-4">
        {projects.map((project) => (
          <ProjectScrollCard key={project.id} project={project} isActive className={CARD_CLASS} />
        ))}
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${(projects.length + 1) * 55}vh` }}>
      <div className="sticky top-0 flex h-[80vh] items-center overflow-hidden">
        <motion.div ref={trackRef} className="flex gap-6 px-[6vw]" style={{ x }}>
          {projects.map((project, index) => (
            <ProjectScrollCard key={project.id} project={project} isActive={index === active} className={CARD_CLASS} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ProjectScrollCard({
  project,
  isActive,
  className,
}: {
  project: Project;
  isActive: boolean;
  className: string;
}) {
  const category = CATEGORY_BY_SLUG[project.slug] ?? project.techStack[0] ?? "Project";

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-active={isActive}
      className={`project-scroll-card group relative flex h-120 flex-col overflow-hidden rounded-card bg-ink p-6 text-white sm:p-8 ${className}`}
    >
      <div className="flex items-center justify-between text-xs tracking-wide text-white/45 uppercase">
        <span>{category}</span>
        <span className="grid size-11 place-items-center rounded-pill bg-white/10 text-white ring-1 ring-white/15 transition-transform duration-300 ease-(--ease-spring-snappy) group-hover:rotate-45 group-hover:scale-108">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <LogoMark className="size-18 text-white/90" />
      </div>

      <div className="project-scroll-card__content relative mt-auto flex flex-col gap-2">
        <DecryptText
          lines={[project.title.split("–")[0].trim()]}
          level={3}
          className="text-2xl font-medium tracking-tight sm:text-3xl"
        />
        <p className="max-w-md text-sm text-white/55">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, 3).map((tech) => (
            <TagChip key={tech} tone="light">
              {tech}
            </TagChip>
          ))}
        </div>
      </div>
    </Link>
  );
}
