"use client";
// Demo-only persistence in the browser. In production this becomes the database (Supabase).
import { useCallback, useEffect, useState } from "react";
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
  useEffect(() => {
    setLog(read<Overrides>(DOSES, {}));
    const onStorage = (e: StorageEvent) => e.key === DOSES && setLog(read<Overrides>(DOSES, {}));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const toggle = useCallback((key: string) => {
    setLog((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = new Date().toISOString();
      write(DOSES, next);
      return next;
    });
  }, []);
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
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => setBookings(read<Booking[]>(BOOKINGS, [])), []);
  const add = useCallback((b: Booking) => {
    setBookings((prev) => {
      const next = [b, ...prev];
      write(BOOKINGS, next);
      return next;
    });
  }, []);
  return { bookings, add };
}
