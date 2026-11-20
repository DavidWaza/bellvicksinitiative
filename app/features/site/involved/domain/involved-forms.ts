import * as yup from "yup";
import { ROUTES } from "~/shared/site-routes";
import type { IconName } from "~/utils/icons";
import type { Tone } from "~/utils/tones";

/**
 * The three ways to get involved, and the form behind each. Schemas live in the domain so the
 * future backend can mirror them; the UI only renders them.
 */
export type ApplicationKind = "volunteer" | "mentor" | "partner";

export interface InvolvementWay {
  kind: ApplicationKind;
  title: string;
  href: string;
  icon: IconName;
  tone: Tone;
  blurb: string;
  /** Bulleted "what to expect", honest and non-specific. */
  expect: string[];
}

export const INVOLVEMENT_WAYS: InvolvementWay[] = [
  {
    kind: "volunteer",
    title: "Volunteer",
    href: ROUTES.volunteer,
    icon: "volunteer",
    tone: "coral",
    blurb: "Give your time and skills to our programmes and events in Abuja and beyond.",
    expect: [
      "Join our volunteer network and hear about opportunities first",
      "Help at book drives, food and water distributions and events",
      "Share professional skills, from teaching to photography",
    ],
  },
  {
    kind: "mentor",
    title: "Become a mentor",
    href: ROUTES.becomeMentor,
    icon: "mentorship",
    tone: "sky",
    blurb: "Be the caring adult who encourages a child to learn and dream big.",
    expect: [
      "Structured mentoring with clear goals",
      "Support from the Bellvicks team throughout",
      "We'll talk with you first about safeguarding and fit",
    ],
  },
  {
    kind: "partner",
    title: "Partner with us",
    href: ROUTES.partner,
    icon: "partner",
    tone: "sun",
    blurb: "Organisations and businesses: help us reach more communities, together.",
    expect: [
      "Fund or co-deliver a cause",
      "Give in kind: books, supplies, venues or expertise",
      "Join partners such as Auto Credit, Ville Infinity Homes, Alliance Hospital Abuja and Birthright Properties",
    ],
  },
];

export function findWay(kind: ApplicationKind): InvolvementWay {
  return INVOLVEMENT_WAYS.find((w) => w.kind === kind)!;
}

export const AVAILABILITY_OPTIONS = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "flexible", label: "Flexible" },
];

export const PARTNERSHIP_TYPES = [
  { value: "funding", label: "Funding a cause" },
  { value: "in-kind", label: "In-kind support" },
  { value: "programme", label: "Co-delivering a programme" },
  { value: "other", label: "Something else" },
];

const phone = yup
  .string()
  .trim()
  .default("")
  .matches(/^[+()\d\s-]{7,20}$/, {
    excludeEmptyString: true,
    message: "Enter a valid phone number.",
  });
const name = yup.string().trim().required("Please tell us your name.");
const email = yup
  .string()
  .trim()
  .email("Enter a valid email address.")
  .required("Please enter your email.");

export const volunteerSchema = yup.object({
  name,
  email,
  phone,
  location: yup.string().trim().default(""),
  availability: yup.string().required("Choose when you're available."),
  skills: yup.string().trim().max(1000).default(""),
});

export const mentorSchema = yup.object({
  name,
  email,
  phone,
  occupation: yup.string().trim().required("Please tell us what you do."),
  motivation: yup
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters).")
    .max(1500)
    .required("Please tell us why you'd like to mentor."),
});

export const partnerSchema = yup.object({
  organisation: yup.string().trim().required("Please enter your organisation's name."),
  name,
  email,
  phone,
  partnershipType: yup.string().required("Choose a type of partnership."),
  message: yup.string().trim().max(2000).default(""),
});

export type VolunteerApplication = yup.InferType<typeof volunteerSchema>;
export type MentorApplication = yup.InferType<typeof mentorSchema>;
export type PartnerEnquiry = yup.InferType<typeof partnerSchema>;
