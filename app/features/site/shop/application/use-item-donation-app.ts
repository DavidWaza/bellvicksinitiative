import { unwrapApiResponse } from "~/shared/api-envelope";
import type {
  ItemDonationMutationPort,
  ItemDonationSubmission,
} from "../ports/item-donation.port";

/** Sends a "Donate an item" offer. Resolves with its reference; throws with a readable message. */
export default function useItemDonationApp(options: {
  deps: { mutationPort: ItemDonationMutationPort };
}) {
  const mutation = options.deps.mutationPort.useSubmitMutation();
  async function submit(input: ItemDonationSubmission): Promise<string> {
    const res = await mutation.mutateAsync(input);
    return unwrapApiResponse(res, "We couldn't send your offer just now. Please try again.").data
      .reference;
  }
  return { submit, isPending: computed(() => mutation.isPending.value) };
}
