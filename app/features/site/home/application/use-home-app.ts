import { computed } from "vue";
import { readApiData } from "~/shared/response-helpers";
import { resolveHomeVisibility } from "../domain/home-sections";
import type { HomeContent } from "../domain/home-types";
import type { HomeQueryPort } from "../ports/home-query.port";

export interface UseHomeAppOptions {
  deps: { queryPort: HomeQueryPort };
  /** True in dev: keep every section visible so TODO_CONTENT slots can be reviewed. */
  showPlaceholders: boolean;
}

/**
 * The homepage use case. Framework-agnostic: takes a `deps` bag, returns plain reactive state.
 * No router, no fetch, no component imports.
 */
export default function useHomeApp(options: UseHomeAppOptions) {
  const query = options.deps.queryPort.useHomeContentQuery();

  // The envelope check on the read side: a `status: false` answer is "no content", not a crash.
  const content = computed<HomeContent | undefined>(() =>
    readApiData<HomeContent | undefined>(query.data.value, undefined),
  );

  const visible = computed(() => resolveHomeVisibility(content.value, options.showPlaceholders));

  return {
    content,
    visible,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    /** Resolves when the first fetch settles — the composition root awaits it during SSR. */
    suspense: query.suspense,
  };
}
