import { useMutation } from "@tanstack/vue-query";
import type { InvolvedMutationPort, InvolvedServicePort } from "../ports/involved.port";

export function useInvolvedMutationAdapter(service: InvolvedServicePort): InvolvedMutationPort {
  return {
    useVolunteerMutation: () =>
      useMutation({ mutationFn: (input) => service.submitVolunteer(input) }),
    useMentorMutation: () => useMutation({ mutationFn: (input) => service.submitMentor(input) }),
    usePartnerMutation: () => useMutation({ mutationFn: (input) => service.submitPartner(input) }),
  };
}
