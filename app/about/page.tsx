import type { Metadata } from "next";
import { profile, programYears } from "@/lib/content/profile";
import { RevealFade } from "@/components/effects/reveal-fade";
import { ScrollFocus } from "@/components/effects/scroll-focus";
import { ScrollProgressBar } from "@/components/effects/scroll-progress-bar";
import { DecryptText } from "@/components/effects/decrypt-text";
import { CountUp } from "@/components/effects/count-up";
import { TiltPortrait } from "@/components/about/tilt-portrait";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";
import { TagChip } from "@/components/ui/tag-chip";
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

const stats = [
  { value: programYears(), suffix: "", label: "Years in CpE" },
  { value: profile.certifications.length, suffix: "", label: "Certifications" },
  { value: profile.skills.frameworks.length, suffix: "+", label: "Frameworks & tools" },
];

export default function AboutPage() {
  return (
    <main className="shell px-5 py-20 sm:px-8 lg:py-28">
      <ScrollProgressBar />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:h-fit">
          <Eyebrow>The Person</Eyebrow>

          <RevealFade translateY={12}>
            <TiltPortrait src="/about/portrait.jpg" alt={profile.name} />
          </RevealFade>

          <p className="text-sm text-black/60">Based in Biñan, Laguna, Philippines — open to remote work worldwide.</p>
        </div>

        <div className="flex flex-col gap-20">
          <div className="flex flex-col justify-between gap-16">
            <RevealFade translateY={12}>
              <p className="text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
                I build practical software —{" "}
                <span className="text-muted">
                  AI security tools, computer vision systems, and workflow automation that ships.
                </span>
              </p>
            </RevealFade>

            <RevealFade delay={80} translateY={12}>
              <div className="grid grid-cols-3 gap-4 border-y border-line py-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="tabular-nums text-3xl font-semibold tracking-tight sm:text-4xl">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-xs text-black/45">{stat.label}</span>
                  </div>
                ))}
              </div>
            </RevealFade>

            <RevealFade delay={140} translateY={12}>
              <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-black/45">Find me online</span>
                  <div className="flex gap-2">
                    <a
                      href={profile.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="grid size-9 place-items-center rounded-pill bg-accent text-white transition-transform duration-300 ease-(--ease-spring-snappy) hover:-translate-y-0.5 hover:opacity-80"
                    >
                      <CircleDot className="size-4" />
                    </a>
                    <a
                      href={profile.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="grid size-9 place-items-center rounded-pill bg-surface text-black/70 transition-transform duration-300 ease-(--ease-spring-snappy) hover:-translate-y-0.5 hover:opacity-70"
                    >
                      <CircleDot className="size-4" />
                    </a>
                    <a
                      href={`mailto:${profile.email}`}
                      aria-label="Email"
                      className="grid size-9 place-items-center rounded-pill bg-surface text-black/70 transition-transform duration-300 ease-(--ease-spring-snappy) hover:-translate-y-0.5 hover:opacity-70"
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

          <section className="flex flex-col gap-8">
            <DecryptText lines={["Timeline"]} level={3} className="text-sm font-medium tracking-wide text-black/45 uppercase" />
            <ol className="relative flex flex-col">
              <div aria-hidden className="absolute top-2 bottom-2 left-1.25 w-px bg-line" />
              {profile.timeline.map((entry, index) => (
                <li key={`${entry.title}-${entry.start}`} className={index === 0 ? "" : "border-t border-line"}>
                  <ScrollFocus>
                    <RevealFade delay={index * 60} translateY={10}>
                      <div className="group relative flex flex-col gap-1 py-6 pl-8 transition-transform duration-300 ease-(--ease-spring-soft) hover:translate-x-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                        <span
                          aria-hidden
                          className="absolute top-[1.85rem] left-0 size-2.5 rounded-full bg-line transition-colors duration-300 group-hover:bg-accent"
                        />
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
                  </ScrollFocus>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-8">
            <DecryptText
              lines={["Certifications"]}
              level={3}
              className="text-sm font-medium tracking-wide text-black/45 uppercase"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.certifications.map((cert, index) => (
                <RevealFade key={cert} delay={index * 50} translateY={10}>
                  <div className="group flex items-center gap-3 rounded-card-sm border border-line bg-surface/60 px-5 py-4 transition-all duration-300 ease-(--ease-spring-soft) hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_40px_-24px_rgba(161,0,255,0.25)]">
                    <span className="grid size-8 shrink-0 place-items-center rounded-pill bg-white text-accent ring-1 ring-line transition-transform duration-300 ease-(--ease-spring-snappy) group-hover:rotate-12">
                      <CircleDot className="size-4" />
                    </span>
                    <p className="text-sm text-black/75">{cert}</p>
                  </div>
                </RevealFade>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-8">
            <DecryptText lines={["Skills"]} level={3} className="text-sm font-medium tracking-wide text-black/45 uppercase" />
            <div className="flex flex-col gap-6">
              {skillGroups.map((group, index) => (
                <RevealFade key={group.label} delay={index * 60} translateY={10}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                    <h3 className="w-48 shrink-0 text-sm text-black/45">{group.label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.values.map((value) => (
                        <TagChip
                          key={value}
                          className="cursor-default transition-transform duration-200 ease-(--ease-spring-snappy) hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                        >
                          {value}
                        </TagChip>
                      ))}
                    </div>
                  </div>
                </RevealFade>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
