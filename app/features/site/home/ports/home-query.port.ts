import type { UseMutationReturnType, UseQueryReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { HomeContent, VolunteerInterestInput } from "../domain/home-types";

/** Reads. Reactive inputs would cross as zero-arg thunks; the homepage has none. */
export interface HomeQueryPort {
  useHomeContentQuery: () => UseQueryReturnType<ApiResponse<HomeContent>, Error>;
}

/** Writes. */
export interface HomeMutationPort {
  useVolunteerInterestMutation: () => UseMutationReturnType<
    ApiResponse<{ received: true }>,
    Error,
    VolunteerInterestInput,
    unknown
  >;
}

export interface HomeDeps {
  queryPort: HomeQueryPort;
  mutationPort: HomeMutationPort;
}
