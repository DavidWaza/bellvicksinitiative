import { createHmac, timingSafeEqual } from "node:crypto";
import type { DonationTransaction } from "../../utils/donation";

/**
 * POST /api/paystack/webhook — Paystack calls this the moment a payment succeeds, even if the
 * customer closes the tab before returning to the site. Set it in the Paystack dashboard:
 * Settings → API Keys & Webhooks → Webhook URL: https://bellvicksinitiative.org/api/paystack/webhook
 *
 * Every request is checked against Paystack's signature (HMAC-SHA512 of the raw body with the
 * secret key), and the payment is re-verified with Paystack before any email is sent. Handles
 * storybook orders (BVSB-) and Donate-page gifts (BVDN-).
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.paystackSecretKey) return { ok: false };

  const raw = (await readRawBody(event, "utf8")) ?? "";
  const signature = getHeader(event, "x-paystack-signature") ?? "";
  const expected = createHmac("sha512", config.paystackSecretKey).update(raw).digest("hex");
  const valid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) {
    setResponseStatus(event, 401);
    return { ok: false };
  }

  let body: { event?: string; data?: { reference?: string } };
  try {
    body = JSON.parse(raw);
  } catch {
    return { ok: true };
  }

  // Only successful charges for our storybook orders (references we issued start with BVSB-).
  const reference = body.data?.reference ?? "";
  if (body.event === "charge.success" && reference.startsWith("BVSB-")) {
    // Answer Paystack straight away; verify and email in the background.
    event.waitUntil(
      paystackApi<{ data?: PaystackTransaction }>(
        `/transaction/verify/${encodeURIComponent(reference)}`,
      )
        .then((res) => (isGenuinePayment(res?.data) ? handlePaidOrder(res.data) : undefined))
        .catch(() => undefined),
    );
  }
  // Gifts from the Donate page (BVDN-). Later monthly charges carry Paystack's own references
  // and are left to the Paystack dashboard.
  if (body.event === "charge.success" && reference.startsWith(DONATION_REF_PREFIX)) {
    event.waitUntil(
      paystackApi<{ data?: DonationTransaction }>(
        `/transaction/verify/${encodeURIComponent(reference)}`,
      )
        .then((res) => (isGenuineDonation(res?.data) ? handlePaidDonation(res.data) : undefined))
        .catch(() => undefined),
    );
  }
  return { ok: true }; // always 200 quickly, so Paystack doesn't keep retrying
});
