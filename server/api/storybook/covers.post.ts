import { writeStories } from "../../../app/features/site/storybook/infrastructure/mock/story-templates";
import { buildCoverPrompt } from "../../../app/features/site/storybook/infrastructure/mock/cover-prompts";
import {
  AGE_MAX,
  AGE_MIN,
  EYE_COLOURS,
  NAME_MAX,
  type StoryDraft,
} from "../../../app/features/site/storybook/domain/storybook-types";

/**
 * POST /api/storybook/covers — illustrates the three personalised covers for one child.
 *
 * multipart/form-data: `photo` (JPG/PNG/WebP, ≤10 MB) + `draft` (JSON of the questionnaire).
 * The stories are re-written HERE from the answers (never trusted from the browser), then each
 * cover is drawn by OpenAI's GPT Image model (the same model family Flick uses), with the child's
 * photo as the likeness reference. Nothing is stored: the photo goes to OpenAI and is discarded.
 *
 * Off until NUXT_OPENAI_API_KEY is set. Spending guards: per-IP and site-wide daily limits.
 * Answers with the ApiResponse envelope; `status: false` on HTTP 200 for expected failures.
 */

type CoverResult = { id: string; coverUrl: string };
const fail = (message: string) => ({ status: false as const, message, data: null });

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

// Simple in-memory daily counters (reset on restart; one server process). Good enough to stop
// a runaway bill; use a shared store (Redis, DB) if the site ever runs on several instances.
const usage = { day: "", total: 0, byIp: new Map<string, number>() };
function allow(ip: string, perIp: number, perDay: number): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (usage.day !== today) Object.assign(usage, { day: today, total: 0, byIp: new Map() });
  const mine = usage.byIp.get(ip) ?? 0;
  if (mine >= perIp || usage.total >= perDay) return false;
  usage.byIp.set(ip, mine + 1);
  usage.total += 1;
  return true;
}

function parseDraft(raw: string | undefined): Omit<StoryDraft, "hasPhoto"> | null {
  try {
    const d = JSON.parse(raw ?? "");
    const text = (v: unknown, max: number) =>
      typeof v === "string" && v.trim().length > 0 && v.length <= max ? v.trim() : null;
    const name = text(d.name, NAME_MAX);
    const from = text(d.from, 40);
    if (!name || !from) return null;
    if (d.gender !== "girl" && d.gender !== "boy") return null;
    const age = Number(d.age);
    if (!Number.isInteger(age) || age < AGE_MIN || age > AGE_MAX) return null;
    if (!EYE_COLOURS.some((e) => e.value === d.eyeColour)) return null;
    if (d.guardianConsent !== true) return null;
    const answers: StoryDraft["answers"] = {};
    for (const key of ["activities", "funny", "food", "place", "other"] as const) {
      const a = text(d.answers?.[key], 200);
      if (a) answers[key] = a;
    }
    return {
      name,
      from,
      gender: d.gender,
      age,
      eyeColour: d.eyeColour,
      guardianConsent: true,
      answers,
      dedication: "",
      email: "",
    };
  } catch {
    return null;
  }
}

async function drawCover(
  apiKey: string,
  model: string,
  photo: { data: Buffer; type: string; filename?: string },
  prompt: string,
): Promise<string> {
  const form = new FormData();
  form.append("model", model);
  form.append("prompt", prompt);
  form.append(
    "image[]",
    new Blob([new Uint8Array(photo.data)], { type: photo.type }),
    photo.filename || "child.jpg",
  );
  form.append("size", "1024x1536"); // portrait, 2:3 — cropped to 3:4 on the card
  form.append("quality", "high");
  form.append("output_format", "jpeg");
  form.append("output_compression", "85");
  form.append("n", "1");

  const res = await $fetch<{ data: { b64_json: string }[] }>(
    "https://api.openai.com/v1/images/edits",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      timeout: 180_000,
    },
  );
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image returned");
  return `data:image/jpeg;base64,${b64}`;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.openaiApiKey)
    return fail("Illustrated covers aren't switched on yet. Your drawn covers are ready below.");

  const parts = await readMultipartFormData(event);
  const photo = parts?.find((p) => p.name === "photo" && p.data?.length);
  const draft = parseDraft(parts?.find((p) => p.name === "draft")?.data.toString("utf8"));
  if (!photo || !photo.type || !ALLOWED.has(photo.type) || photo.data.length > MAX_BYTES)
    return fail("Please use a JPG, PNG or WebP photo under 10 MB.");
  if (!draft) return fail("Some details were missing. Please go back and check the form.");

  // Only valid requests count towards the daily limits.
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  if (!allow(ip, Number(config.storybookCoversPerIp), Number(config.storybookCoversPerDay)))
    return fail(
      "We've reached today's limit for illustrated covers. Your drawn covers are ready below; please try again tomorrow.",
    );

  const books = writeStories(draft);
  const settled = await Promise.allSettled(
    books.map(async ({ id, title, scene }) => ({
      id,
      coverUrl: await drawCover(
        String(config.openaiApiKey),
        String(config.openaiImageModel),
        { data: photo.data, type: photo.type!, filename: photo.filename },
        buildCoverPrompt(draft, { title, scene }),
      ),
    })),
  );

  const covers = settled.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  // Server log only (never shown to visitors): why a cover failed.
  for (const r of settled)
    // oxlint-disable-next-line no-console
    if (r.status === "rejected") console.error("[storybook covers]", r.reason?.data ?? r.reason);
  if (!covers.length)
    return fail("We couldn't illustrate the covers just now. Your drawn covers are ready below.");

  return { status: true as const, message: "", data: covers satisfies CoverResult[] };
});
