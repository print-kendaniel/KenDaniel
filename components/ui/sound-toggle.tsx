"use client";

import { useUiSound } from "@/components/effects/ui-sound-provider";

export function SoundToggle() {
  const { isMuted, toggleMute } = useUiSound();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute interface sounds" : "Mute interface sounds"}
      aria-pressed={!isMuted}
      className="fixed right-4 bottom-4 z-90 grid size-10 place-items-center rounded-pill bg-ink text-base text-white shadow-lg transition-transform duration-300 ease-(--ease-spring-snappy) hover:scale-108"
    >
      <span aria-hidden>{isMuted ? "🔇" : "🔊"}</span>
    </button>
  );
}
