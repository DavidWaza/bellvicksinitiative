import { useHomeMutationAdapter, useHomeQueryAdapter } from "../adapters/home-query-adapter";
import useHomeServiceMockAdapter from "../infrastructure/services/home-service-mock-adapter";
import type { HomeDeps } from "../ports/home-query.port";

/**
 * THE SWAP POINT — the only place adapters are named. When the backend exists, replace the one
 * line below with an HTTP adapter implementing HomeServicePort; nothing else changes.
 */
export default function useHomeDeps(): HomeDeps {
  const service = useHomeServiceMockAdapter(); // ← swap for useHomeServiceHttpAdapter()
  return {
    queryPort: useHomeQueryAdapter(service),
    mutationPort: useHomeMutationAdapter(service),
  };
}
