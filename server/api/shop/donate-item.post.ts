import { randomBytes } from "node:crypto";
import {
  DONOR_KINDS,
  HANDOVER_OPTIONS,
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  itemDonationSchema,
  MAX_ITEM_PHOTOS,
  MAX_RECEIPT_BYTES,
  RECEIPT_TYPES,
  RESELLABLE_RULE,
} from "../../../app/features/site/shop/domain/item-donation";
import type { EmailAttachment, SiteEmail } from "../../utils/email";

/**
 * POST /api/shop/donate-item — "Donate an item" to The Giving Shop. multipart/form-data: `data`
 * (JSON, validated with the same yup schema as the browser), 1–4 `photos`, and optionally a
 * `receipt` and a `proof` (photo or PDF). Emails the DONATIONS inbox with everything attached and a
 * reference, so the team can reply on WhatsApp or email and arrange pickup.
 */
const IMAGES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO = 2.5 * 1024 * 1024;
const MAX_TOTAL = 4.3 * 1024 * 1024;

type Rows = SiteEmail["fields"];
const heading = (title: string): Rows[number] => [title, "", "heading"];
const label = (options: { value: string; label: string }[], value: unknown) =>
  options.find((o) => o.value === value)?.label ?? String(value ?? "");
const ext = (type?: string) =>
  type === "application/pdf" ? "pdf" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";

export default defineEventHandler(async (event) => {
  const parts = (await readMultipartFormData(event)) ?? [];
  let raw: unknown;
  try {
    raw = JSON.parse(parts.find((p) => p.name === "data")?.data.toString("utf8") ?? "");
  } catch {
    return apiFail("Some details were missing.");
  }

  let v;
  try {
    v = await itemDonationSchema.validate(raw, { stripUnknown: true });
  } catch (e) {
    return apiFail(e instanceof Error ? e.message : "Please check the form.");
  }

  const photos = parts.filter((p) => p.name === "photos" && p.data?.length).slice(0, MAX_ITEM_PHOTOS);
  const receipt = v.hasReceipt === "yes" ? parts.find((p) => p.name === "receipt" && p.data?.length) : undefined;
  const proof = v.hasReceipt === "no" ? parts.find((p) => p.name === "proof" && p.data?.length) : undefined;

  if (!photos.length) return apiFail("Please add at least one photo of the item.");
  if (v.hasReceipt === "yes" && !receipt) return apiFail("Please add a photo or PDF of the receipt.");
  let total = 0;
  for (const p of photos) {
    total += p.data.length;
    if (!p.type || !IMAGES.has(p.type)) return apiFail("Item photos must be JPG, PNG or WebP images.");
    if (p.data.length > MAX_PHOTO) return apiFail("A photo is too large. Please use a smaller one.");
  }
  for (const doc of [receipt, proof]) {
    if (!doc) continue;
    total += doc.data.length;
    if (!doc.type || !RECEIPT_TYPES.includes(doc.type))
      return apiFail("The receipt or proof must be a photo (JPG, PNG, WebP) or a PDF.");
    if (doc.data.length > MAX_RECEIPT_BYTES)
      return apiFail("The receipt or proof is too large (2 MB at most).");
  }
  if (total > MAX_TOTAL) return apiFail("The files are too large together. Please use fewer or smaller photos.");

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  if (!(await underFormLimit(ip)))
    return apiFail("You've sent several forms in a short time. Please try again in an hour.");

  const ref = `GS-ITEM-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
  const donor = v.donorKind === "organisation" ? `${v.organisation} (${v.fullName})` : v.fullName;
  const waDigits = v.whatsapp.replace(/[^\d]/g, "").replace(/^0/, "234");

  const fields: Rows = [
    ["Reference", ref],
    heading("The item"),
    ["What", v.itemName],
    ["Category", label(ITEM_CATEGORIES, v.category)],
    ["Condition", label(ITEM_CONDITIONS, v.condition)],
    ["Quantity", String(v.quantity)],
    ["Description", v.description],
    ["Estimated value", v.estimatedValue],
    ["Photos", `${photos.length} attached`],
    heading("Receipt"),
    ["Has a receipt", v.hasReceipt === "yes" ? "Yes (proof attached)" : "No"],
    ["Why not / proof of authenticity", v.hasReceipt === "no" ? v.noReceiptReason : ""],
    ["Extra proof", v.hasReceipt === "no" ? (proof ? "Attached" : "None sent") : ""],
    heading("Location"),
    ["Handover", label(HANDOVER_OPTIONS, v.handover)],
    ["Pickup address", v.address],
    ["City / town", v.city],
    ["State", v.state],
    heading("Contact"),
    ["Donating as", label(DONOR_KINDS, v.donorKind)],
    ["Organisation", v.organisation],
    ["Contact person", v.fullName],
    ["WhatsApp", `${v.whatsapp}${waDigits.length >= 10 ? `  (https://wa.me/${waDigits})` : ""}`],
    ["Email", v.email],
    ["Best time to reach", v.bestTime],
    ["Anything else", v.notes],
    heading("Confirmed"),
    ["Resellable", `Yes. ${RESELLABLE_RULE}`],
  ];

  const attachments: EmailAttachment[] = [
    ...photos.map((p, i) => ({ filename: `${ref}-item-${i + 1}.${ext(p.type)}`, content: p.data.toString("base64") })),
    ...(receipt ? [{ filename: `${ref}-receipt.${ext(receipt.type)}`, content: receipt.data.toString("base64") }] : []),
    ...(proof ? [{ filename: `${ref}-proof.${ext(proof.type)}`, content: proof.data.toString("base64") }] : []),
  ];

  try {
    await sendSiteEmail({
      inbox: "donations",
      subject: `Item donation offer ${ref}: ${v.quantity}× ${v.itemName} from ${donor}`,
      title: "New item donation for The Giving Shop",
      replyTo: v.email || undefined,
      fields,
      attachments,
    });
  } catch (e) {
    // oxlint-disable-next-line no-console
    console.error("[item donation email]", (e as { data?: unknown })?.data ?? e);
    return apiFail("We couldn't send your offer just now. Please try again later.");
  }
  return { status: true as const, message: "", data: { received: true as const, reference: ref } };
});
