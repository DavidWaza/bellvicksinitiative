/**
 * Paid storybook orders: everything needed to email the storybook team ONE complete order.
 *
 * Paystack carries the order as metadata (books, each child's form details, delivery, totals). The
 * children's photos are too big for metadata, so the checkout hands them to `holdOrderPhotos`
 * (kept in memory for a day); the order email attaches them. The email is sent by whichever comes
 * first, the customer's return to /checkout/complete or Paystack's webhook, and only once.
 */

export interface PaystackChild {
  name?: string;
  age?: number;
  gender?: string;
  eyeColour?: string;
  from?: string;
  dedication?: string;
  answers?: Record<string, string>;
}

export interface PaystackTransaction {
  status: string;
  amount: number;
  currency: string;
  reference: string;
  customer?: { email?: string };
  metadata?: {
    order?: {
      totals?: { books: number; subtotal: number; delivery: number; total: number };
      items?: {
        bookId?: string;
        title: string;
        quantity: number;
        inspiredBy?: string[];
        hasPhoto?: boolean;
        child?: PaystackChild;
      }[];
      customer?: Record<string, string | undefined>;
    };
  };
}

/** Calls the Paystack API with the secret key. NUXT_PAYSTACK_API_BASE exists only for testing. */
export function paystackApi<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: object } = {},
) {
  const config = useRuntimeConfig();
  return $fetch<T>(`${config.paystackApiBase}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${config.paystackSecretKey}` },
    timeout: 30_000,
  });
}

/** A paid transaction is only trusted if Paystack says success AND the amount is ours. */
export function isGenuinePayment(tx: PaystackTransaction | undefined): tx is PaystackTransaction {
  const expected = Math.round((tx?.metadata?.order?.totals?.total ?? -1) * 100);
  return Boolean(tx && tx.status === "success" && tx.currency === "NGN" && tx.amount === expected);
}

// ---------------------------------------------------------------------------------------------
// Photos held between checkout and payment (in memory; one server process).

type HeldPhoto = { child: string; content: string; ext: string };
const held = new Map<string, { photos: HeldPhoto[]; expires: number }>();
const DAY = 24 * 60 * 60 * 1000;

export function holdOrderPhotos(reference: string, photos: HeldPhoto[]) {
  const now = Date.now();
  for (const [ref, v] of held) if (v.expires < now) held.delete(ref);
  if (photos.length) held.set(reference, { photos, expires: now + DAY });
}

// ---------------------------------------------------------------------------------------------
// The order email.

const ANSWER_LABELS: Record<string, string> = {
  activities: "Favourite activities",
  funny: "Something funny they do",
  food: "Favourite food",
  place: "Favourite place",
  other: "Other details",
};
const naira = (n: number | undefined) => `₦${Number(n ?? 0).toLocaleString("en-NG")}`;

/** References already emailed, so a reload or a repeated webhook never sends a second email. */
const emailed = new Set<string>();

export async function emailPaidOrder(tx: PaystackTransaction): Promise<void> {
  if (emailed.has(tx.reference)) return;
  emailed.add(tx.reference);

  const order = tx.metadata?.order;
  const c = order?.customer ?? {};
  const t = order?.totals;
  const items = order?.items ?? [];
  const address = [
    c.address,
    c.city,
    c.state,
    c.postcode,
    c.zone === "nigeria" ? "Nigeria" : c.country,
  ]
    .filter(Boolean)
    .join(", ");

  const books = items
    .map((i, n) => {
      const ch = i.child ?? {};
      const answers = Object.entries(ch.answers ?? {})
        .filter(([, v]) => v)
        .map(([k, v]) => `    ${ANSWER_LABELS[k] ?? k}: ${v}`);
      return [
        `${n + 1}. ${i.title}  ×${i.quantity}`,
        `    For: ${ch.name ?? "?"}, age ${ch.age ?? "?"}, ${ch.gender ?? "?"}, ${ch.eyeColour ?? "?"} eyes`,
        `    From (on the cover): ${ch.from ?? "?"}`,
        ch.dedication ? `    Dedication: ${ch.dedication.replace(/\n+/g, " / ")}` : "",
        ...answers,
        i.inspiredBy?.length ? `    Story inspired by: ${i.inspiredBy.join(", ")}` : "",
        `    Photo: ${i.hasPhoto ? "attached" : "not provided"}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const photos = held.get(tx.reference)?.photos ?? [];
  const missingPhotos = items.some((i) => i.hasPhoto) && !photos.length;

  try {
    await sendSiteEmail({
      inbox: "storybook",
      subject: `PAID storybook order ${tx.reference}: ${naira(tx.amount / 100)} (${t?.books ?? items.length} book${(t?.books ?? 0) === 1 ? "" : "s"})`,
      title: "New paid storybook order",
      replyTo: c.email ?? tx.customer?.email,
      fields: [
        ["Status", "PAID: confirmed with Paystack"],
        ["Reference", tx.reference],
        [
          "Books",
          `${t?.books ?? "?"} × ${naira(t ? t.subtotal / Math.max(1, t.books) : 0)} = ${naira(t?.subtotal)}`,
        ],
        ["Delivery", t?.delivery === 0 ? "Free" : naira(t?.delivery)],
        ["Total paid", naira(tx.amount / 100)],
        ["Customer", c.fullName],
        ["Email", c.email ?? tx.customer?.email],
        ["Phone", c.phone],
        ["Deliver to", address],
        ["Delivery notes", c.notes],
        ["Order", books],
        [
          "Photos",
          photos.length
            ? `${photos.length} attached (one per child)`
            : missingPhotos
              ? 'Not attached here (server restarted): see the "New storybook" email for each child, or ask the customer.'
              : "None provided",
        ],
      ],
      attachments: photos.map((p) => ({
        filename: `${tx.reference}-${p.child.replace(/[^\p{L}\p{N}-]+/gu, "-")}.${p.ext}`,
        content: p.content,
      })),
    });
    held.delete(tx.reference);
  } catch (e) {
    emailed.delete(tx.reference); // let the next attempt (reload or webhook retry) try again
    // oxlint-disable-next-line no-console
    console.error("[order email]", tx.reference, (e as { data?: unknown })?.data ?? e);
  }
}
