import type { ImageSlot } from "~/shared/image";
import type { Content } from "~/shared/todo-content";
import type { IconName } from "~/utils/icons";
import type { Currency } from "~/utils/format-money";
import type { CauseStatus } from "~/utils/status";
import type { Tone } from "~/utils/tones";

/**
 * Typed read models for the homepage. Causes and books here are THIS slice's own narrow
 * projections (ARCHITECTURE §7) — the future Causes and Books slices will own their own.
 * Every unknown fact is `Content<T>` and set to TODO_CONTENT; nothing is invented.
 */

export interface HomeHero {
  eyebrow: string;
  headlineLead: string;
  highlight: string;
  headlineTail: string;
  supporting: string;
  image: ImageSlot;
}

export interface HomePartner {
  name: string;
  /** Logo path without extension (e.g. /partners/auto-credit → .webp + .png). */
  logo?: string;
}

export interface HomeValue {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  tone: Tone;
}

export interface HomeImpactStat {
  id: string;
  label: string;
  icon: IconName;
  value: Content<number>;
  suffix?: string;
}

export interface HomeAbout {
  heading: string;
  highlight: string;
  mission: string;
  checklist: string[];
  mainImage: ImageSlot;
  smallImages: [ImageSlot, ImageSlot];
}

export interface HomeProgramme {
  slug: string;
  title: string;
  line: string;
  href: string;
  icon: IconName;
  tone: Tone;
  image: ImageSlot;
}

export interface HomeBooksTeaser {
  copy: string;
  ageBands: string[];
}

export type CauseLocation = "Keffi" | "Gwagwalada" | "Lokoja";

export interface HomeCause {
  id: string;
  title: string;
  location: CauseLocation;
  summary: string;
  /** e.g. "SDG 2 · Zero Hunger" */
  tag?: string;
  status: Content<CauseStatus>;
  raised: Content<number>;
  goal: Content<number>;
  currency: Currency;
  image: ImageSlot;
}

export interface HomeStory {
  heading: string;
  highlight: string;
  intro: Content<string>;
  quote: Content<string>;
  attribution: Content<string>;
  image: ImageSlot;
}

export interface HomeNewsPost {
  id: string;
  title: Content<string>;
  category: Content<string>;
  /** ISO date; formatted at the call site with formatDisplayDate. */
  publishedAt: Content<string>;
  image: ImageSlot;
}

export interface HomeTestimonial {
  id: string;
  quote: Content<string>;
  name: Content<string>;
  role: Content<string>;
}

export interface HomeContent {
  hero: HomeHero;
  partners: HomePartner[];
  values: HomeValue[];
  impact: HomeImpactStat[];
  about: HomeAbout;
  programmes: HomeProgramme[];
  booksTeaser: HomeBooksTeaser;
  causes: HomeCause[];
  story: HomeStory;
  involvedImage: ImageSlot;
  news: HomeNewsPost[];
  testimonials: HomeTestimonial[];
}

export const VOLUNTEER_INTERESTS = [
  "Volunteer",
  "Become a mentor",
  "Partner with us",
  "Not sure yet",
] as const;
export type VolunteerInterest = (typeof VOLUNTEER_INTERESTS)[number];

export interface VolunteerInterestInput {
  name: string;
  email: string;
  phone: string;
  interest: VolunteerInterest;
}
