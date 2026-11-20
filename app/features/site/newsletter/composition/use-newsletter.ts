import { useNewsletterMutationAdapter } from "../adapters/newsletter-mutation-adapter";
import useNewsletterApp from "../application/use-newsletter-app";
import useNewsletterServiceMockAdapter from "../infrastructure/services/newsletter-service-mock-adapter";

/** THE SWAP POINT is the service line below. */
export default function useNewsletter() {
  const service = useNewsletterServiceMockAdapter(); // ← swap for useNewsletterServiceHttpAdapter()
  return useNewsletterApp({ deps: { mutationPort: useNewsletterMutationAdapter(service) } });
}
