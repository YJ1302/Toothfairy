import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";

export function AppHeader({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(-2)
    .join("");
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo compact />
        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-[0.95rem] font-semibold">{name}</p>
            <p className="text-xs text-ink-3">{role}</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-lav-200 text-sm font-bold text-lav-700" aria-hidden="true">
            {initials}
          </span>
          <Link
            href="/"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-2 hover:bg-lav-50 hover:text-ink"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={19} />
          </Link>
        </div>
      </div>
    </header>
  );
}
