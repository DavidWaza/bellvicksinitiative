import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";
import { ROUTES } from "~/shared/site-routes";

export interface FocusArea {
  slug: string;
  label: string;
  blurb: string;
  href: string;
  icon: IconName;
  tone: Tone;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    slug: "education",
    label: "Education",
    blurb: "Books and supplies for out-of-school children.",
    href: ROUTES.education,
    icon: "education",
    tone: "sky",
  },
  {
    slug: "health",
    label: "Health",
    blurb: "Healthy food and care for vulnerable families.",
    href: ROUTES.health,
    icon: "health",
    tone: "coral",
  },
  {
    slug: "skill-development",
    label: "Skill Development",
    blurb: "Practical skills and enterprise for young people.",
    href: ROUTES.skillDevelopment,
    icon: "skills",
    tone: "sun",
  },
  {
    slug: "sustainability",
    label: "Sustainability",
    blurb: "Clean water and resilience that lasts.",
    href: ROUTES.sustainability,
    icon: "sustainability",
    tone: "mint",
  },
  {
    slug: "community",
    label: "Community",
    blurb: "Programmes shaped with local communities.",
    href: ROUTES.community,
    icon: "community",
    tone: "lavender",
  },
  {
    slug: "mentorship",
    label: "Mentorship",
    blurb: "Structured mentoring for children.",
    href: ROUTES.mentorship,
    icon: "mentorship",
    tone: "accent",
  },
];

export interface NavLeaf {
  label: string;
  href: string;
  icon?: IconName;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  /** Present for dropdowns. `mega` renders the two-column focus-area panel. */
  children?: NavLeaf[];
  mega?: boolean;
  /** The signature "Create your storybook" entry. */
  featured?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: ROUTES.home },
  { id: "about", label: "About", href: ROUTES.about },
  {
    id: "what-we-do",
    label: "What We Do",
    href: ROUTES.whatWeDo,
    mega: true,
    children: FOCUS_AREAS.map((a) => ({ label: a.label, href: a.href, icon: a.icon })),
  },
  { id: "causes", label: "Causes", href: ROUTES.causes },
  { id: "storybook", label: "Create your storybook", href: ROUTES.storybook, featured: true },
  {
    id: "get-involved",
    label: "Get Involved",
    href: ROUTES.getInvolved,
    children: [
      { label: "Volunteer", href: ROUTES.volunteer, icon: "volunteer" },
      { label: "Become a Mentor", href: ROUTES.becomeMentor, icon: "mentorship" },
      { label: "Partner with us", href: ROUTES.partner, icon: "partner" },
    ],
  },
  {
    id: "back-to-school",
    label: "Back to School",
    href: ROUTES.backToSchool,
    children: [
      { label: "About the programme", href: ROUTES.backToSchool, icon: "education" },
      { label: "Sponsor a child", href: ROUTES.sponsorChild, icon: "sponsor" },
      { label: "Apply for sponsorship", href: ROUTES.applySponsorship, icon: "student" },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    href: ROUTES.shop,
    children: [
      { label: "Shop for yourself", href: ROUTES.shop, icon: "shoppingBag" },
      { label: "Give to a child", href: ROUTES.shopGive, icon: "heart" },
      { label: "Donate an item", href: ROUTES.shopDonateItem, icon: "gift" },
    ],
  },
  { id: "news", label: "News", href: ROUTES.news },
  { id: "contact", label: "Contact", href: ROUTES.contact },
];

export const FOOTER_QUICK_LINKS: NavLeaf[] = [
  { label: "About", href: ROUTES.about },
  { label: "Our causes", href: ROUTES.causes },
  { label: "Create your storybook", href: ROUTES.storybook },
  { label: "Get involved", href: ROUTES.getInvolved },
  { label: "Back to School", href: ROUTES.backToSchool },
  { label: "The Giving Shop", href: ROUTES.shop },
  { label: "News", href: ROUTES.news },
  { label: "Contact", href: ROUTES.contact },
];

/** The small featured card in the "What We Do" mega panel. Real cause, no invented figures. */
export const FEATURED_NAV_CAUSE = {
  eyebrow: "Featured cause",
  title: "Clean water for Lokoja",
  blurb: "Portable, clean water supply for communities in Lokoja.",
  href: `${ROUTES.causes}/lokoja-water`,
} as const;
