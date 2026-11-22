import { useMutation } from "@tanstack/vue-query";
import type { StorybookMutationPort, StorybookServicePort } from "../ports/storybook.port";

export function useStorybookMutationAdapter(service: StorybookServicePort): StorybookMutationPort {
  return {
    useGenerateMutation: () => useMutation({ mutationFn: (input) => service.generateBooks(input) }),
    useIllustrateMutation: () =>
      useMutation({ mutationFn: ({ input, photo }) => service.illustrateCovers(input, photo) }),
  };
}
