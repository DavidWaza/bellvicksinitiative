import { DONATION_TARGETS } from "../../app/features/site/donate/domain/donate-types";

/**
 * Paid donations (naira, through Paystack). The gift travels with the payment as Paystack metadata,
 * so every gift is visible in the Paystack dashboard. Once a payment is confirmed (the donor's
 * return to /donate/complete or Paystack's webhook, whichever comes first), the donations inbox
 * gets ONE email and the donor gets ONE thank-you receipt (shared-store markers, see kv.ts).
 *
 * Monthly gifts are Paystack subscriptions: the first payment comes through here; later monthly
 * charges are taken by Paystack and show in its dashboard (Subscriptions).
 */

export interface DonationMeta {
  /** Kobo, as charged. Checked against what Paystack says was paid. */
  amountKobo: number;
  frequency: "once" | "monthly";
  target: string;
  name: string;
  email: string;
  message?: string;
}

export interface DonationTransaction {
  status: string;
  amount: number;
  currency: string;
  reference: string;
  customer?: { email?: string };
  metadata?: { donation?: DonationMeta };
}

/** References we issue for gifts start with this (storybook orders use BVSB-). */
export const DONATION_REF_PREFIX = "BVDN-";

export const targetLabel = (value: string) =>
  DONATION_TARGETS.find((t) => t.value === value)?.label ?? "Where it's needed most";

/** Only trusted if Paystack says success AND the amount and currency are what we asked for. */
export function isGenuineDonation(
  tx: DonationTransaction | undefined,
): tx is DonationTransaction {
  const d = tx?.metadata?.donation;
  return Boolean(
    tx &&
    d &&
    tx.reference.startsWith(DONATION_REF_PREFIX) &&
    tx.status === "success" &&
    tx.currency === "NGN" &&
    tx.amount === d.amountKobo,
  );
}

/**
 * The Paystack plan for a monthly gift of this amount, created once and remembered. Paystack
 * subscriptions need a plan; a plan is just "₦X every month".
 */
export async function monthlyPlanCode(amountKobo: number): Promise<string> {
  const key = `donate:plan:${amountKobo}`;
  const known = await kvGet(key);
  if (known) return known;
  const res = await paystackApi<{ status: boolean; data?: { plan_code?: string } }>("/plan", {
    method: "POST",
    body: {
      name: `Monthly gift ₦${(amountKobo / 100).toLocaleString("en-NG")}`,
      interval: "monthly",
      amount: amountKobo,
      currency: "NGN",
    },
  });
  const code = res?.data?.plan_code;
  if (!code) throw new Error("No plan code from Paystack");
  await kvSet(key, code, 365 * 24 * 60 * 60);
  return code;
}

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const MONTH_SECONDS = 30 * 24 * 60 * 60;

/** The donations inbox: one email per gift. */
async function emailTeam(tx: DonationTransaction): Promise<void> {
  const marker = `donate:emailed:${tx.reference}`;
  if (!(await kvSetIfAbsent(marker, MONTH_SECONDS))) return;
  const d = tx.metadata!.donation!;
  const amount = naira(tx.amount / 100);
  const monthly = d.frequency === "monthly";
  try {
    await sendSiteEmail({
      inbox: "donations",
      subject: `Donation received: ${amount}${monthly ? " a month" : ""} from ${d.name}`,
      title: monthly ? "New monthly donation (paid)" : "New donation (paid)",
      replyTo: d.email,
      fields: [
        ["Amount", `${amount}${monthly ? " (first of a monthly gift)" : ""}`],
        ["Frequency", monthly ? "Monthly (Paystack subscription)" : "One-off"],
        ["Give to", targetLabel(d.target)],
        ["Name", d.name],
        ["Email", d.email],
        ["Additional information", d.message],
        ["Paystack reference", tx.reference],
        ["Status", "Paid and confirmed with Paystack"],
      ],
    });
  } catch (e) {
    await kvDel(marker).catch(() => undefined); // let a reload or the webhook try again
    // oxlint-disable-next-line no-console
    console.error("[donation email]", tx.reference, (e as { data?: unknown })?.data ?? e);
  }
}

