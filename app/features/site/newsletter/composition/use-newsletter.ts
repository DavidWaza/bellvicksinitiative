import { useNewsletterMutationAdapter } from "../adapters/newsletter-mutation-adapter";
import useNewsletterApp from "../application/use-newsletter-app";
import useNewsletterServiceHttpAdapter from "../infrastructure/services/newsletter-service-http-adapter";

/** THE SWAP POINT is the service line below. */
export default function useNewsletter() {
  const service = useNewsletterServiceHttpAdapter(); // emails via our server (server/api/forms)
  return useNewsletterApp({ deps: { mutationPort: useNewsletterMutationAdapter(service) } });
}
