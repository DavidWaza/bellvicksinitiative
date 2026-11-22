import type { ApiResponse } from "~/shared/api-response";
import { failResponse } from "~/shared/response-helpers";
import { shrinkPhotoForUpload } from "~/utils/downscale-image";
import type { GenerateInput } from "../../ports/storybook.port";

/**
 * REAL (not a mock): emails the finished questionnaire and the child's photo to the storybook
 * inbox via our server (server/api/storybook/submission.post.ts). Never throws.
 */
export async function submitStorybookHttp(
  input: GenerateInput,
  photo: Blob | null,
): Promise<ApiResponse<{ received: true } | null>> {
  const form = new FormData();
  form.append("draft", JSON.stringify(input));
  if (photo) form.append("photo", await shrinkPhotoForUpload(photo), "photo.jpg");
  try {
    return await $fetch("/api/storybook/submission", {
      method: "POST",
      body: form,
      timeout: 60_000,
    });
  } catch {
    return failResponse(null, "We couldn't send your storybook details.");
  }
}
