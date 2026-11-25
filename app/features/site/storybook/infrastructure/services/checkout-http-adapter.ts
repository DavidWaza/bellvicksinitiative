import { downscaleToJpeg } from "~/utils/downscale-image";
import { MAX_ORDER_COVER_CHARS, type CheckoutRequest } from "../../domain/cart-types";
import type { CheckoutServicePort } from "../../ports/checkout.port";

/**
 * A book's AI cover, shrunk for the order email (~800px JPEG, roughly 80–150 KB). Covers are kept
 * in the cart at full size; sending them as-is could pass Vercel's 4.5 MB request limit.
 * Anything that can't be read or is still too big is left out (the email then says so).
 */
async function coverForOrder(cover?: string): Promise<string | undefined> {
  if (!cover?.startsWith("data:image/")) return undefined;
  try {
    const small = await downscaleToJpeg(await (await fetch(cover)).blob(), 800, 0.8);
    return small && small.length <= MAX_ORDER_COVER_CHARS ? small : undefined;
  } catch {
    return undefined;
  }
}

/**
 * REAL payments (not a mock): the site's own server talks to Paystack
 * (server/api/storybook/checkout.post.ts and checkout/verify.get.ts). Needs the Node server;
 * a static-only upload can show the cart but can't take payment.
 */
export default function useCheckoutHttpAdapter(): CheckoutServicePort {
  return {
    startPayment: async (req) => {
      const body: CheckoutRequest = {
        ...req,
        items: await Promise.all(
          req.items.map(async (i) => ({ ...i, cover: await coverForOrder(i.cover) })),
        ),
      };
      return $fetch("/api/storybook/checkout", { method: "POST", body, timeout: 30_000 });
    },
    verifyPayment: (reference) =>
      $fetch("/api/storybook/checkout/verify", { query: { reference }, timeout: 30_000 }),
  };
}
