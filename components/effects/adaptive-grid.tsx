"use client";

import { useEffect } from "react";

const FONT_BASE = 16;
const BASE_WIDTH = 1920;
const DAMPING_COEF = 0.6666;

/**
 * Media queries in globals.css handle the rem scale at and below 1920px.
 * Above that, this keeps the layout growing instead of capping out, using
 * the same damped interpolation as the original design's AdaptiveGrid.
 */
export function AdaptiveGrid() {
  useEffect(() => {
    function apply() {
      const width = window.innerWidth;
      const widthReduction = ((BASE_WIDTH - width) / BASE_WIDTH) * 100;
      const size = FONT_BASE - (FONT_BASE * (widthReduction * DAMPING_COEF)) / 100;

      if (size > FONT_BASE) {
        document.documentElement.style.fontSize = `${size}px`;
      } else {
        document.documentElement.style.removeProperty("font-size");
      }
    }

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return null;
}
