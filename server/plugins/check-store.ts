/**
 * Warns in the Vercel logs if the shared store isn't connected. Without it, order photos, the
 * "already emailed" markers and the spam/spending limits live in one instance's memory only, so
 * order emails can miss their photos or be sent twice. Connect Upstash Redis in Vercel → Storage.
 */
export default defineNitroPlugin(() => {
  if (process.env.VERCEL && !hasSharedStore())
    // oxlint-disable-next-line no-console
    console.warn(
      "[bellvicks] No shared store: add Upstash Redis in Vercel → Storage (sets KV_REST_API_URL / KV_REST_API_TOKEN).",
    );
});
