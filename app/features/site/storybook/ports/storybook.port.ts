import type { UseMutationReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { StoryBook, StoryDraft } from "../domain/storybook-types";

export type GenerateInput = Omit<StoryDraft, "hasPhoto">;
export type IllustratedCover = { id: string; coverUrl: string };
type IllustrateInput = { input: GenerateInput; photo: Blob };

export interface StorybookServicePort {
  /** Writes three personalised stories for the draft. */
  generateBooks: (input: GenerateInput) => Promise<ApiResponse<StoryBook[]>>;
  /** Emails the questionnaire + photo to the storybook team. Off on a static upload. */
  submitStorybook: (
    input: GenerateInput,
    photo: Blob | null,
  ) => Promise<ApiResponse<{ received: true } | null>>;
  /** AI-illustrates the covers from the child's photo. Empty list when AI covers are off. */
  illustrateCovers: (
    input: GenerateInput,
    photo: Blob,
  ) => Promise<ApiResponse<IllustratedCover[] | null>>;
}

export interface StorybookMutationPort {
  useGenerateMutation: () => UseMutationReturnType<
    ApiResponse<StoryBook[]>,
    Error,
    GenerateInput,
    unknown
  >;
  useIllustrateMutation: () => UseMutationReturnType<
    ApiResponse<IllustratedCover[] | null>,
    Error,
    IllustrateInput,
    unknown
  >;
}
