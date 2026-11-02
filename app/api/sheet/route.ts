import { NextResponse } from "next/server";

// Server-side bridge to the clinic's Google Sheet (Apps Script web app).
// SHEET_URL and SHEET_KEY live in Vercel environment variables, never in the browser.
// Without them every call answers { enabled: false } and the site keeps using the browser only.

export const dynamic = "force-dynamic";

const URL_ = process.env.SHEET_URL;
const KEY = process.env.SHEET_KEY;
const DOSE_KEY = /^[\w-]{1,40}\|[\w-]{1,40}\|\d{4}-\d{2}-\d{2}\|(morning|afternoon|night)$/;

async function sheet(payload: Record<string, unknown>) {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, key: KEY }),
    redirect: "follow",
    cache: "no-store",
  });
  return res.json();
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const off = () => NextResponse.json({ enabled: false });
const fail = (status = 502) => NextResponse.json({ enabled: true, ok: false }, { status });

export async function GET() {
  if (!URL_ || !KEY) return off();
  try {
    const data = await sheet({ action: "list" });
    if (!data.ok) return fail();
    return NextResponse.json({ enabled: true, ok: true, bookings: data.bookings, doses: data.doses });
  } catch {
    return fail();
  }
}

export async function POST(req: Request) {
  if (!URL_ || !KEY) return off();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400);
  }
  try {
    if (body.action === "addBooking") {
      const b = (body.booking ?? {}) as Record<string, unknown>;
      const booking = {
        id: text(b.id, 60),
        createdAt: text(b.createdAt, 40),
        child: text(b.child, 80),
        age: text(b.age, 10),
        reason: text(b.reason, 80),
        date: text(b.date, 10),
        time: text(b.time, 12),
        parent: text(b.parent, 80),
        phone: text(b.phone, 20),
        notes: text(b.notes, 500),
      };
      if (!booking.id || !booking.child || !booking.date) return fail(400);
      const data = await sheet({ action: "addBooking", booking });
      return data.ok ? NextResponse.json({ enabled: true, ok: true }) : fail();
    }
    if (body.action === "setDose") {
      const k = text(body.key, 120);
      const givenAt = body.givenAt === null ? null : text(body.givenAt, 40);
      if (!DOSE_KEY.test(k)) return fail(400);
      const data = await sheet({ action: "setDose", key2: k, givenAt });
      return data.ok ? NextResponse.json({ enabled: true, ok: true }) : fail();
    }
    return fail(400);
  } catch {
    return fail();
  }
}
