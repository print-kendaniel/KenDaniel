import { FieldValue } from "firebase-admin/firestore";
import { adminFirestore } from "./firebase-admin-node";
import type { ProjectInput } from "@/lib/validation/project.schema";

/**
 * Seed content sourced directly from the resume (Ken Daniel Llamanzares).
 * Descriptions carry a TODO marker where the resume only gave a short bullet;
 * expand those in the admin UI once real project detail/media is ready.
 * repoUrl/liveUrl/coverImage are left null — none were present in the resume.
 */
const projectSeeds: ProjectInput[] = [
  {
    slug: "trustmebro-ai",
    title: "TrustMeBro AI – AI-Powered Phishing & Scam Detection Platform",
    summary:
      "Full-stack cybersecurity platform (web app + Chrome extension) that detects phishing URLs, scam screenshots, and malicious QR codes.",
    description: `Built a full-stack cybersecurity platform (web app + Chrome extension) using Gemini AI and SSL/domain-age heuristics to detect phishing URLs, scam screenshots, malicious QR codes, and fake profiles, protecting Philippine banking and e-wallet users (GCash, Maya, BDO, BPI).

Deployed a Dockerized FastAPI backend on Render with Firebase auth, OCR-based screenshot analysis, and a Manifest V3 Chrome extension featuring context-menu scanning, including full production setup (CORS hardening, custom domain, Chrome Web Store submission).

TODO: expand with architecture details, screenshots, and outcomes.`,
    techStack: ["Next.js", "FastAPI", "Docker", "Chrome Extension (Manifest V3)", "Firebase", "Gemini AI"],
    repoUrl: null,
    liveUrl: null,
    coverImage: null,
    featured: true,
    order: 1,
  },
  {
    slug: "swinewatch",
    title: "SwineWatch – ASF Detection and Monitoring System",
    summary:
      "Real-time pig surveillance system using thermal imaging to detect early African Swine Fever symptoms.",
    description: `Built a real-time pig surveillance system using thermal imaging and Raspberry Pi cameras to detect early ASF (African Swine Fever) symptoms, with a React/Tailwind dashboard, Firebase, and Cloudinary.

TODO: expand with detection model details, hardware setup, and results.`,
    techStack: ["React", "Tailwind CSS", "Firebase", "Cloudinary", "Computer Vision", "Raspberry Pi"],
    repoUrl: null,
    liveUrl: null,
    coverImage: null,
    featured: true,
    order: 2,
  },
  {
    slug: "digital-ears",
    title: "Digital Ears – Emotion Detection from Speech Signals",
    summary:
      "MATLAB-based speech emotion recognition system classifying Angry, Happy, and Sad emotions.",
    description: `Built a MATLAB-based speech emotion recognition system using short-time and mean energy features to classify Angry, Happy, and Sad emotions.

TODO: expand with signal processing pipeline details and accuracy results.`,
    techStack: ["MATLAB", "Digital Signal Processing"],
    repoUrl: null,
    liveUrl: null,
    coverImage: null,
    featured: true,
    order: 3,
  },
  {
    slug: "recruitment-workflow-automation",
    title: "Recruitment Workflow Automation Project",
    summary:
      "Rule-based automation system for candidate screening, status updates, and email communication.",
    description: `Designed a rule-based automation system for candidate screening, status updates, and email communication, streamlining recruitment using n8n and Google Workspace APIs.

TODO: expand with workflow design details and impact metrics.`,
    techStack: ["n8n", "Google Workspace APIs"],
    repoUrl: null,
    liveUrl: null,
    coverImage: null,
    featured: true,
    order: 4,
  },
];

async function seedProjects() {
  const projectsCollection = adminFirestore.collection("projects");

  for (const project of projectSeeds) {
    const existing = await projectsCollection.where("slug", "==", project.slug).limit(1).get();

    if (!existing.empty) {
      console.log(`Skipping "${project.slug}" — already seeded.`);
      continue;
    }

    const now = FieldValue.serverTimestamp();
    await projectsCollection.add({ ...project, createdAt: now, updatedAt: now });
    console.log(`Seeded project "${project.slug}".`);
  }
}

async function main() {
  await seedProjects();
  console.log("Seeding complete. `posts` was intentionally left empty — no blog content exists in the resume yet.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed script failed:", error);
    process.exit(1);
  });
