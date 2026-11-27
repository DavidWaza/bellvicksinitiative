import { useMutation } from "@tanstack/vue-query";
import type { DonateMutationPort, DonateServicePort } from "../ports/donate.port";

export function useDonateMutationAdapter(service: DonateServicePort): DonateMutationPort {
  return {
    usePledgeMutation: () => useMutation({ mutationFn: (input) => service.pledge(input) }),
    useStartPaymentMutation: () =>
      useMutation({ mutationFn: (input) => service.startPayment(input) }),
    useVerifyMutation: () => useMutation({ mutationFn: (ref) => service.verifyPayment(ref) }),
  };
}
