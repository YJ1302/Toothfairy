// Builds the site as static files in ./out for Cloudflare Pages.
// A static export cannot contain app/api (that route runs as functions/api/sheet.ts on Cloudflare),
// so it is moved aside for the build and always put back afterwards.
import { spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";

const api = "app/api";
const aside = ".api-aside";
if (existsSync(aside)) rmSync(aside, { recursive: true, force: true });
rmSync(".next", { recursive: true, force: true }); // stale type files from a normal build would still name the moved route
const moved = existsSync(api);
if (moved) renameSync(api, aside);
let code = 1;
try {
  const r = spawnSync("npx", ["next", "build"], { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1" }, shell: process.platform === "win32" });
  code = r.status ?? 1;
} finally {
  if (moved) renameSync(aside, api);
}
process.exit(code);
