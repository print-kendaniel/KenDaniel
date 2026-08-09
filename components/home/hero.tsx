"use client";

import { Roboto_Flex } from "next/font/google";
import { LiquidReveal } from "@/components/effects/liquid-reveal";
import { TextPressure } from "@/components/effects/text-pressure";
import { RevealFade } from "@/components/effects/reveal-fade";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";
import { CircleDot } from "@/components/ui/icons";
import { HeroCard, type CarouselItem } from "@/components/home/hero-card";
import { useContactModal } from "@/components/contact/contact-modal-context";
import { profile } from "@/lib/content/profile";
import type { Project } from "@/types/project";

const robotoFlex = Roboto_Flex({ subsets: ["latin"] });

const builtWith = ["Next.js", "Firebase", "Python", "TensorFlow", "OpenCV", "Docker", "n8n"];

export function Hero({ featuredProjects }: { featuredProjects: Project[] }) {
  const { openContactModal } = useContactModal();

  const carouselItems: CarouselItem[] = featuredProjects.slice(0, 3).map((project) => ({
    caption: project.techStack[0] ?? "Project",
    title: project.title.split("–")[0].trim(),
  }));

  return (
    <section id="home" className="relative isolate overflow-hidden rounded-b-card bg-hero-to">
      <LiquidReveal beforeSrc="/hero/after.svg" afterSrc="/hero/before.svg" alt="" />

      <div
        aria-hidden
        className="absolute inset-0 z-1 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,.35), transparent, rgba(255,255,255,.35))" }}
      />

      <RevealFade delay={300} translateY={20} className="pointer-events-none absolute inset-x-0 z-1 bottom-28 text-center select-none">
        <span
          aria-hidden
          className="font-bold leading-none text-white/40 whitespace-nowrap"
          style={{ fontSize: "var(--text-watermark)" }}
        >
          ASE DANIEL
        </span>
      </RevealFade>

      <div className="shell relative z-20 flex flex-col gap-8 px-5 pt-28 pb-20 sm:px-8 lg:grid lg:min-h-screen lg:grid-cols-12 lg:gap-10 lg:pt-36 lg:pb-28">
        <div className="flex flex-col gap-7 lg:col-span-7">
          <RevealFade delay={200} translateY={10}>
            <Eyebrow>Computer Engineer, Class of 2026</Eyebrow>
          </RevealFade>

          <RevealFade delay={250} translateY={10}>
            <div className="h-28 sm:h-36 md:h-44">
              <TextPressure
                text={profile.name}
                fontFamily={robotoFlex.style.fontFamily}
                flex={false}
                width={false}
                italic={false}
                textColor="var(--foreground)"
                minFontSize={28}
              />
            </div>
          </RevealFade>

          <RevealFade delay={750} translateY={10}>
            <div className="flex flex-wrap gap-3">
              <PillButton variant="dark" arrow="right" onClick={openContactModal}>
                Let&apos;s Talk
              </PillButton>
              <PillButton variant="outline" href="/projects">
                View Work
              </PillButton>
            </div>
          </RevealFade>
        </div>

        <div className="flex flex-col items-start gap-8 lg:col-span-5 lg:items-end">
          <RevealFade delay={400} translateY={16} scaleFrom={0.96}>
            <HeroCard items={carouselItems} />
          </RevealFade>

          <RevealFade delay={550} translateY={14} className="w-full max-w-96 lg:w-76">
            <p className="mb-3 text-left text-xs font-medium text-black/45 lg:text-right">Built with</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:grid-cols-2">
              {builtWith.map((tool) => (
                <li
                  key={tool}
                  className="flex items-center gap-1.5 text-xs text-black/70 transition-transform duration-300 ease-(--ease-spring-snappy) hover:-translate-y-0.5"
                >
                  <CircleDot className="size-3.5 text-black/40" />
                  {tool}
                </li>
              ))}
            </ul>
          </RevealFade>
        </div>

        <RevealFade delay={900} translateY={0} className="lg:col-span-12">
          <div className="shell flex items-center justify-between gap-3 border-t border-black/10 px-0 py-5 text-xs font-medium tracking-wide text-black/60 uppercase sm:px-0">
            <span>B.S. Computer Engineering, 2026</span>
            <span className="hidden sm:inline">Based in Biñan, Laguna, PH</span>
            <span className="inline-flex items-center gap-2">
              Scroll to explore
              <span aria-hidden>↓</span>
            </span>
          </div>
        </RevealFade>
      </div>
    </section>
  );
}
