"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Post } from "@/types/post";

interface Props {
  mode: "create" | "edit";
  post?: Post;
}

export function PostForm({ mode, post }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      content: String(formData.get("content") ?? ""),
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      published: formData.get("published") === "on",
    };

    try {
      const url = mode === "create" ? "/api/blog" : `/api/blog/${post?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error?.message ?? "Failed to save post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm">Slug</span>
        <input name="slug" defaultValue={post?.slug} required className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Title</span>
        <input name="title" defaultValue={post?.title} required className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Excerpt</span>
        <input name="excerpt" defaultValue={post?.excerpt} required className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Content (markdown)</span>
        <textarea name="content" defaultValue={post?.content} required rows={12} className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Tags (comma-separated)</span>
        <input name="tags" defaultValue={post?.tags.join(", ")} className="border px-3 py-2" />
      </label>

      <label className="flex items-center gap-2">
        <input name="published" type="checkbox" defaultChecked={post?.published} />
        <span className="text-sm">Published</span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="border px-4 py-2">
        {isSubmitting ? "Saving…" : "Save post"}
      </button>
    </form>
  );
}
