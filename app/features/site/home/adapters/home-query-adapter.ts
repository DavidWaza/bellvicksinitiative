import { useMutation, useQuery } from "@tanstack/vue-query";
import { homeQueryKeys } from "../infrastructure/home-query-keys";
import type { HomeMutationPort, HomeQueryPort } from "../ports/home-query.port";
import type { HomeServicePort } from "../ports/home-service.port";

/** TanStack implementation of the read port. */
export function useHomeQueryAdapter(service: HomeServicePort): HomeQueryPort {
  return {
    useHomeContentQuery() {
      return useQuery({
        queryKey: homeQueryKeys.content(),
        queryFn: () => service.getHomeContent(),
      });
    },
  };
}

/** TanStack implementation of the write port. Callers unwrap the envelope. */
export function useHomeMutationAdapter(service: HomeServicePort): HomeMutationPort {
  return {
    useVolunteerInterestMutation() {
      return useMutation({ mutationFn: (input) => service.submitVolunteerInterest(input) });
    },
  };
}
