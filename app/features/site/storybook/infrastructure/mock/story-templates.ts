import { pronouns, type StoryBook, type StoryDraft } from "../../domain/storybook-types";
import { THEMES, type StoryContext } from "./story-themes";

/**
 * Mock story writer. Chooses the three themes that best fit the questionnaire answers and writes
 * each one around them (see story-themes.ts):
 * - favourite activities pick the adventure (football → a cup final, drawing → a magic crayon…);
 * - a pet or sibling named in the answers joins the story as a sidekick;
 * - every answered question gets a book before any answer gets a second one;
 * - favourite food and place get their own stories;
 * - the funny habit becomes the plot of a comic story.
 * With few or no answers it falls back to classic stories (and a bedtime story for ages 1–3).
 * Same answers → same books, so nothing is random.
 * Product details (32 pages, 8.5" × 8.5") are placeholders for the real print spec.
 */
type Input = Omit<StoryDraft, "hasPhoto">;

/** A written book plus the cover scene the prompt builder needs. */
export type WrittenBook = Omit<StoryBook, "coverPrompt"> & { scene: string };

const PET =
  /\b(cat|kitten|dog|puppy|goat|rabbit|parrot|bird|tortoise|hamster|fish|chicken|hen)\s+(?:called|named)\s+([\p{L}'-]+)/iu;
const PET_ANY =
  /\b(?:my|our|a|his|her)\s+(cat|kitten|dog|puppy|goat|rabbit|parrot|tortoise|hamster)\b/i;
const SIDEKICK =
  /\b((?:little |big |baby |older |younger )?(?:brother|sister|cousin|best friend|friend))\s+(?:called |named )?([\p{Lu}][\p{L}'-]+)/u;

function context(d: Input): StoryContext {
  const p = pronouns(d.gender);
  const clean = (s?: string) => (s?.trim() ? s.trim() : undefined);
  const answers = {
    activities: clean(d.answers.activities),
    funny: clean(d.answers.funny),
    food: clean(d.answers.food),
    place: clean(d.answers.place),
    other: clean(d.answers.other),
  };
  const everything = Object.values(answers).filter(Boolean).join(". ");

  const petNamed = everything.match(PET);
  const petAny = everything.match(PET_ANY);
  const pet = petNamed
    ? { kind: petNamed[1]!.toLowerCase(), name: petNamed[2]!.replace(/^./, (c) => c.toUpperCase()) }
    : petAny
      ? { kind: petAny[1]!.toLowerCase() }
      : undefined;

  const sib = everything.match(SIDEKICK);
  const sidekick = sib ? { label: sib[1]!.toLowerCase(), name: sib[2]! } : undefined;

  return {
    name: d.name.trim(),
    age: d.age,
    he: p.they,
    He: p.they.charAt(0).toUpperCase() + p.they.slice(1),
    his: p.their,
    him: p.them,
    ...answers,
    pet,
    sidekick,
  };
}

export function writeStories(d: Input): WrittenBook[] {
  const c = context(d);

  const ranked = THEMES.map((theme, order) => ({ theme, order, ...theme.match(c) }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order);

  // Pass 1: the best book for each kind of answer given (activity, pet, food, place, funny), so
  // no answer is crowded out. Pass 2: fill any space with the next best fits, then the classics.
  const picked: typeof ranked = [];
  const add = (t: (typeof ranked)[number]) => {
    if (picked.length < 3 && !picked.some((p) => p.theme.id === t.theme.id)) picked.push(t);
  };
  const seen = new Set<string>();
  for (const t of ranked) {
    if (t.theme.source === "classic" || seen.has(t.theme.source)) continue;
    seen.add(t.theme.source);
    add(t);
  }
  for (const t of ranked) add(t);
  // Strongest match first on the page.
  picked.sort((a, b) => b.score - a.score || a.order - b.order);

  // Companions found in the answers belong on every book's "inspired by" list.
  const shared = [c.sidekick && `${c.sidekick.label} ${c.sidekick.name}`].filter((x): x is string =>
    Boolean(x),
  );

  return picked.map(({ theme, because }) => {
    const story = theme.write(c);
    const inspiredBy = [...because, ...shared.filter((s) => !because.includes(s))];
    return {
      id: theme.id,
      tone: theme.tone,
      motif: theme.motif,
      pages: 32,
      size: '8.5" × 8.5"',
      inspiredBy: inspiredBy.length ? inspiredBy : [`Made for ${c.name}, age ${c.age}`],
      ...story,
    };
  });
}
