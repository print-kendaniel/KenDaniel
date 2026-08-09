import type { Metadata } from "next";
import Image from "next/image";
import { profile } from "@/lib/content/profile";
import { RevealFade } from "@/components/effects/reveal-fade";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";
import { CircleDot } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About",
  description: profile.summary,
};

const skillGroups = [
  { label: "Core competencies", values: profile.skills.coreCompetencies },
  { label: "Languages", values: profile.skills.languages },
  { label: "Frameworks & libraries", values: profile.skills.frameworks },
  { label: "Tools & platforms", values: profile.skills.tools },
];

export default function AboutPage() {
  return (
    <>
      <section>
        <div className="shell grid grid-cols-1 gap-16 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <div className="flex flex-col gap-6">
            <Eyebrow>The Person</Eyebrow>

            <RevealFade translateY={12}>
              <div className="relative overflow-hidden rounded-card" style={{ aspectRatio: "3 / 4" }}>
                <Image
                  src="/about/portrait.jpg"
                  alt={profile.name}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </RevealFade>

            <p className="text-sm text-black/60">Based in Biñan, Laguna, Philippines — open to remote work worldwide.</p>
          </div>

          <div className="flex flex-col justify-between gap-16">
            <RevealFade translateY={12}>
              <p className="text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
                I build practical software —{" "}
                <span className="text-muted">
                  AI security tools, computer vision systems, and workflow automation that ships.
                </span>
              </p>
            </RevealFade>

            <RevealFade delay={100} translateY={12}>
              <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-black/45">Find me online</span>
                  <div className="flex gap-2">
                    <a
                      href={profile.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="grid size-9 place-items-center rounded-pill bg-accent text-white transition-opacity hover:opacity-80"
                    >
                      <CircleDot className="size-4" />
                    </a>
                    <a
                      href={profile.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="grid size-9 place-items-center rounded-pill bg-surface text-black/70 transition-opacity hover:opacity-70"
                    >
                      <CircleDot className="size-4" />
                    </a>
                    <a
                      href={`mailto:${profile.email}`}
                      aria-label="Email"
                      className="grid size-9 place-items-center rounded-pill bg-surface text-black/70 transition-opacity hover:opacity-70"
                    >
                      <CircleDot className="size-4" />
                    </a>
                  </div>
                </div>
                <PillButton variant="outline" href="/contact" arrow="right">
                  Get in Touch
                </PillButton>
              </div>
            </RevealFade>
          </div>
        </div>
      </section>

      <main className="shell flex flex-col gap-20 px-5 pb-20 sm:px-8">
        <section className="flex flex-col gap-8">
          <h2 className="text-sm font-medium tracking-wide text-black/45 uppercase">Timeline</h2>
          <ol className="flex flex-col">
            {profile.timeline.map((entry, index) => (
              <li key={`${entry.title}-${entry.start}`} className={index === 0 ? "" : "border-t border-line"}>
                <RevealFade delay={index * 60} translateY={10}>
                  <div className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                    <div>
                      <p className="text-xs font-medium tracking-wide text-black/40 uppercase">{entry.kind}</p>
                      <h3 className="mt-1 text-lg font-medium tracking-tight">{entry.title}</h3>
                      <p className="mt-1 text-sm text-black/60">
                        {entry.organization} · {entry.location}
                      </p>
                      {entry.bullets.length > 0 && (
                        <ul className="mt-3 flex flex-col gap-1 text-sm text-black/70">
                          {entry.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <p className="shrink-0 text-sm text-black/45 sm:text-right">
                      {entry.start} – {entry.end}
                    </p>
                  </div>
                </RevealFade>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="text-sm font-medium tracking-wide text-black/45 uppercase">Certifications</h2>
          <ul className="flex flex-col">
            {profile.certifications.map((cert, index) => (
              <li key={cert} className={index === 0 ? "" : "border-t border-line"}>
                <RevealFade delay={index * 50} translateY={10}>
                  <p className="py-4 text-sm text-black/70">{cert}</p>
                </RevealFade>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="text-sm font-medium tracking-wide text-black/45 uppercase">Skills</h2>
          <div className="flex flex-col gap-5">
            {skillGroups.map((group, index) => (
              <RevealFade key={group.label} delay={index * 60} translateY={10}>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-8">
                  <h3 className="w-48 shrink-0 text-sm text-black/45">{group.label}</h3>
                  <p className="text-sm text-black/75">{group.values.join(" · ")}</p>
                </div>
              </RevealFade>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
