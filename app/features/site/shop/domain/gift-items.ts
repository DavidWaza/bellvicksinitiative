import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

/**
 * "GIVE TO A CHILD": the second store. Here you don't buy for yourself: you PICK an item, PAY for
 * it, and it is DONATED to a child. Items and costs are BGAI's own school-items list from the
 * Back to School "Sponsor's Application Form". DUPLICATED from
 * features/site/sponsorship/domain/sponsorship-forms.ts (SCHOOL_ITEMS), because slices don't
 * import each other: keep the two lists in step.
 */
export interface GiftItem {
  slug: string;
  name: string;
  /** What's in it, as printed on the form ("2 pairs"). */
  quantity?: string;
  /** Naira, per child. */
  price: number;
  /** What it means for the child. */
  blurb: string;
  icon: IconName;
  tone: Tone;
}

export const GIFT_ITEMS: GiftItem[] = [
  {
    slug: "school-uniform",
    name: "School uniform",
    quantity: "2 pairs",
    price: 5_000,
    blurb: "So a child can walk into class looking like everyone else.",
    icon: "tshirt",
    tone: "sky",
  },
  {
    slug: "school-shoes",
    name: "School shoes",
    quantity: "1 pair",
    price: 5_000,
    blurb: "Sturdy shoes for the walk to school and back.",
    icon: "sneaker",
    tone: "coral",
  },
  {
    slug: "school-socks",
    name: "School socks",
    quantity: "5 pairs",
    price: 2_000,
    blurb: "A fresh pair for every day of the school week.",
    icon: "sock",
    tone: "lavender",
  },
  {
    slug: "school-bag",
    name: "School bag",
    quantity: "1",
    price: 5_000,
    blurb: "Somewhere safe to carry books, lunch and dreams.",
    icon: "backpack",
    tone: "sun",
  },
  {
    slug: "school-notebooks",
    name: "School notebooks",
    price: 5_000,
    blurb: "Pages for lessons, homework and practice.",
    icon: "notebook",
    tone: "mint",
  },
  {
    slug: "school-textbooks",
    name: "School textbooks",
    price: 25_000,
    blurb: "The books a child needs to follow every lesson.",
    icon: "books",
    tone: "accent",
  },
];

/** Every item above for one child, as one gift. */
export const FULL_KIT: GiftItem = {
  slug: "full-school-kit",
  name: "Full school kit",
  price: GIFT_ITEMS.reduce((sum, i) => sum + i.price, 0),
  blurb: "Uniform, shoes, socks, a bag, notebooks and textbooks: everything a child needs for school.",
  icon: "gift",
  tone: "coral",
};

export const giftBySlug = (slug: string) =>
  slug === FULL_KIT.slug ? FULL_KIT : GIFT_ITEMS.find((g) => g.slug === slug);
