import {
  DISCLAIMER,
  GENDERS,
  PAYMENT_MODELS,
  RECIPIENT_NOTE,
  RECIPIENT_UPLOADS,
  RELATIONSHIPS,
  SCHOOL_FEE_PER_TERM_NGN,
  SCHOOL_ITEMS,
  SCHOOL_TYPES,
  SPONSOR_KINDS,
  SPONSOR_YEARS,
  recipientSchema,
  schoolConfirmation,
  schoolItemsCost,
  sponsorDeclaration,
  sponsorSchema,
  witnessConfirmation,
  type RecipientApplication,
  type SponsorApplication,
} from "../../../app/features/site/sponsorship/domain/sponsorship-forms";
import type { EmailAttachment, SiteEmail } from "../../utils/email";

/**
 * POST /api/sponsorship/sponsor | recipient — Back to School applications (the digitised paper
 * forms). multipart/form-data: `data` (JSON, validated with the same yup schema as the browser)
 * plus photos by field name. Emailed to the CONTACT inbox with the photos attached, a reference
 * number (the paper form's "No.") and, for recipients, a blank "For official use only" box.
 */
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
/** Vercel accepts at most 4.5 MB per request; the browser shrinks photos first. */
const MAX_FILE = 2.5 * 1024 * 1024;
const MAX_TOTAL = 4.2 * 1024 * 1024;

type Rows = SiteEmail["fields"];
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const label = (options: { value: string; label: string }[], value: unknown) =>
  options.find((o) => o.value === value)?.label ?? String(value ?? "");
const heading = (title: string): Rows[number] => [title, "", "heading"];
const today = () =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Africa/Lagos" }).format(
    new Date(),
  );
const reference = (prefix: string) =>
  `BGAI-${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`;
const signed = (name: string) => `${name} (typed signature) · ${today()}`;

function sponsorEmail(v: SponsorApplication, ref: string, photoAttached: boolean) {
  const items = SCHOOL_ITEMS.filter((i) => v.schoolItems.includes(i.id));
  const perChild = schoolItemsCost(v.schoolItems);
  const who = v.sponsorKind === "organisation" ? `${v.organisation} (${v.name})` : v.name;
  const fields: Rows = [
    ["Application no.", ref],
    heading("Sponsor's details"),
    ["Sponsoring", label(SPONSOR_KINDS, v.sponsorKind)],
    ["Name", v.name],
    ["Organisation", v.organisation],
    ["Nationality", v.nationality],
    ["State of origin", v.stateOfOrigin],
    ["Local Govt. Area", v.lga],
    ["Occupation", v.occupation],
    ["Office address", v.officeAddress],
    ["Phone", v.phone],
    ["Phone (2)", v.phone2],
    ["Email", v.email],
    ["Recent passport", photoAttached ? "Attached" : "Not provided (optional)"],
    heading("Declaration"),
    ["Agreed", sponsorDeclaration(v.name)],
    heading("Commitment"),
    ["Standard school fee", `${naira(SCHOOL_FEE_PER_TERM_NGN)} per term (BGAI standard rate)`],
    ["Number of children", String(v.numberOfChildren)],
    ["Number of years", label(SPONSOR_YEARS, v.years)],
    ["Payment model", label(PAYMENT_MODELS, v.paymentModel)],
    heading("Further commitment (yearly): child's school items"),
    [
      "Items ticked",
      items.length
        ? items
            .map((i) => `• ${i.label}${i.quantity ? ` (${i.quantity})` : ""}: ${naira(i.cost)}`)
            .join("\n")
        : "None",
    ],
    [
      "School items total",
      items.length
        ? `${naira(perChild)} per child per year × ${v.numberOfChildren} = ${naira(perChild * v.numberOfChildren)} per year`
        : "",
    ],
    heading("Signature"),
    ["Signed", signed(v.signature)],
  ];
  return {
    subject: `Back to School: sponsor application ${ref} from ${who}`,
    title: "New sponsor's application (Back to School)",
    replyTo: v.email,
    fields,
  };
}

