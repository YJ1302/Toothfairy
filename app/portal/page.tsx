"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brush, CalendarDays, Check, Droplet, Moon, Phone, Pill, Sun, Sunrise, Undo2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Mascot } from "@/components/Mascot";
import {
  CLINIC,
  PATIENTS,
  SLOT_TIME,
  SLOTS,
  addDays,
  dosesOn,
  fmtLong,
  medActiveOn,
  type Child,
  type DoseStatus,
  type Medicine,
  type Slot,
} from "@/lib/data";
import { useDoseLog, useNow } from "@/lib/store";

const FAMILY = PATIENTS.filter((p) => p.demoFamily);
const PARENT = FAMILY[0].parent;
const SLOT_ICON: Record<Slot, typeof Sun> = { morning: Sunrise, afternoon: Sun, night: Moon };
const SLOT_NAME: Record<Slot, string> = { morning: "Morning", afternoon: "Afternoon", night: "Night" };
const KIND_ICON: Record<Medicine["kind"], typeof Pill> = { syrup: Droplet, rinse: Droplet, gel: Pill, paste: Brush };
const CHILD_TINT = ["bg-lav-200 text-lav-700", "bg-sun-bg text-[#8a5a00]"];

const AFTERCARE: Record<string, string[]> = {
  aarav: [
    "Soft foods today. Avoid chewing on the treated side until the crown is fitted.",
    "Finish the full antibiotic course, even if the pain goes away.",
    "Call the clinic if there is swelling or fever.",
  ],
  myra: [
    "Brush twice a day with a pea-sized amount of the fluoride paste.",
    "Keep sweet snacks to mealtimes.",
    "No bottle or sipper with milk at bedtime.",
  ],
};

