import type { ImageSlot } from "~/shared/image";
import { photo } from "~/shared/photos";
import type { CauseSlug, FocusAreaSlug } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

/**
 * The programmes slice's own read model of the six focus areas. The shell's nav keeps its own
 * short list (label + blurb); this one holds the page content. Copy describes only what the
 * current bellvicksinitiative.org says Bellvicks does — no invented figures or activities.
 */
export interface FocusAreaPage {
  slug: FocusAreaSlug;
  title: string;
  icon: IconName;
  tone: Tone;
  tagline: string;
  intro: string;
  /** What the work involves. */
  focus: { title: string; text: string }[];
  /** Causes on /causes that belong to this area. */
  relatedCauses: CauseSlug[];
  image: ImageSlot;
}

export const FOCUS_AREA_PAGES: FocusAreaPage[] = [
  {
    slug: "education",
    title: "Education",
    icon: "education",
    tone: "sky",
    tagline: "Every child deserves to learn, and to own the books they learn from.",
    intro:
      "Education is where much of our work begins. We get new books and educational supplies into the hands of out-of-school children, so that learning can start or continue wherever they are.",
    focus: [
      {
        title: "Books and supplies",
        text: "New books and learning materials for out-of-school children, starting with communities in Keffi and Gwagwalada.",
      },
      {
        title: "A love of reading",
        text: "Our book drives put stories children can keep into their hands.",
      },
      {
        title: "Working with communities",
        text: "We work with local communities and partners to reach the children who need support most.",
      },
    ],
    relatedCauses: ["keffi-books", "gwagwalada-books"],
    image: photo("/images/programmes/education.jpg", "classroomPupils", "Children learning"),
  },
  {
    slug: "health",
    title: "Health",
    icon: "health",
    tone: "coral",
    tagline: "Healthy children are ready to learn, play and grow.",
    intro:
      "Good nutrition underpins everything else. Our health work supports vulnerable families with a healthy food supply, in line with the UN's Sustainable Development Goal 2: Zero Hunger.",
    focus: [
      {
        title: "Healthy food supply",
        text: "Supporting families in Gwagwalada with access to healthy food.",
      },
      {
        title: "Zero Hunger (SDG 2)",
        text: "Our food work contributes to the global goal of ending hunger.",
      },
      {
        title: "Humanitarian support",
        text: "Practical help for vulnerable communities when they need it.",
      },
    ],
    relatedCauses: ["gwagwalada-food"],
    image: photo("/images/programmes/health.jpg", "familyMeal", "A family sharing a meal"),
  },
  {
    slug: "skill-development",
    title: "Skill Development",
    icon: "skills",
    tone: "sun",
    tagline: "Practical skills open doors to self-reliance.",
    intro:
      "We help young people build practical skills and confidence, so they can grow towards self-reliance and support their families and communities.",
    focus: [
      {
        title: "Practical skills",
        text: "Hands-on learning that young people can put to work.",
      },
      {
        title: "Enterprise",
        text: "Encouraging young people to turn their skills into opportunities.",
      },
      {
        title: "Resilience",
        text: "Building the self-reliance that lasts beyond any single programme.",
      },
    ],
    relatedCauses: [],
    image: photo("/images/programmes/skills.jpg", "youthCircle", "Young people at a workshop"),
  },
  {
    slug: "sustainability",
    title: "Sustainability",
    icon: "sustainability",
    tone: "mint",
    tagline: "Clean water and lasting change, built with communities.",
    intro:
      "Sustainable development means change that lasts. Our sustainability work includes bringing portable, clean water to communities in Lokoja.",
    focus: [
      {
        title: "Clean water",
        text: "A portable, clean water supply for communities in Lokoja.",
      },
      {
        title: "Sustainable growth",
        text: "Programmes designed with communities so the benefits continue.",
      },
      {
        title: "Resilience",
        text: "Helping communities prepare for and recover from hardship.",
      },
    ],
    relatedCauses: ["lokoja-water"],
    image: photo(
      "/images/programmes/sustainability.jpg",
      "waterWalk",
      "Clean water being collected",
    ),
  },
  {
    slug: "community",
    title: "Community",
    icon: "community",
    tone: "lavender",
    tagline: "Communities lead. We walk alongside them.",
    intro:
      "We work hand in hand with local communities and partners. Programmes are shaped with the people they serve, which is how resilience and self-reliance take root.",
    focus: [
      {
        title: "Community-led",
        text: "Local voices shape what we do and how we do it.",
      },
      {
        title: "Partnerships",
        text: "We work with local organisations and businesses that share our goals.",
      },
      {
        title: "Volunteer network",
        text: "Volunteers give their time and skills to support our programmes.",
      },
    ],
    relatedCauses: [],
    image: photo("/images/programmes/community.jpg", "villageGathering", "A community gathering"),
  },
  {
    slug: "mentorship",
    title: "Mentorship",
    icon: "mentorship",
    tone: "accent",
    tagline: "One caring adult can change a child's story.",
    intro:
      "Our mentorship programme offers children structured mentoring: a trusted adult who encourages them, listens and helps them see what is possible.",
    focus: [
      {
        title: "Structured mentoring",
        text: "Mentoring with clear goals, so children and mentors know what to expect.",
      },
      {
        title: "Encouragement",
        text: "Helping children build the confidence to learn and dream big.",
      },
      {
        title: "Become a mentor",
        text: "We welcome caring adults who want to give their time.",
      },
    ],
    relatedCauses: [],
    image: photo(
      "/images/programmes/mentorship.jpg",
      "mentorLaptop",
      "A mentor guiding a young person",
    ),
  },
];

export function findFocusArea(slug: string): FocusAreaPage | undefined {
  return FOCUS_AREA_PAGES.find((a) => a.slug === slug);
}

/**
 * Titles for cross-links to /causes. DUPLICATED from the causes slice on purpose (features don't
 * import each other, ARCHITECTURE §9.2) — keep both copies in step.
 */
export const CAUSE_LINK_TITLES: Record<CauseSlug, { title: string; location: string }> = {
  "keffi-books": { title: "Books for children in Keffi", location: "Keffi" },
  "gwagwalada-books": { title: "Books for children in Gwagwalada", location: "Gwagwalada" },
  "gwagwalada-food": { title: "Healthy food for families in Gwagwalada", location: "Gwagwalada" },
  "lokoja-water": { title: "Clean water for Lokoja", location: "Lokoja" },
};