function recipientEmail(v: RecipientApplication, ref: string, attached: Set<string>) {
  const yesNo = (id: string) => (attached.has(id) ? "Yes (attached)" : "No");
  const fields: Rows = [
    ["Application no.", ref],
    heading("School information"),
    ["Name of school", v.schoolName],
    ["Name of principal", v.principalName],
    ["Phone", v.schoolPhone],
    ["Phone (2)", v.schoolPhone2],
    ["School address", v.schoolAddress],
    ["State", v.schoolState],
    ["Email", v.schoolEmail],
    ["Type of school", label(SCHOOL_TYPES, v.schoolType)],
    [
      "School's confirmation",
      `${schoolConfirmation(v.schoolConfirmName)}\n${signed(v.schoolConfirmName)}`,
    ],
    heading("Child's information"),
    ["Name of child", v.childName],
    ["Gender", label(GENDERS, v.childGender)],
    ["Age", String(v.childAge)],
    ["Class / grade", v.classGrade],
    ["State of origin", v.childStateOfOrigin],
    ["Local Gov't Area", v.childLga],
    ["State of residence", v.stateOfResidence],
    ["Birth certificate (photocopy) attached", yesNo("birthCertificate")],
    ["Educational profile (photocopy of result) attached", yesNo("results")],
    ["Phone no. (if any)", v.childPhone],
    ["Hobbies", v.hobbies],
    ["Recent passport", yesNo("childPassport")],
    heading("Parents / guardian's information"),
    ["Name", v.parentName],
    ["State of origin", v.parentStateOfOrigin],
    ["Local Govt. Area", v.parentLga],
    ["Permanent home address", v.permanentAddress],
    ["Phone", v.parentPhone],
    ["Phone (2)", v.parentPhone2],
    ["Email", v.parentEmail],
    ["Residential address", v.residentialAddress],
    ["Occupation", v.parentOccupation],
    ["Office address", v.parentOfficeAddress],
    [
      "Relationship with child",
      v.relationship === "other"
        ? `Others: ${v.relationshipOther}`
        : label(RELATIONSHIPS, v.relationship),
    ],
    ["Recent passport", yesNo("parentPassport")],
    heading("Disclaimer"),
    ["Accepted", `${DISCLAIMER.join("\n\n")}\n\nNote: ${RECIPIENT_NOTE}`],
    ["Signed (parent / guardian)", signed(v.parentSignature)],
    heading("Witness / next of kin"),
    ["Name", v.witnessName],
    ["Address", v.witnessAddress],
    ["Phone no.", v.witnessPhone],
    ["Relationship with parents/guardian", v.witnessRelationship],
    ["Confirmation", `${witnessConfirmation(v.witnessName)}\n${signed(v.witnessSignature)}`],
    heading("For official use only"),
    ["Assessment", "________________________________"],
    ["Approved / Decline", "☐ Approved     ☐ Decline"],
    ["Agent name", "________________________________"],
    ["Signature", "________________________________"],
    ["Date", "________________________________"],
  ];
  return {
    subject: `Back to School: recipient application ${ref} for ${v.childName} (${v.schoolName})`,
    title: "New recipient application (Back to School)",
    replyTo: v.parentEmail || undefined,
    fields,
  };
}

export default defineEventHandler(async (event) => {
  const form = getRouterParam(event, "form");
  if (form !== "sponsor" && form !== "recipient") return apiFail("Unknown form.");

  const parts = (await readMultipartFormData(event)) ?? [];
  let raw: unknown;
  try {
    raw = JSON.parse(parts.find((p) => p.name === "data")?.data.toString("utf8") ?? "");
  } catch {
    return apiFail("Some details were missing.");
  }

  // Photos: only the expected field names, only images, within the size limits.
  const expected =
    form === "sponsor" ? ["sponsorPassport"] : RECIPIENT_UPLOADS.map((u) => u.id as string);
  const files = parts.filter((p) => p.name && expected.includes(p.name) && p.data?.length);
  let total = 0;
  for (const f of files) {
    total += f.data.length;
    if (!f.type || !ALLOWED.has(f.type)) return apiFail("Photos must be JPG, PNG or WebP images.");
    if (f.data.length > MAX_FILE || total > MAX_TOTAL)
      return apiFail("The photos are too large. Please use smaller photos.");
  }
  const attached = new Set(files.map((f) => f.name!));
  if (form === "recipient") {
    const missing = RECIPIENT_UPLOADS.find((u) => u.required && !attached.has(u.id));
    if (missing) return apiFail(`Please add the ${missing.label.toLowerCase()}.`);
  }

  let email: Omit<SiteEmail, "inbox">;
  let ref: string;
  try {
    if (form === "sponsor") {
      const v = await sponsorSchema.validate(raw, { stripUnknown: true });
      ref = reference("SP");
      email = sponsorEmail(v, ref, attached.has("sponsorPassport"));
    } else {
      const v = await recipientSchema.validate(raw, { stripUnknown: true });
      ref = reference("RA");
      email = recipientEmail(v, ref, attached);
    }
  } catch (e) {
    return apiFail(e instanceof Error ? e.message : "Please check the form.");
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  if (!(await underFormLimit(ip)))
    return apiFail("You've sent several forms in a short time. Please try again in an hour.");

  const attachments: EmailAttachment[] = files.map((f) => ({
    filename: `${ref}-${f.name}.${f.type === "image/png" ? "png" : f.type === "image/webp" ? "webp" : "jpg"}`,
    content: f.data.toString("base64"),
  }));

  try {
    await sendSiteEmail({ inbox: "contact", ...email, attachments });
  } catch (e) {
    // oxlint-disable-next-line no-console
    console.error("[sponsorship email]", form, (e as { data?: unknown })?.data ?? e);
    return apiFail("We couldn't send your application just now. Please try again later.");
  }
  return { status: true as const, message: "", data: { received: true as const, reference: ref } };
});
