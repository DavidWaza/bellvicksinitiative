import { useItemDonationMutationAdapter } from "../adapters/item-donation-mutation-adapter";
import useItemDonationApp from "../application/use-item-donation-app";
import useItemDonationHttpAdapter from "../infrastructure/services/item-donation-http-adapter";

/** Composition root for "Donate an item" (emails via server/api/shop/donate-item). */
export default function useItemDonation() {
  return useItemDonationApp({
    deps: { mutationPort: useItemDonationMutationAdapter(useItemDonationHttpAdapter()) },
  });
}