/** The donor's thank-you receipt: one per gift. Replies go to the donations inbox. */
async function emailDonor(tx: DonationTransaction): Promise<void> {
  const d = tx.metadata!.donation!;
  const to = (d.email || tx.customer?.email || "").trim();
  if (!to) return;
  const marker = `donate:receipt:${tx.reference}`;
  if (!(await kvSetIfAbsent(marker, MONTH_SECONDS))) return;

  const config = useRuntimeConfig();
  const site = String(config.public.siteUrl).replace(/\/$/, "");
  const firstName = d.name.trim().split(/\s+/)[0] || "there";
  const amount = naira(tx.amount / 100);
  const monthly = d.frequency === "monthly";
  const cause = targetLabel(d.target);
  const e = escapeHtml;
  const monthlyNote =
    "This is a monthly gift: your card will be charged the same amount each month. To change or stop it at any time, just reply to this email.";

  const html = `<!doctype html><html><body style="margin:0;background:#fffbf5;font-family:Arial,Helvetica,sans-serif;color:#1d1a15">
<div style="max-width:560px;margin:0 auto;padding:28px 20px">
  <div style="text-align:center">
    <img src="${site}/brand/logo-160.png" width="64" height="64" alt="Bellvicks Initiative" style="display:inline-block">
  </div>
  <div style="background:#ffffff;border-radius:20px;padding:28px 24px;margin-top:16px">
    <p style="margin:0;display:inline-block;background:#e3f1e8;color:#0f3526;font-weight:bold;font-size:13px;padding:6px 12px;border-radius:999px">✓ Payment successful</p>
    <h1 style="margin:16px 0 8px;font-size:24px;color:#0f3526">Thank you, ${e(firstName)}!</h1>
    <p style="margin:0 0 6px;font-size:15px;line-height:1.6">We've received your gift of <strong>${amount}${monthly ? " a month" : ""}</strong> for <strong>${e(cause)}</strong>. Thank you for standing with children and communities across Nigeria.</p>
    ${monthly ? `<p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#4b4439">${monthlyNote}</p>` : ""}
    <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:18px;font-size:14px;color:#4b4439">
      <tr><td style="padding:4px 0">Amount</td><td style="padding:4px 0;text-align:right;font-weight:bold;color:#1d1a15">${amount}</td></tr>
      <tr><td style="padding:4px 0">Frequency</td><td style="padding:4px 0;text-align:right">${monthly ? "Monthly" : "One-off"}</td></tr>
      <tr><td style="padding:4px 0">Supporting</td><td style="padding:4px 0;text-align:right">${e(cause)}</td></tr>
    </table>
    <p style="margin:22px 0 0;font-size:13px;color:#625a4c">Reference: <strong>${e(tx.reference)}</strong></p>
  </div>
  <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#625a4c;text-align:center">Questions about your gift? Just reply to this email.<br>Bellvicks Global Aid Initiative · <a href="${site}" style="color:#0f3526">bellvicksinitiative.org</a></p>
</div></body></html>`;

  const text = [
    `Thank you, ${firstName}!`,
    "",
    `We've received your gift of ${amount}${monthly ? " a month" : ""} for ${cause}. Thank you for standing with children and communities across Nigeria.`,
    ...(monthly ? ["", monthlyNote] : []),
    "",
    `Amount: ${amount}`,
    `Frequency: ${monthly ? "Monthly" : "One-off"}`,
    `Supporting: ${cause}`,
    `Reference: ${tx.reference}`,
    "",
    "Questions about your gift? Just reply to this email.",
    "Bellvicks Global Aid Initiative · bellvicksinitiative.org",
  ].join("\n");

  try {
    await sendCustomerEmail({
      to,
      subject: `Thank you for your gift to Bellvicks Initiative (${tx.reference})`,
      html,
      text,
      replyTo: String(config.donationsEmail || config.contactEmail || "") || undefined,
    });
  } catch (err) {
    await kvDel(marker).catch(() => undefined);
    // oxlint-disable-next-line no-console
    console.error("[donation receipt]", tx.reference, (err as { data?: unknown })?.data ?? err);
  }
}

/** Everything that happens once a gift is confirmed: the team's email + the donor's receipt. */
export async function handlePaidDonation(tx: DonationTransaction): Promise<void> {
  await Promise.allSettled([emailTeam(tx), emailDonor(tx)]);
}
