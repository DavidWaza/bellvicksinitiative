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
  /** Optional long-form copy supplied by Bellvicks, shown in its own section. */
  story?: { heading: string; paragraphs: string[]; closing: string };
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
    // Long-form copy: describes only the work listed above (no invented figures or activities).
    story: {
      heading: "Opening Doors Through Learning",
      paragraphs: [
        "At Bellvicks Global Aid Initiative, we believe every child deserves the chance to learn, whatever their circumstances. Education opens doors to opportunity, confidence and a better future, yet too many children are out of school or learning without the basic tools they need.",
        "Our education work puts new books and learning materials into the hands of out-of-school children, starting with communities in Keffi and Gwagwalada. We work alongside families, local leaders, volunteers and partners to understand what children need, and to make learning possible wherever they are.",
        "Through book drives, educational supplies and community partnerships, we aim to spark a love of reading and help children start, continue and enjoy their education.",
        "Every book placed in a child's hands is a step towards a stronger, more hopeful future.",
      ],
      closing: "Because when a child learns, a whole community grows.",
    },
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
    // Long-form copy: describes only the work listed above (no invented figures or activities).
    story: {
      heading: "Healthy Children, Thriving Families",
      paragraphs: [
        "At Bellvicks Global Aid Initiative, we believe good health is the foundation for everything else. A well-nourished child is ready to learn, play and grow, and a healthy family is better able to face life's challenges.",
        "Our health work focuses on nutrition, supporting vulnerable families in Gwagwalada with access to a healthy food supply. It is part of our commitment to the UN's Sustainable Development Goal 2: Zero Hunger.",
        "Working with local communities, volunteers and partners, we provide practical humanitarian support to individuals and families when they need it most, and help build the conditions for healthier lives.",
        "Together, we are working towards a future where no child goes hungry and every family has the strength to thrive.",
      ],
      closing: "Because every child deserves the strength to grow and the energy to dream.",
    },
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
    // Long-form copy: describes only the work listed above (no invented figures or activities).
    story: {
      heading: "Skills for a Self-Reliant Future",
      paragraphs: [
        "At Bellvicks Global Aid Initiative, we believe young people have enormous potential, and that the right skills can turn that potential into opportunity. Practical skills build confidence, open doors to work and enterprise, and help young people support themselves and their families.",
        "Our skill development work focuses on hands-on learning that young people can put to use straight away. We encourage them to turn what they learn into real opportunities and to grow, step by step, towards self-reliance.",
        "Working alongside communities, volunteers and partners, we aim to build resilience and independence that last long beyond any single programme.",
        "Together, we are helping young people move from potential to purpose.",
      ],
      closing:
        "Because when young people are equipped, they build futures for themselves and for others.",
    },
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
    // Long-form copy: describes only the work listed above (no invented figures or activities).
    story: {
      heading: "Lasting Change, Built Together",
      paragraphs: [
        "At Bellvicks Global Aid Initiative, we believe real progress is progress that lasts. Sustainable development means meeting today's needs in ways that keep benefiting communities for years to come.",
        "Our sustainability work includes bringing a portable, clean water supply to communities in Lokoja. Clean water protects health, saves time and gives families, especially children, the chance to focus on learning and growing.",
        "We design our work with communities, not just for them, so that the benefits continue after a project ends, and so that communities are better prepared to face and recover from hardship.",
        "Together, we are building foundations that future generations can stand on.",
      ],
      closing: "Because the best change is the kind that keeps on giving.",
    },
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
    // Supplied by Bellvicks.
    story: {
      heading: "Building Stronger Communities Together",
      paragraphs: [
        "At Bellvicks Global Aid Initiative, we believe that thriving communities are the foundation of a better future. Through our community-focused programs, we work alongside local leaders, families, volunteers, and partner organizations to identify needs, strengthen social connections, and create sustainable solutions that improve lives.",
        "Our community activities are designed to promote inclusion, empowerment, and collective development. We support initiatives that foster social cohesion, provide relief to vulnerable individuals and families, encourage volunteerism, and create opportunities for people to actively participate in shaping the future of their communities.",
        "Through outreach programs, community engagement projects, awareness campaigns, support services, and strategic partnerships, we strive to build resilient communities where every individual has the opportunity to thrive.",
        "Together, we are creating environments where hope is restored, opportunities are expanded, and lasting impact is achieved.",
      ],
      closing: "Because when communities grow stronger, everyone benefits.",
    },
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
    // Long-form copy: describes only the work listed above (no invented figures or activities).
    story: {
      heading: "Guiding Young Lives, One Relationship at a Time",
      paragraphs: [
        "At Bellvicks Global Aid Initiative, we believe one caring adult can change a child's story. A mentor who listens, encourages and believes in a child can help them see what is possible, and find the confidence to pursue it.",
        "Our mentorship programme offers children structured mentoring, with clear goals so that children and mentors both know what to expect. Mentors encourage learning, support personal growth and help children dream big.",
        "We welcome caring adults who want to give their time, and the Bellvicks team supports every mentor throughout, so that each mentoring relationship is safe, positive and meaningful.",
        "Together, we are raising a generation of children who know that someone believes in them.",
      ],
      closing: "Because every child deserves someone in their corner.",
    },
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
