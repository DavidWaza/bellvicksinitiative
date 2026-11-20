import { useQuery } from "@tanstack/vue-query";
import { causesQueryKeys } from "../infrastructure/causes-query-keys";
import type { CausesQueryPort, CausesServicePort } from "../ports/causes.port";

export function useCausesQueryAdapter(service: CausesServicePort): CausesQueryPort {
  return {
    useCausesQuery() {
      return useQuery({ queryKey: causesQueryKeys.list(), queryFn: () => service.getCauses() });
    },
    useCauseQuery(options) {
      const slug = computed(() => options.slug());
      return useQuery({
        queryKey: computed(() => causesQueryKeys.detail(slug.value)),
        queryFn: () => service.getCause(slug.value),
      });
    },
  };
}
