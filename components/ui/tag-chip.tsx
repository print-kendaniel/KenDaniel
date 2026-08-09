interface TagChipProps {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}

/** Pill tag, e.g. a project's tech-stack label. `light` tone is for use on dark cards. */
export function TagChip({ children, tone = "dark", className }: TagChipProps) {
  const toneClass = tone === "light" ? "border-white/25 text-white" : "border-line text-black";

  return (
    <span
      className={`inline-flex rounded-pill border px-4 py-2 text-sm ${toneClass} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
