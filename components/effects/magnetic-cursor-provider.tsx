"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { rafTicker } from "@/lib/raf-ticker";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const MAGNETIC_RADIUS = 70;
const MAX_PULL_PX = 14;
const CURSOR_LERP = 0.2;
const PULL_LERP = 0.15;

interface Target {
  element: HTMLElement;
  pull: { x: number; y: number };
}

interface MagneticContextValue {
  registerTarget: (id: string, element: HTMLElement) => void;
  unregisterTarget: (id: string) => void;
}

const MagneticContext = createContext<MagneticContextValue | null>(null);

/**
 * Global registry + custom cursor. Interactive elements register themselves
 * via `useMagnetic()`; this drives both their pull-toward-cursor transform
 * and the cursor's own gooey blob visual from one shared ticker subscription
 * instead of per-element listeners. Fully disabled on touch (native cursor
 * stays, no registry work happens).
 */
export function MagneticCursorProvider({ children }: { children: ReactNode }) {
  const [isTouch, setIsTouch] = useState(true);
  const targetsRef = useRef(new Map<string, Target>());
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const cursorPosRef = useRef({ x: -9999, y: -9999 });
  const dotRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    function onPointerMove(event: PointerEvent) {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    }
    window.addEventListener("pointermove", onPointerMove);

    const unsubscribe = rafTicker.subscribe(() => {
      const mouse = mouseRef.current;

      cursorPosRef.current.x += (mouse.x - cursorPosRef.current.x) * CURSOR_LERP;
      cursorPosRef.current.y += (mouse.y - cursorPosRef.current.y) * CURSOR_LERP;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cursorPosRef.current.x}px, ${cursorPosRef.current.y}px) translate(-50%, -50%)`;
      }

      let nearestId: string | null = null;
      let nearestDist = Infinity;
      let nearestCenter = { x: 0, y: 0 };

      for (const [id, target] of targetsRef.current) {
        const rect = target.element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(mouse.x - cx, mouse.y - cy);

        if (dist < MAGNETIC_RADIUS && dist < nearestDist) {
          nearestDist = dist;
          nearestId = id;
          nearestCenter = { x: cx, y: cy };
        }
      }

      for (const [id, target] of targetsRef.current) {
        let targetPullX = 0;
        let targetPullY = 0;

        if (id === nearestId) {
          const rect = target.element.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const strength = 1 - nearestDist / MAGNETIC_RADIUS;
          targetPullX = (mouse.x - cx) * strength * 0.4;
          targetPullY = (mouse.y - cy) * strength * 0.4;
          const mag = Math.hypot(targetPullX, targetPullY);
          if (mag > MAX_PULL_PX) {
            targetPullX = (targetPullX / mag) * MAX_PULL_PX;
            targetPullY = (targetPullY / mag) * MAX_PULL_PX;
          }
        }

        target.pull.x += (targetPullX - target.pull.x) * PULL_LERP;
        target.pull.y += (targetPullY - target.pull.y) * PULL_LERP;

        target.element.style.transform =
          Math.abs(target.pull.x) < 0.05 && Math.abs(target.pull.y) < 0.05
            ? ""
            : `translate(${target.pull.x}px, ${target.pull.y}px)`;
      }

      if (blobRef.current) {
        blobRef.current.style.opacity = nearestId ? "1" : "0";
        if (nearestId) {
          blobRef.current.style.transform = `translate(${nearestCenter.x}px, ${nearestCenter.y}px) translate(-50%, -50%)`;
        }
      }
    });

    const targets = targetsRef.current;
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      unsubscribe();
      for (const target of targets.values()) target.element.style.transform = "";
    };
  }, [isTouch]);

  function registerTarget(id: string, element: HTMLElement) {
    targetsRef.current.set(id, { element, pull: { x: 0, y: 0 } });
  }

  function unregisterTarget(id: string) {
    const target = targetsRef.current.get(id);
    if (target) target.element.style.transform = "";
    targetsRef.current.delete(id);
  }

  return (
    <MagneticContext.Provider value={{ registerTarget, unregisterTarget }}>
      {children}
      {!isTouch && !reducedMotion && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-100" style={{ filter: "url(#goo)" }}>
          <div ref={blobRef} className="absolute top-0 left-0 size-4 rounded-pill bg-ink opacity-0" />
          <div ref={dotRef} className="absolute top-0 left-0 size-3 rounded-pill bg-ink" />
        </div>
      )}
    </MagneticContext.Provider>
  );
}

export function useMagneticContext(): MagneticContextValue {
  const context = useContext(MagneticContext);
  if (!context) {
    throw new Error("useMagneticContext must be used within a MagneticCursorProvider");
  }
  return context;
}
