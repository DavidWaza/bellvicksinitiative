import * as yup from "yup";
import type { IconName } from "~/utils/icons";

/**
 * Back to School: BGAI's school-fee sponsorship, digitised from the paper "Sponsor's Application
 * Form" and "Recipient Application Form". Every field, option, price and statement on those forms
 * is here, worded as printed. The "For official use only" box is not shown to applicants; it is
 * added (blank) to the team's email instead (server/api/sponsorship/[form].post.ts).
 */
export type SponsorshipForm = "sponsor" | "recipient";

// ---------------------------------------------------------------------------------------------
// Statements printed on the forms
// ---------------------------------------------------------------------------------------------

export const BGAI_MOTTO =
  "We unequivocally believe every child should be given a chance at education to have a choice to determine their own future irrespective of where or to which parent they are born and to inspire in them an unyielding spirit of greatness.";

export const SPONSOR_APPRECIATION =
  "We sincerely appreciate your financial support which is to help curb illiteracy in our society.";

/** The sponsor's declaration; `name` fills the "I ……" blank. */
export const sponsorDeclaration = (name: string) =>
  `I, ${name || "……"}, understand that the purpose of this sponsorship is solely to help pay the child's school fees as the parent/guardian can not afford it at the moment. The child is not mine, the child is not to bear my name, the child is not to live with me and I do not have the right to visit the child without the prior knowledge of the parent/guardian, school authority and BGAI.`;

/** Confirmation under School Information (signed for the school). */
export const schoolConfirmation = (name: string) =>
  `I, ${name || "……"}, solemnly confirm that the information of the child provided is to the best of my knowledge true as verified by me.`;

export const DISCLAIMER = [
  "We only volunteer to help pay the child's school fees, the child's security and health is the responsibility of the parents/guardian.",
  "By signing this form, the parents/guardian confirm that all the information provided is true and do solemnly affirm to be implicated for legal charges if the information be found to be false.",
];

export const RECIPIENT_NOTE =
  "This assistance is NOT a right but a privilege. Filling this form does not guarantee automatic qualification.";

/** Confirmation by the witness / next of kin. */
export const witnessConfirmation = (name: string) =>
  `I, ${name || "……"}, solemnly confirm that the information of the child provided above is to the best of my knowledge true as verified by me.`;

// ---------------------------------------------------------------------------------------------
// Sponsor's commitment
// ---------------------------------------------------------------------------------------------

/** "BGAI standard rate of school fee per term". */
export const SCHOOL_FEE_PER_TERM_NGN = 25_000;

export const SPONSOR_KINDS = [
  { value: "organisation", label: "As organisation" },
  { value: "individual", label: "As individual" },
];

export const SPONSOR_YEARS = [
  { value: "1", label: "One year" },
  { value: "2", label: "Two years" },
  { value: "3", label: "Three years" },
  { value: "4", label: "Four years" },
  { value: "5", label: "Five years" },
  { value: "6", label: "Six years" },
];

export const PAYMENT_MODELS = [
  { value: "yearly", label: "Yearly instalment" },
  { value: "once", label: "At once" },
];

/** "Further commitment (yearly): child's school items", with quantity and cost per child. */
export const SCHOOL_ITEMS = [
  { id: "uniform", label: "School uniform", quantity: "2 pairs", cost: 5_000 },
  { id: "shoes", label: "School shoes", quantity: "1 pair", cost: 5_000 },
  { id: "socks", label: "School socks", quantity: "5 pairs", cost: 2_000 },
  { id: "bag", label: "School bag", quantity: "1", cost: 5_000 },
  { id: "notebooks", label: "School notebooks", quantity: "", cost: 5_000 },
  { id: "textbooks", label: "School textbooks", quantity: "", cost: 25_000 },
] as const;
export type SchoolItemId = (typeof SCHOOL_ITEMS)[number]["id"];

/** Yearly cost of the ticked items for ONE child. */
export function schoolItemsCost(ids: readonly string[]): number {
  return SCHOOL_ITEMS.filter((i) => ids.includes(i.id)).reduce((sum, i) => sum + i.cost, 0);
}

// ---------------------------------------------------------------------------------------------
// Recipient options
// ---------------------------------------------------------------------------------------------

export const SCHOOL_TYPES = [
  { value: "private", label: "Private school" },
  { value: "government", label: "Government school" },
];

export const GENDERS: { value: string; label: string; icon: IconName }[] = [
  { value: "male", label: "Male", icon: "genderMale" },
  { value: "female", label: "Female", icon: "genderFemale" },
];

export const RELATIONSHIPS = [
  { value: "father-mother", label: "Father / Mother" },
  { value: "uncle-aunt", label: "Uncle / Aunt" },
  { value: "brother-sister", label: "Brother / Sister" },
  { value: "other", label: "Others" },
];

/** Photo uploads on the recipient form. Passports are required; document copies optional. */
export const RECIPIENT_UPLOADS = [
  { id: "childPassport", label: "Child's recent passport photograph", required: true },
  { id: "birthCertificate", label: "Birth certificate (photocopy)", required: false },
  { id: "results", label: "Educational profile (photocopy of result)", required: false },
  { id: "parentPassport", label: "Parent / guardian's recent passport photograph", required: true },
] as const;
export type RecipientUploadId = (typeof RECIPIENT_UPLOADS)[number]["id"];

