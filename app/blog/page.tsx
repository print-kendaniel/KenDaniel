import type { Metadata } from "next";
import { listPublishedPosts } from "@/lib/firebase/firestore";
import { PostCard } from "@/components/blog/post-card";
import { DecryptText } from "@/components/effects/decrypt-text";
import { RevealFade } from "@/components/effects/reveal-fade";
import { ScrollFocus } from "@/components/effects/scroll-focus";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing from Ken Daniel Llamanzares on engineering, machine learning, and building projects.",
};

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <main className="shell flex max-w-3xl flex-col gap-10 px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <DecryptText lines={["Blog"]} className="text-4xl font-semibold tracking-tight sm:text-5xl" />

      {posts.length === 0 ? (
        <RevealFade delay={100}>
          <p className="text-sm text-black/60">No posts published yet — check back soon.</p>
        </RevealFade>
      ) : (
        <ul className="flex flex-col gap-6">
          {posts.map((post, index) => (
            <li key={post.id}>
              <ScrollFocus>
                <RevealFade delay={index * 90} translateY={28}>
                  <PostCard post={post} />
                </RevealFade>
              </ScrollFocus>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
