import type { ImageConsent, ImageSlot, PhotoCredit } from "./image";

/**
 * Site-wide photo registry.
 *
 * Every image on the site is a SLOT: the path where a real Bellvicks photo will live. Until that
 * file exists, the slot shows a free stock stand-in from Unsplash (Unsplash licence: free for
 * commercial use, no permission needed; credit given on /credits as a courtesy).
 *
 * To use a real photo:
 *   1. put the file in /public at the slot path,
 *   2. add the path to REAL_PHOTOS below with its guardian-consent state.
 * The stock stand-in is then dropped automatically.
 *
 * Rule: stock photos are illustrative. Never caption one as a named or real beneficiary, and
 * never put a stock face next to a testimonial or story.
 */

/** Real Bellvicks photos that exist in /public, with consent status. */
const REAL_PHOTOS: Record<string, ImageConsent> = {
  // "/images/home/hero-child.jpg": "granted",
};

interface StockPhoto {
  file: string;
  /** Describes what the stock photo actually shows. */
  alt: string;
  credit: PhotoCredit;
}

const unsplash = (photographer: string, slug: string): PhotoCredit => ({
  photographer,
  url: `https://unsplash.com/photos/${slug}`,
  site: "Unsplash",
});

export const STOCK_PHOTOS = {
  girlSmiling: {
    file: "/images/stock/girl-smiling.jpg",
    alt: "A young girl with braided hair smiling at the camera",
    credit: unsplash("Picha HD", "a-little-girl-with-a-big-smile-on-her-face-KqaCBwr-rJw"),
  },
  girlReadingToClass: {
    file: "/images/stock/girl-reading-to-class.jpg",
    alt: "A girl in a yellow shirt reading aloud to her classmates",
    credit: unsplash(
      "Emmanuel Ikwuegbu",
      "a-woman-standing-in-front-of-a-group-of-children-VC6MGt9ZoBA",
    ),
  },
  boysInUniform: {
    file: "/images/stock/boys-in-uniform.jpg",
    alt: "Two smiling schoolboys in checked uniforms",
    credit: unsplash("TopSphere Media", "2-smiling-boys-in-uniform-oOHBxlGADx4"),
  },
  girlInAnkara: {
    file: "/images/stock/girl-in-ankara.jpg",
    alt: "A small girl in a bright patterned dress smiling broadly",
    credit: unsplash(
      "Derrick Pare",
      "a-young-child-in-a-colorful-dress-smiles-broadly-5NtjH7NjMVs",
    ),
  },
  classroomPupils: {
    file: "/images/stock/classroom-pupils.jpg",
    alt: "Pupils sitting at wooden desks in a classroom",
    credit: unsplash("Doug Linstedt", "children-sitting-on-chairs-inside-classroom-jEEYZsaxbH4"),
  },
  familyMeal: {
    file: "/images/stock/family-meal.jpg",
    alt: "A family sitting together around a table for a meal",
    credit: unsplash(
      "Ayodele Adeniyi",
      "a-group-of-people-sitting-around-a-wooden-table-PG9FDJfKKsY",
    ),
  },
  familyPortraitMeal: {
    file: "/images/stock/family-portrait-meal.jpg",
    alt: "Parents and children smiling over a shared plate of food",
    credit: unsplash(
      "Ayodele Adeniyi",
      "a-family-sitting-at-a-table-with-a-plate-of-food-M8XEw4miJ2s",
    ),
  },
  teacherAndStudents: {
    file: "/images/stock/teacher-and-students.jpg",
    alt: "A teacher explaining a lesson to attentive students",
    credit: unsplash(
      "David Geneugelijk",
      "a-teacher-instructs-students-in-a-classroom-CXa6E3krENE",
    ),
  },
  youthCircle: {
    file: "/images/stock/youth-circle.jpg",
    alt: "Young people sitting in a large circle outdoors for a workshop",
    credit: unsplash(
      "Valdhy Mbemba",
      "man-addresses-group-of-people-sitting-in-a-circle-o0L21_kfKF0",
    ),
  },
  waterWalk: {
    file: "/images/stock/water-walk.jpg",
    alt: "People walking along a dirt road carrying water containers",
    credit: unsplash(
      "Jeff Ackley",
      "group-of-people-walking-at-the-road-carrying-containers-YwDo_HwORXs",
    ),
  },
  childrenWithBooks: {
    file: "/images/stock/children-with-books.jpg",
    alt: "A group of children sitting on steps reading books",
    credit: unsplash("Michael Ali", "a-group-of-children-sitting-on-steps-with-books-dPuMBIbvDCg"),
  },
  pupilsWriting: {
    file: "/images/stock/pupils-writing.jpg",
    alt: "Pupils in green uniforms writing in their exercise books",
    credit: unsplash("Annie Spratt", "children-writing-in-books-feU8G7E5ODI"),
  },
  boyWithPencil: {
    file: "/images/stock/boy-with-pencil.jpg",
    alt: "A boy at a classroom table thinking, pencil in hand",
    credit: unsplash(
      "Felicia Montenegro",
      "a-group-of-young-children-sitting-at-a-table-EEbLJlfCnSI",
    ),
  },
  volunteers: {
    file: "/images/stock/volunteers.jpg",
    alt: "Volunteers in matching yellow shirts at an event",
    credit: unsplash("Rashpal Singh", "three-men-wearing-yellow-volunteers-shirts-qKVSEuBT5EY"),
  },
  mentorLaptop: {
    file: "/images/stock/mentor-laptop.jpg",
    alt: "A woman guiding a young person working on a laptop",
    credit: unsplash("Iwaria Inc.", "a-person-and-a-child-looking-at-a-laptop-SNcyY72lQwg"),
  },
  classroomNumbers: {
    file: "/images/stock/classroom-numbers.jpg",
    alt: "Young children learning in a simple classroom with numbers chalked on the wall",
    credit: unsplash(
      "Antoine Demare",
      "children-in-a-classroom-with-numbers-on-the-wall-5OhSEgbUQwo",
    ),
  },
  villageGathering: {
    file: "/images/stock/village-gathering.jpg",
    alt: "A community gathering in a rural village",
    credit: unsplash(
      "Sitraka Mamy Tantely Andriamialijaona",
      "crowd-gathers-in-a-rural-village-with-buildings-and-tents-iOS-rtpsQk4",
    ),
  },
  citySkyline: {
    file: "/images/stock/city-skyline.jpg",
    alt: "A city skyline with tall buildings under a bright sky",
    credit: unsplash("Chizon", "a-city-street-with-tall-buildings-in-the-background-LfRn3yxsrQo"),
  },
  // The Giving Shop: plain, unbranded product stand-ins until Bellvicks photographs its goods.
  shopTshirt: {
    file: "/images/stock/shop-tshirt.jpg",
    alt: "A plain white T-shirt on a wooden hanger",
    credit: unsplash("Avtar Singh", "a-plain-white-t-shirt-hangs-on-a-wooden-hanger-8ACmRoleM24"),
  },
  shopTote: {
    file: "/images/stock/shop-tote.jpg",
    alt: "A plain natural canvas tote bag on a grey background",
    credit: unsplash("Brando Makes Branding", "white-reusable-bag-on-gray-surface-smTDI-z1rlY"),
  },
  shopHoodie: {
    file: "/images/stock/shop-hoodie.jpg",
    alt: "A plain white hoodie on a hanger",
    credit: unsplash("Mediamodifier", "white-hoodie-and-distressed-jeans-kJXGTOY1wLQ"),
  },
  shopCap: {
    file: "/images/stock/shop-cap.jpg",
    alt: "A plain white baseball cap on a grey background",
    credit: unsplash("personalgraphic.com", "a-white-baseball-cap-on-a-gray-background-ozdzzeBu4Go"),
  },
  shopMug: {
    file: "/images/stock/shop-mug.jpg",
    alt: "A plain white ceramic mug",
    credit: unsplash("Mediamodifier", "a-white-coffee-mug-xf38DdLyBvI"),
  },
  shopNotebook: {
    file: "/images/stock/shop-notebook.jpg",
    alt: "An open lined notebook with a pen and pencils on a desk",
    credit: unsplash("Clay Banks", "open-notebook-with-pen-and-pencils-on-desk-n9AaeihA9HI"),
  },
  shopSchoolSet: {
    file: "/images/stock/shop-school-set.jpg",
    alt: "A notebook with coloured pencils, a ruler and clips on a pink desk",
    credit: unsplash(
      "Mediamodifier",
      "a-notebook-pencils-ruler-tape-and-pencils-on-a-pink-lT4XuZoDrX8",
    ),
  },
  shopGiftBox: {
    file: "/images/stock/shop-gift-box.jpg",
    alt: "Two gifts wrapped in brown kraft paper with a red ribbon",
    credit: unsplash(
      "Cemrecan Yurtman",
      "two-wrapped-gifts-with-red-ribbon-and-confetti-ZogUJmll5ys",
    ),
  },
} satisfies Record<string, StockPhoto>;

export type StockPhotoKey = keyof typeof STOCK_PHOTOS;

/**
 * Resolve a slot. `realAlt` describes the real photo once supplied; until then the stock photo's
 * own description is used so alt text always matches what is shown.
 */
export function photo(slot: string, stock: StockPhotoKey | null, realAlt: string): ImageSlot {
  const realConsent = REAL_PHOTOS[slot];
  if (realConsent)
    return { slot, src: slot, alt: realAlt, consent: realConsent, source: "bellvicks" };
  if (stock) {
    const s = STOCK_PHOTOS[stock];
    return {
      slot,
      src: s.file,
      alt: s.alt,
      consent: "not-required",
      source: "stock",
      credit: s.credit,
    };
  }
  return { slot, src: undefined, alt: realAlt, consent: "pending", source: "none" };
}
