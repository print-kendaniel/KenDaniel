import Link from "next/link";
import type { Project } from "@/types/project";
import { LogoMark, ArrowUpRight } from "@/components/ui/icons";
import { TagChip } from "@/components/ui/tag-chip";
import { DecryptText } from "@/components/effects/decrypt-text";
import { getProjectCategory } from "@/lib/content/project-category";

export function ProjectCard({ project }: { project: Project }) {
  const category = getProjectCategory(project);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex min-h-88 flex-col overflow-hidden rounded-card bg-ink p-6 text-white ring-1 ring-white/5 transition-transform duration-300 ease-(--ease-spring-soft) hover:-translate-y-2 sm:min-h-104 sm:p-8"
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
  );
}
