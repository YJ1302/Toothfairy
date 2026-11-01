import Link from "next/link";
import { useId } from "react";
import { MARK_BODY, MARK_GAPS, MARK_GAP_WIDTH, MARK_STAR, MARK_SWOOSH, MARK_VIEWBOX } from "./brand";

export function LogoMark({ size = 40, light = false, bold = false }: { size?: number; light?: boolean; bold?: boolean }) {
  const id = useId().replace(/:/g, "");
  const gap = bold ? MARK_GAP_WIDTH * 1.7 : MARK_GAP_WIDTH;
  return (
    <svg width={size} height={(size * 92) / 100} viewBox={MARK_VIEWBOX} aria-hidden="true">
      <defs>
        <mask id={`cut-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="92">
          <rect width="100" height="92" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth={gap} strokeLinecap="round">
            {MARK_GAPS.map((d) => (
              <path key={d} d={d} />
            ))}
            {!bold && <path d={MARK_SWOOSH} strokeWidth={1.7} />}
          </g>
        </mask>
      </defs>
      <path d={MARK_BODY} fill={light ? "#FFFFFF" : "#8B6CCF"} mask={`url(#cut-${id})`} />
      <path d={MARK_STAR} fill={light ? "#A88DDF" : "#6A4BB8"} />
    </svg>
  );
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl" aria-label="Tooth Fairy Pediatric Dentistry, home">
      <LogoMark size={compact ? 38 : 46} light={light} bold={compact} />
      <span className="flex flex-col leading-none">
        <span className={`font-logo text-[1.45rem] ${light ? "text-white" : "text-ink"}`}>Tooth Fairy</span>
        {!compact && (
          <span className={`mt-1.5 text-[0.62rem] font-semibold tracking-[0.13em] ${light ? "text-lav-300" : "text-lav-500"}`}>
            PEDIATRIC DENTISTRY
          </span>
        )}
      </span>
    </Link>
  );
}
