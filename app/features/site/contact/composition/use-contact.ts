import { useContactMutationAdapter } from "../adapters/contact-mutation-adapter";
import useContactApp from "../application/use-contact-app";
import useContactServiceHttpAdapter from "../infrastructure/services/contact-service-http-adapter";

/** THE SWAP POINT is the service line below. */
export default function useContact() {
  const service = useContactServiceHttpAdapter(); // emails via our server (server/api/forms)
  return useContactApp({ deps: { mutationPort: useContactMutationAdapter(service) } });
}
