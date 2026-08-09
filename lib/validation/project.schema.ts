import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated"),
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(280),
  description: z.string().min(1),
  techStack: z.array(z.string().min(1)).min(1),
  repoUrl: z.url().nullable(),
  liveUrl: z.url().nullable(),
  coverImage: z.string().nullable(),
  featured: z.boolean(),
  order: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Project = z.infer<typeof projectSchema>;

export const projectInputSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export const projectUpdateSchema = projectInputSchema.partial();

export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
