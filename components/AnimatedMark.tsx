"use client";
import { useId } from "react";
import { motion } from "framer-motion";
import { MARK_BODY, MARK_GAPS, MARK_GAP_WIDTH, MARK_STAR, MARK_SWOOSH } from "./brand";

/** four-point sparkle centred on (cx, cy) */
function sparkle(cx: number, cy: number, r: number) {
  const k = r * 0.2;
  return `M${cx} ${cy - r}C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy}C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r}C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy}C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
}

// fairy dust around the mark: [x, y, radius, delay]
const DUST: [number, number, number, number][] = [
  [6, 64, 3.6, 2.2],
  [95, 56, 3, 3.1],
  [88, -3, 4, 2.6],
  [12, -5, 2.6, 3.6],
  [99, 24, 2.2, 4.2],
];

const UNFOLD = { duration: 0.9, ease: [0.2, 0.9, 0.25, 1] as const };

/**
 * The Tooth Fairy logo mark, animated: the wings unfold from the centre line,
 * the white lines draw in, the sparkle pops into place, then the wings keep a slow flutter.
 */
type Mood = "watch" | "shy" | "happy";

/** the two eyes, set on the tooth crown; they follow `look`, blink, and close or smile with `mood` */
const EYE_X = [43, 57];
const EYE_Y = 19.5;

function Eyes({ look, mood }: { look: { x: number; y: number }; mood: Mood }) {
  const dx = Math.max(-1, Math.min(1, look.x)) * 1.3;
  const dy = Math.max(-1, Math.min(1, look.y)) * 0.9;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.7 }}>
      {EYE_X.map((x) => (
        <g key={x}>
          <motion.g animate={{ opacity: mood === "watch" ? 1 : 0, x: dx, y: dy }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ scaleY: [1, 1, 0.1, 1] }}
              transition={{ duration: 4.2, times: [0, 0.93, 0.96, 1], repeat: Infinity, ease: "easeInOut" }}
            >
              <ellipse cx={x} cy={EYE_Y} rx={2.8} ry={3.6} fill="#2E2445" />
              <circle cx={x + 1} cy={EYE_Y - 1.5} r={1} fill="#fff" />
            </motion.g>
          </motion.g>
          <g fill="none" stroke="#2E2445" strokeWidth={1.5} strokeLinecap="round">
            <motion.path d={`M${x - 2.6} ${EYE_Y + 1}q2.6 -3.6 5.2 0`} animate={{ opacity: mood === "happy" ? 1 : 0 }} transition={{ duration: 0.2 }} />
            <motion.path d={`M${x - 2.6} ${EYE_Y - 0.6}q2.6 2.8 5.2 0`} animate={{ opacity: mood === "shy" ? 1 : 0 }} transition={{ duration: 0.2 }} />
          </g>
        </g>
      ))}
    </motion.g>
  );
}

export function AnimatedMark({
  tilt = 0,
  className,
  face = false,
  look = { x: 0, y: 0 },
  mood = "watch",
}: {
  tilt?: number;
  className?: string;
  /** add the eyes */
  face?: boolean;
  look?: { x: number; y: number };
  mood?: Mood;
}) {
  const id = useId().replace(/:/g, "");
  const flutter = { scaleX: [1, 0.93, 1] };
  const flutterT = { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const, delay: 1.9 };

  return (
    <motion.svg
      viewBox="-6 -10 112 112"
      className={className}
      role="img"
      aria-label="Tooth Fairy logo"
      animate={{ rotate: tilt * 4 }}
      transition={{ type: "spring", stiffness: 80, damping: 14 }}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={`l-${id}`}>
          <rect x="-10" y="-10" width="60.6" height="120" />
        </clipPath>
        <clipPath id={`r-${id}`}>
          <rect x="49.4" y="-10" width="60.6" height="120" />
        </clipPath>
        <mask id={`cut-${id}`} maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120">
          <rect x="-10" y="-10" width="120" height="120" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth={MARK_GAP_WIDTH} strokeLinecap="round">
            {MARK_GAPS.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: i === 2 ? 0.35 : 0.6, delay: i === 2 ? 1.25 : 0.75, ease: "easeInOut" },
                  opacity: { duration: 0.01, delay: i === 2 ? 1.25 : 0.75 },
                }}
              />
            ))}
            <motion.path
              d={MARK_SWOOSH}
              strokeWidth={1.7}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ pathLength: { duration: 0.4, delay: 1.45, ease: "easeOut" }, opacity: { duration: 0.01, delay: 1.45 } }}
            />
          </g>
        </mask>
      </defs>

      {/* soft glow behind */}
      <motion.ellipse
        cx={50}
        cy={46}
        rx={44}
        ry={40}
        fill="#8B6CCF"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ filter: "blur(9px)" }}
      />

      <motion.g mask={`url(#cut-${id})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {/* left wing half */}
        <g clipPath={`url(#l-${id})`}>
          <motion.g style={{ transformOrigin: "50px 40px" }} initial={{ scaleX: 0.08 }} animate={{ scaleX: 1 }} transition={UNFOLD}>
            <motion.path d={MARK_BODY} fill="#8B6CCF" style={{ transformOrigin: "50px 40px" }} animate={flutter} transition={flutterT} />
          </motion.g>
        </g>
        {/* right wing half */}
        <g clipPath={`url(#r-${id})`}>
          <motion.g style={{ transformOrigin: "50px 40px" }} initial={{ scaleX: 0.08 }} animate={{ scaleX: 1 }} transition={UNFOLD}>
            <motion.path d={MARK_BODY} fill="#8B6CCF" style={{ transformOrigin: "50px 40px" }} animate={flutter} transition={flutterT} />
          </motion.g>
        </g>
      </motion.g>

      {face && <Eyes look={look} mood={mood} />}

      {/* the gift between the roots */}
      <motion.path
        d={MARK_STAR}
        fill="#6A4BB8"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: [0, 1.35, 1], rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
      />
      <motion.path
        d={MARK_STAR}
        fill="#fff"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0.5, 0], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.6, delay: 2.6 }}
      />

      {/* fairy dust */}
      <g fill="#8B6CCF">
        {DUST.map(([x, y, r, delay]) => (
          <motion.path
            key={`${x}-${y}`}
            d={sparkle(x, y, r)}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 45, 90] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.4, delay, ease: "easeInOut" }}
          />
        ))}
      </g>
    </motion.svg>
  );
}
