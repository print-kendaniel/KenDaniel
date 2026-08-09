"use client";

import Link from "next/link";
import { useMagnetic } from "@/lib/hooks/use-magnetic";

interface MagneticNavLinkProps {
  label: string;
  href: string | null;
  onClick?: () => void;
  className: string;
}

/** One magnetic-registered nav item — own component so useMagnetic (a hook) can be called once per instance inside a list. */
export function MagneticNavLink({ label, href, onClick, className }: MagneticNavLinkProps) {
  const magneticRef = useMagnetic<HTMLSpanElement>();

  return (
    <span ref={magneticRef} className="inline-block">
      {href ? (
        <Link href={href} className={className}>
          {label}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={className}>
          {label}
        </button>
      )}
    </span>
  );
}
