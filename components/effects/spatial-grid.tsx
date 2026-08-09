"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { rafTicker } from "@/lib/raf-ticker";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const MAX_TILT_DEG = 5;
const LERP = 0.08;

interface SpatialGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Perspective container for a "spatial" grid: the whole scene tilts gently
 * toward the cursor (like looking through a window), and children placed at
 * different translateZ depths (via `SpatialCard`) shift by different
 * amounts on screen purely from the perspective projection — no per-card
 * math needed beyond their own static depth value.
 */
export function SpatialGrid({ children, className }: SpatialGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLUListElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    function onMouseMove(event: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      targetRef.current = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
    }

    function onMouseLeave() {
      targetRef.current = { x: 0, y: 0 };
    }

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    const unsubscribe = rafTicker.subscribe(() => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * LERP;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * LERP;

      const node = sceneRef.current;
      if (node) {
        const rotateY = currentRef.current.x * MAX_TILT_DEG * 2;
        const rotateX = -currentRef.current.y * MAX_TILT_DEG * 2;
        node.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      unsubscribe();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} style={{ perspective: "1600px" }}>
      <ul ref={sceneRef} className={className} style={{ transformStyle: "preserve-3d" }}>
        {children}
      </ul>
    </div>
  );
}
