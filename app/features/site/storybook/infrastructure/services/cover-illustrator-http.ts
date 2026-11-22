import type { ApiResponse } from "~/shared/api-response";
import type { GenerateInput, IllustratedCover } from "../../ports/storybook.port";

/**
 * The REAL cover call (not a mock): POST /api/storybook/covers, which draws each cover with
 * OpenAI's GPT Image model from the child's photo. Only used when the site has AI covers switched
 * on (runtimeConfig.public.storybookAiCovers). Covers take ~30–90s, hence the long timeout.
 */
export function illustrateCoversHttp(
  input: GenerateInput,
  photo: Blob,
): Promise<ApiResponse<IllustratedCover[] | null>> {
  const form = new FormData();
  form.append("photo", photo);
  form.append("draft", JSON.stringify(input));
  return $fetch<ApiResponse<IllustratedCover[] | null>>("/api/storybook/covers", {
    method: "POST",
    body: form,
    timeout: 200_000,
  });
}
