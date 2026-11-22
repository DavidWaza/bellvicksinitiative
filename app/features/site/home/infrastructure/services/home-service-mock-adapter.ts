import { postForm } from "~/shared/form-post";
import { okResponse } from "~/shared/response-helpers";
import { MOCK_LIST_LATENCY_MS, mockLatency } from "~/shared/mock";
import type { HomeServicePort } from "../../ports/home-service.port";
import { HOME_CONTENT } from "../mock/home-content";

/**
 * Homepage transport: content is still mock (no CMS yet); the volunteer sign-up is REAL and is
 * emailed to the contact inbox by our server (server/api/forms/[form].post.ts).
 */
export default function useHomeServiceMockAdapter(): HomeServicePort {
  return {
    getHomeContent: () => mockLatency(okResponse(HOME_CONTENT), MOCK_LIST_LATENCY_MS),

    submitVolunteerInterest: (input) => postForm("/api/forms/interest", { ...input }),
  };
}
