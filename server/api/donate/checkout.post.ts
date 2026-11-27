import { randomBytes } from "node:crypto";
import {
  canPayOnline,
  MAX_ONLINE_GIFT_NGN,
  MIN_ONLINE_GIFT_NGN,
  pledgeSchema,
} from "../../../app/features/site/donate/domain/donate-types";
import type { DonationMeta } from "../../utils/donation";

/**
 * POST /api/donate/checkout — starts a Paystack payment for a naira gift (one-off, or monthly as a
 * Paystack subscription). Validated with the same schema as the form. Returns Paystack's hosted
 * payment page URL; the donor comes back to /donate/complete, which verifies the payment here on
 * the server. Off until NUXT_PAYSTACK_SECRET_KEY is set.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.paystackSecretKey)
    return apiFail("Online giving isn't switched on yet. Please pledge your gift instead.");

  let gift;
  try {
    gift = await pledgeSchema.validate(await readBody(event).catch(() => null), {
      stripUnknown: true,
    });
  } catch (e) {
    return apiFail(e instanceof Error ? e.message : "Please check the form.");
  }
  if (!canPayOnline(gift.currency))
    return apiFail("Online payment is in Naira only. Please pledge gifts in other currencies.");
  if (gift.amount < MIN_ONLINE_GIFT_NGN || gift.amount > MAX_ONLINE_GIFT_NGN)
    return apiFail(
      `Please give between ₦${MIN_ONLINE_GIFT_NGN.toLocaleString("en-NG")} and ₦${MAX_ONLINE_GIFT_NGN.toLocaleString("en-NG")} online.`,
    );

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  const hour = Math.floor(Date.now() / 3_600_000);
  if ((await kvIncr(`limit:donate:${ip}:${hour}`, 3600)) > 20)
    return apiFail("Too many attempts just now. Please try again in an hour, or contact us.");

  const amountKobo = Math.round(gift.amount * 100);
  const reference =
    `${DONATION_REF_PREFIX}${Date.now().toString(36)}-${randomBytes(8).toString("hex")}`.toUpperCase();
  const donation: DonationMeta = {
    amountKobo,
    frequency: gift.frequency === "monthly" ? "monthly" : "once",
    target: gift.target.slice(0, 40),
    name: gift.name.slice(0, 120),
    email: gift.email.slice(0, 200),
    message: gift.message?.slice(0, 1500) || undefined,
  };

  let plan: string | undefined;
  if (donation.frequency === "monthly") {
    plan = await monthlyPlanCode(amountKobo).catch((e) => {
      // oxlint-disable-next-line no-console
      console.error("[donate plan]", e?.data ?? e);
      return undefined;
    });
    if (!plan)
      return apiFail("We couldn't set up a monthly gift just now. Please try again in a moment.");
  }

  const res = await paystackApi<{
    status: boolean;
    data?: { authorization_url: string };
  }>("/transaction/initialize", {
    method: "POST",
    body: {
      email: donation.email,
      amount: amountKobo,
      currency: "NGN",
      reference,
      ...(plan ? { plan } : {}),
      callback_url: `${getRequestURL(event).origin}/donate/complete`,
      metadata: {
        // Shown as columns on the transaction in the Paystack dashboard.
        custom_fields: [
          { display_name: "Donor", variable_name: "donor", value: donation.name },
          { display_name: "Give to", variable_name: "give_to", value: targetLabel(gift.target) },
          {
            display_name: "Frequency",
            variable_name: "frequency",
            value: plan ? "Monthly" : "One-off",
          },
        ],
        donation,
      },
    },
  }).catch((e) => {
    // oxlint-disable-next-line no-console
    console.error("[donate checkout]", e?.data ?? e);
    return null;
  });

  if (!res?.status || !res.data?.authorization_url)
    return apiFail("We couldn't start the payment just now. Please try again in a moment.");
  return {
    status: true as const,
    message: "",
    data: { reference, authorizationUrl: res.data.authorization_url },
  };
});
