/**
 * The customer's receipt for a paid storybook order: "your payment was successful, thank you, it
 * arrives within N days". Sent once per order (shared-store marker), to the email given at
 * checkout, with replies going to the storybook inbox. Delivery days:
 * NUXT_PUBLIC_STORYBOOK_DELIVERY_DAYS (default 10; also shown on the confirmation page).
 */
const naira = (n: number | undefined) => `₦${Number(n ?? 0).toLocaleString("en-NG")}`;

export async function emailCustomerReceipt(tx: PaystackTransaction): Promise<void> {
  const order = tx.metadata?.order;
  const c = order?.customer ?? {};
  const to = (c.email ?? tx.customer?.email ?? "").trim();
  if (!to) return;

  const marker = `order:receipt:${tx.reference}`;
  if (!(await kvSetIfAbsent(marker, 30 * 24 * 60 * 60))) return;

  const config = useRuntimeConfig();
  const days = Number(config.public.storybookDeliveryDays) || 10;
  const site = String(config.public.siteUrl).replace(/\/$/, "");
  const firstName = (c.fullName ?? "").trim().split(/\s+/)[0] || "there";
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
  const e = escapeHtml;

  const rows = items
    .map(
      (i) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece3d6;font-size:15px">
          <strong style="color:#0f3526">${e(i.title)}</strong><br>
          <span style="color:#625a4c;font-size:13px">For ${e(i.child?.name ?? "")}${i.child?.from ? `, from ${e(i.child.from)}` : ""}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #ece3d6;font-size:15px;text-align:right;white-space:nowrap">× ${i.quantity}</td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#fffbf5;font-family:Arial,Helvetica,sans-serif;color:#1d1a15">
<div style="max-width:560px;margin:0 auto;padding:28px 20px">
  <div style="text-align:center">
    <img src="${site}/brand/logo-160.png" width="64" height="64" alt="Bellvicks Initiative" style="display:inline-block">
  </div>
  <div style="background:#ffffff;border-radius:20px;padding:28px 24px;margin-top:16px">
    <p style="margin:0;display:inline-block;background:#e3f1e8;color:#0f3526;font-weight:bold;font-size:13px;padding:6px 12px;border-radius:999px">✓ Payment successful</p>
    <h1 style="margin:16px 0 8px;font-size:24px;color:#0f3526">Thank you, ${e(firstName)}!</h1>
    <p style="margin:0 0 6px;font-size:15px;line-height:1.6">Your payment of <strong>${naira(tx.amount / 100)}</strong> was successful, and your personalised storybook order is confirmed. Thank you for your purchase.</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6">We're now making your books. <strong>Your order will arrive within ${days} days.</strong></p>

    <h2 style="margin:0 0 4px;font-size:16px;color:#0f3526">Your order</h2>
    <table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:10px;font-size:14px;color:#4b4439">
      <tr><td style="padding:3px 0">Books</td><td style="padding:3px 0;text-align:right">${naira(t?.subtotal)}</td></tr>
      <tr><td style="padding:3px 0">Delivery</td><td style="padding:3px 0;text-align:right">${t?.delivery === 0 ? "Free" : naira(t?.delivery)}</td></tr>
      <tr><td style="padding:8px 0 0;font-size:16px;font-weight:bold;color:#1d1a15">Total paid</td><td style="padding:8px 0 0;text-align:right;font-size:16px;font-weight:bold;color:#1d1a15">${naira(tx.amount / 100)}</td></tr>
    </table>

    <h2 style="margin:22px 0 4px;font-size:16px;color:#0f3526">Delivering to</h2>
    <p style="margin:0;font-size:14px;line-height:1.6">${e(c.fullName ?? "")}<br>${e(address)}${c.phone ? `<br>${e(c.phone)}` : ""}</p>

    <p style="margin:22px 0 0;font-size:13px;color:#625a4c">Order reference: <strong>${e(tx.reference)}</strong></p>
  </div>
  <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#625a4c;text-align:center">Questions about your order? Just reply to this email.<br>Bellvicks Global Aid Initiative · <a href="${site}" style="color:#0f3526">bellvicksinitiative.org</a></p>
</div></body></html>`;

  const text = [
    `Thank you, ${firstName}!`,
    "",
    `Your payment of ${naira(tx.amount / 100)} was successful, and your personalised storybook order is confirmed. Thank you for your purchase.`,
    `We're now making your books. Your order will arrive within ${days} days.`,
    "",
    "Your order:",
    ...items.map((i) => `- ${i.title} (for ${i.child?.name ?? ""}) × ${i.quantity}`),
    "",
    `Books: ${naira(t?.subtotal)}`,
    `Delivery: ${t?.delivery === 0 ? "Free" : naira(t?.delivery)}`,
    `Total paid: ${naira(tx.amount / 100)}`,
    "",
    `Delivering to: ${c.fullName ?? ""}, ${address}`,
    `Order reference: ${tx.reference}`,
    "",
    "Questions about your order? Just reply to this email.",
    "Bellvicks Global Aid Initiative · bellvicksinitiative.org",
  ].join("\n");

  try {
    await sendCustomerEmail({
      to,
      subject: `Payment successful: your Bellvicks storybook order (${tx.reference})`,
      html,
      text,
      replyTo: String(config.storybookEmail || "") || undefined,
    });
  } catch (err) {
    await kvDel(marker).catch(() => undefined); // let a reload or the webhook try again
    // oxlint-disable-next-line no-console
    console.error("[receipt email]", tx.reference, (err as { data?: unknown })?.data ?? err);
  }
}

/** Everything that happens once a payment is confirmed: the team's order email + the receipt. */
export async function handlePaidOrder(tx: PaystackTransaction): Promise<void> {
  await Promise.allSettled([emailPaidOrder(tx), emailCustomerReceipt(tx)]);
}
