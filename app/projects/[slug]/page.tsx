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

  return (
    <main className="shell flex max-w-3xl flex-col gap-6 px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      {project.coverImage && (
        <RevealFade translateY={16} scaleFrom={0.98}>
          <Image
            src={project.coverImage}
            alt={project.title}
            width={1200}
            height={630}
            className="w-full rounded-card object-cover"
          />
        </RevealFade>
      )}

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
    </main>
  );
}
