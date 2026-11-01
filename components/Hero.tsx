"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Check, HeartHandshake, Pill, Smile } from "lucide-react";
import { Mascot } from "./Mascot";
import { CLINIC } from "@/lib/data";

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.55;
      setLook({ x: (e.clientX - cx) / (window.innerWidth / 2), y: (e.clientY - cy) / (window.innerHeight / 2) });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:pb-24 md:pt-14">
        <div className="max-w-[42rem]">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-2 shadow-[0_0_0_1px_var(--color-line)]"
          >
            <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
            Children&apos;s dentist in Baner, Pune
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[2.6rem] text-ink [text-wrap:wrap] sm:text-[3.5rem] lg:text-[3.9rem]"
          >
            Little teeth,
            <br />
            looked after gently.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-[34rem] text-lg text-ink-2 sm:text-xl"
          >
            Dental care for children from their first tooth to their teens, with {CLINIC.doctor}. Calm visits for your
            child, and a parent app that tells you which medicine to give, and when.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/book" className="btn btn-primary !px-6 !py-3.5 text-[1.05rem]">
              <CalendarCheck size={19} /> Book a visit
            </Link>
            <Link href="/login" className="btn btn-ghost !px-6 !py-3.5 text-[1.05rem]">
              Parent login
            </Link>
          </motion.div>
          <ul className="mt-10 grid gap-3 text-[0.97rem] text-ink-2 sm:grid-cols-3 sm:gap-5">
            {[
              { icon: Smile, text: "Child-first, no-fear visits" },
              { icon: HeartHandshake, text: "Parents stay in the room" },
              { icon: Pill, text: "Medicine schedule at home" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 sm:flex-col sm:items-start">
                <Icon size={20} className="shrink-0 text-lav-500" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div ref={stage} className="relative mx-auto aspect-square w-full max-w-[460px]">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-[6%] rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-lav-100"
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-[12%]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Mascot look={look} className="h-full w-full drop-shadow-[0_18px_24px_rgba(106,75,184,0.18)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 16, delay: 1.6 }}
            className="absolute bottom-[14%] left-0 flex items-center gap-3 rounded-2xl bg-white py-3 pl-3 pr-4 shadow-[0_14px_34px_-16px_rgba(46,36,69,0.35),0_0_0_1px_var(--color-line)] sm:-left-6"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-mint-bg text-mint">
              <Check size={18} strokeWidth={3} />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Amoxicillin, 5 ml</span>
              <span className="text-ink-3">Given at 8:05 am</span>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 16, delay: 1.85 }}
            className="absolute right-0 top-[16%] rounded-2xl bg-white px-4 py-3 text-sm leading-tight shadow-[0_14px_34px_-16px_rgba(46,36,69,0.35),0_0_0_1px_var(--color-line)] sm:-right-4"
          >
            <span className="block text-ink-3">Next visit</span>
            <span className="font-semibold">Fri, 5:00 pm</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
