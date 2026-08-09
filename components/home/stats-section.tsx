import { RevealFade } from "@/components/effects/reveal-fade";
import { ScrollFocus } from "@/components/effects/scroll-focus";
import { DecryptText } from "@/components/effects/decrypt-text";
import { CountUp } from "@/components/effects/count-up";
import { Eyebrow } from "@/components/ui/eyebrow";
import { profile } from "@/lib/content/profile";

function programYears(): number {
  const education = profile.timeline.find((entry) => entry.kind === "education");
  if (!education) return 0;
  const startYear = Number(education.start.slice(0, 4));
  const endYear = Number(education.end.slice(0, 4));
  return endYear - startYear;
}

export function StatsSection({ projectsCount }: { projectsCount: number }) {
  const stats = [
    { value: projectsCount, suffix: "", label: "Projects shipped" },
    { value: profile.certifications.length, suffix: "", label: "Certifications earned" },
    { value: profile.skills.languages.length, suffix: "", label: "Programming languages" },
    { value: programYears(), suffix: "", label: "Years in Computer Engineering" },
  ];

  return (
    <section>
      <div className="shell px-5 pb-20 sm:px-8 lg:pb-28">
        <ScrollFocus>
          <RevealFade scaleFrom={0.99} translateY={40}>
            <div className="rounded-card bg-ink px-6 py-12 text-white sm:px-8 sm:py-16 md:px-16">
              <Eyebrow tone="light">By the numbers</Eyebrow>

              <DecryptText
                lines={["Real work, not projections."]}
                delay={120}
                className="mt-4 max-w-[20ch] text-3xl font-medium tracking-tight md:text-4xl"
              />

              <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <li key={stat.label}>
                    <RevealFade delay={index * 90} translateY={20}>
                      <CountUp
                        value={stat.value}
                        suffix={stat.suffix}
                        className="tabular-nums text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
                      />
                      <p className="mt-3 text-sm text-white/55">{stat.label}</p>
                    </RevealFade>
                  </li>
                ))}
              </ul>
            </div>
          </RevealFade>
        </ScrollFocus>
      </div>
    </section>
  );
}
