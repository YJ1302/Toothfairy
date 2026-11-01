"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Mascot } from "@/components/Mascot";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<"parent" | "clinic">("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState<"none" | "email" | "password">("none");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState<"none" | "google" | "email">("none");
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.get("as") === "doctor") setRole("clinic");
  }, [params]);

  const success = busy !== "none";
  const look =
    focus === "email"
      ? { x: Math.min(email.length / 22, 1) * 1.6 - 0.8, y: 0.7 }
      : focus === "password" && show
        ? { x: 0.9, y: 0.6 }
        : { x: 0, y: 0 };

  const finish = (kind: "google" | "email") => {
    setBusy(kind);
    setTimeout(() => router.push(role === "parent" ? "/portal" : "/dashboard"), 1100);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter your email address, for example name@gmail.com.");
    if (password.length < 4) return setError("Enter your password. It has at least 4 characters.");
    setError("");
    finish("email");
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-lav-100 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <Logo />
        <div className="relative mx-auto aspect-square w-full max-w-[400px]">
          <div className="absolute inset-[4%] rounded-full bg-white/60" aria-hidden="true" />
          <Mascot
            className="relative h-full w-full"
            look={look}
            covered={focus === "password" && !show && !success}
            happy={success}
            title="The Tooth Fairy mascot, watching you sign in"
          />
        </div>
        <p className="max-w-sm text-ink-2">
          Our tooth fairy keeps an eye on your child&apos;s medicines. Not on your password, though.
        </p>
      </div>

      <div className="flex flex-col px-4 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <span className="lg:invisible">
            <Logo compact />
          </span>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-ink-2 hover:text-lav-600">
            <ArrowLeft size={17} /> Back to site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <div className="mx-auto mb-4 h-28 w-28 lg:hidden">
            <Mascot look={look} covered={focus === "password" && !show && !success} happy={success} className="h-full w-full" />
          </div>
          <h1 className="text-[2.1rem] sm:text-[2.5rem]">{role === "parent" ? "Welcome back" : "Clinic sign in"}</h1>
          <p className="mt-2 text-ink-2">
            {role === "parent" ? "See today's medicines and upcoming visits for your children." : "Patients, prescriptions and today's appointments."}
          </p>

          <div className="mt-7 grid grid-cols-2 rounded-full bg-lav-100 p-1" role="tablist" aria-label="Account type">
            {(["parent", "clinic"] as const).map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={role === r}
                onClick={() => {
                  setRole(r);
                  setError("");
                }}
                className="relative rounded-full py-2.5 text-[0.95rem] font-semibold"
              >
                {role === r && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className={`relative ${role === r ? "text-ink" : "text-ink-2"}`}>{r === "parent" ? "Parent" : "Clinic"}</span>
              </button>
            ))}
          </div>

          {role === "parent" && (
            <>
              <button
                onClick={() => finish("google")}
                disabled={success}
                className="btn btn-ghost mt-6 w-full !py-3.5 text-[1.02rem] disabled:opacity-80"
              >
                {busy === "google" ? (
                  <>
                    <Spinner /> Connecting to Google…
                  </>
                ) : (
                  <>
                    <GoogleG /> Continue with Google
                  </>
                )}
              </button>
              <div className="my-6 flex items-center gap-3 text-sm text-ink-3">
                <span className="h-px flex-1 bg-line" /> or use email <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}

          <form onSubmit={submit} className={`space-y-4 ${role === "clinic" ? "mt-6" : ""}`} noValidate>
            <label className="block">
              <span className="mb-2 block font-semibold">Email</span>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  className="field !pl-11"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocus("email")}
                  onBlur={() => setFocus("none")}
                  autoComplete="email"
                  placeholder={role === "parent" ? "you@gmail.com" : "doctor@toothfairydental.in"}
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block font-semibold">Password</span>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  className="field !pl-11 !pr-12"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocus("password")}
                  onBlur={() => setFocus("none")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-3 hover:bg-lav-50 hover:text-ink"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && (
              <p className="rounded-xl bg-rose-bg px-4 py-3 text-sm text-rose" role="alert">
                {error}
              </p>
            )}
            <button type="submit" disabled={success} className="btn btn-primary w-full !py-3.5 text-[1.02rem]">
              {busy === "email" ? (
                <>
                  <Spinner light /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 rounded-2xl bg-sun-bg px-4 py-3 text-sm text-ink-2">
            Sample site: any email and password opens the demo {role === "parent" ? "parent" : "clinic"} account.
          </p>
        </div>
      </div>
    </div>
  );
}

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <motion.span
      className={`inline-block h-4.5 w-4.5 rounded-full border-2 ${light ? "border-white/40 border-t-white" : "border-lav-200 border-t-lav-600"}`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      aria-hidden="true"
    />
  );
}
