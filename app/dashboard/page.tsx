"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, CalendarDays, Check, ChevronRight, Phone, Pill, Plus, Search, TriangleAlert, Users, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import {
  CLINIC,
  PATIENTS,
  SLOT_TIME,
  SLOTS,
  addDays,
  adherence,
  dosesOn,
  fmtDay,
  fmtLong,
  hasActiveCourse,
  iso,
  medActiveOn,
  type Child,
  type Medicine,
  type Slot,
} from "@/lib/data";
import { useBookings, useDoseLog, useNow } from "@/lib/store";

type Filter = "all" | "meds" | "attention";

function toMinutes(t: string) {
  const m = t.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  return h * 60 + Number(m[2]);
}

function tone(pct: number | null) {
  if (pct === null) return { bar: "bg-line", text: "text-ink-3" };
  if (pct >= 85) return { bar: "bg-mint", text: "text-mint" };
  if (pct >= 70) return { bar: "bg-sun", text: "text-[#8a5a00]" };
  return { bar: "bg-rose", text: "text-rose" };
}

export default function Dashboard() {
  const now = useNow();
  const { log } = useDoseLog();
  const { bookings } = useBookings();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [extraMeds, setExtraMeds] = useState<Record<string, Medicine[]>>({});

  const patients: Child[] = useMemo(
    () => PATIENTS.map((p) => ({ ...p, medicines: [...p.medicines, ...(extraMeds[p.id] ?? [])] })),
    [extraMeds],
  );

  const rows = useMemo(() => {
    if (!now) return [];
    return patients.map((p) => {
      const week = adherence(p, now, log, 7);
      const recent = adherence(p, now, log, 2);
      const active = hasActiveCourse(p, now);
      const attention = active && ((week.pct !== null && week.pct < 75) || recent.missed >= 2);
      return { p, week, recent, active, attention };
    });
  }, [patients, now, log]);

  if (!now) return <div className="min-h-dvh bg-page" />;

  const onMeds = rows.filter((r) => r.active);
  const avg = onMeds.length ? Math.round(onMeds.reduce((s, r) => s + (r.week.pct ?? 0), 0) / onMeds.length) : 0;
  const attention = rows.filter((r) => r.attention);
  const todayIso = iso(now);
  const appts = [
    ...patients
      .filter((p) => p.nextVisit?.offset === 0)
      .map((p) => ({ id: p.id, name: p.name, time: p.nextVisit!.time, reason: p.nextVisit!.reason, isNew: false })),
    ...bookings.filter((b) => b.date === todayIso).map((b) => ({ id: b.id, name: b.child, time: b.time, reason: b.reason, isNew: true })),
  ].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  const requests = bookings.filter((b) => b.date > todayIso);

  const q = query.trim().toLowerCase();
  const shown = rows.filter(
    (r) =>
      (filter === "all" || (filter === "meds" && r.active) || (filter === "attention" && r.attention)) &&
      (!q || r.p.name.toLowerCase().includes(q) || r.p.parent.toLowerCase().includes(q) || r.p.treatment.toLowerCase().includes(q)),
  );
  const open = openId ? patients.find((p) => p.id === openId) ?? null : null;

  return (
    <div className="min-h-dvh bg-page">
      <AppHeader name={CLINIC.doctor} role="Clinic dashboard" />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
        <p className="text-ink-3">{fmtLong(now)}</p>
        <h1 className="mt-1 text-[2.1rem] sm:text-[2.6rem]">Hello, {CLINIC.doctorShort}</h1>

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Users, label: "Patients", value: String(patients.length), note: "in the clinic" },
            { icon: Pill, label: "On medicines", value: String(onMeds.length), note: "active courses today" },
            { icon: Activity, label: "Doses given", value: `${avg}%`, note: "average, last 7 days" },
            { icon: CalendarDays, label: "Visits today", value: String(appts.length), note: appts[0] ? `first at ${appts[0].time}` : "none booked" },
          ].map((s) => (
            <div key={s.label} className="panel p-4 sm:p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-ink-2">
                <s.icon size={16} className="text-lav-500" /> {s.label}
              </p>
              <p className="mt-2 font-display text-[2rem] leading-none">{s.value}</p>
              <p className="mt-1.5 text-sm text-ink-3">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="panel min-w-0 p-4 sm:p-6" aria-labelledby="patients-h">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="patients-h" className="text-2xl">
                Patients
              </h2>
              <div className="relative w-full sm:w-64">
                <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  className="field !py-2.5 !pl-10 text-[0.95rem]"
                  placeholder="Search child, parent, treatment"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search patients"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(
                [
                  ["all", `All (${rows.length})`],
                  ["meds", `On medicines (${onMeds.length})`],
                  ["attention", `Needs attention (${attention.length})`],
                ] as [Filter, string][]
              ).map(([f, l]) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    filter === f ? "bg-ink text-white" : "bg-lav-50 text-ink-2 hover:bg-lav-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="relative -mx-4 mt-4 overflow-x-auto sm:-mx-6">
              <table className="w-full text-left text-[0.95rem] sm:min-w-[720px]">
                <thead>
                  <tr className="border-b border-line text-sm text-ink-3">
                    <th className="py-2.5 pl-4 font-semibold sm:pl-6">Child</th>
                    <th className="hidden py-2.5 font-semibold sm:table-cell">Treatment</th>
                    <th className="py-2.5 font-semibold">
                      <span className="sm:hidden">7 days</span>
                      <span className="hidden sm:inline">Doses given, 7 days</span>
                    </th>
                    <th className="hidden py-2.5 font-semibold sm:table-cell">Next visit</th>
                    <th className="py-2.5 pr-4 sm:pr-6">
                      <span className="sr-only">Open</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map(({ p, week, active, attention }) => {
                    const t = tone(active ? week.pct : null);
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setOpenId(p.id)}
                        className="cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-lav-50"
                      >
                        <td className="py-3.5 pl-4 sm:pl-6">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lav-100 font-semibold text-lav-700">{p.name[0]}</span>
                            <div className="leading-tight">
                              <p className="font-semibold">
                                {p.name}
                                {attention && <TriangleAlert size={15} className="ml-1.5 inline -translate-y-px text-rose" aria-label="Needs attention" />}
                              </p>
                              <p className="text-sm text-ink-3">
                                {p.age} yrs, parent {p.parent.split(" ")[0]}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden max-w-[220px] py-3.5 pr-4 text-ink-2 sm:table-cell">{p.treatment}</td>
                        <td className="py-3.5 pr-4">
                          {active && week.pct !== null ? (
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-12 overflow-hidden rounded-full bg-lav-100 sm:w-24">
                                <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${week.pct}%` }} />
                              </div>
                              <span className={`font-semibold ${t.text}`}>{week.pct}%</span>
                            </div>
                          ) : (
                            <span className="text-ink-3">—</span>
                          )}
                        </td>
                        <td className="hidden py-3.5 pr-4 text-ink-2 sm:table-cell">
                          {p.nextVisit ? (p.nextVisit.offset === 0 ? `Today, ${p.nextVisit.time}` : fmtDay(addDays(now, p.nextVisit.offset))) : "—"}
                        </td>
                        <td className="py-3.5 pr-4 text-ink-3 sm:pr-6">
                          <ChevronRight size={18} />
                        </td>
                      </tr>
                    );
                  })}
                  {shown.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-ink-2">
                        No patients match. Clear the search or pick another filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="space-y-6">
            <section className="panel p-5 sm:p-6" aria-labelledby="att-h">
              <h2 id="att-h" className="flex items-center gap-2 text-xl">
                Missed doses
              </h2>
              {attention.length === 0 ? (
                <p className="mt-3 text-ink-2">Every course is on track.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {attention.map(({ p, recent, week }) => (
                    <li key={p.id} className="rounded-2xl bg-rose-bg/70 p-4">
                      <button onClick={() => setOpenId(p.id)} className="text-left font-semibold hover:underline">
                        {p.name}
                      </button>
                      <p className="mt-0.5 text-sm text-ink-2">
                        {recent.missed} missed in the last 2 days, {week.pct}% given this week
                      </p>
                      <a href={`tel:${p.parentPhone.replace(/\s/g, "")}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rose hover:underline">
                        <Phone size={15} /> Call {p.parent.split(" ")[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel p-5 sm:p-6" aria-labelledby="appt-h">
              <h2 id="appt-h" className="text-xl">
                Today&apos;s visits
              </h2>
              <ol className="mt-4 space-y-1">
                {appts.map((a) => (
                  <li key={a.id} className="flex gap-4 rounded-xl px-2 py-2.5 hover:bg-lav-50">
                    <span className="w-[4.6rem] shrink-0 font-semibold text-lav-700">{a.time}</span>
                    <span className="min-w-0 leading-tight">
                      <span className="block font-semibold">
                        {a.name}
                        {a.isNew && <span className="ml-2 rounded-full bg-lav-600 px-2 py-0.5 text-xs text-white">New</span>}
                      </span>
                      <span className="text-sm text-ink-3">{a.reason}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {requests.length > 0 && (
              <section className="panel p-5 sm:p-6" aria-labelledby="req-h">
                <h2 id="req-h" className="text-xl">
                  Booking requests
                </h2>
                <ul className="mt-4 space-y-3">
                  {requests.map((b) => (
                    <li key={b.id} className="rounded-2xl bg-lav-50 p-4">
                      <p className="font-semibold">
                        {b.child}, {b.age === "Under 1" ? "under 1" : `${b.age} yrs`}
                      </p>
                      <p className="text-sm text-ink-2">
                        {fmtDay(new Date(b.date + "T00:00:00"))}, {b.time}. {b.reason}
                      </p>
                      <a href={`tel:+91${b.phone.replace(/\D/g, "")}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-lav-700 hover:underline">
                        <Phone size={15} /> Call {b.parent.split(" ")[0]} to confirm
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-ink-3">Sample data. Children and parents shown here are invented.</p>
      </main>

      <AnimatePresence>
        {open && (
          <PatientDrawer
            key={open.id}
            child={open}
            now={now}
            log={log}
            onClose={() => setOpenId(null)}
            onAdd={(m) => setExtraMeds((x) => ({ ...x, [open.id]: [...(x[open.id] ?? []), m] }))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PatientDrawer({
  child,
  now,
  log,
  onClose,
  onAdd,
}: {
  child: Child;
  now: Date;
  log: Record<string, string>;
  onClose: () => void;
  onAdd: (m: Medicine) => void;
}) {
  const [adding, setAdding] = useState(false);
  const days = Array.from({ length: 14 }, (_, i) => addDays(now, i - 13));
  const week = adherence(child, now, log, 7);
  const t = tone(hasActiveCourse(child, now) ? week.pct : null);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={child.name}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col bg-page shadow-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-lav-200 font-display text-2xl text-lav-700">{child.name[0]}</span>
            <div>
              <h2 className="text-[1.6rem] leading-tight">{child.name}</h2>
              <p className="text-ink-2">
                {child.age} years. Last seen {fmtDay(addDays(now, child.lastVisitOffset))}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-lav-50" aria-label="Close" autoFocus>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="panel p-4">
              <p className="text-sm text-ink-3">Doses given, 7 days</p>
              <p className={`mt-1 font-display text-3xl ${t.text}`}>{week.pct === null ? "—" : `${week.pct}%`}</p>
              <p className="text-sm text-ink-3">
                {week.given} of {week.total} doses
              </p>
            </div>
            <div className="panel p-4">
              <p className="text-sm text-ink-3">Parent</p>
              <p className="mt-1 font-semibold">{child.parent}</p>
              <a href={`tel:${child.parentPhone.replace(/\s/g, "")}`} className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-lav-700 hover:underline">
                <Phone size={14} /> {child.parentPhone}
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-3">Treatment</p>
            <p className="mt-1">{child.treatment}</p>
            {child.nextVisit && (
              <p className="mt-1 text-ink-2">
                Next visit {child.nextVisit.offset === 0 ? "today" : fmtLong(addDays(now, child.nextVisit.offset))}, {child.nextVisit.time}:{" "}
                {child.nextVisit.reason.toLowerCase()}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Medicines</h3>
              {!adding && (
                <button onClick={() => setAdding(true)} className="btn btn-soft !px-3.5 !py-2 text-sm">
                  <Plus size={16} /> Add medicine
                </button>
              )}
            </div>
            <AnimatePresence>
              {adding && (
                <AddMedicine
                  onCancel={() => setAdding(false)}
                  onSave={(m) => {
                    onAdd(m);
                    setAdding(false);
                  }}
                />
              )}
            </AnimatePresence>
            {child.medicines.length === 0 && !adding && <p className="mt-3 text-ink-2">No medicines prescribed. Add one after treatment.</p>}
            <ul className="mt-4 space-y-4">
              {child.medicines.map((m) => {
                const active = medActiveOn(m, now, now);
                return (
                  <li key={m.id} className="panel p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {m.name} <span className="font-normal text-ink-3">{m.detail}</span>
                        </p>
                        <p className="text-sm text-ink-2">
                          {m.dose}, {m.slots.map((s) => SLOT_TIME[s].label).join(", ")}. {m.withFood}. {m.days} days.
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-mint-bg text-mint" : "bg-lav-50 text-ink-3"}`}>
                        {active ? "Active" : m.startOffset > 0 ? "Starts later" : "Finished"}
                      </span>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      {m.slots.map((s) => (
                        <div key={s} className="flex items-center gap-2">
                          <span className="w-16 shrink-0 text-xs text-ink-3">{SLOT_TIME[s].label}</span>
                          <div className="flex flex-1 gap-1">
                            {days.map((d) => {
                              const dose = medActiveOn(m, d, now) ? dosesOn(child, d, now, log).find((x) => x.med.id === m.id && x.slot === s) : undefined;
                              const cls = !dose
                                ? "bg-transparent"
                                : dose.status === "given"
                                  ? "bg-mint"
                                  : dose.status === "missed"
                                    ? "bg-rose"
                                    : dose.status === "due"
                                      ? "bg-sun"
                                      : "bg-lav-200";
                              return (
                                <span
                                  key={iso(d)}
                                  className={`h-4 flex-1 rounded-[4px] ${cls} ${!dose ? "outline outline-1 -outline-offset-1 outline-line" : ""}`}
                                  title={`${fmtDay(d)}: ${dose ? dose.status : "not scheduled"}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between pl-[4.5rem] text-[0.7rem] text-ink-3">
                        <span>{fmtDay(days[0])}</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-[3px] bg-mint" /> Given
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-[3px] bg-rose" /> Missed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-[3px] bg-sun" /> Due now
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-[3px] bg-lav-200" /> Later today
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function AddMedicine({ onSave, onCancel }: { onSave: (m: Medicine) => void; onCancel: () => void }) {
  const [f, setF] = useState({ name: "", detail: "", dose: "", days: "5", withFood: "After food", slots: ["morning", "night"] as Slot[] });
  const ok = f.name.trim() && f.dose.trim() && Number(f.days) > 0 && f.slots.length > 0;
  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        onSave({
          id: `new-${Date.now()}`,
          name: f.name.trim(),
          detail: f.detail.trim(),
          dose: f.dose.trim(),
          slots: SLOTS.filter((s) => f.slots.includes(s)),
          withFood: f.withFood.trim() || "As directed",
          startOffset: 0,
          days: Number(f.days),
          kind: "syrup",
        });
      }}
    >
      <div className="mt-4 space-y-3 rounded-2xl border-[1.5px] border-lav-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field !py-2.5" placeholder="Medicine, e.g. Amoxicillin" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label="Medicine name" />
          <input className="field !py-2.5" placeholder="Strength, e.g. 250 mg/5 ml" value={f.detail} onChange={(e) => setF({ ...f, detail: e.target.value })} aria-label="Strength" />
          <input className="field !py-2.5" placeholder="Dose, e.g. 5 ml" value={f.dose} onChange={(e) => setF({ ...f, dose: e.target.value })} aria-label="Dose" />
          <input className="field !py-2.5" placeholder="Instructions" value={f.withFood} onChange={(e) => setF({ ...f, withFood: e.target.value })} aria-label="Instructions" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SLOTS.map((s) => {
            const on = f.slots.includes(s);
            return (
              <button
                type="button"
                key={s}
                aria-pressed={on}
                onClick={() => setF({ ...f, slots: on ? f.slots.filter((x) => x !== s) : [...f.slots, s] })}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${on ? "bg-lav-600 text-white" : "bg-lav-50 text-ink-2"}`}
              >
                {on && <Check size={14} strokeWidth={3} />} {SLOT_TIME[s].label}
              </button>
            );
          })}
          <label className="ml-auto flex items-center gap-2 text-sm text-ink-2">
            For
            <input
              className="field !w-16 !px-2 !py-1.5 text-center"
              inputMode="numeric"
              value={f.days}
              onChange={(e) => setF({ ...f, days: e.target.value.replace(/\D/g, "").slice(0, 3) })}
              aria-label="Number of days"
            />
            days
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onCancel} className="btn btn-ghost !py-2 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={!ok} className="btn btn-primary !py-2 text-sm disabled:opacity-45">
            Save medicine
          </button>
        </div>
      </div>
    </motion.form>
  );
}
