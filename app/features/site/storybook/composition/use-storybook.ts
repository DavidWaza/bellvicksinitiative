import { useStorybookMutationAdapter } from "../adapters/storybook-mutation-adapter";
import useStorybookApp from "../application/use-storybook-app";
import useStorybookServiceMockAdapter from "../infrastructure/services/storybook-service-mock-adapter";

/** THE SWAP POINT is the service line below. */
export default function useStorybook() {
  const service = useStorybookServiceMockAdapter(); // ← swap for useStorybookServiceHttpAdapter()
  return useStorybookApp({
    deps: {
      mutationPort: useStorybookMutationAdapter(service),
      submitStorybook: service.submitStorybook,
    },
  });
}
