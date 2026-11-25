/**
 * Sends site emails through Resend (https://resend.com), from the verified bellvicksinitiative.org
 * domain. Where each email goes is a setting, never a hard-coded address:
 *   - NUXT_STORYBOOK_EMAIL: storybook questionnaires and paid storybook orders
 *   - NUXT_VOLUNTEER_EMAIL: volunteer applications (and homepage sign-ups choosing "Volunteer")
 *   - NUXT_MENTOR_EMAIL:    mentor applications (and sign-ups choosing "Become a mentor")
 *   - NUXT_PARTNER_EMAIL:   partnership enquiries (and sign-ups choosing "Partner with us")
 *   - NUXT_DONATIONS_EMAIL: donation pledges and Back to School sponsor applications
 *   - NUXT_CONTACT_EMAIL:   everything else (contact, newsletter, Back to School recipient
 *                           applications, "Not sure yet" sign-ups), and the fallback for any
 *                           of the inboxes above that isn't set
 * Off until NUXT_RESEND_API_KEY is set.
 */

export type Inbox = "storybook" | "volunteer" | "mentor" | "partner" | "donations" | "contact";

export interface EmailAttachment {
  filename: string;
  /** Base64 file content. */
  content: string;
}

export interface SiteEmail {
  inbox: Inbox;
  subject: string;
  /** Heading inside the email. */
  title: string;
  /**
   * Rows of the details table, in order. Empty values are left out. A row marked "heading"
   * starts a new section (long forms such as the Back to School applications).
   */
  fields: (
    | [label: string, value: string | number | undefined | null]
    | [label: string, value: string, kind: "heading"]
  )[];
  /** Lets Bellvicks answer the visitor with a plain "Reply". */
  replyTo?: string;
  attachments?: EmailAttachment[];
}

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function render(email: SiteEmail) {
  const rows = email.fields.filter(
    (row) =>
      row[2] === "heading" ||
      (row[1] !== undefined && row[1] !== null && String(row[1]).trim() !== ""),
  );
  const html = `<!doctype html><html><body style="margin:0;background:#fffbf5;font-family:Arial,Helvetica,sans-serif;color:#1d1a15">
<div style="max-width:640px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#625a4c">Bellvicks Initiative website</p>
  <h1 style="margin:0 0 20px;font-size:22px;color:#0f3526">${escape(email.title)}</h1>
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:12px">
    ${rows
      .map(([label, value, kind]) =>
        kind === "heading"
          ? `<tr><td colspan="2" style="padding:18px 14px 8px;background:#e3f1e8;font-weight:bold;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#0f3526">${escape(label)}</td></tr>`
          : `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #ece3d6;vertical-align:top;width:34%;font-weight:bold;font-size:14px">${escape(label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #ece3d6;font-size:14px;white-space:pre-wrap">${escape(String(value))}</td>
    </tr>`,
      )
      .join("")}
  </table>
  ${email.replyTo ? `<p style="margin:16px 0 0;font-size:13px;color:#625a4c">Reply to this email to answer ${escape(email.replyTo)} directly.</p>` : ""}
</div></body></html>`;
  const text = `${email.title}\n\n${rows
    .map(([l, v, kind]) => (kind === "heading" ? `\n== ${l} ==` : `${l}: ${v}`))
    .join("\n")}\n`;
  return { html, text };
}

/** Sends one email. Throws on failure, so callers can answer with a failure envelope. */
export async function sendSiteEmail(email: SiteEmail): Promise<void> {
  const config = useRuntimeConfig();
  const INBOXES: Record<Inbox, unknown> = {
    storybook: config.storybookEmail,
    volunteer: config.volunteerEmail,
    mentor: config.mentorEmail,
    partner: config.partnerEmail,
    donations: config.donationsEmail,
    contact: config.contactEmail,
  };
  const to = String(INBOXES[email.inbox] || config.contactEmail || "");
  if (!config.resendApiKey || !to) throw new Error("Email isn't set up");

  const { html, text } = render(email);
  await $fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.resendApiKey}` },
    body: {
      from: config.emailFrom,
      to: [to],
      subject: email.subject,
      html,
      text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      ...(email.attachments?.length ? { attachments: email.attachments } : {}),
    },
    timeout: 30_000,
  });
}

/**
 * Sends an email to a CUSTOMER (not one of our inboxes), e.g. a payment receipt. The caller builds
 * the HTML; replies go to `replyTo` (one of our inboxes). Throws on failure.
 */
export async function sendCustomerEmail(email: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const config = useRuntimeConfig();
  if (!config.resendApiKey) throw new Error("Email isn't set up");
  await $fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.resendApiKey}` },
    body: {
      from: config.emailFrom,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    },
    timeout: 30_000,
  });
}

export const escapeHtml = escape;

/** Spam guard: at most `perHour` form emails per visitor per hour (shared store, see kv.ts). */
export async function underFormLimit(ip: string, perHour = 10): Promise<boolean> {
  const hour = Math.floor(Date.now() / 3_600_000);
  return (await kvIncr(`limit:form:${ip}:${hour}`, 3600)) <= perHour;
}
