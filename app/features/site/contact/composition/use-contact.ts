import { useContactMutationAdapter } from "../adapters/contact-mutation-adapter";
import useContactApp from "../application/use-contact-app";
import useContactServiceMockAdapter from "../infrastructure/services/contact-service-mock-adapter";

/** THE SWAP POINT is the service line below. */
export default function useContact() {
  const service = useContactServiceMockAdapter(); // ← swap for useContactServiceHttpAdapter()
  return useContactApp({ deps: { mutationPort: useContactMutationAdapter(service) } });
}
