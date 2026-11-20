import type { ApiResponse } from "~/shared/api-response";
import type { HomeContent, VolunteerInterestInput } from "../domain/home-types";

/**
 * The transport port. Today a mock adapter answers it; swapping to HTTP is one line in
 * composition/use-home-deps.ts. Every method answers with the ApiResponse envelope — and
 * `status: false` can arrive on a 200, so every write must go through unwrapApiResponse.
 */
export interface HomeServicePort {
  getHomeContent: () => Promise<ApiResponse<HomeContent>>;
  submitVolunteerInterest: (
    input: VolunteerInterestInput,
  ) => Promise<ApiResponse<{ received: true }>>;
}
