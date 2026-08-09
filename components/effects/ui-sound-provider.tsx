"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

interface UiSoundContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  playBlip: (frequency?: number, duration?: number) => void;
}

const UiSoundContext = createContext<UiSoundContextValue | null>(null);

/**
 * Barely-there synthesized UI sound (no audio files) — a short oscillator +
 * gain-envelope "blip". Defaults muted; the AudioContext is only created and
 * resumed inside the unmute click handler itself, so it always has a
 * genuine user gesture behind it per browser autoplay policy.
 */
export function UiSoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(true);

  function toggleMute() {
    setIsMuted((muted) => {
      const next = !muted;
      isMutedRef.current = next;
      if (!next) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        } else if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume();
        }
      }
      return next;
    });
  }

  function playBlip(frequency = 880, duration = 0.08) {
    const ctx = audioContextRef.current;
    if (isMutedRef.current || !ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  return (
    <UiSoundContext.Provider value={{ isMuted, toggleMute, playBlip }}>{children}</UiSoundContext.Provider>
  );
}

export function useUiSound(): UiSoundContextValue {
  const context = useContext(UiSoundContext);
  if (!context) {
    throw new Error("useUiSound must be used within a UiSoundProvider");
  }
  return context;
}
