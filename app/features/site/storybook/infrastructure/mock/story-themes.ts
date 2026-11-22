import type { StoryBook } from "../../domain/storybook-types";

/**
 * The story library the mock writer chooses from. Each theme says WHEN it fits (from the
 * questionnaire answers) and HOW it uses them. The real service replaces this, but should keep
 * the same rule: the books follow the answers, they are never a fixed or random set.
 */

/** Everything the writer knows about the child, pre-parsed from the draft. */
export interface StoryContext {
  name: string;
  age: number;
  he: string; // she / he
  He: string; // She / He
  his: string; // her / his
  him: string; // her / him
  /** Raw answers, trimmed (undefined when skipped). */
  activities?: string;
  funny?: string;
  food?: string;
  place?: string;
  other?: string;
  /** A pet found in the answers: "a cat called Puff" → { kind: "cat", name: "Puff" }. */
  pet?: { kind: string; name?: string };
  /** A sibling or friend found in the answers: "little brother Tobi". */
  sidekick?: { label: string; name: string };
}

interface ThemeMatch {
  /** Higher = a better fit. 0 or below = doesn't fit. */
  score: number;
  /** Shown on the card ("Inspired by …") so the customer sees why this book was chosen. */
  because: string[];
}

interface WrittenStory {
  title: string;
  blurb: string;
  opening: string;
  /** What the cover shows (fed into the image prompt). */
  scene: string;
}

/** Which answer a theme draws on. The writer gives each answered source a book before repeating one. */
type ThemeSource = "activity" | "pet" | "food" | "place" | "funny" | "classic";

export interface StoryTheme {
  id: string;
  source: ThemeSource;
  tone: StoryBook["tone"];
  motif: StoryBook["motif"];
  match: (c: StoryContext) => ThemeMatch;
  write: (c: StoryContext) => WrittenStory;
}

// ---------------------------------------------------------------------------------------------
// Helpers

/** Which answer a keyword was found in matters: a favourite ACTIVITY is a stronger signal. */
function find(c: StoryContext, words: RegExp): { in: "activities" | "other"; word: string } | null {
  const a = c.activities?.match(words);
  if (a) return { in: "activities", word: a[0].toLowerCase() };
  // Never the funny habit: it already has its own story.
  const o = [c.other, c.place].join(" ").match(words);
  return o ? { in: "other", word: o[0].toLowerCase() } : null;
}

const scoreFor = (hit: ReturnType<typeof find>) => (!hit ? 0 : hit.in === "activities" ? 10 : 5);

const GERUND: Record<string, string> = {
  sing: "singing",
  sings: "singing",
  dance: "dancing",
  dances: "dancing",
  draw: "drawing",
  draws: "drawing",
  paint: "painting",
  paints: "painting",
  swim: "swimming",
  swims: "swimming",
  run: "running",
  runs: "running",
  build: "building",
  builds: "building",
  read: "reading",
  reads: "reading",
  invent: "inventing",
  invents: "inventing",
  race: "racing",
  races: "racing",
};
/** "Loves singing", "Loves football". */
const loves = (hit: ReturnType<typeof find>) =>
  hit ? [`Loves ${GERUND[hit.word] ?? hit.word}`] : [];

