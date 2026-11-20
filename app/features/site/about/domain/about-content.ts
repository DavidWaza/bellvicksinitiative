import { photo } from "~/shared/photos";
import { sample } from "~/shared/sample-content";
import { isReal, TODO_CONTENT, type Content } from "~/shared/todo-content";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

/**
 * About-page content. Facts come from the current bellvicksinitiative.org only. Team names and the
 * CAC registration number are TODO_CONTENT — never invent them.
 * (Values and partners are DUPLICATED from the home slice on purpose — keep both in step.)
 */
export const ABOUT = {
  mission:
    "Improving the lives of disadvantaged children, youth and vulnerable communities through sustainable development programmes and humanitarian support, working with local communities and partners to build resilience, self-reliance and sustainable growth.",
  vision:
    "A world where every child and vulnerable person has access to education, opportunity and the resources they need to thrive.",
  story: [
    "Bellvicks Global Aid Initiative (BGAI) has worked with communities across Nigeria since 2018. From our base in Abuja, we support disadvantaged children, youth and vulnerable communities with education, health, skills, clean water and mentorship.",
    "We believe lasting change is built with communities, not for them. That's why we work alongside local communities and partners, and why our programmes aim for resilience and self-reliance rather than dependence.",
  ],
  heroImage: photo("/images/about/hero.jpg", "girlReadingToClass", "Children learning together"),
  storyImage: photo("/images/about/story.jpg", "boyWithPencil", "Children in a classroom"),
  /** CAC registration number. Shown only once real. */
  registrationNumber: TODO_CONTENT as Content<string>,
};

export const VALUES: { title: string; text: string; icon: IconName; tone: Tone }[] = [
  {
    title: "Transparent",
    text: "We are open about where support goes and what it achieves.",
    icon: "transparent",
    tone: "sky",
  },
  {
    title: "Accountable",
    text: "We answer to the children, families and partners we serve.",
    icon: "accountable",
    tone: "mint",
  },
  {
    title: "Community-led",
    text: "Local communities help shape every programme we run.",
    icon: "community",
    tone: "coral",
  },
  {
    title: "Lasting impact",
    text: "Sustainable programmes that build resilience and self-reliance.",
    icon: "impact",
    tone: "sun",
  },
];

export const PARTNERS: { name: string; logo?: string }[] = [
  { name: "Auto Credit", logo: "/partners/auto-credit" },
  { name: "Ville Infinity Homes", logo: "/partners/ville-infinity-homes" },
  { name: "Alliance Hospital Abuja", logo: "/partners/alliance-hospital" },
  { name: "Birthright Properties", logo: "/partners/birthright-properties" },
];

export interface TeamMember {
  id: string;
  name: Content<string>;
  role: Content<string>;
}

export const TEAM: TeamMember[] = [
  // SAMPLE names (shared/sample-content.ts): replace with the real team before launch.
  { id: "t1", name: sample("Victoria Bello"), role: sample("Founder & Executive Director") },
  { id: "t2", name: sample("Emeka Okafor"), role: sample("Programmes Lead") },
  { id: "t3", name: sample("Aisha Yusuf"), role: sample("Volunteer Coordinator") },
  { id: "t4", name: sample("Tobi Adeleke"), role: sample("Partnerships & Fundraising") },
];

/** hasRealContent for the team section (hidden in production until names exist). */
export const hasTeam = (showPlaceholders: boolean) =>
  showPlaceholders || TEAM.some((m) => isReal(m.name));
