/**
 * Shared static SVG filter defs, rendered once at the root. Chromatic
 * aberration isn't here — its offsets change continuously with scroll
 * velocity, so it owns a small dedicated filter local to HeroCharacter
 * instead (cheaper than re-rendering shared defs every frame).
 */
export function SvgFilters() {
  return (
    <svg aria-hidden focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {/* Gooey merge: heavy blur + a high-contrast alpha threshold fuses nearby blurred shapes into one blob. */}
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
