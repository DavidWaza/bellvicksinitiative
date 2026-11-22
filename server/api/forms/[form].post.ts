import { object, string, type AnyObjectSchema } from "yup";
import { VOLUNTEER_INTERESTS } from "../../../app/features/site/home/domain/home-types";
import {
  contactSchema,
  CONTACT_TOPICS,
} from "../../../app/features/site/contact/domain/contact-types";
import {
  AVAILABILITY_OPTIONS,
  mentorSchema,
  partnerSchema,
  volunteerSchema,
} from "../../../app/features/site/involved/domain/involved-forms";
import {
  DONATION_TARGETS,
  pledgeSchema,
} from "../../../app/features/site/donate/domain/donate-types";
import { newsletterSchema } from "../../../app/features/site/newsletter/domain/newsletter-types";

/**
 * POST /api/forms/:form — emails a website form to the CONTACT inbox (NUXT_CONTACT_EMAIL).
 * Forms: contact, volunteer, mentor, partner, pledge, newsletter, interest (homepage sheet). Each is validated here with the
 * same schema the browser uses (never trust the browser). Storybook emails go to the storybook
 * inbox instead (server/api/storybook/*).
 */
const label = (options: { value: string; label: string }[], value: unknown) =>
  options.find((o) => o.value === value)?.label ?? String(value ?? "");

type Builder = (v: Record<string, unknown>) => Omit<SiteEmail, "inbox">;

const FORMS: Record<string, { schema: AnyObjectSchema; email: Builder }> = {
  contact: {
    schema: contactSchema,
    email: (v) => ({
      subject: `Contact form: ${label(CONTACT_TOPICS, v.topic)} from ${v.name}`,
      title: "New message from the contact form",
      replyTo: String(v.email),
      fields: [
        ["Name", String(v.name)],
        ["Email", String(v.email)],
        ["Topic", label(CONTACT_TOPICS, v.topic)],
        ["Message", String(v.message)],
      ],
    }),
  },
  volunteer: {
    schema: volunteerSchema,
    email: (v) => ({
      subject: `Volunteer application from ${v.name}`,
      title: "New volunteer application",
      replyTo: String(v.email),
      fields: [
        ["Name", String(v.name)],
        ["Email", String(v.email)],
        ["Phone", v.phone as string],
        ["Location", v.location as string],
        ["Availability", label(AVAILABILITY_OPTIONS, v.availability)],
        ["Skills", v.skills as string],
      ],
    }),
  },
  mentor: {
    schema: mentorSchema,
    email: (v) => ({
      subject: `Mentor application from ${v.name}`,
      title: "New mentor application",
      replyTo: String(v.email),
      fields: Object.entries(v).map(([k, val]) => [titleCaseKey(k), val as string]),
    }),
  },
  partner: {
    schema: partnerSchema,
    email: (v) => ({
      subject: `Partnership enquiry from ${v.organisation}`,
      title: "New partnership enquiry",
      replyTo: String(v.email),
      fields: Object.entries(v).map(([k, val]) => [titleCaseKey(k), val as string]),
    }),
  },
  pledge: {
    schema: pledgeSchema,
    email: (v) => ({
      subject: `Donation pledge from ${v.name}`,
      title: "New donation pledge (no payment taken)",
      replyTo: String(v.email),
      fields: [
        ["Name", String(v.name)],
        ["Email", String(v.email)],
        ["Cause", label(DONATION_TARGETS, v.target)],
        ["Amount", `${v.currency} ${Number(v.amount).toLocaleString("en-NG")}`],
        ["Frequency", v.frequency === "monthly" ? "Monthly" : "One-off"],
      ],
    }),
  },
  // The homepage "Join our volunteer network" sheet.
  interest: {
    schema: object({
      name: string().trim().required("Please tell us your name.").max(80),
      email: string()
        .trim()
        .email("Enter a valid email address.")
        .required("Please enter your email."),
      phone: string().trim().max(20).default(""),
      interest: string()
        .oneOf([...VOLUNTEER_INTERESTS])
        .required("Choose how you'd like to help."),
    }),
    email: (v) => ({
      subject: `Get involved: ${v.interest} (${v.name})`,
      title: "New sign-up from the homepage",
      replyTo: String(v.email),
      fields: [
        ["Name", String(v.name)],
        ["Email", String(v.email)],
        ["Phone", v.phone as string],
        ["Interested in", String(v.interest)],
      ],
    }),
  },
  newsletter: {
    schema: newsletterSchema,
    email: (v) => ({
      subject: `Newsletter sign-up: ${v.email}`,
      title: "New newsletter subscriber",
      replyTo: String(v.email),
      fields: [["Email", String(v.email)]],
    }),
  },
};

/** "partnershipType" → "Partnership type". */
function titleCaseKey(key: string) {
  const words = key.replace(/([A-Z])/g, " $1").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default defineEventHandler(async (event) => {
  const form = FORMS[getRouterParam(event, "form") ?? ""];
  if (!form) return apiFail("Unknown form.");

  let values: Record<string, unknown>;
  try {
    values = await form.schema.validate(await readBody(event), { stripUnknown: true });
  } catch (e) {
    return apiFail(e instanceof Error ? e.message : "Please check the form.");
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  if (!(await underFormLimit(ip)))
    return apiFail("You've sent several forms in a short time. Please try again in an hour.");

  try {
    await sendSiteEmail({ inbox: "contact", ...form.email(values) });
  } catch (e) {
    // oxlint-disable-next-line no-console
    console.error(
      "[form email]",
      getRouterParam(event, "form"),
      (e as { data?: unknown })?.data ?? e,
    );
    return apiFail(
      "We couldn't send this just now. Please try again, or email us at info@bellvicksinitiative.org.",
    );
  }
  return { status: true as const, message: "", data: { received: true as const } };
});
