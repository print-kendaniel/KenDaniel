import Link from "next/link";
import type { Post } from "@/types/post";
import { TagChip } from "@/components/ui/tag-chip";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-3 rounded-card-sm border border-line bg-surface/40 p-5 transition-transform duration-300 ease-(--ease-spring-soft) hover:-translate-y-1"
    >
      <h3 className="text-xl font-medium tracking-tight">{post.title}</h3>
      <p className="text-sm text-black/60">{post.excerpt}</p>
      <ul className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </ul>
    </Link>
  );
}
