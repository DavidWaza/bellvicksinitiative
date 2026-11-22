/**
 * Sends site emails through Resend (https://resend.com), from the verified bellvicksinitiative.org
 * domain. Where each email goes is a setting, never a hard-coded address:
 *   - NUXT_STORYBOOK_EMAIL: storybook submissions and paid storybook orders
 *   - NUXT_CONTACT_EMAIL:   contact, volunteer, mentor, partner, pledge and newsletter forms
 * Off until NUXT_RESEND_API_KEY is set.
 */

export type Inbox = "storybook" | "contact";

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
  /** Rows of the details table, in order. Empty values are left out. */
  fields: [label: string, value: string | number | undefined | null][];
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
    ([, v]) => v !== undefined && v !== null && String(v).trim() !== "",
  );
  const html = `<!doctype html><html><body style="margin:0;background:#fffbf5;font-family:Arial,Helvetica,sans-serif;color:#1d1a15">
<div style="max-width:640px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#625a4c">Bellvicks Initiative website</p>
  <h1 style="margin:0 0 20px;font-size:22px;color:#0f3526">${escape(email.title)}</h1>
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:12px">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #ece3d6;vertical-align:top;width:34%;font-weight:bold;font-size:14px">${escape(label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #ece3d6;font-size:14px;white-space:pre-wrap">${escape(String(value))}</td>
    </tr>`,
      )
      .join("")}
  </table>
  ${email.replyTo ? `<p style="margin:16px 0 0;font-size:13px;color:#625a4c">Reply to this email to answer ${escape(email.replyTo)} directly.</p>` : ""}
</div></body></html>`;
  const text = `${email.title}\n\n${rows.map(([l, v]) => `${l}: ${v}`).join("\n")}\n`;
  return { html, text };
}

/** Sends one email. Throws on failure, so callers can answer with a failure envelope. */
export async function sendSiteEmail(email: SiteEmail): Promise<void> {
  const config = useRuntimeConfig();
  const to = email.inbox === "storybook" ? config.storybookEmail : config.contactEmail;
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

// Simple spam guard: at most N form emails per visitor per hour (in-memory, one server process).
const recent = new Map<string, number[]>();
export function underFormLimit(ip: string, perHour = 10): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (hits.length >= perHour) return false;
  hits.push(now);
  recent.set(ip, hits);
  return true;
}
