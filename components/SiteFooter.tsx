import Link from "next/link";
import { Logo } from "./Logo";
import { CLINIC } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-[0.95rem] text-white/65">
            Pediatric dental care in Baner, Pune, with {CLINIC.doctor}.
          </p>
        </div>
        <div className="text-[0.95rem]">
          <p className="mb-3 font-semibold text-white">Visit</p>
          {CLINIC.addressLines.map((l) => (
            <p key={l}>{l}</p>
          ))}
          <p className="mt-3">
            <a href={CLINIC.phoneHref} className="hover:text-white">
              {CLINIC.phoneDisplay}
            </a>
          </p>
        </div>
        <div className="text-[0.95rem]">
          <p className="mb-3 font-semibold text-white">For parents</p>
          <ul className="space-y-2">
            <li>
              <Link href="/book" className="hover:text-white">
                Book a visit
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Parent login
              </Link>
            </li>
            <li>
              <Link href="/login?as=doctor" className="hover:text-white">
                Clinic login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-white/50 sm:px-6">
          © {new Date().getFullYear()} {CLINIC.name}. Sample site for review. Patient details shown are invented.
        </p>
      </div>
    </footer>
  );
}
