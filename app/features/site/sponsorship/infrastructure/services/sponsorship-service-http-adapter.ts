import type { ApiResponse } from "~/shared/api-response";
import { failResponse } from "~/shared/response-helpers";
import { SITE_INFO } from "~/shared/site-info";
import { shrinkPhotoForUpload } from "~/utils/downscale-image";
import type { SponsorshipServicePort, Submitted } from "../../ports/sponsorship.port";

/**
 * REAL (not a mock): posts a Back to School application and its photos to our server, which
 * emails it to the contact inbox (server/api/sponsorship/[form].post.ts). Photos are shrunk in
 * the browser first (Vercel accepts at most 4.5 MB per request). Never throws.
 */
export default function useSponsorshipServiceHttpAdapter(): SponsorshipServicePort {
  return {
    async submit({ form, data, files }) {
      const body = new FormData();
      body.append("data", JSON.stringify(data));
      for (const [name, blob] of Object.entries(files)) {
        body.append(name, await shrinkPhotoForUpload(blob), `${name}.jpg`);
      }
      try {
        return await $fetch<ApiResponse<Submitted>>(`/api/sponsorship/${form}`, {
          method: "POST",
          body,
          timeout: 60_000,
        });
      } catch {
        return failResponse(
          { received: true, reference: "" },
          `We couldn't send this just now. Please email us at ${SITE_INFO.email}.`,
        );
      }
    },
  };
}
