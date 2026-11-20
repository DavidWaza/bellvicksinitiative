import type { StoryBook, StoryDraft } from "../../domain/storybook-types";

/**
 * The image prompt for one personalised cover, in the style of the approved samples
 * (public/images/storybook/*, made in Flick with gpt-image-2.5, 3:4, high quality, 1K).
 * The illustration service sends this with the child's photo as a reference image, so the
 * character keeps their likeness. Kept beside the mock so the real backend can reuse it verbatim.
 */
const SCENES: Record<string, string> = {
  "talking-baobab":
    "stands smiling with arms raised beside an enormous ancient baobab tree that has a kind, smiling face formed naturally in its bark. Golden hour savanna, warm orange sky, glowing fireflies and musical notes floating from the tree",
  "market-day":
    "laughs while carrying a woven basket as a cheeky little white goat tugs at it. Behind them a bustling, colourful West African open-air market: striped awnings, tomatoes, peppers, yams and plantain, fabric stalls, warm sunlight",
  "reach-the-stars":
    "rides a handmade cardboard-and-bottle-top rocket soaring into a deep blue night sky full of sparkling stars and a crescent moon, wearing a cardboard astronaut helmet. Far below, the twinkling lights of a city",
};

export function buildCoverPrompt(
  d: Omit<StoryDraft, "hasPhoto">,
  book: Pick<StoryBook, "id" | "title">,
): string {
  const child = `${d.age}-year-old ${d.gender === "girl" ? "girl" : "boy"} with ${d.eyeColour} eyes`;
  const extra = d.answers.activities ? ` Include a small nod to: ${d.answers.activities}.` : "";
  return [
    "Front cover of a personalised children's picture book, vibrant comic-book / Pixar-style digital illustration, full bleed portrait.",
    `The hero is the child in the reference photo (keep their face, skin tone and hair exactly): a joyful ${child}, who ${SCENES[book.id] ?? "is the hero of a magical adventure"}.${extra}`,
    `Big bold hand-lettered white title text with a dark outline at the top: "${book.title.toUpperCase()}".`,
    `Small white text at the bottom: "By ${d.from.trim()}".`,
    "Rich saturated colours, cinematic lighting, high detail, cheerful, suitable for young children.",
  ].join(" ");
}
