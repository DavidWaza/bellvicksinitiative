import { mockWrite } from "~/shared/mock";
import type { DonateServicePort } from "../../ports/donate.port";

/** No backend or payment provider yet: pledges are accepted and discarded. */
export default function useDonateServiceMockAdapter(): DonateServicePort {
  return { pledge: () => mockWrite({ received: true as const }) };
}
