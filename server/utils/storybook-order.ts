/**
 * Paid storybook orders: everything needed to email the storybook team ONE complete order.
 *
 * Paystack carries the order as metadata (books, each child's form details, delivery, totals). The
 * children's photos are too big for metadata, so the checkout hands them to `holdOrderPhotos`
 * (shared store, kept for a day); the order email attaches them. The email is sent by whichever comes
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
        hasCover?: boolean;
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
// Photos held between checkout and payment (shared store, see kv.ts; kept for a day).

type HeldPhoto = { child: string; content: string; ext: string };
const DAY_SECONDS = 24 * 60 * 60;
/** Stay well under the store's per-value limit (Upstash: 1 MB per request on the free plan). */
const MAX_HELD_CHARS = 900_000;

export async function holdOrderPhotos(reference: string, photos: HeldPhoto[]): Promise<void> {
  const kept: HeldPhoto[] = [];
  let size = 0;
  for (const p of photos) {
    if (size + p.content.length > MAX_HELD_CHARS) break;
    kept.push(p);
    size += p.content.length;
  }
  if (kept.length) await kvSet(`order:photos:${reference}`, JSON.stringify(kept), DAY_SECONDS);
}

async function heldPhotos(reference: string): Promise<HeldPhoto[]> {
  try {
    return JSON.parse((await kvGet(`order:photos:${reference}`)) ?? "[]");
  } catch {
    return [];
  }
}

/**
 * Each book's AI cover (base64 JPEG, ~100 KB), by cart line. One store entry per cover, so a
 * large order never passes the per-value limit. `null` = that book has no AI cover.
 */
export async function holdOrderCovers(reference: string, covers: (string | null)[]) {
  await Promise.all(
    covers.map((c, n) =>
      c && c.length <= MAX_HELD_CHARS
        ? kvSet(`order:cover:${reference}:${n}`, c, DAY_SECONDS)
        : undefined,
    ),
  );
}

async function heldCover(reference: string, n: number): Promise<string | null> {
  return (await kvGet(`order:cover:${reference}:${n}`).catch(() => null)) ?? null;
}

const fileSafe = (s: string) => s.replace(/[^\p{L}\p{N}-]+/gu, "-").replace(/^-+|-+$/g, "");

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

export async function emailPaidOrder(tx: PaystackTransaction): Promise<void> {
  // One email per order, even when the confirmation page and Paystack's webhook arrive together
  // in different Vercel instances: only the caller that sets this marker first sends.
  const marker = `order:emailed:${tx.reference}`;
  if (!(await kvSetIfAbsent(marker, 30 * DAY_SECONDS))) return;

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

  // The covers the customer chose, attached as "<ref>-book-1-<title>-<child>.jpg".
  const covers = await Promise.all(
    items.map(async (i, n) => {
      const content = i.hasCover ? await heldCover(tx.reference, n) : null;
      return content
        ? {
            filename: `${tx.reference}-book-${n + 1}-${fileSafe(i.title)}-${fileSafe(i.child?.name ?? "")}.jpg`,
            content,
          }
        : null;
    }),
  );

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
        `    Cover: ${
          covers[n]
            ? `attached (${covers[n]!.filename})`
            : i.hasCover
              ? "chosen, but not held any more (server restarted): ask the customer"
              : "the drawn stand-in (no AI cover was made for this book)"
        }`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const photos = await heldPhotos(tx.reference);
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
          "Covers",
          covers.some(Boolean)
            ? `${covers.filter(Boolean).length} attached (the cover of each book chosen)`
            : "None attached (no AI covers for these books)",
        ],
        [
          "Photos",
          photos.length
            ? `${photos.length} attached (one per child)`
            : missingPhotos
              ? 'Not attached here (server restarted): see the "New storybook" email for each child, or ask the customer.'
              : "None provided",
        ],
      ],
      attachments: [
        ...photos.map((p) => ({
          filename: `${tx.reference}-${p.child.replace(/[^\p{L}\p{N}-]+/gu, "-")}.${p.ext}`,
          content: p.content,
        })),
        ...covers.filter((c) => c !== null),
      ],
    });
    await kvDel(`order:photos:${tx.reference}`);
    await Promise.all(items.map((_, n) => kvDel(`order:cover:${tx.reference}:${n}`)));
  } catch (e) {
    await kvDel(marker).catch(() => undefined); // let the next attempt (reload or webhook retry) try again
    // oxlint-disable-next-line no-console
    console.error("[order email]", tx.reference, (e as { data?: unknown })?.data ?? e);
  }
}
