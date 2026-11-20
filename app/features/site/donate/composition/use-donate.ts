import { useDonateMutationAdapter } from "../adapters/donate-mutation-adapter";
import useDonateApp from "../application/use-donate-app";
import useDonateServiceMockAdapter from "../infrastructure/services/donate-service-mock-adapter";

/** THE SWAP POINT is the service line below. */
export default function useDonate() {
  const service = useDonateServiceMockAdapter(); // ← swap for useDonateServiceHttpAdapter()
  return useDonateApp({ deps: { mutationPort: useDonateMutationAdapter(service) } });
}
