import Link from "next/link";
import { SPARKLES, TOOTH, WING_LOW, WING_UP, sparkle } from "./sprig";

export function LogoMark({ size = 40, light = false }: { size?: number; light?: boolean }) {
  const wings = (
    <>
      <path d={WING_UP} />
      <path d={WING_LOW} />
    </>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <g fill={light ? "#6A4BB8" : "#DDD0F6"} stroke={light ? "#C9B6EF" : "#8B6CCF"} strokeWidth={1} strokeLinejoin="round">
        {wings}
        <g transform="translate(64 0) scale(-1 1)">{wings}</g>
      </g>
      <path d={TOOTH} fill={light ? "#C9B6EF" : "#8B6CCF"} />
      <g fill={light ? "#E4D9FA" : "#6A4BB8"}>
        {SPARKLES.map(([x, y, r]) => (
          <path key={`${x}-${y}`} d={sparkle(x, y, r)} />
        ))}
      </g>
    </svg>
  );
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl" aria-label="Tooth Fairy, home">
      <LogoMark size={compact ? 36 : 44} light={light} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.38rem] ${light ? "text-white" : "text-ink"}`}>Tooth Fairy</span>
        {!compact && (
          <span className={`mt-1 text-[0.78rem] font-semibold tracking-wide ${light ? "text-lav-300" : "text-lav-500"}`}>
            Pediatric Dentistry
          </span>
        )}
      </span>
    </Link>
  );
}
