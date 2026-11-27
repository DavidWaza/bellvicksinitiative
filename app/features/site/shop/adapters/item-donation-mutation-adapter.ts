import { useMutation } from "@tanstack/vue-query";
import type {
  ItemDonationMutationPort,
  ItemDonationServicePort,
} from "../ports/item-donation.port";

export function useItemDonationMutationAdapter(
  service: ItemDonationServicePort,
): ItemDonationMutationPort {
  return { useSubmitMutation: () => useMutation({ mutationFn: (input) => service.submit(input) }) };
}
