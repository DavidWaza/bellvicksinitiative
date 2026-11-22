import { useInvolvedMutationAdapter } from "../adapters/involved-mutation-adapter";
import useInvolvedApp from "../application/use-involved-app";
import type { ApplicationKind } from "../domain/involved-forms";
import useInvolvedServiceHttpAdapter from "../infrastructure/services/involved-service-http-adapter";

/** THE SWAP POINT — replace the mock service with an HTTP one on the next line. */
export default function useInvolved<K extends ApplicationKind>(kind: K) {
  const service = useInvolvedServiceHttpAdapter(); // emails via our server (server/api/forms)
  return useInvolvedApp({ deps: { mutationPort: useInvolvedMutationAdapter(service) }, kind });
}
