import { ROUTES } from "~/shared/site-routes";
import { sample } from "~/shared/sample-content";
import type { HomeContent } from "../../domain/home-types";
import { photo } from "~/shared/photos";

/**
 * Homepage copy — the single typed content module. Real facts come from the current
 * bellvicksinitiative.org. Impact figures, amounts raised/goal, cause status, the story, news and
 * testimonials are INVENTED demo values wrapped in sample()
 * (shared/sample-content.ts). Replace each with the real value, or TODO_CONTENT, before launch.
 */
export const HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: "Bellvicks Global Aid Initiative",
    headlineLead: "The future we want to see in",
    highlight: "Africa",
    headlineTail: ".",
    supporting:
      "A world where every child and vulnerable person has access to education, opportunity and the resources they need to thrive.",
    image: photo(
      "/images/home/hero-child.jpg",
      "girlSmiling",
      "A smiling child looking at the camera",
    ),
  },

  partners: [
    { name: "Auto Credit", logo: "/partners/auto-credit" },
    { name: "Ville Infinity Homes", logo: "/partners/ville-infinity-homes" },
    { name: "Alliance Hospital Abuja", logo: "/partners/alliance-hospital" },
    { name: "Birthright Properties", logo: "/partners/birthright-properties" },
  ],

  values: [
    {
      id: "transparent",
      title: "Transparent",
      description: "We are open about where support goes and what it achieves.",
      icon: "transparent",
      tone: "sky",
    },
    {
      id: "accountable",
      title: "Accountable",
      description: "We answer to the children, families and partners we serve.",
      icon: "accountable",
      tone: "mint",
    },
    {
      id: "community-led",
      title: "Community-led",
      description: "Local communities help shape every programme we run.",
      icon: "community",
      tone: "coral",
    },
    {
      id: "lasting-impact",
      title: "Lasting impact",
      description: "Sustainable programmes that build resilience and self-reliance.",
      icon: "impact",
      tone: "sun",
    },
  ],

  impact: [
    {
      id: "children",
      label: "Children reached",
      icon: "education",
      value: sample(2400),
      suffix: "+",
    },
    {
      id: "communities",
      label: "Communities served",
      icon: "community",
      value: sample(18),
      suffix: "+",
    },
    { id: "volunteers", label: "Volunteers", icon: "volunteer", value: sample(120), suffix: "+" },
    { id: "books", label: "Books delivered", icon: "books", value: sample(5000), suffix: "+" },
  ],

  about: {
    heading: "Empowering communities.",
    highlight: "Inspiring change.",
    mission:
      "Improving the lives of disadvantaged children, youth and vulnerable communities through sustainable development programmes and humanitarian support, working with local communities and partners to build resilience, self-reliance and sustainable growth.",
    checklist: [
      "Education for every child",
      "Health and nutrition",
      "Skills and enterprise",
      "Clean water and sustainability",
    ],
    mainImage: photo(
      "/images/home/about-main.jpg",
      "girlReadingToClass",
      "Children learning together in a classroom",
    ),
    smallImages: [
      photo("/images/home/about-small-1.jpg", "boysInUniform", "Volunteers with children"),
      photo("/images/home/about-small-2.jpg", "girlInAnkara", "A child holding a book"),
    ],
  },

  programmes: [
    {
      slug: "education",
      title: "Education",
      line: "Books and learning supplies for out-of-school children.",
      href: ROUTES.education,
      icon: "education",
      tone: "sky",
      image: photo("/images/home/programme-education.jpg", "classroomPupils", "A child reading"),
    },
    {
      slug: "health",
      title: "Health",
      line: "Healthy food and care for vulnerable families.",
      href: ROUTES.health,
      icon: "health",
      tone: "coral",
      image: photo("/images/home/programme-health.jpg", "familyMeal", "A family sharing a meal"),
    },
    {
      slug: "skill-development",
      title: "Skill Development",
      line: "Practical skills and enterprise for young people.",
      href: ROUTES.skillDevelopment,
      icon: "skills",
      tone: "sun",
      image: photo(
        "/images/home/programme-skills.jpg",
        "youthCircle",
        "A young person learning a trade",
      ),
    },
    {
      slug: "sustainability",
      title: "Sustainability",
      line: "Clean water and resilience that lasts.",
      href: ROUTES.sustainability,
      icon: "sustainability",
      tone: "mint",
      image: photo(
        "/images/home/programme-sustainability.jpg",
        "waterWalk",
        "Children collecting clean water",
      ),
    },
    {
      slug: "community",
      title: "Community",
      line: "Programmes built with local communities and partners.",
      href: ROUTES.community,
      icon: "community",
      tone: "lavender",
      image: photo(
        "/images/home/programme-community.jpg",
        "villageGathering",
        "Community members gathered together",
      ),
    },
  ],

  booksTeaser: {
    copy: "Tell us your child's name, age and favourite things, add a photo, and we'll write three brand-new adventures starring them. Pick the ones you love and we'll print them as keepsake books.",
    ageBands: ["Ages 1–12", "3 stories to choose from", "Your own dedication"],
  },

  causes: [
    {
      id: "keffi-books",
      title: "Books for children in Keffi",
      location: "Keffi",
      summary: "New educational supplies for out-of-school children.",
      status: sample("active"),
      raised: sample(1250000),
      goal: sample(2000000),
      currency: "NGN",
      image: photo(
        "/images/home/cause-keffi-books.jpg",
        "childrenWithBooks",
        "Children with new books in Keffi",
      ),
    },
    {
      id: "gwagwalada-books",
      title: "Books for children in Gwagwalada",
      location: "Gwagwalada",
      summary: "New educational supplies for out-of-school children.",
      status: sample("closing_soon"),
      raised: sample(1320000),
      goal: sample(1500000),
      currency: "NGN",
      image: photo(
        "/images/home/cause-gwagwalada-books.jpg",
        "pupilsWriting",
        "Children with new books in Gwagwalada",
      ),
    },
    {
      id: "gwagwalada-food",
      title: "Healthy food for families in Gwagwalada",
      location: "Gwagwalada",
      summary: "A healthy food supply for the community.",
      tag: "SDG 2 · Zero Hunger",
      status: sample("funded"),
      raised: sample(1800000),
      goal: sample(1800000),
      currency: "NGN",
      image: photo(
        "/images/home/cause-gwagwalada-food.jpg",
        "familyPortraitMeal",
        "A meal being shared in Gwagwalada",
      ),
    },
    {
      id: "lokoja-water",
      title: "Clean water for Lokoja",
      location: "Lokoja",
      summary: "Portable, clean water supply for the community.",
      status: sample("active"),
      raised: sample(900000),
      goal: sample(3000000),
      currency: "NGN",
      image: photo(
        "/images/home/cause-lokoja-water.jpg",
        "waterWalk",
        "Clean water being collected in Lokoja",
      ),
    },
  ],

  story: {
    heading: "Small steps.",
    highlight: "Big dreams.",
    intro: sample(
      "When Halima joined our Keffi book drive she had never owned a book. Six months on, she reads to her younger brothers every evening.",
    ),
    quote: sample(
      "Now I read to my brothers every night. My favourite is the one with the red kite.",
    ),
    attribution: sample("Halima, 9, Keffi"),
    image: photo(
      "/images/home/story-child.jpg",
      "childrenWithBooks",
      "A child from our programmes",
    ),
  },

  involvedImage: photo(
    "/images/home/get-involved.jpg",
    "volunteers",
    "Bellvicks volunteers together",
  ),

  news: [
    {
      id: "news-1",
      title: sample("Book drive puts new books in 300 hands in Keffi"),
      category: sample("Education"),
      publishedAt: sample("2026-10-14"),
      image: photo("/images/home/news-1.jpg", "classroomNumbers", "News photo"),
    },
    {
      id: "news-2",
      title: sample("Volunteers pack healthy food for Gwagwalada families"),
      category: sample("Health"),
      publishedAt: sample("2026-09-02"),
      image: photo("/images/home/news-2.jpg", "teacherAndStudents", "News photo"),
    },
    {
      id: "news-3",
      title: sample("Lokoja community plans its new clean water point"),
      category: sample("Sustainability"),
      publishedAt: sample("2026-07-21"),
      image: photo("/images/home/news-3.jpg", "villageGathering", "News photo"),
    },
  ],

  testimonials: [
    {
      id: "t-1",
      quote: sample(
        "Volunteering at the Keffi book drive was the best Saturday of my year. Watching a child choose their very first book is unforgettable.",
      ),
      name: sample("Chiamaka O."),
      role: sample("Volunteer, Abuja"),
    },
    {
      id: "t-2",
      quote: sample(
        "Bellvicks listened to us before anything was built. The water project belongs to our community.",
      ),
      name: sample("Musa A."),
      role: sample("Community leader, Lokoja"),
    },
    {
      id: "t-3",
      quote: sample(
        "We can see exactly where our support goes. That openness is why we keep giving.",
      ),
      name: sample("Funmi A."),
      role: sample("Monthly donor"),
    },
  ],
};
