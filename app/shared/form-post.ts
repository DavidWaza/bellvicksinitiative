import type { ApiResponse } from "./api-response";
import { failResponse } from "./response-helpers";
import { SITE_INFO } from "./site-info";

type Received = { received: true };

/**
 * Sends a website form to our server, which emails it (server/api/forms, server/api/storybook).
 * Never throws: if the server can't be reached (e.g. a static upload with no server), it answers
 * with the failure envelope and a real way to get in touch, rather than pretending it was sent.
 */
export async function postForm(
  path: string,
  body: Record<string, unknown>,
): Promise<ApiResponse<Received>> {
  try {
    return await $fetch<ApiResponse<Received>>(path, { method: "POST", body, timeout: 30_000 });
  } catch {
    return failResponse(
      { received: true },
      `We couldn't send this just now. Please email us at ${SITE_INFO.email}.`,
    );
  }
}
