import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { SponsorshipForm } from "../domain/sponsorship-forms";

/** The server's answer: the application's reference number (the paper form's "No."). */
export type Submitted = { received: true; reference: string };

export interface SponsorshipSubmission {
  form: SponsorshipForm;
  data: Record<string, unknown>;
  /** Photos, by field name (passports, document copies). Shrunk before upload. */
  files: Record<string, Blob>;
}

export interface SponsorshipServicePort {
  submit: (input: SponsorshipSubmission) => Promise<ApiResponse<Submitted>>;
}

export interface SponsorshipMutationPort {
  useSubmitMutation: () => UseMutationReturnType<
    ApiResponse<Submitted>,
    Error,
    SponsorshipSubmission,
    unknown
  >;
}
