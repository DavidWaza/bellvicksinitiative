import { computed, ref } from "vue";
import { readApiData } from "~/shared/response-helpers";
import type { Cause, CauseLocation } from "../domain/cause-types";
import type { CausesQueryPort } from "../ports/causes.port";

/** The causes list: data plus a location filter. Framework-agnostic over a deps bag. */
export function useCausesListApp(options: { deps: { queryPort: CausesQueryPort } }) {
  const query = options.deps.queryPort.useCausesQuery();
  const causes = computed<Cause[]>(() => readApiData(query.data.value, [] as Cause[]));

  const location = ref<CauseLocation | "all">("all");
  const visible = computed(() =>
    location.value === "all"
      ? causes.value
      : causes.value.filter((c) => c.location === location.value),
  );

  return {
    causes,
    visible,
    location,
    setLocation: (value: CauseLocation | "all") => (location.value = value),
    isLoading: query.isLoading,
    suspense: query.suspense,
  };
}

/** One cause. `cause` is null when the slug is unknown (the page turns that into a 404). */
export function useCauseDetailApp(options: {
  deps: { queryPort: CausesQueryPort };
  slug: () => string;
}) {
  const query = options.deps.queryPort.useCauseQuery({ slug: options.slug });
  const cause = computed<Cause | null>(() => readApiData(query.data.value, null));
  return { cause, isLoading: query.isLoading, suspense: query.suspense };
}
