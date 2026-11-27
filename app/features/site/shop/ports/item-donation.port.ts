import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { ItemDonation } from "../domain/item-donation";

/** The server's answer: a reference for the donation offer. */
export type ItemDonationReceived = { received: true; reference: string };

export interface ItemDonationSubmission {
  data: ItemDonation;
  /** Photos of the item (shrunk before upload). */
  photos: Blob[];
  /** Proof of the receipt (photo or PDF), when they have one. */
  receipt?: File | null;
  /** Optional proof of authenticity when there is no receipt. */
  proof?: File | null;
}

export interface ItemDonationServicePort {
  submit: (input: ItemDonationSubmission) => Promise<ApiResponse<ItemDonationReceived>>;
}

export interface ItemDonationMutationPort {
  useSubmitMutation: () => UseMutationReturnType<
    ApiResponse<ItemDonationReceived>,
    Error,
    ItemDonationSubmission,
    unknown
  >;
}
