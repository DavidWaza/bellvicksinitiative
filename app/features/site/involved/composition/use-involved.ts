import { useInvolvedMutationAdapter } from "../adapters/involved-mutation-adapter";
import useInvolvedApp from "../application/use-involved-app";
import type { ApplicationKind } from "../domain/involved-forms";
import useInvolvedServiceMockAdapter from "../infrastructure/services/involved-service-mock-adapter";

/** THE SWAP POINT — replace the mock service with an HTTP one on the next line. */
export default function useInvolved<K extends ApplicationKind>(kind: K) {
  const service = useInvolvedServiceMockAdapter(); // ← swap for useInvolvedServiceHttpAdapter()
  return useInvolvedApp({ deps: { mutationPort: useInvolvedMutationAdapter(service) }, kind });
}
