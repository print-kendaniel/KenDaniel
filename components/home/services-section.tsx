import { RevealFade } from "@/components/effects/reveal-fade";
import { DecryptText } from "@/components/effects/decrypt-text";
import { ScrollStack, ScrollStackItem } from "@/components/effects/scroll-stack";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRight } from "@/components/ui/icons";

const rows = [
  {
    title: "Full-Stack Development",
    description: "Building complete web platforms end to end, from API to interface.",
  },
  {
    title: "Computer Vision & ML",
    description: "Training and deploying models for real-time detection and analysis.",
  },
  {
    title: "Workflow Automation",
    description: "Designing systems that remove repetitive manual work.",
  },
  {
    title: "Security Tooling",
    description: "Building browser-based tools that protect real users.",
  },
];

export function ServicesSection() {
  return (
    <section id="services">
      <div className="shell px-5 py-20 sm:px-8 lg:py-28">
        <RevealFade>
          <Eyebrow>What I do</Eyebrow>
        </RevealFade>

        <DecryptText
          lines={["What I do best"]}
          delay={120}
          className="mt-5 mb-14 max-w-[16ch] text-4xl font-semibold tracking-tight sm:mb-14 sm:text-5xl"
        />

        <ScrollStack style={{ height: "78dvh" }} itemDistance={70} itemStackDistance={22} baseScale={0.86}>
          {rows.map((row, index) => (
            <ScrollStackItem key={row.title}>
              <span className="w-8 shrink-0 text-sm font-medium text-white/45 sm:w-10">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h3 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">{row.title}</h3>
                <p className="mt-2 max-w-md text-sm text-white/65">{row.description}</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-white text-ink sm:size-12">
                <ArrowUpRight className="size-4" />
              </span>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
