import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { DonationPledge, PaidDonation } from "../domain/donate-types";

type Received = { received: true };
type PaymentStarted = { reference: string; authorizationUrl: string };

export interface DonateServicePort {
  /** A gift recorded for follow-up (currencies Paystack can't charge yet). */
  pledge: (input: DonationPledge) => Promise<ApiResponse<Received>>;
  /** Server opens a Paystack payment for a naira gift; returns its hosted page URL. */
  startPayment: (input: DonationPledge) => Promise<ApiResponse<PaymentStarted | null>>;
  /** Server asks Paystack whether the gift with this reference was paid. */
  verifyPayment: (reference: string) => Promise<ApiResponse<PaidDonation | null>>;
}

export interface DonateMutationPort {
  usePledgeMutation: () => UseMutationReturnType<
    ApiResponse<Received>,
    Error,
    DonationPledge,
    unknown
  >;
  useStartPaymentMutation: () => UseMutationReturnType<
    ApiResponse<PaymentStarted | null>,
    Error,
    DonationPledge,
    unknown
  >;
  useVerifyMutation: () => UseMutationReturnType<
    ApiResponse<PaidDonation | null>,
    Error,
    string,
    unknown
  >;
}
