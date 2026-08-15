import { RevealFade } from "@/components/effects/reveal-fade";
import { DecryptText } from "@/components/effects/decrypt-text";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectCarousel } from "@/components/home/project-carousel";
import type { Project } from "@/types/project";

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
          <ProjectCarousel projects={projects} />
        </RevealFade>
      </div>
    </section>
  );
}
