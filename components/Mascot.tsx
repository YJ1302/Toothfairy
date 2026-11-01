"use client";
import { motion } from "framer-motion";
import { HINGE, SPARKLES, TOOTH, WING_LOW, WING_UP, sparkle } from "./sprig";

type Props = {
  /** where the eyes look, each axis from -1 to 1 */
  look?: { x: number; y: number };
  /** hands over the eyes (used while a password is typed) */
  covered?: boolean;
  /** closed happy eyes */
  happy?: boolean;
  /** play the sprig-growing entrance */
  grow?: boolean;
  className?: string;
  title?: string;
};

const EYES = [26.4, 37.6];

export function Mascot({ look = { x: 0, y: 0 }, covered = false, happy = false, grow = true, className, title }: Props) {
  const dx = Math.max(-1, Math.min(1, look.x)) * 1.1;
  const dy = Math.max(-1, Math.min(1, look.y)) * 0.8;
  
  return (
    <svg viewBox="2 2 60 60" className={className} role="img" aria-label={title ?? "The Tooth Fairy mascot"}>
      {/* wings */}
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(64 0) scale(-1 1)" : undefined}>
          <motion.g
            fill="#DDD0F6"
            stroke="#8B6CCF"
            strokeWidth={0.9}
            strokeLinejoin="round"
            style={{ transformOrigin: `${HINGE.x}px ${HINGE.y}px` }}
            initial={grow ? { scale: 0, rotate: 0 } : false}
            animate={{ scale: 1, rotate: happy ? [0, 14, 0, 14, 0] : [0, 9, 0] }}
            transition={{
              scale: { type: "spring", stiffness: 200, damping: 13, delay: 0.3 },
              rotate: happy
                ? { duration: 0.7, ease: "easeInOut" }
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
          >
            <path d={WING_UP} />
            <path d={WING_LOW} />
          </motion.g>
        </g>
      ))}

      {/* sparkles */}
      <g fill="#6A4BB8">
        {SPARKLES.map(([x, y, r], i) => (
          <motion.path
            key={i}
            d={sparkle(x, y, r)}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={grow ? { scale: 0, rotate: -45, opacity: 0 } : false}
            animate={{ scale: [1, i === 0 ? 1 : 0.6, 1], rotate: 0, opacity: 1 }}
            transition={{
              rotate: { type: "spring", stiffness: 160, damping: 12, delay: 0.7 + i * 0.15 },
              opacity: { duration: 0.2, delay: 0.7 + i * 0.15 },
              scale: grow
                ? { duration: 2.4, times: [0, 0.5, 1], repeat: Infinity, delay: 1.2 + i * 0.5, ease: "easeInOut" }
                : { duration: 2.4, repeat: Infinity, delay: i * 0.5 },
            }}
          />
        ))}
      </g>

      {/* body */}
      <path d={TOOTH} fill="#8B6CCF" />
      <path
        d="M20.5 30.5c.6-4.6 3.8-6.6 7.2-6.6"
        fill="none"
        stroke="#fff"
        strokeOpacity={0.45}
        strokeWidth={1.4}
        strokeLinecap="round"
      />

      {/* cheeks */}
      <ellipse cx={22.4} cy={38.4} rx={2.3} ry={1.4} fill="#F3A9C8" opacity={0.75} />
      <ellipse cx={41.6} cy={38.4} rx={2.3} ry={1.4} fill="#F3A9C8" opacity={0.75} />

      {/* eyes */}
      {happy ? (
        <g fill="none" stroke="#2E2445" strokeWidth={1.3} strokeLinecap="round">
          <path d="M24.4 34.2q2-2.4 4 0" />
          <path d="M35.6 34.2q2-2.4 4 0" />
        </g>
      ) : (
        <motion.g
          animate={{ x: dx, y: dy }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          {EYES.map((x) => (
            <motion.g
              key={x}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ scaleY: [1, 1, 0.1, 1] }}
              transition={{ duration: 4.2, times: [0, 0.93, 0.96, 1], repeat: Infinity, ease: "easeInOut" }}
            >
              <ellipse cx={x} cy={33.6} rx={1.55} ry={2} fill="#2E2445" />
              <circle cx={x + 0.55} cy={32.8} r={0.55} fill="#fff" />
            </motion.g>
          ))}
        </motion.g>
      )}

      {/* smile */}
      <motion.path
        fill="none"
        stroke="#2E2445"
        strokeWidth={1.25}
        strokeLinecap="round"
        animate={{ d: happy ? "M28 39.2q4 4.2 8 0" : covered ? "M30 40.4q2 .9 4 0" : "M28.6 39.6q3.4 2.8 6.8 0" }}
        transition={{ duration: 0.25 }}
      />

      {/* hands */}
      {[0, 1].map((side) => (
        <motion.ellipse
          key={side}
          stroke="#6A4BB8"
          strokeWidth={0.7}
          initial={false}
          animate={
            covered
              ? { cx: EYES[side], cy: 33.8, rx: 3.6, ry: 3.1, fill: "#DCCFF7", strokeOpacity: 1 }
              : { cx: side === 0 ? 16.6 : 47.4, cy: 45, rx: 2.3, ry: 3.1, fill: "#7A5BC4", strokeOpacity: 0 }
          }
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        />
      ))}
    </svg>
  );
}
