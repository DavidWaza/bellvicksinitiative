import type { StoryBook, StoryDraft } from "../../domain/storybook-types";

/**
 * The image prompt for one personalised cover, in the style of the approved samples
 * (public/images/storybook/*, made in Flick with gpt-image-2.5, 3:4, high quality, 1K).
 * The scene comes from the story theme the answers chose (story-themes.ts).
 * The illustration service sends this with the child's photo as a reference image, so the
 * character keeps their likeness. Kept beside the mock so the real backend can reuse it verbatim.
 */
export function buildCoverPrompt(
  d: Omit<StoryDraft, "hasPhoto">,
  book: Pick<StoryBook, "title"> & { scene: string },
): string {
  const child = `${d.age}-year-old ${d.gender === "girl" ? "girl" : "boy"} with ${d.eyeColour} eyes`;
  return [
    "Front cover of a personalised children's picture book, vibrant comic-book / Pixar-style digital illustration, full bleed portrait.",
    `The hero is the child in the reference photo (keep their face, skin tone and hair exactly): a joyful ${child}, who ${book.scene}.`,
    `Big bold hand-lettered white title text with a dark outline at the top: "${book.title.toUpperCase()}".`,
    `Small white text at the bottom: "By ${d.from.trim()}".`,
    "Rich saturated colours, cinematic lighting, high detail, cheerful, suitable for young children.",
  ].join(" ");
}
