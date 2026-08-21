import type { Project } from "@/types/project";

/** Presentation-only category label per project — not a stored field, just a display hint. */
const CATEGORY_BY_SLUG: Record<string, string> = {
  "trustmebro-ai": "Cybersecurity",
  swinewatch: "Computer Vision",
  "digital-ears": "Signal Processing",
  "recruitment-workflow-automation": "Automation",
};

export function getProjectCategory(project: Project): string {
  return CATEGORY_BY_SLUG[project.slug] ?? project.techStack[0] ?? "Project";
}
