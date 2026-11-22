import * as yup from "yup";
import type { StoryBook, StoryDraft } from "./storybook-types";

/**
 * The storybook cart and checkout. Prices are SETTINGS (runtimeConfig), never hard-coded here and
 * never trusted from the browser: the server recomputes every total before asking Paystack to
 * charge. A price of -1 means "not set yet", and checkout can't take payment until it is.
 */

/** The child a book is personalised for (everything the printer needs except the photo). */
type ChildDetails = Pick<
  StoryDraft,
  "name" | "gender" | "age" | "eyeColour" | "answers" | "from" | "dedication"
>;

export interface CartItem {
  /** Unique per cart line (the same story for two children is two lines). */
  key: string;
  bookId: string;
  title: string;
  blurb: string;
  tone: StoryBook["tone"];
  motif: StoryBook["motif"];
  inspiredBy: string[];
  /** The AI cover, when one was drawn (small enough to keep in the browser). */
  coverUrl?: string;
  /** The child's photo, shrunk to a small JPEG data URL, so it travels with the order. */
  photo?: string;
  child: ChildDetails;
  quantity: number;
}

/** A shrunk photo is a JPEG data URL of at most this many characters (~1.5 MB). */
export const MAX_PHOTO_CHARS = 2_000_000;

export const MAX_QUANTITY = 10;
export const MAX_CART_LINES = 20;

/** All amounts in naira (major units). -1 = not set yet. */
export interface StorybookPricing {
  bookPrice: number;
  deliveryNigeria: number;
  deliveryInternational: number;
}

export type DeliveryZone = "nigeria" | "international";

export const isPriceSet = (amount: number) => Number.isFinite(amount) && amount >= 0;

/** Checkout is possible only when the book price and that zone's delivery fee are both set. */
export const canCharge = (p: StorybookPricing, zone: DeliveryZone) =>
  isPriceSet(p.bookPrice) &&
  p.bookPrice > 0 &&
  isPriceSet(zone === "nigeria" ? p.deliveryNigeria : p.deliveryInternational);

export function cartTotals(
  items: Pick<CartItem, "quantity">[],
  p: StorybookPricing,
  zone: DeliveryZone,
) {
  const books = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = isPriceSet(p.bookPrice) ? books * p.bookPrice : 0;
  const fee = zone === "nigeria" ? p.deliveryNigeria : p.deliveryInternational;
  const delivery = books > 0 && isPriceSet(fee) ? fee : 0;
  return { books, subtotal, delivery, total: subtotal + delivery };
}

/** Nigeria's 36 states and the FCT, for the delivery address. */
export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

const required = (label: string) => yup.string().trim().required(`Please enter your ${label}.`);

/** The checkout form. Used in the browser (vee-validate) AND on the server before charging. */
export const checkoutSchema = yup.object({
  fullName: required("full name").max(80),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Please enter your email."),
  phone: required("phone number")
    .matches(/^[+\d][\d\s()-]{6,19}$/, "Enter a valid phone number, e.g. 0803 123 4567.")
    .max(20),
  zone: yup.mixed<DeliveryZone>().oneOf(["nigeria", "international"]).required(),
  country: yup
    .string()
    .trim()
    .max(60)
    .when("zone", ([zone], schema) =>
      zone === "international" ? schema.required("Please enter the country.") : schema.optional(),
    ),
  state: required("state or region").max(60),
  city: required("town or city").max(60),
  address: required("street address").max(160),
  postcode: yup.string().trim().max(20).optional(),
  notes: yup.string().trim().max(300).optional(),
});
export type CheckoutDetails = yup.InferType<typeof checkoutSchema>;

/** What the browser sends to start a payment. */
export interface CheckoutRequest {
  customer: CheckoutDetails;
  items: Pick<CartItem, "bookId" | "title" | "quantity" | "child" | "inspiredBy" | "photo">[];
}

/** What the browser gets back after Paystack confirms a payment. */
export interface PaidOrder {
  reference: string;
  email: string;
  total: number;
  books: { title: string; child: string; quantity: number }[];
}
