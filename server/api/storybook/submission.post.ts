import { writeStories } from "../../../app/features/site/storybook/infrastructure/mock/story-templates";
import {
  AGE_MAX,
  AGE_MIN,
  EYE_COLOURS,
  NAME_MAX,
  STORY_QUESTIONS,
  emailSchema,
  type StoryDraft,
} from "../../../app/features/site/storybook/domain/storybook-types";

/**
 * POST /api/storybook/submission — emails a finished storybook questionnaire to the STORYBOOK
 * inbox (NUXT_STORYBOOK_EMAIL), with the child's photo attached so the team can illustrate and
 * print the books. Sent when the parent reaches "stories are ready", with guardian consent.
 * multipart/form-data: `draft` (JSON) + optional `photo` (JPG/PNG/WebP, ≤10 MB).
 */
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 10 * 1024 * 1024;

type Draft = Omit<StoryDraft, "hasPhoto">;

function parse(raw: string | undefined): Draft | null {
  try {
    const d = JSON.parse(raw ?? "");
    const text = (v: unknown, max: number) =>
      typeof v === "string" && v.trim() && v.length <= max ? v.trim() : "";
    const draft: Draft = {
      name: text(d.name, NAME_MAX),
      from: text(d.from, 40),
      email: text(d.email, 254),
      dedication: text(d.dedication, 150),
      gender: d.gender === "boy" ? "boy" : "girl",
      age: Number(d.age),
      eyeColour: EYE_COLOURS.some((e) => e.value === d.eyeColour) ? d.eyeColour : "brown",
      guardianConsent: d.guardianConsent === true,
      answers: {},
    };
    for (const key of ["activities", "funny", "food", "place", "other"] as const) {
      const a = text(d.answers?.[key], 200);
      if (a) draft.answers[key] = a;
    }
    const ok =
      draft.name &&
      draft.from &&
      emailSchema.isValidSync(draft.email) &&
      Number.isInteger(draft.age) &&
      draft.age >= AGE_MIN &&
      draft.age <= AGE_MAX &&
      draft.guardianConsent;
    return ok ? draft : null;
  } catch {
    return null;
  }
}

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const draft = parse(parts?.find((p) => p.name === "draft")?.data.toString("utf8"));
  if (!draft) return apiFail("Some details were missing.");
  const photo = parts?.find((p) => p.name === "photo" && p.data?.length);
  const photoOk = photo?.type && ALLOWED.has(photo.type) && photo.data.length <= MAX_BYTES;

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  if (!underFormLimit(ip)) return apiFail("Too many submissions. Please try again later.");

  // Re-written here from the answers, so the email lists exactly the stories the parent saw.
  const books = writeStories(draft);
  const answers = STORY_QUESTIONS.filter((q) => draft.answers[q.id]).map(
    (q) => [q.prompt.replaceAll("{name}", draft.name), draft.answers[q.id]!] as [string, string],
  );

  try {
    await sendSiteEmail({
      inbox: "storybook",
      subject: `New storybook: ${draft.name}, age ${draft.age} (from ${draft.from})`,
      title: `New storybook for ${draft.name}`,
      replyTo: draft.email,
      fields: [
        ["Parent's email", draft.email],
        ["Child", `${draft.name}, ${draft.age}, ${draft.gender}, ${draft.eyeColour} eyes`],
        ["From (on the cover)", draft.from],
        ["Dedication", draft.dedication],
        ...answers,
        ["Stories offered", books.map((b) => `• ${b.title}`).join("\n")],
        ["Photo", photoOk ? "Attached (guardian consent given)" : "No photo received"],
        [
          "Next step",
          "The parent can now pay for the books they want; paid orders arrive separately.",
        ],
      ],
      attachments: photoOk
        ? [
            {
              filename: `${draft.name.replace(/[^\p{L}\p{N}-]+/gu, "-")}-photo.${EXT[photo!.type!]}`,
              content: photo!.data.toString("base64"),
            },
          ]
        : [],
    });
  } catch (e) {
    // oxlint-disable-next-line no-console
    console.error("[storybook email]", (e as { data?: unknown })?.data ?? e);
    return apiFail("We couldn't send your storybook details just now.");
  }
  return { status: true as const, message: "", data: { received: true as const } };
});
