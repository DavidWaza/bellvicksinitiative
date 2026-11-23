import { useMutation } from "@tanstack/vue-query";
import type { SponsorshipMutationPort, SponsorshipServicePort } from "../ports/sponsorship.port";

export function useSponsorshipMutationAdapter(
  service: SponsorshipServicePort,
): SponsorshipMutationPort {
  return {
    useSubmitMutation: () => useMutation({ mutationFn: (input) => service.submit(input) }),
  };
}
