import * as yup from "yup";
import { CAUSE_SLUGS, type CauseSlug } from "~/shared/site-routes";
import { SUPPORTED_CURRENCIES, type Currency } from "~/utils/format-money";

/**
 * Donations. Gifts in NAIRA are paid online through Paystack (one-off, or monthly as a Paystack
 * subscription), always confirmed by our server. Paystack can't charge other currencies on this
 * account yet, so a gift in USD, GBP, EUR or CAD is recorded as a PLEDGE and the team follows up
 * with how to pay. Never fake a payment step.
 */
export type DonationTarget = CauseSlug | "greatest-need";

/** Narrow copy of cause titles for the picker. DUPLICATED from the causes slice — keep in step. */
export const DONATION_TARGETS: { value: DonationTarget; label: string }[] = [
  { value: "greatest-need", label: "Where it's needed most" },
  { value: "keffi-books", label: "Books for children in Keffi" },
  { value: "gwagwalada-books", label: "Books for children in Gwagwalada" },
  { value: "gwagwalada-food", label: "Healthy food for families in Gwagwalada" },
  { value: "lokoja-water", label: "Clean water for Lokoja" },
];

export function parseTarget(raw: unknown): DonationTarget {
  return typeof raw === "string" && (CAUSE_SLUGS as readonly string[]).includes(raw)
    ? (raw as CauseSlug)
    : "greatest-need";
}

/** Suggested amounts per currency — UI presets only, not claims about what a gift buys. */
export const PRESET_AMOUNTS: Record<Currency, number[]> = {
  NGN: [5000, 10000, 25000, 50000],
  USD: [10, 25, 50, 100],
  GBP: [10, 25, 50, 100],
  EUR: [10, 25, 50, 100],
  CAD: [15, 30, 60, 120],
};

export const FREQUENCIES = [
  { value: "once", label: "One-off" },
  { value: "monthly", label: "Monthly" },
];

export const pledgeSchema = yup.object({
  target: yup.string().required(),
  currency: yup.string().oneOf(SUPPORTED_CURRENCIES).required(),
  amount: yup
    .number()
    .typeError("Enter an amount.")
    .positive("Enter an amount greater than zero.")
    .required("Enter an amount."),
  frequency: yup.string().oneOf(["once", "monthly"]).required(),
  name: yup.string().trim().required("Please tell us your name."),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Please enter your email."),
  /** Anything else the donor wants us to know (optional). */
  message: yup.string().trim().max(1500, "Please keep it under 1,500 characters.").default(""),
});
export type DonationPledge = yup.InferType<typeof pledgeSchema>;

/** Online payment is in naira only (Paystack); other currencies are pledged. */
export const canPayOnline = (currency: unknown) => currency === "NGN";

/** Limits for an online gift, in naira (checked again on the server). */
export const MIN_ONLINE_GIFT_NGN = 100;
export const MAX_ONLINE_GIFT_NGN = 10_000_000;

/** A paid gift, as confirmed by our server after Paystack. */
export interface PaidDonation {
  reference: string;
  /** Partly hidden ("id•••@gmail.com"). */
  email: string;
  amount: number;
  frequency: "once" | "monthly";
  /** What the gift supports, e.g. "Clean water for Lokoja". */
  target: string;
  name: string;
}
