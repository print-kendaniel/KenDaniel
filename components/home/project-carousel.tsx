"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { LogoMark, ArrowUpRight, ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { TagChip } from "@/components/ui/tag-chip";
import { DecryptText } from "@/components/effects/decrypt-text";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import type { Project } from "@/types/project";

/** Presentation-only category label per project — not a stored field, just a display hint. Mirrors project-card.tsx's mapping. */
const CATEGORY_BY_SLUG: Record<string, string> = {
  "trustmebro-ai": "Cybersecurity",
  swinewatch: "Computer Vision",
  "digital-ears": "Signal Processing",
  "recruitment-workflow-automation": "Automation",
};

/**
 * Carousel adapted from the "Skiper 54" community component. The source
 * carousels a set of photos with a focus/blur clip-path effect and a
 * title that flies in on the selected slide; this site has no project
 * photography (coverImage is unset for every project — see
 * scripts/seed.ts), so each slide is a project "tab" card instead of a
 * picture — the same always-visible title/summary/tech-stack content as
 * the grid's ProjectCard, just carouseled with the same focus-scale
 * interaction on the active slide.
 *
 * Also swapped: framer-motion -> this codebase's existing `motion`
 * package, and dropped the shadcn/ui Carousel + Autoplay-plugin wrapper
 * in favor of calling embla-carousel-react directly — this is the only
 * carousel on the site, the extra abstraction layer wasn't buying
 * anything, and autoplay was never enabled in the source's own usage.
 */
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, slidesToScroll: 1 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {projects.map((project, index) => {
            const category = CATEGORY_BY_SLUG[project.slug] ?? project.techStack[0] ?? "Project";
            const isActive = current === index;

            return (
              <div
                key={project.id}
                className="relative min-w-0 shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[36%]"
              >
                <motion.div
                  initial={false}
                  animate={
                    reducedMotion
                      ? { clipPath: "inset(0 0 0 0 round 2rem)" }
                      : { clipPath: isActive ? "inset(0 0 0 0 round 2rem)" : "inset(8% 0 8% 0 round 2rem)" }
                  }
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-125 overflow-hidden rounded-card sm:h-135"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group relative flex h-full flex-col bg-ink p-6 text-white ring-1 ring-white/5 sm:p-8"
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

                    <div className="relative mt-auto flex flex-col gap-2">
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
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous project"
          onClick={scrollPrev}
          className="grid size-11 place-items-center rounded-pill border border-line bg-surface text-black/70 transition-transform duration-300 ease-(--ease-spring-snappy) hover:-translate-x-0.5 hover:text-black"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to ${project.title.split("–")[0].trim()}`}
              className={`h-2 rounded-pill transition-all duration-300 ${
                current === index ? "w-6 bg-ink" : "w-2 bg-line"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next project"
          onClick={scrollNext}
          className="grid size-11 place-items-center rounded-pill border border-line bg-surface text-black/70 transition-transform duration-300 ease-(--ease-spring-snappy) hover:translate-x-0.5 hover:text-black"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
