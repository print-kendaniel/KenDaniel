import type { Metadata } from "next";
import { listProjects } from "@/lib/firebase/firestore";
import { ProjectCard } from "@/components/projects/project-card";
import { DecryptText } from "@/components/effects/decrypt-text";
import { RevealFade } from "@/components/effects/reveal-fade";
import { SpatialGrid } from "@/components/effects/spatial-grid";
import { SpatialCard } from "@/components/effects/spatial-card";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects built by Ken Daniel Llamanzares spanning full-stack web, computer vision, and automation.",
};

const DEPTH_PATTERN = [-24, 22, 22, -24];

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <main className="shell flex flex-col gap-10 px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <DecryptText lines={["Projects"]} className="text-4xl font-semibold tracking-tight sm:text-5xl" />

      <SpatialGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.id}>
            <RevealFade delay={index * 90} translateY={32}>
              <SpatialCard depth={DEPTH_PATTERN[index % DEPTH_PATTERN.length]}>
                <ProjectCard project={project} />
              </SpatialCard>
            </RevealFade>
          </li>
        ))}
      </SpatialGrid>
    </main>
  );
}
