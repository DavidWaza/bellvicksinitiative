import { randomBytes } from "node:crypto";
import {
  AGE_MAX,
  AGE_MIN,
  NAME_MAX,
} from "../../../app/features/site/storybook/domain/storybook-types";
import {
  canCharge,
  cartTotals,
  checkoutSchema,
  MAX_CART_LINES,
  MAX_PHOTO_CHARS,
  MAX_QUANTITY,
  type CheckoutRequest,
} from "../../../app/features/site/storybook/domain/cart-types";

/**
 * POST /api/storybook/checkout — starts a Paystack payment for the cart.
 *
 * The total is computed HERE from the price settings, never taken from the browser. The full order
 * (books, each child's details and dedication, delivery address) travels with the payment as
 * Paystack metadata, so every paid order is visible in the Paystack dashboard even before the site
 * has a database. Returns Paystack's hosted payment page URL; the customer comes back to
 * /checkout/complete, which verifies the payment server-side.
 *
 * Off until NUXT_PAYSTACK_SECRET_KEY and the prices are set.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.paystackSecretKey)
    return apiFail("Online payment isn't switched on yet. Please contact us to order.");

  const body = await readBody<CheckoutRequest>(event).catch(() => null);
  let customer;
  try {
    customer = await checkoutSchema.validate(body?.customer, { stripUnknown: true });
  } catch (e) {
    return apiFail(e instanceof Error ? e.message : "Please check your delivery details.");
  }

  const items = (Array.isArray(body?.items) ? body!.items : []).slice(0, MAX_CART_LINES);
  const valid = items.every(
    (i) =>
      typeof i.title === "string" &&
      i.title.length <= 120 &&
      Number.isInteger(i.quantity) &&
      i.quantity >= 1 &&
      i.quantity <= MAX_QUANTITY &&
      typeof i.child?.name === "string" &&
      i.child.name.trim().length > 0 &&
      i.child.name.length <= NAME_MAX &&
      Number.isInteger(i.child.age) &&
      i.child.age >= AGE_MIN &&
      i.child.age <= AGE_MAX,
  );
  if (!items.length || !valid)
    return apiFail("Your cart looks empty or out of date. Please refresh it.");

  const pricing = storybookPricing();
  if (!canCharge(pricing, customer.zone))
    return apiFail("Prices for this delivery option aren't set yet. Please contact us to order.");
  const totals = cartTotals(items, pricing, customer.zone);

  const reference =
    `BVSB-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`.toUpperCase();
  const origin = getRequestURL(event).origin;
  const clip = (s: unknown, max: number) => String(s ?? "").slice(0, max);

  // Each child's shrunk photo (from the cart), held for the order email; Paystack metadata is too
  // small for images. One photo per child, even if they have several books.
  // The browser sends each child's photo once (on their first book), so "has a photo" is per child.
  const photos: { child: string; content: string; ext: string }[] = [];
  const childKey = (i: (typeof items)[number]) => `${i.child.name.trim()}-${i.child.age}`;
  for (const i of items) {
    const m =
      typeof i.photo === "string" && i.photo.length <= MAX_PHOTO_CHARS
        ? i.photo.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/)
        : null;
    if (m && !photos.some((p) => p.child === childKey(i)))
      photos.push({ child: childKey(i), content: m[2]!, ext: m[1] === "jpeg" ? "jpg" : m[1]! });
  }
  const hasPhoto = items.map((i) => photos.some((p) => p.child === childKey(i)));

  const res = await paystackApi<{
    status: boolean;
    message: string;
    data?: { authorization_url: string };
  }>("/transaction/initialize", {
    method: "POST",
    body: {
      email: customer.email,
      amount: Math.round(totals.total * 100), // kobo
      currency: "NGN",
      reference,
      callback_url: `${origin}/checkout/complete`,
      metadata: {
        // Shown as columns on the transaction in the Paystack dashboard.
        custom_fields: [
          { display_name: "Customer", variable_name: "customer", value: customer.fullName },
          { display_name: "Phone", variable_name: "phone", value: customer.phone },
          {
            display_name: "Books",
            variable_name: "books",
            value: items.map((i) => `${i.quantity}× ${clip(i.title, 120)}`).join("; "),
          },
          {
            display_name: "Deliver to",
            variable_name: "deliver_to",
            value: [
              customer.address,
              customer.city,
              customer.state,
              customer.postcode,
              customer.zone === "nigeria" ? "Nigeria" : customer.country,
            ]
              .filter(Boolean)
              .join(", "),
          },
        ],
        order: {
          totals,
          pricing,
          customer,
          items: items.map((i, n) => ({
            bookId: clip(i.bookId, 40),
            title: clip(i.title, 120),
            quantity: i.quantity,
            inspiredBy: (Array.isArray(i.inspiredBy) ? i.inspiredBy : [])
              .slice(0, 6)
              .map((s) => clip(s, 80)),
            hasPhoto: hasPhoto[n],
            child: {
              name: clip(i.child.name, NAME_MAX),
              age: i.child.age,
              gender: clip(i.child.gender, 4),
              eyeColour: clip(i.child.eyeColour, 10),
              from: clip(i.child.from, 40),
              dedication: clip(i.child.dedication, 150),
              answers: Object.fromEntries(
                Object.entries(i.child.answers ?? {}).map(([k, v]) => [clip(k, 12), clip(v, 200)]),
              ),
            },
          })),
        },
      },
    },
  }).catch((e) => {
    // oxlint-disable-next-line no-console
    console.error("[storybook checkout]", e?.data ?? e);
    return null;
  });

  if (!res?.status || !res.data?.authorization_url)
    return apiFail("We couldn't start the payment just now. Please try again in a moment.");

  await holdOrderPhotos(reference, photos);

  return {
    status: true as const,
    message: "",
    data: { reference, authorizationUrl: res.data.authorization_url },
  };
});
