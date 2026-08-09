"use client";

import { useEffect, useRef, useState } from "react";
import { rafTicker } from "@/lib/raf-ticker";
import { useRevealVisible } from "@/components/effects/use-reveal-visible";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useUiSound } from "@/components/effects/ui-sound-provider";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*";
const TICK_MS = 40;
const STAGGER_MS = 25;

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

interface UseDecryptTextOptions {
  /** Also wait for the intro loader to finish (hero text shouldn't scramble underneath it). */
  gateOnReady?: boolean;
  /** Extra delay in ms before the scramble starts, once visible/ready. */
  delay?: number;
}

/**
 * Scrambles `text` character-by-character before resolving left-to-right,
 * once, when scrolled into view. Character count never changes (only which
 * glyph is shown), so there's no layout shift during the cycling — the only
 * width change is the one-time font swap (mono while scrambling, back to
 * the real typeface once resolved).
 */
export function useDecryptText<T extends HTMLElement>(text: string, options: UseDecryptTextOptions = {}) {
  const { gateOnReady = false, delay = 0 } = options;
  const { ref, visible } = useRevealVisible<T>(gateOnReady);
  const [display, setDisplay] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const elapsedRef = useRef(0);
  const accumulatorRef = useRef(0);
  const doneRef = useRef(false);
  const { playBlip } = useUiSound();

  useEffect(() => {
    if (!visible || doneRef.current) return;

    if (reducedMotion) {
      setDisplay(text);
      doneRef.current = true;
      playBlip(660, 0.1);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const startTimeout = setTimeout(() => {
      setIsScrambling(true);
      elapsedRef.current = 0;
      accumulatorRef.current = 0;
      const totalDuration = text.length * STAGGER_MS + 300;

      unsubscribe = rafTicker.subscribe((_time, deltaMs) => {
        accumulatorRef.current += deltaMs;
        if (accumulatorRef.current < TICK_MS) return;
        accumulatorRef.current = 0;
        elapsedRef.current += TICK_MS;

        const revealedCount = Math.min(text.length, Math.floor(elapsedRef.current / STAGGER_MS));

        setDisplay(
          text
            .split("")
            .map((char, i) => (char === " " || i < revealedCount ? char : randomChar()))
            .join(""),
        );

        if (elapsedRef.current >= totalDuration) {
          setDisplay(text);
          setIsScrambling(false);
          doneRef.current = true;
          playBlip(660, 0.1);
          unsubscribe?.();
        }
      });
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- text/reducedMotion/delay are fixed for a given mount; re-subscribing mid-scramble would restart it
  }, [visible]);

  return { ref, display, isScrambling };
}
