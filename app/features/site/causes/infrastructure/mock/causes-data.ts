import { photo } from "~/shared/photos";
import { sample } from "~/shared/sample-content";
import type { Cause } from "../../domain/cause-types";

/**
 * The four real causes from bellvicksinitiative.org. Status, amount raised and goal are INVENTED
 * demo values wrapped in sample() (shared/sample-content.ts). Replace them before launch.
 * (The homepage slice keeps its own narrower copy of these causes — keep titles in step.)
 */
export const CAUSES: Cause[] = [
  {
    slug: "keffi-books",
    title: "Books for children in Keffi",
    location: "Keffi",
    summary: "New educational supplies for out-of-school children.",
    description: [
      "Many children in and around Keffi are out of school. This cause provides new books and educational supplies so that they can learn, read and keep up their schooling.",
      "Supplies are distributed with the help of local communities and partners, so they reach the children who need them most.",
    ],
    supports: [
      "New books for children to keep",
      "Exercise books, pencils and learning supplies",
      "Getting supplies to children through local partners",
    ],
    focusArea: "education",
    status: sample("active"),
    raised: sample(1250000),
    goal: sample(2000000),
    currency: "NGN",
    image: photo(
      "/images/causes/keffi-books.jpg",
      "childrenWithBooks",
      "Children with new books in Keffi",
    ),
  },
  {
    slug: "gwagwalada-books",
    title: "Books for children in Gwagwalada",
    location: "Gwagwalada",
    summary: "New educational supplies for out-of-school children.",
    description: [
      "This cause brings new books and educational supplies to out-of-school children in Gwagwalada, giving them the tools to learn.",
      "It is part of our wider book drive work: every child deserves a story of their own.",
    ],
    supports: [
      "New books for children to keep",
      "Learning supplies",
      "Reading support through our book drives",
    ],
    focusArea: "education",
    status: sample("closing_soon"),
    raised: sample(1320000),
    goal: sample(1500000),
    currency: "NGN",
    image: photo(
      "/images/causes/gwagwalada-books.jpg",
      "pupilsWriting",
      "Children with new books in Gwagwalada",
    ),
  },
  {
    slug: "gwagwalada-food",
    title: "Healthy food for families in Gwagwalada",
    location: "Gwagwalada",
    summary: "A healthy food supply for the community.",
    description: [
      "Hungry children can't learn. This cause supports vulnerable families in Gwagwalada with a healthy food supply.",
      "It contributes to the UN's Sustainable Development Goal 2: Zero Hunger.",
    ],
    supports: ["Healthy food for vulnerable families", "Better nutrition for growing children"],
    focusArea: "health",
    tag: "SDG 2 · Zero Hunger",
    status: sample("funded"),
    raised: sample(1800000),
    goal: sample(1800000),
    currency: "NGN",
    image: photo(
      "/images/causes/gwagwalada-food.jpg",
      "familyPortraitMeal",
      "A meal being shared in Gwagwalada",
    ),
  },
  {
    slug: "lokoja-water",
    title: "Clean water for Lokoja",
    location: "Lokoja",
    summary: "Portable, clean water supply for the community.",
    description: [
      "Clean water is the foundation of good health. This cause provides a portable, clean water supply for communities in Lokoja.",
      "Safe water means fewer illnesses, more time in school and healthier families.",
    ],
    supports: [
      "A portable, clean water supply",
      "Healthier families and fewer water-borne illnesses",
    ],
    focusArea: "sustainability",
    status: sample("active"),
    raised: sample(900000),
    goal: sample(3000000),
    currency: "NGN",
    image: photo(
      "/images/causes/lokoja-water.jpg",
      "waterWalk",
      "Clean water being collected in Lokoja",
    ),
  },
];
