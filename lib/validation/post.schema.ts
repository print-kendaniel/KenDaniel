import { z } from "zod";

export const postSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated"),
  title: z.string().min(1).max(160),
  excerpt: z.string().min(1).max(280),
  content: z.string().min(1),
  tags: z.array(z.string().min(1)),
  published: z.boolean(),
  publishedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Post = z.infer<typeof postSchema>;

export const postInputSchema = postSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PostInput = z.infer<typeof postInputSchema>;

export const postUpdateSchema = postInputSchema.partial();

export type PostUpdate = z.infer<typeof postUpdateSchema>;
