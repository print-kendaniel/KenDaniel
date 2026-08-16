import Link from "next/link";
import { RevealFade } from "@/components/effects/reveal-fade";
import { DecryptText } from "@/components/effects/decrypt-text";
import { ScrollStack, ScrollStackItem } from "@/components/effects/scroll-stack";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LogoMark, ArrowUpRight } from "@/components/ui/icons";
import { TagChip } from "@/components/ui/tag-chip";
import type { Project } from "@/types/project";

/** Presentation-only category label per project — not a stored field, just a display hint. Mirrors project-card.tsx's mapping. */
const CATEGORY_BY_SLUG: Record<string, string> = {
  "trustmebro-ai": "Cybersecurity",
  swinewatch: "Computer Vision",
  "digital-ears": "Signal Processing",
  "recruitment-workflow-automation": "Automation",
};

/**
 * Scroll-driven, not click-driven: each project pins and comes into focus as
 * the visitor scrolls through the stack, like picking a card, rather than
 * requiring arrow/dot clicks. Built on the same ScrollStack pin+scrub
 * mechanism already used by the Services section.
 */
export function PortfolioSection({ projects }: { projects: Project[] }) {
  return (
    <section id="works">
      <div className="shell px-5 pt-10 pb-20 sm:px-8 lg:pb-28">
        <div className="mb-12 flex flex-col items-center gap-5 text-center">
          <RevealFade>
            <Eyebrow className="rounded-pill border border-line px-4 py-1.5">Portfolio</Eyebrow>
          </RevealFade>
          <DecryptText
            lines={["Selected Work"]}
            delay={120}
            className="w-fit text-4xl font-semibold tracking-tight sm:text-5xl"
          />
        </div>

        <RevealFade delay={100} translateY={40}>
          <ScrollStack style={{ height: "82vh" }} itemDistance={90} itemStackDistance={24} baseScale={0.88}>
            {projects.map((project) => {
              const category = CATEGORY_BY_SLUG[project.slug] ?? project.techStack[0] ?? "Project";

              return (
                <ScrollStackItem key={project.id} itemClassName="project-stack-card">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group relative flex h-full flex-col p-6 text-white sm:p-8"
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
                </ScrollStackItem>
              );
            })}
          </ScrollStack>
        </RevealFade>
      </div>
    </section>
  );
}
