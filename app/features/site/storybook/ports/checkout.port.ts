import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { CheckoutRequest, PaidOrder } from "../domain/cart-types";

type PaymentStarted = { reference: string; authorizationUrl: string };

export interface CheckoutServicePort {
  /** Server prices the cart and opens a Paystack payment; returns its hosted page URL. */
  startPayment: (req: CheckoutRequest) => Promise<ApiResponse<PaymentStarted | null>>;
  /** Server asks Paystack whether the payment with this reference succeeded. */
  verifyPayment: (reference: string) => Promise<ApiResponse<PaidOrder | null>>;
}

export interface CheckoutMutationPort {
  useStartPaymentMutation: () => UseMutationReturnType<
    ApiResponse<PaymentStarted | null>,
    Error,
    CheckoutRequest,
    unknown
  >;
  useVerifyMutation: () => UseMutationReturnType<
    ApiResponse<PaidOrder | null>,
    Error,
    string,
    unknown
  >;
}
