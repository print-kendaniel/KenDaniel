"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Project } from "@/types/project";

interface Props {
  mode: "create" | "edit";
  project?: Project;
}

export function ProjectForm({ mode, project }: Props) {
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
      summary: String(formData.get("summary") ?? ""),
      description: String(formData.get("description") ?? ""),
      techStack: String(formData.get("techStack") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      repoUrl: String(formData.get("repoUrl") ?? "") || null,
      liveUrl: String(formData.get("liveUrl") ?? "") || null,
      coverImage: String(formData.get("coverImage") ?? "") || null,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") ?? 0),
    };

    try {
      const url = mode === "create" ? "/api/projects" : `/api/projects/${project?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error?.message ?? "Failed to save project");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm">Slug</span>
        <input name="slug" defaultValue={project?.slug} required className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Title</span>
        <input name="title" defaultValue={project?.title} required className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Summary</span>
        <input name="summary" defaultValue={project?.summary} required className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Description (markdown)</span>
        <textarea
          name="description"
          defaultValue={project?.description}
          required
          rows={10}
          className="border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Tech stack (comma-separated)</span>
        <input
          name="techStack"
          defaultValue={project?.techStack.join(", ")}
          required
          className="border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Repo URL</span>
        <input name="repoUrl" defaultValue={project?.repoUrl ?? ""} className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Live URL</span>
        <input name="liveUrl" defaultValue={project?.liveUrl ?? ""} className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Cover image URL</span>
        <input name="coverImage" defaultValue={project?.coverImage ?? ""} className="border px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Order</span>
        <input
          name="order"
          type="number"
          defaultValue={project?.order ?? 0}
          required
          className="border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2">
        <input name="featured" type="checkbox" defaultChecked={project?.featured} />
        <span className="text-sm">Featured</span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="border px-4 py-2">
        {isSubmitting ? "Saving…" : "Save project"}
      </button>
    </form>
  );
}
