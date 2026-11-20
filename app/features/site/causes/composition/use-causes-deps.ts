import { useCausesQueryAdapter } from "../adapters/causes-query-adapter";
import useCausesServiceMockAdapter from "../infrastructure/services/causes-service-mock-adapter";
import type { CausesQueryPort } from "../ports/causes.port";

/** THE SWAP POINT — replace the mock service with an HTTP one here. */
export default function useCausesDeps(): { queryPort: CausesQueryPort } {
  return { queryPort: useCausesQueryAdapter(useCausesServiceMockAdapter()) };
}
