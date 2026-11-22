/**
 * A tiny shared key-value store for the few things the server must remember between requests:
 * order photos (checkout → payment), "order already emailed" markers, and spam/spending limits.
 *
 * On Vercel every request can run in a different short-lived instance, so plain memory is NOT
 * shared. This uses Upstash Redis (Vercel → Storage / Marketplace → Upstash Redis), through its
 * REST API, when its environment variables exist:
 *   KV_REST_API_URL + KV_REST_API_TOKEN            (names Vercel's integration sets), or
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * Without them (local development) it falls back to memory in this process.
 */

const url = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const token = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

/** Runs one Redis command over Upstash's REST API. */
async function redis<T>(...command: (string | number)[]): Promise<T> {
  const res = await $fetch<{ result: T; error?: string }>(url(), {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: command.map(String),
    timeout: 10_000,
  });
  if (res.error) throw new Error(res.error);
  return res.result;
}

// In-memory fallback (one process only: fine for `npm run dev` and local testing).
const memory = new Map<string, { value: string; expires: number }>();
function memGet(key: string) {
  const hit = memory.get(key);
  if (hit && hit.expires < Date.now()) memory.delete(key);
  return memory.get(key)?.value ?? null;
}

/** True when a shared store is configured (warn if not, in production). */
export const hasSharedStore = () => Boolean(url() && token());

export async function kvGet(key: string): Promise<string | null> {
  return hasSharedStore() ? redis<string | null>("GET", key) : memGet(key);
}

export async function kvSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (hasSharedStore()) await redis("SET", key, value, "EX", ttlSeconds);
  else memory.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}

export async function kvDel(key: string): Promise<void> {
  if (hasSharedStore()) await redis("DEL", key);
  else memory.delete(key);
}

/** Sets the key only if it doesn't exist. True = this caller "won" (e.g. sends the email). */
export async function kvSetIfAbsent(key: string, ttlSeconds: number): Promise<boolean> {
  if (hasSharedStore())
    return (await redis<string | null>("SET", key, "1", "NX", "EX", ttlSeconds)) === "OK";
  if (memGet(key) !== null) return false;
  memory.set(key, { value: "1", expires: Date.now() + ttlSeconds * 1000 });
  return true;
}

/** Adds 1 and returns the new count; the counter expires `ttlSeconds` after it was created. */
export async function kvIncr(key: string, ttlSeconds: number): Promise<number> {
  if (hasSharedStore()) {
    const n = await redis<number>("INCR", key);
    if (n === 1) await redis("EXPIRE", key, ttlSeconds);
    return n;
  }
  const n = Number(memGet(key) ?? 0) + 1;
  const expires = memory.get(key)?.expires ?? Date.now() + ttlSeconds * 1000;
  memory.set(key, { value: String(n), expires });
  return n;
}
