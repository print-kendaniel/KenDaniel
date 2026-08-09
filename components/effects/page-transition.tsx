"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Keying on pathname forces React to remount this wrapper on every route
 * change, which retriggers the CSS entrance animation — a cheap, reliable
 * way to get a consistent fade/slide-in on navigation without fighting the
 * App Router's instant unmount/mount of route segments.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
