import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getProjectBySlug, listProjects } from "@/lib/firebase/firestore";
import { RevealLines } from "@/components/effects/reveal-lines";
import { RevealFade } from "@/components/effects/reveal-fade";
import { TagChip } from "@/components/ui/tag-chip";
import { PillButton } from "@/components/ui/pill-button";
import { LogoMark } from "@/components/ui/icons";
import { getProjectCategory } from "@/lib/content/project-category";
import { ScrollProgressBar } from "@/components/effects/scroll-progress-bar";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const category = getProjectCategory(project);

  return (
    <main className="shell px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <ScrollProgressBar />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <RevealFade translateY={16} scaleFrom={0.98}>
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                width={1200}
                height={630}
                className="w-full rounded-card object-cover"
              />
            ) : (
              <div className="relative flex aspect-4/5 flex-col justify-between overflow-hidden rounded-card bg-ink p-8 text-white">
                <span className="text-xs tracking-wide text-white/45 uppercase">{category}</span>
                <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
                  <LogoMark className="size-24 text-white/90" />
                </div>
                <div className="relative flex flex-wrap gap-2">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <TagChip key={tech} tone="light">
                      {tech}
                    </TagChip>
                  ))}
                </div>
              </div>
            )}
          </RevealFade>
        </div>

        <div className="flex max-w-3xl flex-col gap-6">
          <RevealLines lines={[project.title]} className="text-3xl font-semibold tracking-tight sm:text-4xl" />

          <RevealFade delay={80} translateY={12}>
            <p className="text-lg text-black/70">{project.summary}</p>
          </RevealFade>

          <RevealFade delay={140} translateY={12}>
            <ul className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <TagChip key={tech}>{tech}</TagChip>
              ))}
            </ul>
          </RevealFade>

          <RevealFade delay={200} translateY={12}>
            <div className="flex gap-4">
              {project.repoUrl && (
                <PillButton variant="outline" href={project.repoUrl}>
                  Repository
                </PillButton>
              )}
              {project.liveUrl && (
                <PillButton variant="dark" href={project.liveUrl} arrow="up-right">
                  Live demo
                </PillButton>
              )}
            </div>
          </RevealFade>

          <RevealFade delay={260} translateY={16}>
            <article className="flex flex-col gap-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
            </article>
          </RevealFade>
        </div>
      </div>
    </main>
  );
}
