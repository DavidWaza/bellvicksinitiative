// The launch build: same as `npm run build`, but FAILS if any invented sample content
// (shared/sample-content.ts) is still in the site. Run it before going live.
// Works the same on Windows, macOS and Linux (no shell env syntax needed).
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["nuxt", "build", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, STRICT_CONTENT: "1" },
});
process.exit(result.status ?? 1);
