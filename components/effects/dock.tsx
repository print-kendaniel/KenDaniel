"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
  type SpringOptions,
} from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import "./dock.css";

export interface DockItemData {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface DockItemProps {
  className?: string;
  onClick: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  magnification: number;
  baseItemSize: number;
  label: string;
  children: ReactNode;
}

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      <div className="dock-icon">{children}</div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="dock-label"
            role="tooltip"
            style={{ x: "-50%" }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export interface DockProps {
  items: DockItemData[];
  className?: string;
  spring?: SpringOptions;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
}

const DEFAULT_SPRING: SpringOptions = { mass: 0.1, stiffness: 150, damping: 12 };

export function Dock({
  items,
  className = "",
  spring = DEFAULT_SPRING,
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  baseItemSize = 44,
}: DockProps) {
  const reducedMotion = usePrefersReducedMotion();
  const mouseX = useMotionValue(Infinity);

  if (reducedMotion) {
    return (
      <div className={`dock-outer dock-outer-static ${className}`}>
        <div className="dock-panel" style={{ height: panelHeight, position: "fixed" }}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              className={`dock-item dock-item-static ${item.className ?? ""}`}
              style={{ width: baseItemSize, height: baseItemSize }}
            >
              <div className="dock-icon">{item.icon}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`dock-outer ${className}`}>
      <motion.div
        onMouseMove={({ pageX }) => {
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
        }}
        className="dock-panel"
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Quick navigation"
      >
        {items.map((item) => (
          <DockItem
            key={item.label}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
          >
            {item.icon}
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}
