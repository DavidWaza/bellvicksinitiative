import { useMutation } from "@tanstack/vue-query";
import type { ContactMutationPort, ContactServicePort } from "../ports/contact.port";

export function useContactMutationAdapter(service: ContactServicePort): ContactMutationPort {
  return {
    useSendMessageMutation: () =>
      useMutation({ mutationFn: (input) => service.sendMessage(input) }),
  };
}
