import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { ContactMessage } from "../domain/contact-types";

type Received = { received: true };

export interface ContactServicePort {
  sendMessage: (input: ContactMessage) => Promise<ApiResponse<Received>>;
}

export interface ContactMutationPort {
  useSendMessageMutation: () => UseMutationReturnType<
    ApiResponse<Received>,
    Error,
    ContactMessage,
    unknown
  >;
}
