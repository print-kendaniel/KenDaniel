"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { useMagnetic } from "@/lib/hooks/use-magnetic";
import { useUiSound } from "@/components/effects/ui-sound-provider";

type Variant = "dark" | "light" | "outline";
type Arrow = "right" | "up-right";

interface PillButtonProps {
  children: ReactNode;
  variant?: Variant;
  arrow?: Arrow;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  dark: "bg-ink text-white",
  light: "bg-surface text-black",
  outline: "border border-line bg-transparent text-black",
};

const badgeClasses: Record<Variant, string> = {
  dark: "bg-white text-ink",
  light: "bg-ink text-white",
  outline: "bg-ink text-white",
};

export function PillButton({
  children,
  variant = "dark",
  arrow,
  href,
  onClick,
  type = "button",
  disabled,
  className,
}: PillButtonProps) {
  // Magnetic pull is applied to this wrapping ref, not the button itself —
  // the button's own hover:scale transform class would get clobbered if the
  // provider set style.transform directly on the same node.
  const magneticRef = useMagnetic<HTMLSpanElement>();
  const { playBlip } = useUiSound();

  const paddingClass = arrow ? "py-1.5 pr-1.5 pl-6" : "px-7 py-3.5";
  const rootClass = `group inline-flex items-center gap-3 rounded-pill text-sm font-medium transition-transform duration-300 ease-(--ease-spring-snappy) hover:scale-104 ${paddingClass} ${variantClasses[variant]} ${className ?? ""}`;

  const content = (
    <>
      {children}
      {arrow && (
        <span
          className={`grid size-9 place-items-center rounded-pill text-base transition-transform duration-300 ease-(--ease-spring-snappy) ${
            arrow === "right" ? "group-hover:translate-x-1" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          } ${badgeClasses[variant]}`}
        >
          {arrow === "right" ? <ArrowRight className="size-4" /> : <ArrowUpRight className="size-4" />}
        </span>
      )}
    </>
  );

  function handleHover() {
    playBlip(880, 0.06);
  }

  const button = href ? (
    <Link href={href} className={rootClass} onMouseEnter={handleHover}>
      {content}
    </Link>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={rootClass} onMouseEnter={handleHover}>
      {content}
    </button>
  );

  return (
    <span ref={magneticRef} className="inline-block">
      {button}
    </span>
  );
}
