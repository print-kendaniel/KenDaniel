interface EyebrowProps {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}

/** Small label with a leading dot, used above headings. */
export function Eyebrow({ children, tone = "dark", className }: EyebrowProps) {
  const textClass = tone === "dark" ? "text-black/70" : "text-white/70";
  const dotClass = tone === "dark" ? "bg-black/50" : "bg-white/60";

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${textClass} ${className ?? ""}`}>
      <span className={`h-1.5 w-1.5 rounded-pill ${dotClass}`} />
      {children}
    </span>
  );
}
