import { pronouns, type StoryBook, type StoryDraft } from "../../domain/storybook-types";

/**
 * Mock story writer. The real service will write and illustrate each book; until it exists these
 * templates personalise three original stories with the child's name, age, pronouns and answers.
 * Product details (32 pages, 8.5" × 8.5") are placeholders for the real print spec.
 */
type Input = Omit<StoryDraft, "hasPhoto">;

const firstLine = (text: string | undefined) =>
  text
    ?.split(/[.\n]/)[0]
    ?.trim()
    .replace(/^e\.g\.\s*/i, "")
    .toLowerCase();

export function writeStories(d: Input): Omit<StoryBook, "coverPrompt">[] {
  const name = d.name.trim();
  const p = pronouns(d.gender);
  const activity = firstLine(d.answers.activities);
  const food = firstLine(d.answers.food);
  const place = firstLine(d.answers.place);

  const base = { pages: 32, size: '8.5" × 8.5"' };

  return [
    {
      ...base,
      id: "talking-baobab",
      title: `${name} and the Talking Baobab`,
      tone: "sun",
      motif: "tree",
      blurb: `In a village where the oldest baobab can talk, ${d.age}-year-old ${name} discovers the tree has lost its song. Can ${p.they} find it before the rains come${activity ? `, with a little help from ${p.their} love of ${activity}` : ""}?`,
      opening: `Every morning, ${name} said good morning to the baobab at the edge of the village. And every morning, the baobab said nothing at all. Until today.`,
    },
    {
      ...base,
      id: "market-day",
      title: `${name}'s Big Market Day`,
      tone: "coral",
      motif: "market",
      blurb: `Mama's list is long, the market is loud, and a cheeky goat will not stop following ${name}. A funny, busy adventure that ends with ${food ? `a big plate of ${food}` : "the best dinner ever"}.`,
      opening: `"Tomatoes, pepper, onions and one small surprise," read ${name}. ${p.they.charAt(0).toUpperCase() + p.they.slice(1)} folded the list, took a deep breath, and stepped into the market.`,
    },
    {
      ...base,
      id: "reach-the-stars",
      title: `${name} Reaches for the Stars`,
      tone: "sky",
      motif: "stars",
      blurb: `When the stars over ${place ? place : "the city"} go missing one night, ${name} builds a rocket from boxes and bottle tops and flies up to bring them home.`,
      opening: `The night the stars went out, ${name} was the only one still awake. ${p.they.charAt(0).toUpperCase() + p.they.slice(1)} pressed ${p.their} nose to the window and made a plan.`,
    },
  ];
}
