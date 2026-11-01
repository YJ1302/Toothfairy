"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/#services", label: "Treatments" },
  { href: "/#first-visit", label: "First visit" },
  { href: "/#doctor", label: "Dr. Anusha" },
  { href: "/#parent-app", label: "Parent app" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.95rem] font-medium text-ink-2 transition-colors hover:text-lav-600">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/login" className="btn btn-ghost !py-2.5">
            Parent login
          </Link>
          <Link href="/book" className="btn btn-primary !py-2.5">
            Book a visit
          </Link>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-full bg-lav-100 text-lav-700 sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line sm:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium text-ink-2 hover:bg-lav-50">
                  {l.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/login" className="btn btn-ghost">
                  Parent login
                </Link>
                <Link href="/book" className="btn btn-primary">
                  Book a visit
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