// ---------------------------------------------------------------------------------------------
// Schemas (the server validates with these too)
// ---------------------------------------------------------------------------------------------

const req = (message: string) => yup.string().trim().max(300).required(message);
const opt = () => yup.string().trim().max(300).default("");
const phone = (required: boolean) => {
  const s = yup
    .string()
    .trim()
    .default("")
    .matches(/^[+()\d\s-]{7,20}$/, {
      excludeEmptyString: true,
      message: "Enter a valid phone number.",
    });
  return required ? s.required("Enter a phone number.") : s;
};
const email = (required: boolean) => {
  const s = yup.string().trim().default("").email("Enter a valid email address.");
  return required ? s.required("Please enter an email address.") : s;
};
const mustAgree = (message: string) => yup.boolean().default(false).oneOf([true], message);
const signature = () =>
  yup.string().trim().max(120).required("Type your full name as your signature.");

export const sponsorSchema = yup.object({
  sponsorKind: yup
    .string()
    .oneOf(
      SPONSOR_KINDS.map((k) => k.value),
      "Choose organisation or individual.",
    )
    .required("Choose organisation or individual."),
  name: req("Please enter your name."),
  organisation: opt().when("sponsorKind", ([kind], s) =>
    kind === "organisation" ? s.required("Please enter the organisation's name.") : s,
  ),
  nationality: req("Please enter your nationality."),
  stateOfOrigin: opt(),
  lga: opt(),
  occupation: req("Please enter your occupation."),
  officeAddress: opt(),
  phone: phone(true),
  phone2: phone(false),
  email: email(true),
  declaration: mustAgree("Please confirm you understand the purpose of this sponsorship."),
  numberOfChildren: yup
    .number()
    .typeError("Enter the number of children.")
    .integer("Enter a whole number.")
    .min(1, "Sponsor at least one child.")
    .max(500)
    .required("Enter the number of children."),
  years: yup
    .string()
    .oneOf(
      SPONSOR_YEARS.map((y) => y.value),
      "Choose the number of years.",
    )
    .required("Choose the number of years."),
  paymentModel: yup
    .string()
    .oneOf(
      PAYMENT_MODELS.map((p) => p.value),
      "Choose a payment model.",
    )
    .required("Choose a payment model."),
  schoolItems: yup
    .array(
      yup
        .string()
        .oneOf(SCHOOL_ITEMS.map((i) => i.id))
        .required(),
    )
    .default([]),
  signature: signature(),
});
export type SponsorApplication = yup.InferType<typeof sponsorSchema>;

export const recipientSchema = yup.object({
  // School information
  schoolName: req("Please enter the name of the school."),
  principalName: req("Please enter the name of the principal."),
  schoolPhone: phone(true),
  schoolPhone2: phone(false),
  schoolAddress: req("Please enter the school's address."),
  schoolState: req("Please enter the state."),
  schoolEmail: email(false),
  schoolType: yup
    .string()
    .oneOf(
      SCHOOL_TYPES.map((t) => t.value),
      "Choose private or government school.",
    )
    .required("Choose private or government school."),
  schoolConfirmName: req("Enter the name of the person confirming for the school."),
  schoolConfirm: mustAgree("The school's confirmation is needed."),
  // Child's information
  childName: req("Please enter the child's name."),
  childGender: yup
    .string()
    .oneOf(
      GENDERS.map((g) => g.value),
      "Choose male or female.",
    )
    .required("Choose male or female."),
  childAge: yup
    .number()
    .typeError("Enter the child's age.")
    .integer("Enter a whole number.")
    .min(1, "Enter the child's age.")
    .max(30, "Enter the child's age.")
    .required("Enter the child's age."),
  classGrade: req("Please enter the child's class or grade."),
  childStateOfOrigin: req("Please enter the child's state of origin."),
  childLga: req("Please enter the child's local government area."),
  stateOfResidence: req("Please enter the child's state of residence."),
  childPhone: phone(false),
  hobbies: opt(),
  // Parents / guardian's information
  parentName: req("Please enter the parent or guardian's name."),
  parentStateOfOrigin: req("Please enter the state of origin."),
  parentLga: req("Please enter the local government area."),
  permanentAddress: req("Please enter the permanent home address."),
  parentPhone: phone(true),
  parentPhone2: phone(false),
  parentEmail: email(false),
  residentialAddress: req("Please enter the residential address."),
  parentOccupation: req("Please enter the occupation."),
  parentOfficeAddress: opt(),
  relationship: yup
    .string()
    .oneOf(
      RELATIONSHIPS.map((r) => r.value),
      "Choose the relationship with the child.",
    )
    .required("Choose the relationship with the child."),
  relationshipOther: opt().when("relationship", ([r], s) =>
    r === "other" ? s.required("Please specify the relationship.") : s,
  ),
  // Disclaimer
  disclaimer: mustAgree("Please accept the disclaimer."),
  parentSignature: signature(),
  // Witness / next of kin
  witnessName: req("Please enter the witness's name."),
  witnessAddress: req("Please enter the witness's address."),
  witnessPhone: phone(true),
  witnessRelationship: req("Please enter the relationship with the parents/guardian."),
  witnessConfirm: mustAgree("The witness's confirmation is needed."),
  witnessSignature: signature(),
});
export type RecipientApplication = yup.InferType<typeof recipientSchema>;
