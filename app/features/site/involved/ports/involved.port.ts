import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type {
  MentorApplication,
  PartnerEnquiry,
  VolunteerApplication,
} from "../domain/involved-forms";

type Received = { received: true };

export interface InvolvedServicePort {
  submitVolunteer: (input: VolunteerApplication) => Promise<ApiResponse<Received>>;
  submitMentor: (input: MentorApplication) => Promise<ApiResponse<Received>>;
  submitPartner: (input: PartnerEnquiry) => Promise<ApiResponse<Received>>;
}

export interface InvolvedMutationPort {
  useVolunteerMutation: () => UseMutationReturnType<
    ApiResponse<Received>,
    Error,
    VolunteerApplication,
    unknown
  >;
  useMentorMutation: () => UseMutationReturnType<
    ApiResponse<Received>,
    Error,
    MentorApplication,
    unknown
  >;
  usePartnerMutation: () => UseMutationReturnType<
    ApiResponse<Received>,
    Error,
    PartnerEnquiry,
    unknown
  >;
}
