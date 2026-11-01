"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarCheck, Check, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Mascot } from "@/components/Mascot";
import { CLINIC, addDays, fmtLong, iso, startOfDay } from "@/lib/data";
import { useBookings, useNow } from "@/lib/store";

const STEPS = ["Your child", "Reason for visit", "Date and time", "Your details"];
const REASONS = [
  "Check-up and cleaning",
  "Toothache or swelling",
  "Broken or knocked tooth",
  "Cavities or fillings",
  "First visit for a baby",
  "Follow-up visit",
  "Something else",
];
const AGES = ["Under 1", ...Array.from({ length: 16 }, (_, i) => String(i + 1))];
const MORNING = ["10:00 am", "10:30 am", "11:00 am", "11:30 am", "12:00 pm", "12:30 pm", "1:00 pm"];
const EVENING = ["4:30 pm", "5:00 pm", "5:30 pm", "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm"];

function taken(day: string, slot: string) {
  let h = 0;
  for (const c of day + slot) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10 < 3;
}

export default function BookPage() {
  const now = useNow();
  const { add } = useBookings();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    child: "",
    age: "",
    firstVisit: "yes",
    reason: "",
    notes: "",
    date: "",
    time: "",
    parent: "",
    phone: "",
    email: "",
    consent: false,
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const days = useMemo(() => {
    if (!now) return [];
    return Array.from({ length: 14 }, (_, i) => addDays(startOfDay(now), i + 1));
  }, [now]);

  const phoneOk = form.phone.replace(/\D/g, "").length === 10;
  const valid = [
    form.child.trim().length > 1 && form.age !== "",
    form.reason !== "",
    form.date !== "" && form.time !== "",
    form.parent.trim().length > 1 && phoneOk && form.consent,
  ];

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const submit = () => {
    add({
      id: crypto.randomUUID(),
      child: form.child.trim(),
      age: form.age,
      reason: form.reason,
      date: form.date,
      time: form.time,
      parent: form.parent.trim(),
      phone: form.phone,
      notes: form.notes,
      createdAt: new Date().toISOString(),
    });
    setDone(true);
  };

  const chosenDate = form.date ? new Date(form.date + "T00:00:00") : null;
  const firstName = form.child.trim().split(" ")[0];

  return (
    <div className="min-h-dvh bg-page">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <Link href="/" className="inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-ink-2 hover:text-lav-600">
          <ArrowLeft size={17} /> Back to site
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 pt-4 sm:px-6 md:grid-cols-[260px_1fr] md:gap-12 md:pt-10">
        <aside>
          <h1 className="text-[2rem] sm:text-[2.4rem]">Book a visit</h1>
          <p className="mt-2 text-ink-2">Takes about a minute. We&apos;ll call to confirm.</p>
          {!done && (
            <ol className="mt-8 hidden space-y-1 md:block">
              {STEPS.map((s, i) => {
                const reachable = i <= step || valid.slice(0, i).every(Boolean);
                return (
                  <li key={s}>
                    <button
                      onClick={() => reachable && go(i)}
                      disabled={!reachable}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        i === step ? "bg-white font-semibold shadow-[0_0_0_1px_var(--color-line)]" : "text-ink-2 enabled:hover:bg-white/70"
                      } disabled:opacity-50`}
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-sm ${
                          i < step && valid[i] ? "bg-mint text-white" : i === step ? "bg-lav-600 text-white" : "bg-lav-100 text-lav-700"
                        }`}
                      >
                        {i < step && valid[i] ? <Check size={14} strokeWidth={3} /> : i + 1}
                      </span>
                      {s}
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
          {!done && (
            <div className="mt-6 md:hidden">
              <div className="flex items-center justify-between text-sm font-medium text-ink-2">
                <span>
                  Step {step + 1} of {STEPS.length}: {STEPS[step]}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lav-100">
                <motion.div className="h-full rounded-full bg-lav-600" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
          )}
        </aside>

        <section className="panel relative overflow-hidden p-5 sm:p-8">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <Mascot happy grow className="h-40 w-40" title="Happy tooth" />
                <h2 className="mt-4 text-3xl">Request sent</h2>
                <p className="mt-3 max-w-md text-ink-2">
                  {firstName}&apos;s visit is requested for <strong className="text-ink">{chosenDate && fmtLong(chosenDate)}</strong> at{" "}
                  <strong className="text-ink">{form.time}</strong>. The clinic will call {form.phone} to confirm.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/" className="btn btn-ghost">
                    Back to site
                  </Link>
                  <Link href="/login" className="btn btn-primary">
                    Open the parent app
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -28 }}
                transition={{ duration: 0.22 }}
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-3xl">Who is coming in?</h2>
                    <label className="block">
                      <span className="mb-2 block font-semibold">Child&apos;s name</span>
                      <input className="field" value={form.child} onChange={(e) => set("child", e.target.value)} placeholder="e.g. Aarav Deshpande" autoComplete="off" />
                    </label>
                    <label className="block max-w-xs">
                      <span className="mb-2 block font-semibold">Age</span>
                      <select className="field" value={form.age} onChange={(e) => set("age", e.target.value)}>
                        <option value="">Select age</option>
                        {AGES.map((a) => (
                          <option key={a} value={a}>
                            {a === "Under 1" ? a : `${a} ${a === "1" ? "year" : "years"}`}
                          </option>
                        ))}
                      </select>
                    </label>
                    <fieldset>
                      <legend className="mb-2 font-semibold">First visit to Tooth Fairy?</legend>
                      <div className="flex gap-2">
                        {[
                          ["yes", "Yes, first visit"],
                          ["no", "No, been before"],
                        ].map(([v, l]) => (
                          <Chip key={v} active={form.firstVisit === v} onClick={() => set("firstVisit", v)}>
                            {l}
                          </Chip>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-3xl">What is the visit for?</h2>
                    <div className="flex flex-wrap gap-2">
                      {REASONS.map((r) => (
                        <Chip key={r} active={form.reason === r} onClick={() => set("reason", r)}>
                          {r}
                        </Chip>
                      ))}
                    </div>
                    <label className="block">
                      <span className="mb-2 block font-semibold">
                        Anything we should know? <span className="font-normal text-ink-3">Optional</span>
                      </span>
                      <textarea
                        className="field min-h-28 resize-y"
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        placeholder="Allergies, worries, or what happened"
                      />
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-3xl">Pick a day and time</h2>
                    <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
                      <div className="flex gap-2">
                        {days.map((d) => {
                          const closed = d.getDay() === 0;
                          const id = iso(d);
                          const active = form.date === id;
                          return (
                            <button
                              key={id}
                              disabled={closed}
                              onClick={() => {
                                set("date", id);
                                set("time", "");
                              }}
                              className={`flex w-[4.6rem] shrink-0 flex-col items-center rounded-2xl py-3 transition-colors ${
                                active
                                  ? "bg-lav-600 text-white"
                                  : closed
                                    ? "bg-transparent text-ink-3 line-through decoration-1"
                                    : "bg-lav-50 text-ink hover:bg-lav-100"
                              }`}
                              aria-pressed={active}
                              aria-label={closed ? `${fmtLong(d)}, closed` : fmtLong(d)}
                            >
                              <span className={`text-xs font-semibold ${active ? "text-lav-100" : "text-ink-3"}`}>
                                {d.toLocaleDateString("en-IN", { weekday: "short" })}
                              </span>
                              <span className="font-display text-2xl leading-tight">{d.getDate()}</span>
                              <span className={`text-xs ${active ? "text-lav-100" : "text-ink-3"}`}>
                                {d.toLocaleDateString("en-IN", { month: "short" })}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {form.date ? (
                      <div className="space-y-5">
                        {[
                          { label: "Morning", icon: Sun, slots: MORNING },
                          { label: "Evening", icon: Moon, slots: EVENING },
                        ].map((g) => (
                          <div key={g.label}>
                            <p className="mb-2 flex items-center gap-2 font-semibold">
                              <g.icon size={17} className="text-lav-500" /> {g.label}
                            </p>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                              {g.slots.map((s) => {
                                const busy = taken(form.date, s);
                                const active = form.time === s;
                                return (
                                  <button
                                    key={s}
                                    disabled={busy}
                                    onClick={() => set("time", s)}
                                    className={`rounded-xl py-2.5 text-[0.95rem] font-medium transition-colors ${
                                      active
                                        ? "bg-lav-600 text-white"
                                        : busy
                                          ? "cursor-not-allowed bg-transparent text-ink-3 line-through"
                                          : "bg-white text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-lav-300)]"
                                    }`}
                                    aria-pressed={active}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <p className="text-sm text-ink-3">Crossed-out times are already booked.</p>
                      </div>
                    ) : (
                      <p className="rounded-2xl bg-lav-50 p-4 text-ink-2">Choose a day to see open times. We&apos;re closed on Sundays.</p>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-2xl sm:text-3xl">How can we reach you?</h2>
                    <label className="block">
                      <span className="mb-2 block font-semibold">Parent or guardian name</span>
                      <input className="field" value={form.parent} onChange={(e) => set("parent", e.target.value)} autoComplete="name" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block font-semibold">Mobile number</span>
                      <div className="flex">
                        <span className="grid place-items-center rounded-l-[14px] border-[1.5px] border-r-0 border-line bg-lav-50 px-3 font-medium text-ink-2">
                          +91
                        </span>
                        <input
                          className="field !rounded-l-none"
                          inputMode="numeric"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value.replace(/[^\d ]/g, "").slice(0, 11))}
                          placeholder="10-digit number"
                          autoComplete="tel-national"
                          aria-invalid={form.phone !== "" && !phoneOk}
                        />
                      </div>
                      {form.phone !== "" && !phoneOk && <span className="mt-1.5 block text-sm text-rose">Enter a 10-digit mobile number.</span>}
                    </label>
                    <label className="block">
                      <span className="mb-2 block font-semibold">
                        Email <span className="font-normal text-ink-3">Optional</span>
                      </span>
                      <input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                    </label>
                    <label className="flex cursor-pointer gap-3 rounded-2xl bg-lav-50 p-4 text-[0.95rem] text-ink-2">
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-lav-600)]"
                        checked={form.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                      />
                      I am this child&apos;s parent or guardian, and I agree to {CLINIC.name} storing these details to arrange the visit.
                    </label>
                    <div className="rounded-2xl border border-line p-4 text-[0.95rem]">
                      <p className="font-semibold">Summary</p>
                      <p className="mt-1 text-ink-2">
                        {form.child || "Your child"}, {form.reason.toLowerCase() || "visit"}, on {chosenDate ? fmtLong(chosenDate) : "—"} at {form.time || "—"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
                  <button onClick={() => go(step - 1)} disabled={step === 0} className="btn btn-ghost disabled:invisible">
                    <ChevronLeft size={18} /> Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button onClick={() => go(step + 1)} disabled={!valid[step]} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-45">
                      Continue <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button onClick={submit} disabled={!valid[3]} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-45">
                      <CalendarCheck size={18} /> Request this visit
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2.5 text-[0.95rem] font-medium transition-colors ${
        active ? "bg-lav-600 text-white" : "bg-white text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-lav-300)]"
      }`}
    >
      {children}
    </button>
  );
}
