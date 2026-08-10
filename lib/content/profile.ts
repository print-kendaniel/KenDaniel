/**
 * Single source of truth for static personal content, sourced from the
 * resume. Phone number and the listed reference are intentionally excluded
 * from `profile` — kept off the public site per an explicit privacy
 * decision, not an oversight.
 */

export interface TimelineEntry {
  kind: "education" | "experience";
  title: string;
  organization: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export const profile = {
  name: "Ken Daniel Llamanzares",
  credentials: "CpE, SO2",
  title: "Computer Engineer",
  location: "Biñan, Laguna, Philippines",
  email: "kd.llamanzares@gmail.com",
  links: {
    github: "https://github.com/print-kendaniel",
    linkedin: "https://www.linkedin.com/in/kd-llamanzares",
  },
  summary:
    "Computer Engineering graduate (2026) with hands-on experience in technical support, embedded systems, full-stack web development, and machine learning. Skilled in building cloud-connected IoT systems, computer vision applications, AI-powered security tools, and workflow automation. Registered Safety Officer 2 (SO2) and TESDA-certified in Computer System Servicing with Lean Six Sigma Yellow Belt training.",
  skills: {
    coreCompetencies: [
      "Machine Learning",
      "Full-Stack Development",
      "REST API Design",
      "Chrome Extension Development",
      "Computer Vision",
      "OCR",
      "Prompt Engineering",
      "Workflow Automation",
      "CI/CD",
      "Database Management",
      "Debugging",
    ],
    languages: ["Python", "PHP", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3"],
    frameworks: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Tailwind CSS",
      "Firebase SDK",
      "OpenCV",
      "TensorFlow",
      "Scikit-learn",
      "NumPy",
      "Pandas",
      "YOLOv7",
      "YOLOv8",
    ],
    tools: [
      "Docker",
      "Kubernetes",
      "Git",
      "GitHub",
      "Cloudinary",
      "MySQL",
      "NoSQL",
      "Postman",
      "n8n",
      "MCP",
      "Vercel",
      "Render",
      "VS Code",
      "Linux",
    ],
  },
  certifications: [
    "Computer System Servicing NC II – TESDA National Certification",
    "Safety Officer 2 (SO2) – DOLE-accredited Safety Officer Training",
    "Lean Six Sigma Yellow Belt – Council for Six Sigma",
    "Introduction to Modern AI – Cisco Networking Academy",
  ],
  timeline: [
    {
      kind: "experience",
      title: "Technical Support Engineer Intern",
      organization: "Straive",
      location: "Calamba, Philippines",
      start: "2026-02",
      end: "2026-04",
      bullets: [
        "Delivered IT support across hardware and software environments through systematic diagnostics and troubleshooting, reducing end-user downtime.",
        "Performed system reformatting, OS installation, and workstation configuration, standardizing setups across users.",
        "Designed and deployed an internal web platform for the EUC team to centralize inventory tracking, production mapping, and task management.",
      ],
    },
    {
      kind: "education",
      title: "Bachelor of Science in Computer Engineering",
      organization: "National University, Manila, Philippines",
      location: "Manila, Philippines",
      start: "2022-08",
      end: "2026-07",
      bullets: [],
    },
  ] satisfies TimelineEntry[],
} as const;

/** Years spent in the Computer Engineering program, derived from the timeline entry itself. */
export function programYears(): number {
  const education = profile.timeline.find((entry) => entry.kind === "education");
  if (!education) return 0;
  const startYear = Number(education.start.slice(0, 4));
  const endYear = Number(education.end.slice(0, 4));
  return endYear - startYear;
}
