import * as yup from "yup";
import type { IconName } from "~/utils/icons";

/**
 * "Donate an item" to The Giving Shop. People and organisations give goods; the shop resells them
 * and the proceeds go to humanitarian work. Bellvicks' rule: DONATED ITEMS MUST BE RESELLABLE.
 * The same schema validates the form in the browser and the submission on the server
 * (server/api/shop/donate-item.post.ts), which emails it to the donations inbox.
 */
export const RESELLABLE_RULE = "Donated items must be in good, resellable condition.";

export const ITEM_CATEGORIES = [
  { value: "clothing", label: "Clothing & shoes" },
  { value: "bags", label: "Bags & accessories" },
  { value: "home", label: "Home & kitchen" },
  { value: "books", label: "Books & stationery" },
  { value: "electronics", label: "Electronics" },
  { value: "toys", label: "Toys & games" },
  { value: "other", label: "Something else" },
];

export const ITEM_CONDITIONS: {
  value: string;
  label: string;
  description: string;
  icon: IconName;
}[] = [
  { value: "new", label: "New", description: "Unused, ideally with tags or packaging.", icon: "tag" },
  {
    value: "like-new",
    label: "Like new",
    description: "Used briefly, no marks or wear.",
    icon: "impact",
  },
  {
    value: "good",
    label: "Good",
    description: "Gently used, clean, fully working.",
    icon: "check",
  },
];

export const DONOR_KINDS = [
  { value: "person", label: "An individual" },
  { value: "organisation", label: "An organisation" },
];

export const HANDOVER_OPTIONS: {
  value: string;
  label: string;
  description: string;
  icon: IconName;
}[] = [
  {
    value: "pickup",
    label: "Please pick it up",
    description: "We'll arrange a pickup from your address.",
    icon: "truck",
  },
  {
    value: "dropoff",
    label: "I'll drop it off",
    description: "We'll share where to bring it.",
    icon: "pin",
  },
];

export const MAX_ITEM_PHOTOS = 4;
/** Receipt proof: a photo or a PDF. */
export const RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MAX_RECEIPT_BYTES = 2 * 1024 * 1024;

const phone = yup
  .string()
  .trim()
  .required("Please enter a WhatsApp number we can reach you on.")
  .matches(/^[+()\d\s-]{7,20}$/, {
    excludeEmptyString: true,
    message: "Enter a valid phone number.",
  });

export const itemDonationSchema = yup.object({
  // The item
  itemName: yup.string().trim().required("Tell us what you're donating.").max(120),
  category: yup.string().required("Choose a category."),
  condition: yup.string().required("Choose the item's condition."),
  quantity: yup
    .number()
    .typeError("Enter how many.")
    .integer("Enter a whole number.")
    .min(1, "At least 1.")
    .max(500, "For more than 500, please contact us.")
    .required("Enter how many."),
  description: yup
    .string()
    .trim()
    .max(1500, "Please keep it under 1,500 characters.")
    .default(""),
  estimatedValue: yup.string().trim().max(40).default(""),
  // Receipt
  hasReceipt: yup.string().oneOf(["yes", "no"]).required("Please tell us if you have a receipt."),
  noReceiptReason: yup
    .string()
    .trim()
    .max(1500)
    .when("hasReceipt", ([has], s) =>
      has === "no"
        ? s.required("Please tell us why, or describe any proof that the item is genuine.")
        : s,
    )
    .default(""),
  // Location and handover
  handover: yup.string().oneOf(["pickup", "dropoff"]).required("Choose pickup or drop-off."),
  address: yup
    .string()
    .trim()
    .max(300)
    .when("handover", ([h], s) =>
      h === "pickup" ? s.required("Enter the pickup address.") : s,
    )
    .default(""),
  city: yup.string().trim().required("Enter the city or town.").max(80),
  state: yup.string().trim().required("Enter the state.").max(80),
  // Contact
  donorKind: yup.string().oneOf(["person", "organisation"]).required(),
  organisation: yup
    .string()
    .trim()
    .max(150)
    .when("donorKind", ([k], s) =>
      k === "organisation" ? s.required("Enter the organisation's name.") : s,
    )
    .default(""),
  fullName: yup.string().trim().required("Enter the contact person's full name.").max(120),
  whatsapp: phone,
  email: yup.string().trim().email("Enter a valid email address.").max(200).default(""),
  bestTime: yup.string().trim().max(120).default(""),
  notes: yup.string().trim().max(1500).default(""),
  // The rule
  resellable: yup
    .boolean()
    .oneOf([true], "Please confirm the item is in resellable condition.")
    .required("Please confirm the item is in resellable condition."),
});
export type ItemDonation = yup.InferType<typeof itemDonationSchema>;
