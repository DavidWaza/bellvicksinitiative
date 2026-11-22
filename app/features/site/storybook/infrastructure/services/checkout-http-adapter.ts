import type { CheckoutServicePort } from "../../ports/checkout.port";

/**
 * REAL payments (not a mock): the site's own server talks to Paystack
 * (server/api/storybook/checkout.post.ts and checkout/verify.get.ts). Needs the Node server;
 * a static-only upload can show the cart but can't take payment.
 */
export default function useCheckoutHttpAdapter(): CheckoutServicePort {
  return {
    startPayment: (req) =>
      $fetch("/api/storybook/checkout", { method: "POST", body: req, timeout: 30_000 }),
    verifyPayment: (reference) =>
      $fetch("/api/storybook/checkout/verify", { query: { reference }, timeout: 30_000 }),
  };
}
