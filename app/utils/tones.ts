/** Decorative colour families for pastel blobs, bands and stickers. Semantic status tones live in utils/status. */
export type Tone = "mint" | "lavender" | "sun" | "coral" | "sky" | "accent" | "forest";

export interface ToneClasses {
  /** Pastel fill (blobs, chips) */
  soft: string;
  /** Slightly deeper fill */
  mid: string;
  /** Icon / ink colour on top of `soft` — chosen to clear 3:1 as a graphic. */
  ink: string;
  /** Text-safe colour (≥4.5:1) on cream/white/its own tint. */
  text: string;
}

export const TONE_CLASSES: Record<Tone, ToneClasses> = {
  mint: {
    soft: "bg-mint-100",
    mid: "bg-mint-150",
    ink: "text-forest-500",
    text: "text-forest-500",
  },
  lavender: {
    soft: "bg-lavender-100",
    mid: "bg-lavender-150",
    ink: "text-lavender-600",
    text: "text-lavender-600",
  },
  sun: { soft: "bg-sun-100", mid: "bg-sun-150", ink: "text-sun-600", text: "text-base-900" },
  coral: {
    soft: "bg-coral-100",
    mid: "bg-coral-150",
    ink: "text-coral-600",
    text: "text-coral-700",
  },
  sky: { soft: "bg-sky-100", mid: "bg-sky-150", ink: "text-sky-600", text: "text-sky-700" },
  accent: {
    soft: "bg-accent-50",
    mid: "bg-accent-150",
    ink: "text-accent-600",
    text: "text-accent-700",
  },
  forest: {
    soft: "bg-forest-100",
    mid: "bg-forest-150",
    ink: "text-forest-500",
    text: "text-forest-500",
  },
};
