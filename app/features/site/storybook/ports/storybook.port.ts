import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { StoryBook, StoryDraft, StoryOrderRequest } from "../domain/storybook-types";

export type GenerateInput = Omit<StoryDraft, "hasPhoto">;
type OrderReceived = { reference: string };

export interface StorybookServicePort {
  /** Writes three personalised stories for the draft. */
  generateBooks: (input: GenerateInput) => Promise<ApiResponse<StoryBook[]>>;
  /** Records which books the customer wants. No payment: we follow up by email. */
  requestOrder: (input: StoryOrderRequest) => Promise<ApiResponse<OrderReceived>>;
}

export interface StorybookMutationPort {
  useGenerateMutation: () => UseMutationReturnType<
    ApiResponse<StoryBook[]>,
    Error,
    GenerateInput,
    unknown
  >;
  useOrderMutation: () => UseMutationReturnType<
    ApiResponse<OrderReceived>,
    Error,
    StoryOrderRequest,
    unknown
  >;
}
