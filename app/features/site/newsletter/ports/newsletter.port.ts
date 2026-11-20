import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { NewsletterInput } from "../domain/newsletter-types";

type Subscribed = { subscribed: true };

export interface NewsletterServicePort {
  subscribe: (input: NewsletterInput) => Promise<ApiResponse<Subscribed>>;
}

export interface NewsletterMutationPort {
  useSubscribeMutation: () => UseMutationReturnType<
    ApiResponse<Subscribed>,
    Error,
    NewsletterInput,
    unknown
  >;
}
