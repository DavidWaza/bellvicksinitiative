import type { PaidDonation } from "../../../app/features/site/donate/domain/donate-types";
import type { DonationTransaction } from "../../utils/donation";

/**
 * GET /api/donate/verify?reference=… — asks Paystack whether a gift was really paid (never trust
 * the redirect alone). On success the donations inbox and the donor are emailed, once each.
 * Rate-limited, and the reply shows a partly hidden email (anyone with the link sees the page).
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const reference = String(getQuery(event).reference ?? "");
  if (
    !config.paystackSecretKey ||
    !reference.startsWith(DONATION_REF_PREFIX) ||
    !/^[A-Z0-9-]{6,60}$/i.test(reference)
  )
    return apiFail("We couldn't find that payment.");

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  const hour = Math.floor(Date.now() / 3_600_000);
  if ((await kvIncr(`limit:verify:${ip}:${hour}`, 3600)) > 30)
    return apiFail("Too many checks just now. Please try again in an hour, or contact us.");

  const res = await paystackApi<{ data?: DonationTransaction }>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  ).catch(() => null);

  const tx = res?.data;
  if (!tx || tx.status !== "success")
    return apiFail(
      tx?.status === "abandoned" || tx?.status === "failed"
        ? "The payment wasn't completed, so nothing was charged. You can try again."
        : "We couldn't confirm this payment yet. If you were charged, please contact us with your reference.",
    );
  if (!isGenuineDonation(tx))
    return apiFail("This payment doesn't match the gift. Please contact us with your reference.");

  event.waitUntil(handlePaidDonation(tx)); // donations inbox + the donor's receipt

  const d = tx.metadata!.donation!;
  const paid: PaidDonation = {
    reference: tx.reference,
    email: maskEmail(d.email || tx.customer?.email || ""),
    amount: tx.amount / 100,
    frequency: d.frequency,
    target: targetLabel(d.target),
    name: d.name.trim().split(/\s+/)[0] ?? "",
  };
  return { status: true as const, message: "", data: paid };
});
