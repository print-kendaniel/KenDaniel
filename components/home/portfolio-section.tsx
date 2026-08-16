import { RevealFade } from "@/components/effects/reveal-fade";
import { DecryptText } from "@/components/effects/decrypt-text";
import { ProjectScroll } from "@/components/home/project-scroll";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Project } from "@/types/project";

/**
 * Scroll-driven, not click-driven: vertical scroll through this section
 * slides the project track sideways, and the card in focus animates open
 * via clip-path — see ProjectScroll for the mechanism.
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
          <ProjectScroll projects={projects} />
        </RevealFade>
      </div>
    </section>
  );
}
