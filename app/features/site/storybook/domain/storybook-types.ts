import * as yup from "yup";

/**
 * "Create your storybook": a personalised picture book starring the child. The wizard collects the
 * details below, the service writes three stories, and the customer picks the ones they want.
 * There is no payment provider yet, so the last step is a REQUEST (we email price and delivery),
 * never a fake checkout.
 */

export type Gender = "girl" | "boy";
export type EyeColour = "brown" | "hazel" | "blue" | "green";

export const GENDERS: { value: Gender; label: string; icon: "genderFemale" | "genderMale" }[] = [
  { value: "girl", label: "Girl", icon: "genderFemale" },
  { value: "boy", label: "Boy", icon: "genderMale" },
];

export const EYE_COLOURS: { value: EyeColour; label: string; swatch: string }[] = [
  { value: "brown", label: "Brown", swatch: "#5b3a22" },
  { value: "hazel", label: "Hazel", swatch: "#8a6a32" },
  { value: "blue", label: "Blue", swatch: "#3f78b5" },
  { value: "green", label: "Green", swatch: "#3e8a5a" },
];

export const AGE_MIN = 1;
export const AGE_MAX = 12;
export const NAME_MAX = 20;
export const ANSWER_MAX = 200;
export const DEDICATION_MAX = 150;

export type QuestionId = "activities" | "funny" | "food" | "place" | "other";

export interface StoryQuestion {
  id: QuestionId;
  /** `{name}` is replaced with the child's name. */
  prompt: string;
  example: string;
}

export const STORY_QUESTIONS: StoryQuestion[] = [
  {
    id: "activities",
    prompt: "What are {name}'s favourite activities?",
    example: "e.g. Dancing, drawing and building tall block towers.",
  },
  {
    id: "funny",
    prompt: "Tell us something funny {name} does",
    example: "e.g. Sings to the chickens every morning.",
  },
  {
    id: "food",
    prompt: "What is {name}'s favourite food?",
    example: "e.g. Jollof rice and plantain.",
  },
  {
    id: "place",
    prompt: "What's {name}'s favourite place?",
    example: "e.g. Grandma's house in Kaduna.",
  },
  {
    id: "other",
    prompt: "Tell us any other relevant detail",
    example: "e.g. Has a little brother called Tobi and a cat called Puff.",
  },
];

export const questionText = (q: StoryQuestion, name: string) =>
  q.prompt.replaceAll("{name}", name || "your child");

/** Everything the customer tells us. The photo stays on their device in this version. */
export interface StoryDraft {
  name: string;
  gender: Gender;
  age: number;
  answers: Partial<Record<QuestionId, string>>;
  eyeColour: EyeColour;
  /** True once a photo has been chosen and the guardian box ticked. */
  hasPhoto: boolean;
  guardianConsent: boolean;
  from: string;
  dedication: string;
  email: string;
}

export const emptyDraft = (): StoryDraft => ({
  name: "",
  gender: "girl",
  age: 4,
  answers: {},
  eyeColour: "brown",
  hasPhoto: false,
  guardianConsent: false,
  from: "",
  dedication: "",
  email: "",
});

export const defaultDedication = (name: string, from: string) =>
  `For ${name},\n\nA story made just for you.\n\nWith love from ${from}.`;

/** Pronouns for the story text. */
export const pronouns = (g: Gender) =>
  g === "girl"
    ? { they: "she", them: "her", their: "her" }
    : { they: "he", them: "him", their: "his" };

export const STEPS = [
  "name",
  "basics",
  "about",
  "photo",
  "from",
  "dedication",
  "email",
  "pick",
] as const;
export type StepId = (typeof STEPS)[number];

export const emailSchema = yup
  .string()
  .trim()
  .email("Enter a valid email address.")
  .required("Please enter your email.");

const isEmail = (v: string) => emailSchema.isValidSync(v);

/** Whether the customer may leave a step. `about` is optional (its button reads "Skip"). */
export function canLeaveStep(step: StepId, d: StoryDraft): boolean {
  switch (step) {
    case "name":
      return d.name.trim().length > 0 && d.name.trim().length <= NAME_MAX;
    case "basics":
      return d.age >= AGE_MIN && d.age <= AGE_MAX;
    case "about":
      return true;
    case "photo":
      return d.hasPhoto && d.guardianConsent;
    case "from":
      return d.from.trim().length > 0;
    case "dedication":
      return d.dedication.trim().length > 0 && d.dedication.length <= DEDICATION_MAX;
    case "email":
      return isEmail(d.email);
    case "pick":
      return true;
  }
}

/** One generated book, as the service returns it. */
export interface StoryBook {
  id: string;
  title: string;
  blurb: string;
  /** Cover palette. */
  tone: "sun" | "sky" | "coral" | "mint" | "lavender";
  /** Cover motif drawn behind the child. */
  motif: "tree" | "market" | "stars" | "river" | "sport" | "art" | "music" | "animals" | "confetti";
  /** Which answers this book was built from, e.g. "Loves football", "Puff the cat". */
  inspiredBy: string[];
  pages: number;
  /** Trim size, e.g. 8.5" × 8.5". */
  size: string;
  /** The opening page, shown in Preview. */
  opening: string;
  /** Image prompt the illustration service uses for this cover (with the child's photo). */
  coverPrompt: string;
  /** The AI-illustrated cover, once generated. Until then the drawn stand-in cover shows. */
  coverUrl?: string;
}
