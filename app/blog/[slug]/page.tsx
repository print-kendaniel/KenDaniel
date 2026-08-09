import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/lib/firebase/firestore";
import { RevealLines } from "@/components/effects/reveal-lines";
import { RevealFade } from "@/components/effects/reveal-fade";
import { TagChip } from "@/components/ui/tag-chip";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="shell flex max-w-3xl flex-col gap-6 px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <RevealLines lines={[post.title]} className="text-3xl font-semibold tracking-tight sm:text-4xl" />

      <RevealFade delay={80} translateY={12}>
        <ul className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </ul>
      </RevealFade>

      <RevealFade delay={160} translateY={16}>
        <article className="flex flex-col gap-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      </RevealFade>
    </main>
  );
}
