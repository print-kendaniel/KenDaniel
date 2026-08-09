"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMagnetic } from "@/lib/hooks/use-magnetic";

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

/** Hover-lift link: shifts right and fades in on hover. */
export function AnimatedLink({ href, children, className, external }: AnimatedLinkProps) {
  const magneticRef = useMagnetic<HTMLSpanElement>();

  const inner = (
    <span className="inline-block text-white/65 transition-transform duration-300 ease-(--ease-spring-soft) group-hover:translate-x-1 group-hover:text-white">
      {children}
    </span>
  );

  const link = external ? (
    <a href={href} target="_blank" rel="noreferrer" className={`group inline-flex ${className ?? ""}`}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={`group inline-flex ${className ?? ""}`}>
      {inner}
    </Link>
  );

  return (
    <span ref={magneticRef} className="inline-block">
      {link}
    </span>
  );
}
