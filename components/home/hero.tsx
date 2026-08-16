import Image from "next/image";
import { profile } from "@/lib/content/profile";
import "./hero.css";

const nameParts = profile.name.split(" ");
const marqueeFirst = nameParts.slice(0, -1).join(" ");
const marqueeLast = nameParts[nameParts.length - 1];
const marqueeText = `${marqueeFirst} — ${marqueeLast}`;

/**
 * Full-viewport editorial hero adapted from the "Skiper 19"-style
 * marquee + portrait-cutout layout: a giant looping name behind a
 * character cutout, a rule line, and a two-block footer. No CTA here by
 * design — the global `Header` (already absolute + white text on this
 * page) supplies navigation, so this section isn't duplicating a second
 * brand/menu. Colors follow the site's Accenture violet/black/white
 * theme instead of the source's cream-on-photo palette; there's no
 * background photograph to match the source's full-bleed image layer,
 * so the backdrop is a solid ink gradient instead.
 */
export function Hero() {
  return (
    <section className="relative h-dvh w-full overflow-hidden rounded-b-card bg-linear-to-b from-ink to-[#2c0047] text-white">
      <div
        className="hero-anim-fade-up absolute inset-x-0 top-[18vh] z-10 overflow-hidden sm:top-[14vh]"
        style={{ animationDelay: "500ms" }}
      >
        <div className="hero-marquee-track flex w-max leading-none font-semibold whitespace-nowrap text-[14vh] sm:text-[22vh]">
          <span className="pr-[6vw]">{marqueeText}&nbsp;</span>
          <span className="pr-[6vw]">{marqueeText}&nbsp;</span>
        </div>
      </div>

      <div className="hero-anim-rise-in pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">
        <Image
          src="/hero/character.png"
          alt={profile.name}
          width={666}
          height={375}
          priority
          className="h-auto w-[85vw] max-w-md object-contain sm:max-w-xl"
        />
      </div>

      <div className="hero-anim-line absolute inset-x-6 bottom-24 z-10 h-0.5 bg-white sm:inset-x-10 sm:bottom-28" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-5 text-xs leading-relaxed sm:px-10 sm:pb-8 sm:text-sm">
        <div className="hero-anim-fade-up" style={{ animationDelay: "1400ms" }}>
          <p>Associate Software Engineer</p>
          <p>Full-Stack &amp; AI Builder</p>
          <p>Computer Engineering, National University Manila</p>
        </div>
        <div className="hero-anim-fade-up text-right" style={{ animationDelay: "1550ms" }}>
          <p>Based in</p>
          <p>{profile.location}</p>
        </div>
      </div>
    </section>
  );
}
