"use client";
// Storage for doses and bookings. The browser (localStorage) always keeps a copy so the demo works offline;
// when SHEET_URL and SHEET_KEY are set on the server, /api/sheet also saves to the clinic's Google Sheet
// and the pages read the Sheet back, so the parent app and the doctor dashboard share the same data.
import { useCallback, useEffect, useRef, useState } from "react";
import type { Overrides } from "./data";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep state in memory only */
  }
}

const SYNC_MS = 30000;

type Remote = { bookings?: Booking[]; doses?: Overrides };

/** read from the Sheet; null when it is not connected or the call failed */
async function pull(): Promise<Remote | null> {
  try {
    const res = await fetch("/api/sheet", { cache: "no-store" });
    if (!res.ok) return null;
    const j = await res.json();
    return j.enabled && j.ok ? j : null;
  } catch {
    return null;
  }
}

/** write to the Sheet in the background; the browser copy is already saved */
function push(payload: unknown) {
  return fetch("/api/sheet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
}

/** current time, set after mount so server and client markup match */
export function useNow(refreshMs = 60000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), refreshMs);
    return () => clearInterval(t);
  }, [refreshMs]);
  return now;
}

const DOSES = "tf-doses";
export function useDoseLog() {
  const [log, setLog] = useState<Overrides>({});
  const ref = useRef<Overrides>({});
  const busy = useRef(0);
  const apply = useCallback((next: Overrides) => {
    ref.current = next;
    setLog(next);
  }, []);

  useEffect(() => {
    apply(read<Overrides>(DOSES, {}));
    const onStorage = (e: StorageEvent) => e.key === DOSES && apply(read<Overrides>(DOSES, {}));
    window.addEventListener("storage", onStorage);
    const sync = async () => {
      if (busy.current > 0 || document.hidden) return;
      const r = await pull();
      if (r?.doses && busy.current === 0) {
        write(DOSES, r.doses);
        apply(r.doses);
      }
    };
    sync();
    const t = setInterval(sync, SYNC_MS);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, [apply]);

  const toggle = useCallback(
    (key: string) => {
      const next = { ...ref.current };
      const givenAt = next[key] ? null : new Date().toISOString();
      if (givenAt) next[key] = givenAt;
      else delete next[key];
      write(DOSES, next);
      apply(next);
      busy.current++;
      push({ action: "setDose", key, givenAt }).finally(() => setTimeout(() => busy.current--, 1500));
    },
    [apply],
  );
  return { log, toggle };
}

export type Booking = {
  id: string;
  child: string;
  age: string;
  reason: string;
  date: string; // yyyy-mm-dd
  time: string;
  parent: string;
  phone: string;
  notes: string;
  createdAt: string;
};

const BOOKINGS = "tf-bookings";
const newest = (a: Booking, b: Booking) => b.createdAt.localeCompare(a.createdAt);
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    setBookings(read<Booking[]>(BOOKINGS, []));
    const sync = async () => {
      if (document.hidden) return;
      const r = await pull();
      if (r?.bookings) {
        const next = [...r.bookings].sort(newest);
        write(BOOKINGS, next);
        setBookings(next);
      }
    };
    sync();
    const t = setInterval(sync, SYNC_MS);
    return () => clearInterval(t);
  }, []);
  const add = useCallback((b: Booking) => {
    setBookings((prev) => {
      const next = [b, ...prev];
      write(BOOKINGS, next);
      return next;
    });
    push({ action: "addBooking", booking: b });
  }, []);
  return { bookings, add };
}
