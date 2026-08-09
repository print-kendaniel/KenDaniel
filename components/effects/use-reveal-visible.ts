"use client";

import { useEffect, useRef, useState } from "react";
import { useIntroReady } from "@/components/effects/intro-ready-context";

/**
 * Fires once when the element scrolls into view. When `gateOnReady` is set,
 * it also waits for the intro loader to finish (used only by hero text,
 * which shouldn't play its reveal underneath the loader).
 */
export function useRevealVisible<T extends HTMLElement>(gateOnReady = false) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const introReady = useIntroReady();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visible = gateOnReady ? inView && introReady.ready : inView;

  return { ref, visible };
}
