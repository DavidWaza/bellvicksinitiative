import { useDonateMutationAdapter } from "../adapters/donate-mutation-adapter";
import useDonateApp from "../application/use-donate-app";
import useDonateServiceHttpAdapter from "../infrastructure/services/donate-service-http-adapter";

/** THE SWAP POINT is the service line below. */
export default function useDonate() {
  const service = useDonateServiceHttpAdapter(); // our server: Paystack for naira gifts, email for pledges
  return useDonateApp({ deps: { mutationPort: useDonateMutationAdapter(service) } });
}