function greeting(d: Date) {
  const h = d.getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function Portal() {
  const now = useNow(30000);
  const { log, toggle } = useDoseLog();
  const [childId, setChildId] = useState(FAMILY[0].id);
  const child = FAMILY.find((c) => c.id === childId)!;

  return (
    <div className="min-h-dvh bg-page">
      <AppHeader name={PARENT} role="Parent account" />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
        {now ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-ink-3">{fmtLong(now)}</p>
                <h1 className="mt-1 text-[2.1rem] sm:text-[2.6rem]">
                  {greeting(now)}, {PARENT.split(" ")[0]}
                </h1>
              </div>
              <div className="flex gap-2" role="tablist" aria-label="Choose child">
                {FAMILY.map((c, i) => (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={c.id === childId}
                    onClick={() => setChildId(c.id)}
                    className={`flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 font-semibold transition-colors ${
                      c.id === childId ? "bg-white shadow-[0_0_0_1.5px_var(--color-lav-400)]" : "bg-lav-50 text-ink-2 hover:bg-lav-100"
                    }`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-full text-sm ${CHILD_TINT[i % 2]}`}>{c.name[0]}</span>
                    {c.name.split(" ")[0]}, {c.age}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={childId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
              >
                <div className="min-w-0 space-y-6">
                  <Today child={child} now={now} log={log} toggle={toggle} />
                  <Week child={child} now={now} log={log} />
                </div>
                <Side child={child} now={now} />
              </motion.div>
            </AnimatePresence>
            <p className="mt-10 text-center text-sm text-ink-3">Sample data. In the live version, the doctor adds these medicines after each visit.</p>
          </>
        ) : (
          <div className="h-96" />
        )}
      </main>
    </div>
  );
}

function Ring({ value, total }: { value: number; total: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-lav-100)" strokeWidth="7" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={pct === 1 ? "var(--color-mint)" : "var(--color-lav-500)"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold">
        {value}/{total}
      </span>
    </div>
  );
}

function Today({ child, now, log, toggle }: { child: Child; now: Date; log: Record<string, string>; toggle: (k: string) => void }) {
  const doses = dosesOn(child, now, now, log);
  const given = doses.filter((d) => d.status === "given").length;
  const first = child.name.split(" ")[0];
  const allDone = doses.length > 0 && given === doses.length;

  return (
    <section className="panel p-5 sm:p-7" aria-labelledby="today-h">
      <div className="flex items-center gap-4">
        {doses.length > 0 && <Ring value={given} total={doses.length} />}
        <div>
          <h2 id="today-h" className="text-2xl sm:text-[1.75rem]">
            Today for {first}
          </h2>
          <p className="text-ink-2">
            {doses.length === 0
              ? "No medicines today."
              : allDone
                ? "Every dose is given. Well done."
                : `${doses.length - given} ${doses.length - given === 1 ? "dose" : "doses"} left today`}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-mint-bg p-4">
              <Mascot happy className="h-16 w-16 shrink-0" grow />
              <p className="text-[0.97rem] text-[#1d5e45]">
                All done for today. {CLINIC.doctorShort} can see that {first}&apos;s course is on track.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 space-y-6">
        {SLOTS.map((slot) => {
          const list = doses.filter((d) => d.slot === slot);
          if (!list.length) return null;
          const Icon = SLOT_ICON[slot];
          return (
            <div key={slot}>
              <p className="mb-2.5 flex items-center gap-2 text-[0.95rem] font-semibold text-ink-2">
                <Icon size={17} className="text-lav-500" /> {SLOT_NAME[slot]}, {SLOT_TIME[slot].label}
              </p>
              <ul className="space-y-2.5">
                {list.map((d) => (
                  <DoseRow key={d.key} med={d.med} status={d.status} slot={slot} givenAt={log[d.key]} onToggle={() => toggle(d.key)} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DoseRow({
  med,
  status,
  slot,
  givenAt,
  onToggle,
}: {
  med: Medicine;
  status: DoseStatus;
  slot: Slot;
  givenAt?: string;
  onToggle: () => void;
}) {
  const Icon = KIND_ICON[med.kind];
  const given = status === "given";
  return (
    <motion.li
      layout
      className={`flex flex-wrap items-center gap-3 rounded-2xl p-3.5 transition-colors sm:flex-nowrap ${
        given ? "bg-mint-bg/60" : status === "due" ? "bg-sun-bg/70" : "bg-lav-50"
      }`}
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${given ? "bg-white text-mint" : "bg-white text-lav-600"}`}>
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {med.name} <span className="font-normal text-ink-3">{med.detail}</span>
        </p>
        <p className="text-[0.95rem] text-ink-2">
          {med.dose}, {med.withFood.charAt(0).toLowerCase() + med.withFood.slice(1)}
        </p>
        {status === "due" && <p className="mt-0.5 text-sm font-medium text-[#8a5a00]">Due since {SLOT_TIME[slot].label}</p>}
      </div>
      {given ? (
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <span className="flex items-center gap-2 font-semibold text-mint">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="grid h-8 w-8 place-items-center rounded-full bg-mint text-white"
            >
              <Check size={17} strokeWidth={3} />
            </motion.span>
            Given{givenAt ? ` at ${new Date(givenAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}` : ""}
          </span>
          <button onClick={onToggle} className="grid h-9 w-9 place-items-center rounded-full text-ink-3 hover:bg-white hover:text-ink" aria-label={`Undo: ${med.name} not given`}>
            <Undo2 size={17} />
          </button>
        </div>
      ) : (
        <button onClick={onToggle} className="btn btn-primary w-full !py-2.5 sm:w-auto">
          Mark as given
        </button>
      )}
    </motion.li>
  );
}

function Week({ child, now, log }: { child: Child; now: Date; log: Record<string, string> }) {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(now, i - 3)), [now]);
  const rows = child.medicines.flatMap((m) => m.slots.map((s) => ({ med: m, slot: s })));
  if (!rows.length) return null;

  return (
    <section className="panel p-5 sm:p-7" aria-labelledby="week-h">
      <h2 id="week-h" className="text-2xl">
        This week
      </h2>
      <div className="relative -mx-5 mt-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-1.5 text-[0.95rem]">
          <thead>
            <tr>
              <th className="pb-1 text-left font-semibold text-ink-3">
                <span className="sr-only">Medicine</span>
              </th>
              {days.map((d, i) => (
                <th key={i} className={`pb-1 text-center font-semibold ${i === 3 ? "text-lav-600" : "text-ink-3"}`}>
                  <span className="block text-xs">{i === 3 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                  <span className="text-base">{d.getDate()}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ med, slot }) => {
              const Icon = SLOT_ICON[slot];
              return (
                <tr key={med.id + slot}>
                  <td className="whitespace-nowrap pr-3">
                    <span className="flex items-center gap-2">
                      <Icon size={15} className="text-lav-500" />
                      <span className="font-medium">{med.name}</span>
                    </span>
                  </td>
                  {days.map((d, i) => {
                    const active = medActiveOn(med, d, now);
                    const dose = active ? dosesOn(child, d, now, log).find((x) => x.med.id === med.id && x.slot === slot) : undefined;
                    return (
                      <td key={i} className={`text-center ${i === 3 ? "bg-lav-50" : ""} ${i === 3 ? "first:rounded-l-xl" : ""}`}>
                        <span className="inline-grid h-8 w-8 place-items-center">
                          {!dose ? (
                            <span className="h-1 w-3 rounded bg-line" aria-label="Not scheduled" />
                          ) : dose.status === "given" ? (
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-mint text-white" aria-label="Given">
                              <Check size={14} strokeWidth={3} />
                            </span>
                          ) : dose.status === "missed" ? (
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-bg text-xs font-bold text-rose" aria-label="Missed">
                              ✕
                            </span>
                          ) : (
                            <span className={`h-6 w-6 rounded-full border-2 ${dose.status === "due" ? "border-sun" : "border-lav-300"}`} aria-label={dose.status === "due" ? "Due" : "Scheduled"} />
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2">
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-mint" /> Given
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-rose-bg ring-1 ring-rose/40" /> Missed
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-lav-300" /> Coming up
        </span>
      </div>
    </section>
  );
}

function Side({ child, now }: { child: Child; now: Date }) {
  const next = child.nextVisit;
  const nextDate = next ? addDays(now, next.offset) : null;
  return (
    <aside className="space-y-6">
      {next && nextDate && (
        <section className="overflow-hidden rounded-[24px] bg-lav-600 p-6 text-white">
          <p className="flex items-center gap-2 text-sm font-medium text-lav-100">
            <CalendarDays size={16} /> Next visit
          </p>
          <p className="mt-3 font-display text-[1.7rem] leading-tight">{fmtLong(nextDate)}</p>
          <p className="mt-1 text-lav-100">
            {next.time}, {next.reason}
          </p>
          <p className="mt-4 text-sm text-lav-100/90">with {CLINIC.doctor}</p>
        </section>
      )}

      {child.medicines.length > 0 && (
        <section className="panel p-6">
          <h2 className="text-xl">Current course</h2>
          <ul className="mt-4 space-y-4">
            {child.medicines.map((m) => {
              const day = Math.min(m.days, Math.max(1, -m.startOffset + 1));
              const finished = !medActiveOn(m, now, now) && -m.startOffset >= m.days;
              return (
                <li key={m.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-sm text-ink-3">{finished ? "Finished" : `Day ${day} of ${m.days}`}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-lav-100">
                    <motion.div
                      className="h-full rounded-full bg-lav-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(finished ? 1 : day / m.days) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {AFTERCARE[child.id] && (
        <section className="panel p-6">
          <h2 className="text-xl">Care at home</h2>
          <p className="mt-1 text-sm text-ink-3">{child.treatment}</p>
          <ul className="mt-4 space-y-3">
            {AFTERCARE[child.id].map((t) => (
              <li key={t} className="flex gap-3 text-[0.97rem] text-ink-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lav-500" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      <a href={CLINIC.phoneHref} className="flex items-center gap-4 rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--color-line)] hover:shadow-[0_0_0_1.5px_var(--color-lav-300)]">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-lav-100 text-lav-600">
          <Phone size={19} />
        </span>
        <span>
          <span className="block font-semibold">Questions about a medicine?</span>
          <span className="text-sm text-ink-2">Call the clinic, {CLINIC.phoneDisplay}</span>
        </span>
      </a>
    </aside>
  );
}
