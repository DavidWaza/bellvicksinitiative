import type { PaidOrder } from "../../../../app/features/site/storybook/domain/cart-types";

/**
 * GET /api/storybook/checkout/verify?reference=… — asks Paystack whether a payment really
 * succeeded. Never trust the redirect alone: a customer could open /checkout/complete by hand.
 * The amount is checked against the total our own server computed (stored in the metadata).
 * On success the storybook team gets the order email (once; see server/utils/storybook-order.ts).
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const reference = String(getQuery(event).reference ?? "");
  if (!config.paystackSecretKey || !/^[A-Z0-9-]{6,60}$/i.test(reference))
    return apiFail("We couldn't find that payment.");

  const res = await paystackApi<{ data?: PaystackTransaction }>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  ).catch(() => null);

  const tx = res?.data;
  if (!tx || tx.status !== "success")
    return apiFail(
      tx?.status === "abandoned" || tx?.status === "failed"
        ? "The payment wasn't completed, so nothing was charged. You can try again from your cart."
        : "We couldn't confirm this payment yet. If you were charged, please contact us with your reference.",
    );
  if (!isGenuinePayment(tx))
    return apiFail("This payment doesn't match the order. Please contact us with your reference.");

  // Send the order email in the background: attaching photos can take ~20s, and the customer
  // shouldn't wait on "Confirming your payment…" for it.
  event.waitUntil(emailPaidOrder(tx));

  const paid: PaidOrder = {
    reference: tx.reference,
    email: tx.customer?.email ?? "",
    total: tx.amount / 100,
    books: (tx.metadata?.order?.items ?? []).map((i) => ({
      title: i.title,
      child: i.child?.name ?? "",
      quantity: i.quantity,
    })),
  };
  return { status: true as const, message: "", data: paid };
});
