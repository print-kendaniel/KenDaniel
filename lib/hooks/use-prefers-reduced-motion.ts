"use client";

import { useEffect, useState } from "react";

/** Centralized prefers-reduced-motion check — every new interaction system reads this. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    function onChange(event: MediaQueryListEvent) {
      setReduced(event.matches);
    }

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