const titleCase = (s: string) =>
  s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(^|\s|-)(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    .replace(/'S\b/g, "'s")
    // Small words stay small: "Grandma's House in Kaduna".
    .replace(/(?<=\s)(In|Of|The|And|To|At|On|For|With)(?=\s)/g, (w) => w.toLowerCase());

/** "Jollof rice and plantain, puff-puff" → "jollof rice". */
const firstItem = (s: string) =>
  s
    .split(/,|\band\b|&|\//i)[0]!
    .trim()
    .replace(/^(e\.g\.|i love|loves?|likes?|eating|my|his|her|their)\s+/i, "")
    .replace(/[.!]+$/, "")
    .toLowerCase();

/** "Sings to the chickens every morning." → "sings to the chickens every morning". */
const habit = (s: string, name: string) =>
  s
    .trim()
    .replace(/[.!]+$/, "")
    .replace(new RegExp(`^(he|she|they|${name})\\s+`, "i"), "")
    .replace(/^./, (ch) => ch.toLowerCase());

/** " Little brother Tobi joins in!" / " Puff the cat joins in!", or "": any story can add it. */
const company = (c: StoryContext) => {
  const who = c.sidekick
    ? `${c.sidekick.label} ${c.sidekick.name}`
    : c.pet?.name
      ? `${c.pet.name} the ${c.pet.kind}`
      : "";
  return who ? ` ${who.charAt(0).toUpperCase()}${who.slice(1)} joins in!` : "";
};

// ---------------------------------------------------------------------------------------------
// Activity themes (strongest signal)

const SPORT =
  /\b(football|soccer|ball|basketball|running|run|race|races|swim\w*|sports?|athletics|skipping|cycling|bike)\b/i;
const ART = /\b(draw\w*|paint\w*|colou?r\w*|crayons?|art|sketch\w*|crafts?)\b/i;
const MUSIC = /\b(danc\w*|sing\w*|songs?|music|drums?|piano|guitar|keyboard)\b/i;
const BUILD =
  /\b(build\w*|blocks?|lego|robots?|science|experiments?|invent\w*|machines?|fixing)\b/i;
const SPACE = /\b(rockets?|space|stars?|planets?|moon|astronauts?|aeroplanes?|planes?|flying)\b/i;
const READING = /\b(read\w*|books?|stories|story)\b/i;
const ANIMALS =
  /\b(animals?|cats?|kittens?|dogs?|pupp(y|ies)|goats?|chickens?|hens?|birds?|parrots?|horses?|rabbits?|fish|tortoises?|zoo)\b/i;

const sport: StoryTheme = {
  id: "winning-goal",
  source: "activity",
  tone: "mint",
  motif: "sport",
  match: (c) => {
    const hit = find(c, SPORT);
    return { score: scoreFor(hit), because: loves(hit) };
  },
  write: (c) => {
    const hit = find(c, SPORT)?.word ?? "football";
    if (/swim/.test(hit))
      return {
        title: `${c.name} and the Great River Swim`,
        blurb: `The whole village gathers at the river for the great swim, and ${c.age}-year-old ${c.name} wants to be brave enough to try. A splashy story about courage.${company(c)}`,
        opening: `The water sparkled, the drums were beating, and ${c.name} dipped one toe in. "Cold!" ${c.he} laughed.`,
        scene:
          "swims happily across a sparkling river while villagers cheer from the bank, splashes catching the sunlight",
      };
    if (/run|race|athlet|skipping|cycl|bike/.test(hit))
      return {
        title: `${c.name} Wins the Big Race`,
        blurb: `Everyone says the hill is too steep, but ${c.age}-year-old ${c.name} has been practising every day. A big-hearted story about never giving up.${company(c)}`,
        opening: `On your marks… ${c.name} tied ${c.his} laces twice, just to be sure.`,
        scene:
          "sprints across a finish line with arms raised, ribbons and confetti flying, a cheering crowd behind",
      };
    return {
      title: `${c.name} Scores the Winning Goal`,
      blurb: `It's the final of the street football cup and the score is level. Can ${c.age}-year-old ${c.name} keep calm, pass to ${c.his} friends and score the winning goal?${company(c)}`,
      opening: `The ball was old, the goalposts were two flip-flops, and ${c.name} had never wanted anything more.`,
      scene:
        "dribbles a football across a sunny, dusty pitch toward a goal, friends cheering, the ball glowing with magic",
    };
  },
};

const art: StoryTheme = {
  id: "magic-crayon",
  source: "activity",
  tone: "lavender",
  motif: "art",
  match: (c) => {
    const hit = find(c, ART);
    return { score: scoreFor(hit), because: loves(hit) };
  },
  write: (c) => ({
    title: `${c.name} and the Magic Crayon`,
    blurb: `Whatever ${c.name} draws with the magic crayon comes to life: a flying fish, a house made of mangoes, a dragon who is scared of the dark. A colourful adventure for a ${c.age}-year-old artist.${company(c)}`,
    opening: `The crayon was hiding at the bottom of the box, glowing just a little. ${c.name} picked it up and drew a small round sun.`,
    scene:
      "draws in the air with a giant glowing crayon, bright drawings of animals and rainbows springing to life around them",
  }),
};

const music: StoryTheme = {
  id: "dancing-drum",
  source: "activity",
  tone: "coral",
  motif: "music",
  match: (c) => {
    const hit = find(c, MUSIC);
    return { score: scoreFor(hit), because: loves(hit) };
  },
  write: (c) => {
    const sings = /sing|song/.test(find(c, MUSIC)?.word ?? "");
    return sings
      ? {
          title: `${c.name} Sings Up the Sunrise`,
          blurb: `One morning the sun forgets to rise, and only the brightest song can wake it. Lucky for everyone, ${c.age}-year-old ${c.name} has the brightest song of all.${company(c)}`,
          opening: `It was morning, but the sky was still dark. ${c.name} opened the window, took a deep breath and began to sing.`,
          scene:
            "sings joyfully on a hilltop as the sun rises behind them, golden musical notes swirling into the sky",
        }
      : {
          title: `${c.name} and the Dancing Drum`,
          blurb: `Grandpa's old talking drum has one rule: whoever plays it must dance. ${c.age}-year-old ${c.name} can't stop, and soon the whole street is dancing too.${company(c)}`,
          opening: `Boom-ba-boom. The drum in the corner had been quiet for years. Then ${c.name} tapped it, once.`,
          scene:
            "dances with a glowing talking drum in a lively street party, colourful fabric and musical notes swirling around",
        };
  },
};

const build: StoryTheme = {
  id: "amazing-invention",
  source: "activity",
  tone: "sky",
  motif: "stars",
  match: (c) => {
    const hit = find(c, BUILD);
    return { score: scoreFor(hit), because: loves(hit) };
  },
  write: (c) => ({
    title: `${c.name}'s Amazing Invention`,
    blurb: `With blocks, bottle tops and a lot of imagination, ${c.age}-year-old ${c.name} builds a machine to help the whole neighbourhood. But what happens when it starts to wobble?${company(c)}`,
    opening: `"Every great inventor needs a workshop," said ${c.name}, and turned the kitchen table into one.`,
    scene:
      "proudly stands beside a wonderful home-made machine of colourful blocks, cogs and bottle tops that sparkles with light",
  }),
};

const space: StoryTheme = {
  id: "reach-the-stars",
  source: "activity",
  tone: "sky",
  motif: "stars",
  match: (c) => {
    const hit = find(c, SPACE);
    return { score: scoreFor(hit), because: loves(hit) };
  },
  write: (c) => ({
    title: `${c.name} Reaches for the Stars`,
    blurb: `When the stars over ${c.place ? titleCase(c.place.split(",")[0]!) : "the city"} go missing one night, ${c.age}-year-old ${c.name} builds a rocket from boxes and bottle tops and flies up to bring them home.${company(c)}`,
    opening: `The night the stars went out, ${c.name} was the only one still awake. ${c.He} pressed ${c.his} nose to the window and made a plan.`,
    scene:
      "rides a handmade cardboard-and-bottle-top rocket into a deep blue night sky full of sparkling stars and a crescent moon",
  }),
};

const reading: StoryTheme = {
  id: "never-ending-library",
  source: "activity",
  tone: "sun",
  motif: "tree",
  match: (c) => {
    const hit = find(c, READING);
    return { score: scoreFor(hit), because: loves(hit) };
  },
  write: (c) => ({
    title: `${c.name} and the Never-Ending Library`,
    blurb: `Behind the last shelf of the library is a door, and behind the door, every story ever told. ${c.age}-year-old ${c.name} steps inside to find the one that's missing.${company(c)}`,
    opening: `${c.name} had read every book in the library. Well, almost every book.`,
    scene:
      "steps through a glowing doorway in a tall bookshelf into a magical library where books fly like birds",
  }),
};

const animals: StoryTheme = {
  id: "animal-friend",
  source: "pet",
  tone: "mint",
  motif: "animals",
  match: (c) => {
    if (c.pet)
      return {
        score: 9,
        because: [c.pet.name ? `${c.pet.name} the ${c.pet.kind}` : `Loves ${c.pet.kind}s`],
      };
    const hit = find(c, ANIMALS);
    return { score: scoreFor(hit), because: loves(hit) };
  },
  write: (c) => {
    const kind = c.pet?.kind ?? find(c, ANIMALS)?.word.replace(/s$/, "") ?? "puppy";
    if (c.pet?.name)
      return {
        title: `${c.name} and ${c.pet.name}'s Big Adventure`,
        blurb: `${c.pet.name} the ${kind} has gone missing, and only ${c.name} knows all ${c.pet.name}'s favourite hiding places. A warm, funny search across the whole neighbourhood.`,
        opening: `"${c.pet.name}! Breakfast!" called ${c.name}. But for the first time ever, nobody came running.`,
        scene: `hugs ${c.his} ${kind} ${c.pet.name} in a sunny garden full of flowers and butterflies`,
      };
    return {
      title: `${c.name} and the Lost Little ${titleCase(kind)}`,
      blurb: `A tiny ${kind} is lost and far from home. ${c.age}-year-old ${c.name} promises to help it find its family, whatever it takes.${company(c)}`,
      opening: `Under the mango tree, something small was crying. ${c.name} knelt down to look.`,
      scene: `gently carries a tiny, wide-eyed ${kind} along a sunny village path towards home`,
    };
  },
};

// ---------------------------------------------------------------------------------------------
// Answer themes: favourite food, favourite place, the funny habit

const feast: StoryTheme = {
  id: "great-feast",
  source: "food",
  tone: "coral",
  motif: "market",
  match: (c) =>
    c.food
      ? { score: 7, because: [`Favourite food: ${firstItem(c.food)}`] }
      : { score: 0, because: [] },
  write: (c) => {
    const food = firstItem(c.food!);
    return {
      title: `${c.name} and the Great ${titleCase(food)} Feast`,
      blurb: `The whole family is coming for dinner and the pot of ${food} is empty! ${c.age}-year-old ${c.name} races through the market to find everything in time.${company(c)}`,
      opening: `"Who ate all the ${food}?" asked Mama. Everybody looked at ${c.name}. ${c.name} looked at the goat.`,
      scene: `stirs a giant, steaming pot of ${food} in a bright, busy outdoor kitchen while the family cheers`,
    };
  },
};

const journey: StoryTheme = {
  id: "big-trip",
  source: "place",
  tone: "sky",
  motif: "river",
  match: (c) =>
    c.place
      ? { score: 7, because: [`Favourite place: ${c.place.replace(/[.!]+$/, "")}`] }
      : { score: 0, because: [] },
  write: (c) => {
    const place = titleCase(c.place!.split(/[,.]/)[0]!);
    return {
      title: `${c.name}'s Big Trip to ${place}`,
      blurb: `Nowhere in the world is quite like ${place}, and today ${c.age}-year-old ${c.name} is going there by the most magical route ever: over rivers, under rainbows and through the clouds.${company(c)}`,
      opening: `${c.name} packed ${c.his} bag: a snack, a torch, and a map to ${place} drawn in crayon.`,
      scene: `sets off on a joyful journey along a winding road over hills and a river towards ${place}, with a little backpack`,
    };
  },
};

const funny: StoryTheme = {
  id: "funniest-day",
  source: "funny",
  tone: "sun",
  motif: "confetti",
  match: (c) =>
    c.funny
      ? { score: 6, because: [`Funny habit: ${habit(c.funny, c.name)}`] }
      : { score: 0, because: [] },
  write: (c) => {
    const h = habit(c.funny!, c.name);
    return {
      title: `Nobody Is Funnier Than ${c.name}`,
      blurb: `Everyone knows ${c.name} ${h}. But one day it turns out to be exactly what saves the day! A giggly story that celebrates everything that makes ${c.him} ${c.him === "her" ? "herself" : "himself"}.${company(c)}`,
      opening: `In ${c.name}'s house, every day starts the same way: ${c.name} ${h}, and everybody laughs.`,
      scene:
        "laughs with a huge grin in the middle of a cheerful, chaotic scene full of colour and confetti, friends giggling around them",
    };
  },
};

// ---------------------------------------------------------------------------------------------
// Fallbacks (used when the answers don't fill three books)

const bedtime: StoryTheme = {
  id: "goodnight",
  source: "classic",
  tone: "lavender",
  motif: "stars",
  match: (c) => ({ score: c.age <= 3 ? 4 : 0, because: [`Gentle story for age ${c.age}`] }),
  write: (c) => ({
    title: `Goodnight, ${c.name}`,
    blurb: `The moon, the stars and all the sleepy animals have one last thing to do before bedtime: say goodnight to ${c.name}. A gentle rhyming story for little ones.${company(c)}`,
    opening: `The sun went down, the stars came out, and the moon peeped in to look for ${c.name}.`,
    scene:
      "snuggles under a cosy blanket while a smiling moon and sleepy animals peek through the window",
  }),
};

const baobab: StoryTheme = {
  id: "talking-baobab",
  source: "classic",
  tone: "sun",
  motif: "tree",
  match: () => ({ score: 2, because: [] }),
  write: (c) => ({
    title: `${c.name} and the Talking Baobab`,
    blurb: `In a village where the oldest baobab can talk, ${c.age}-year-old ${c.name} discovers the tree has lost its song. Can ${c.he} find it before the rains come?${company(c)}`,
    opening: `Every morning, ${c.name} said good morning to the baobab at the edge of the village. And every morning, the baobab said nothing at all. Until today.`,
    scene:
      "stands smiling with arms raised beside an enormous ancient baobab tree with a kind face in its bark, golden-hour savanna, glowing fireflies",
  }),
};

const market: StoryTheme = {
  id: "market-day",
  source: "classic",
  tone: "coral",
  motif: "market",
  match: () => ({ score: 1.5, because: [] }),
  write: (c) => ({
    title: `${c.name}'s Big Market Day`,
    blurb: `Mama's list is long, the market is loud, and a cheeky goat will not stop following ${c.name}. A funny, busy adventure for a ${c.age}-year-old.${company(c)}`,
    opening: `"Tomatoes, pepper, onions and one small surprise," read ${c.name}. ${c.He} folded the list and stepped into the market.`,
    scene:
      "laughs while carrying a woven basket as a cheeky little white goat tugs at it, in a bustling, colourful open-air market",
  }),
};

const stars: StoryTheme = { ...space, source: "classic", match: () => ({ score: 1, because: [] }) };

/** Activity themes first: on equal scores, earlier wins. */
export const THEMES: StoryTheme[] = [
  sport,
  art,
  music,
  build,
  space,
  reading,
  animals,
  feast,
  journey,
  funny,
  bedtime,
  baobab,
  market,
  stars,
];
