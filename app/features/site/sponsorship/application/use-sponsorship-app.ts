import { computed } from "vue";
import { unwrapApiResponse } from "~/shared/api-envelope";
import type { SponsorshipForm } from "../domain/sponsorship-forms";
import type { SponsorshipMutationPort } from "../ports/sponsorship.port";

const FALLBACK = "We couldn't send your application just now. Please try again.";

/**
 * Submits one Back to School form. Resolves with the application's reference number; throws (via
 * unwrapApiResponse) when the server answers `status: false`, so the form's catch shows why.
 */
export default function useSponsorshipApp(options: {
  deps: { mutationPort: SponsorshipMutationPort };
  form: SponsorshipForm;
}) {
  const mutation = options.deps.mutationPort.useSubmitMutation();

  async function submit(data: Record<string, unknown>, files: Record<string, Blob> = {}) {
    const res = await mutation.mutateAsync({ form: options.form, data, files });
    return unwrapApiResponse(res, FALLBACK).data.reference;
  }

  return { submit, isPending: computed(() => mutation.isPending.value) };
}
