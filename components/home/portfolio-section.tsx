import { RevealFade } from "@/components/effects/reveal-fade";
import { DecryptText } from "@/components/effects/decrypt-text";
import { SpatialGrid } from "@/components/effects/spatial-grid";
import { SpatialCard } from "@/components/effects/spatial-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types/project";

const DEPTH_PATTERN = [-24, 22, 22, -24];

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

        <SpatialGrid className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.id}>
              <RevealFade delay={index * 90} translateY={48}>
                <SpatialCard depth={DEPTH_PATTERN[index % DEPTH_PATTERN.length]}>
                  <ProjectCard project={project} />
                </SpatialCard>
              </RevealFade>
            </li>
          ))}
        </SpatialGrid>
      </div>
    </section>
  );
}
