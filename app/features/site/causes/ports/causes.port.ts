import type { UseQueryReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { Cause } from "../domain/cause-types";

/** Transport port: answered by the mock today, HTTP later (swap in use-causes-deps.ts). */
export interface CausesServicePort {
  getCauses: () => Promise<ApiResponse<Cause[]>>;
  getCause: (slug: string) => Promise<ApiResponse<Cause | null>>;
}

/** Read port. Reactive inputs cross as zero-arg thunks (ARCHITECTURE §9.1). */
export interface CausesQueryPort {
  useCausesQuery: () => UseQueryReturnType<ApiResponse<Cause[]>, Error>;
  useCauseQuery: (options: {
    slug: () => string;
  }) => UseQueryReturnType<ApiResponse<Cause | null>, Error>;
}
