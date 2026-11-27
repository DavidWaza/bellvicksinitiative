import { postForm } from "~/shared/form-post";
import type { DonateServicePort } from "../../ports/donate.port";

/**
 * REAL payments for naira gifts: the site's own server talks to Paystack
 * (server/api/donate/checkout.post.ts and verify.get.ts). Pledges are emailed to the donations
 * inbox (server/api/forms).
 */
export default function useDonateServiceHttpAdapter(): DonateServicePort {
  return {
    pledge: (input) => postForm("/api/forms/pledge", input),
    startPayment: (input) =>
      $fetch("/api/donate/checkout", { method: "POST", body: input, timeout: 30_000 }),
    verifyPayment: (reference) =>
      $fetch("/api/donate/verify", { query: { reference }, timeout: 30_000 }),
  };
}
