import { okResponse } from "~/shared/response-helpers";
import { MOCK_LIST_LATENCY_MS, MOCK_MUTATION_LATENCY_MS, mockLatency } from "~/shared/mock";
import type { HomeServicePort } from "../../ports/home-service.port";
import { HOME_CONTENT } from "../mock/home-content";

/** Mock transport for the homepage. The HTTP adapter will replace this in use-home-deps.ts. */
export default function useHomeServiceMockAdapter(): HomeServicePort {
  return {
    getHomeContent: () => mockLatency(okResponse(HOME_CONTENT), MOCK_LIST_LATENCY_MS),

    // The mock stores nothing: there is no backend yet, so submissions go nowhere.
    submitVolunteerInterest: () =>
      mockLatency(okResponse({ received: true as const }), MOCK_MUTATION_LATENCY_MS),
  };
}
