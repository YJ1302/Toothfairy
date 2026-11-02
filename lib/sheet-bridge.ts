// Server-side bridge to the clinic's Google Sheet (Apps Script web app), shared by every host:
//   Vercel / next start: app/api/sheet/route.ts
//   Cloudflare Pages:    functions/api/sheet.ts
// SHEET_URL and SHEET_KEY live in the host's environment variables, never in the browser.
// Without them every call answers { enabled: false } and the site keeps using the browser only.

export type SheetEnv = { SHEET_URL?: string; SHEET_KEY?: string };

const DOSE_KEY = /^[\w-]{1,40}\|[\w-]{1,40}\|\d{4}-\d{2}-\d{2}\|(morning|afternoon|night)$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const off = () => json({ enabled: false });
const fail = (status = 502) => json({ enabled: true, ok: false }, status);
const text = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

async function callSheet(env: SheetEnv, payload: Record<string, unknown>) {
  const res = await fetch(env.SHEET_URL!, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, key: env.SHEET_KEY }),
    redirect: "follow",
    cache: "no-store",
  });
  return res.json() as Promise<{ ok?: boolean; bookings?: unknown; doses?: unknown }>;
}

export async function handleSheet(req: Request, env: SheetEnv): Promise<Response> {
  if (!env.SHEET_URL || !env.SHEET_KEY) return off();

  if (req.method === "GET") {
    try {
      const data = await callSheet(env, { action: "list" });
      if (!data.ok) return fail();
      return json({ enabled: true, ok: true, bookings: data.bookings, doses: data.doses });
    } catch {
      return fail();
    }
  }

  if (req.method !== "POST") return fail(405);

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
      const data = await callSheet(env, { action: "addBooking", booking });
      return data.ok ? json({ enabled: true, ok: true }) : fail();
    }
    if (body.action === "setDose") {
      const k = text(body.key, 120);
      const givenAt = body.givenAt === null ? null : text(body.givenAt, 40);
      if (!DOSE_KEY.test(k)) return fail(400);
      const data = await callSheet(env, { action: "setDose", key2: k, givenAt });
      return data.ok ? json({ enabled: true, ok: true }) : fail();
    }
    return fail(400);
  } catch {
    return fail();
  }
}
