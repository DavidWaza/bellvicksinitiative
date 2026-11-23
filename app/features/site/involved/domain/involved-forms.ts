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
    blurb: "Give your time and skills to our programmes and events in Nigeria and beyond.",
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
    blurb: "Organisations, individuals and agencies: help us reach more communities, together.",
    expect: [
      "Fund or co-deliver a cause",
      "Give in kind: goods, services, time or expertise, whatever you can offer",
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

/** The two ways to volunteer (Bellvicks' own split): hands-on help, or teaching others. */
export const VOLUNTEER_ROLES: {
  value: string;
  label: string;
  description: string;
  icon: IconName;
  tone: Tone;
}[] = [
  {
    value: "hands-on",
    label: "Lend a hand",
    description: "Be there in person at book drives, food and water distributions and events.",
    icon: "volunteer",
    tone: "coral",
  },
  {
    value: "teach",
    label: "Teach and inspire",
    description: "Share what you know with children and young people, and help shape their future.",
    icon: "education",
    tone: "sky",
  },
];

/** Who is partnering. Organisations and agencies give their name; individuals their title. */
export const PARTNER_KINDS = [
  { value: "organisation", label: "Organisation" },
  { value: "individual", label: "Individual" },
  { value: "agency", label: "Agency" },
];

/** How an individual partner is addressed. */
export const PERSON_TITLES = [
  "Mr",
  "Mrs",
  "Ms",
  "Miss",
  "Dr",
  "Prof",
  "Chief",
  "Engr",
  "Barr",
  "Rev",
  "Alhaji",
  "Hajia",
].map((t) => ({ value: t, label: t }));

export const PARTNERSHIP_TYPES = [
  { value: "funding", label: "Funding a cause" },
  { value: "in-kind", label: "A kind support" },
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
  role: yup
    .string()
    .oneOf(
      VOLUNTEER_ROLES.map((r) => r.value),
      "Choose how you'd like to volunteer.",
    )
    .required("Choose how you'd like to volunteer."),
  availability: yup.string().required("Choose when you're available."),
  skills: yup.string().trim().max(1000).default(""),
  /** Also add them to the newsletter (an opt-in tick box, off by default). */
  newsletter: yup.boolean().default(false),
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
  partnerKind: yup
    .string()
    .oneOf(
      PARTNER_KINDS.map((k) => k.value),
      "Choose who is partnering with us.",
    )
    .required("Choose who is partnering with us."),
  /** Individuals: Mr, Mrs, Dr… */
  title: yup
    .string()
    .default("")
    .when("partnerKind", ([kind], s) =>
      kind === "individual" ? s.required("Choose your title.") : s,
    ),
  /** Organisations and agencies: their name. */
  organisation: yup
    .string()
    .trim()
    .default("")
    .when("partnerKind", ([kind], s) =>
      kind === "individual" ? s : s.required("Please enter the name."),
    ),
  /** Organisations and agencies: the contact's role there. */
  jobTitle: yup.string().trim().max(120).default(""),
  name,
  email,
  phone,
  partnershipType: yup.string().required("Choose a type of partnership."),
  message: yup.string().trim().max(2000).default(""),
});

export type VolunteerApplication = yup.InferType<typeof volunteerSchema>;
export type MentorApplication = yup.InferType<typeof mentorSchema>;
export type PartnerEnquiry = yup.InferType<typeof partnerSchema>;
