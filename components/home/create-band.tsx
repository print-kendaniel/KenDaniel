import { RevealFade } from "@/components/effects/reveal-fade";
import { ScrollFocus } from "@/components/effects/scroll-focus";
import { ArrowRight } from "@/components/ui/icons";

const pills = [
  { label: "Learn", variant: "light" as const },
  { label: "Build", variant: "accent" as const },
  { label: null, variant: "dark" as const },
  { label: "Ship", variant: "ghost" as const },
];

const variantClasses = {
  light: "bg-surface text-black",
  accent: "bg-linear-to-br from-accent-from to-accent-to text-white",
  dark: "bg-ink text-white",
  ghost: "bg-surface/60 text-black/35",
};

export function CreateBand() {
  return (
    <section>
      <ul className="shell flex flex-col gap-3 px-5 py-10 sm:flex-row sm:gap-4 sm:px-8">
        {pills.map((pill, index) => (
          <li key={pill.label ?? "arrow"} className="flex-1">
            <ScrollFocus>
              <RevealFade delay={index * 120} translateY={28}>
                <div
                  className={`grid h-24 place-items-center rounded-pill text-3xl font-medium transition-transform duration-300 ease-(--ease-spring-snappy) hover:scale-103 sm:h-40 sm:text-4xl ${variantClasses[pill.variant]}`}
                >
                  {pill.label ?? <ArrowRight className="size-9 sm:size-12" />}
                </div>
              </RevealFade>
            </ScrollFocus>
          </li>
        ))}
      </ul>
    </section>
  );
}
