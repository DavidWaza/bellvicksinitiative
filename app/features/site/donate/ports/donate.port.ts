import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { DonationPledge } from "../domain/donate-types";

type Received = { received: true };

export interface DonateServicePort {
  pledge: (input: DonationPledge) => Promise<ApiResponse<Received>>;
}

export interface DonateMutationPort {
  usePledgeMutation: () => UseMutationReturnType<
    ApiResponse<Received>,
    Error,
    DonationPledge,
    unknown
  >;
}
