"use client";

import { useState } from "react";
import { ArrowRight, LogoMark } from "@/components/ui/icons";

export interface CarouselItem {
  caption: string;
  title: string;
}

export function HeroCard({ items }: { items: CarouselItem[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const active = items[index];

  function go(step: number) {
    setIndex((current) => (current + step + count) % count);
  }

  return (
    <div className="w-full max-w-96 rounded-card-sm bg-white/70 p-2 ring-1 ring-line/70 backdrop-blur-md lg:w-76">
      <div
        role="button"
        tabIndex={0}
        onClick={() => go(1)}
        onKeyDown={(event) => event.key === "Enter" && go(1)}
        className="flex cursor-pointer gap-2 rounded-control"
      >
        <span className="grid aspect-square w-24 shrink-0 place-items-center rounded-control bg-ink text-white">
          <LogoMark className="size-8 text-accent-from" />
        </span>

        <span className="flex flex-1 flex-col justify-between rounded-control bg-surface/70 p-3">
          <span className="relative block min-h-13">
            <span className="block text-[0.65rem] font-medium tracking-wide text-black/45 uppercase">
              {active.caption}
            </span>
            <span className="mt-1 block max-w-32 text-sm leading-snug font-medium">{active.title}</span>
          </span>

          <span className="flex items-center justify-between">
            <span className="flex gap-1">
              {items.map((item, i) => (
                <span
                  key={item.title}
                  className={`h-1 rounded-pill transition-all duration-300 ${
                    i === index ? "w-4 bg-black/70" : "w-1.5 bg-black/20"
                  }`}
                />
              ))}
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous"
                className="grid size-7 place-items-center rounded-pill bg-white text-black/70 ring-1 ring-line transition-colors hover:text-black"
              >
                <ArrowRight className="size-3.5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
                aria-label="Next"
                className="grid size-7 place-items-center rounded-pill bg-white text-black/70 ring-1 ring-line transition-colors hover:text-black"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
