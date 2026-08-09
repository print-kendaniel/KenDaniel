"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { useRevealVisible } from "@/components/effects/use-reveal-visible";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * 3D reveal (rotates/scales in from an angled position as it scrolls into
 * view) plus an interactive pointer-driven tilt once visible — moving the
 * cursor over it tilts it in 3D like a trading card. Disabled implicitly on
 * touch since there's no hover/mousemove to drive it; it just sits flat.
 */
export function TiltCard({ children, className, maxTilt = 10 }: TiltCardProps) {
  const { ref, visible } = useRevealVisible<HTMLDivElement>(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * maxTilt * 2, y: (px - 0.5) * maxTilt * 2 });
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: "1400px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setTilt({ x: 0, y: 0 });
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: visible
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1) translateY(0)`
            : "rotateX(24deg) rotateY(-10deg) scale(0.9) translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: isHovering
            ? "transform 150ms ease-out"
            : "transform 900ms var(--ease-spring), opacity 900ms var(--ease-spring)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
