import { useMutation } from "@tanstack/vue-query";
import type { NewsletterMutationPort, NewsletterServicePort } from "../ports/newsletter.port";

export function useNewsletterMutationAdapter(
  service: NewsletterServicePort,
): NewsletterMutationPort {
  return {
    useSubscribeMutation: () => useMutation({ mutationFn: (input) => service.subscribe(input) }),
  };
}
