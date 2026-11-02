import { handleSheet } from "@/lib/sheet-bridge";

// Vercel and `next start`. Cloudflare Pages uses functions/api/sheet.ts, which calls the same handler.
export const dynamic = "force-dynamic";

const env = () => ({ SHEET_URL: process.env.SHEET_URL, SHEET_KEY: process.env.SHEET_KEY });

export const GET = (req: Request) => handleSheet(req, env());
export const POST = (req: Request) => handleSheet(req, env());
