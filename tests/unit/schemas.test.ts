import { describe, expect, it } from "vitest";
import { projectSchema, projectInputSchema } from "@/lib/validation/project.schema";
import { postInputSchema } from "@/lib/validation/post.schema";
import { messageInputSchema } from "@/lib/validation/message.schema";
import { contactFormSchema } from "@/lib/validation/contact.schema";

describe("projectSchema", () => {
  const validProject = {
    id: "abc123",
    slug: "trustmebro-ai",
    title: "TrustMeBro AI",
    summary: "Detects phishing and scams.",
    description: "Full description here.",
    techStack: ["Next.js", "FastAPI"],
    repoUrl: null,
    liveUrl: null,
    coverImage: null,
    featured: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("accepts a valid project", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it("rejects an uppercase or space-containing slug", () => {
    expect(projectSchema.safeParse({ ...validProject, slug: "Not Valid" }).success).toBe(false);
  });

  it("rejects an empty techStack array", () => {
    expect(projectSchema.safeParse({ ...validProject, techStack: [] }).success).toBe(false);
  });

  it("projectInputSchema omits server-assigned fields", () => {
    const input = {
      slug: validProject.slug,
      title: validProject.title,
      summary: validProject.summary,
      description: validProject.description,
      techStack: validProject.techStack,
      repoUrl: validProject.repoUrl,
      liveUrl: validProject.liveUrl,
      coverImage: validProject.coverImage,
      featured: validProject.featured,
      order: validProject.order,
    };
    expect(projectInputSchema.safeParse(input).success).toBe(true);
    expect(projectInputSchema.safeParse(validProject).success).toBe(true); // extra fields ignored, not required
  });
});

describe("postInputSchema", () => {
  it("accepts a valid post input", () => {
    const result = postInputSchema.safeParse({
      slug: "hello-world",
      title: "Hello World",
      excerpt: "First post.",
      content: "Body content.",
      tags: ["intro"],
      published: false,
      publishedAt: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing title", () => {
    const result = postInputSchema.safeParse({
      slug: "hello-world",
      excerpt: "First post.",
      content: "Body content.",
      tags: [],
      published: false,
      publishedAt: null,
    });
    expect(result.success).toBe(false);
  });
});

describe("messageInputSchema", () => {
  it("accepts a valid message input", () => {
    const result = messageInputSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Hello",
      message: "Just saying hi.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = messageInputSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      subject: "Hello",
      message: "Just saying hi.",
    });
    expect(result.success).toBe(false);
  });
});

describe("contactFormSchema", () => {
  const validSubmission = {
    name: "Jane Doe",
    email: "jane@example.com",
    subject: "Project inquiry",
    message: "I'd like to discuss a project with you.",
  };

  it("accepts a valid submission with an empty honeypot", () => {
    expect(contactFormSchema.safeParse({ ...validSubmission, company: "" }).success).toBe(true);
  });

  it("accepts a valid submission with an omitted honeypot", () => {
    expect(contactFormSchema.safeParse(validSubmission).success).toBe(true);
  });

  it("parses successfully even when the honeypot field is filled in — the route handler, not the schema, decides what to do with a tripped honeypot so the response can't leak which field caught the bot", () => {
    const result = contactFormSchema.safeParse({ ...validSubmission, company: "Acme Inc" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company).toBe("Acme Inc");
    }
  });

  it("rejects a message that is too short", () => {
    expect(contactFormSchema.safeParse({ ...validSubmission, message: "hi" }).success).toBe(false);
  });
});
