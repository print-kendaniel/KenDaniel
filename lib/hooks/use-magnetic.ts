"use client";

import { useEffect, useId, useRef } from "react";
import { useMagneticContext } from "@/components/effects/magnetic-cursor-provider";

/**
 * Registers an element as a magnetic target. Attach the returned ref to a
 * plain wrapping element (not one that already carries its own hover
 * transform classes) — the provider sets `style.transform` directly on it,
 * which would otherwise clobber existing CSS transforms.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const id = useId();
  const { registerTarget, unregisterTarget } = useMagneticContext();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    registerTarget(id, node);
    return () => unregisterTarget(id);
  }, [id, registerTarget, unregisterTarget]);

  return ref;
}
