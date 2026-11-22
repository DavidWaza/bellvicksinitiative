import { unwrapApiResponse } from "~/shared/api-envelope";
import type { CartItem, CheckoutDetails, PaidOrder } from "../domain/cart-types";
import type { CheckoutMutationPort } from "../ports/checkout.port";

/** Checkout use case: send the cart to be priced and paid, and confirm the payment afterwards. */
export default function useCheckoutApp(options: { deps: { mutationPort: CheckoutMutationPort } }) {
  const start = options.deps.mutationPort.useStartPaymentMutation();
  const verify = options.deps.mutationPort.useVerifyMutation();

  /** Returns Paystack's payment page URL. Throws with a readable message on failure. */
  async function startPayment(customer: CheckoutDetails, items: CartItem[]): Promise<string> {
    const res = await start.mutateAsync({
      customer,
      // Everything the storybook team needs per book. Each child's photo is sent ONCE (on their
      // first book), keeping the request well under Vercel's 4.5 MB limit.
      items: items.map(({ bookId, title, quantity, child, inspiredBy, photo }, n) => ({
        bookId,
        title,
        quantity,
        child,
        inspiredBy,
        photo: items.findIndex((other) => other.photo === photo) === n ? photo : undefined,
      })),
    });
    const data = unwrapApiResponse(res, "We couldn't start the payment. Please try again.").data;
    if (!data?.authorizationUrl)
      throw new Error("We couldn't start the payment. Please try again.");
    return data.authorizationUrl;
  }

  async function confirmPayment(reference: string): Promise<PaidOrder> {
    const res = await verify.mutateAsync(reference);
    const data = unwrapApiResponse(res, "We couldn't confirm the payment.").data;
    if (!data) throw new Error("We couldn't confirm the payment.");
    return data;
  }

  return {
    startPayment,
    confirmPayment,
    isStarting: start.isPending,
    isVerifying: verify.isPending,
  };
}
