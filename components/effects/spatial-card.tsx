import type { ReactNode } from "react";

interface SpatialCardProps {
  children: ReactNode;
  depth?: number;
  className?: string;
}

/** Sits inside `SpatialGrid` at a fixed depth (px) — the parallax shift comes from the scene's own rotation, not from this component. */
export function SpatialCard({ children, depth = 0, className }: SpatialCardProps) {
  return (
    <div
      className={className}
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: "preserve-3d",
        boxShadow: depth > 0 ? `0 ${Math.round(depth * 0.8)}px ${Math.round(depth * 1.6)}px rgba(43,12,20,0.18)` : undefined,
      }}
    >
      {children}
    </div>
  );
}
