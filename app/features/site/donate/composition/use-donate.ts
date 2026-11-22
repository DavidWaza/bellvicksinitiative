import { useDonateMutationAdapter } from "../adapters/donate-mutation-adapter";
import useDonateApp from "../application/use-donate-app";
import useDonateServiceHttpAdapter from "../infrastructure/services/donate-service-http-adapter";

/** THE SWAP POINT is the service line below. */
export default function useDonate() {
  const service = useDonateServiceHttpAdapter(); // emails via our server (server/api/forms)
  return useDonateApp({ deps: { mutationPort: useDonateMutationAdapter(service) } });
}
