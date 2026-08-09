"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "@/components/effects/scroll-provider";
import { useIntroReady } from "@/components/effects/intro-ready-context";
import { LogoMark } from "@/components/ui/icons";

const FILL_MS = 1300;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function PageLoader() {
  const { stopScroll, startScroll } = useScrollLock();
  const { markReady } = useIntroReady();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stopScroll();

    const start = performance.now();
    let rafId = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / FILL_MS);
      setProgress(Math.round(easeInOutCubic(t) * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setExiting(true);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run exactly once on mount
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const panel = panelRef.current;
    if (!panel) return;

    function onTransitionEnd(event: TransitionEvent) {
      if (event.propertyName !== "transform") return;
      markReady();
      startScroll();
      setDone(true);
    }

    panel.addEventListener("transitionend", onTransitionEnd);
    return () => panel.removeEventListener("transitionend", onTransitionEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- markReady/startScroll are stable context callbacks
  }, [exiting]);

  if (done) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-120 flex flex-col items-center justify-center gap-8 rounded-b-card bg-ink text-white"
      style={{
        transform: exiting ? "translateY(-100%)" : "translateY(0%)",
        transition: "transform 700ms var(--ease-spring)",
      }}
    >
      <div
        className="flex flex-col items-center gap-5 text-center"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? "translateY(-12px)" : "translateY(0)",
          transition: "opacity 600ms var(--ease-spring), transform 600ms var(--ease-spring)",
        }}
      >
        <div className="flex items-center gap-2 text-2xl font-semibold sm:text-3xl">
          <LogoMark className="text-accent-from" style={{ fontSize: "1.875rem" }} />
          ASE Daniel
        </div>
        <p className="max-w-[24ch] text-sm text-white/55">Learning in public, shipping along the way.</p>
      </div>

      <div className="flex w-full max-w-88 flex-col gap-3 px-6" style={{ width: "min(22rem, 72vw)" }}>
        <div className="h-px w-full bg-white/15">
          <div
            className="h-full bg-accent-from"
            style={{ width: `${progress}%`, transition: "width 100ms ease-out" }}
          />
        </div>
        <div className="flex justify-between text-xs font-medium tracking-wide text-white/45 uppercase">
          <span>Loading</span>
          <span className="tabular-nums text-white/80">{String(progress).padStart(3, "0")}</span>
        </div>
      </div>
    </div>
  );
}
