import { handleSheet, type SheetEnv } from "../../lib/sheet-bridge";

// Cloudflare Pages Function for /api/sheet. SHEET_URL and SHEET_KEY are set in the
// Cloudflare dashboard: Settings > Variables and Secrets.
export const onRequest = ({ request, env }: { request: Request; env: SheetEnv }) => handleSheet(request, env);
