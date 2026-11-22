import { useMutation } from "@tanstack/vue-query";
import type { CheckoutMutationPort, CheckoutServicePort } from "../ports/checkout.port";

export function useCheckoutMutationAdapter(service: CheckoutServicePort): CheckoutMutationPort {
  return {
    useStartPaymentMutation: () => useMutation({ mutationFn: (req) => service.startPayment(req) }),
    useVerifyMutation: () => useMutation({ mutationFn: (ref) => service.verifyPayment(ref) }),
  };
}
