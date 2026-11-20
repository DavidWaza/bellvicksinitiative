import { failResponse, okResponse } from "~/shared/response-helpers";
import { MOCK_MUTATION_LATENCY_MS, mockLatency } from "~/shared/mock";
import type { NewsletterServicePort } from "../../ports/newsletter.port";

// In-memory only, so the mock can answer a duplicate with the real backend's failure shape:
// `status: false` on a normal 200. That is what proves unwrapApiResponse is wired up.
const subscribed = new Set<string>();

export default function useNewsletterServiceMockAdapter(): NewsletterServicePort {
  return {
    subscribe: async ({ email }) => {
      const key = email.trim().toLowerCase();
      if (subscribed.has(key)) {
        return mockLatency(
          failResponse({ subscribed: true as const }, "This email is already subscribed."),
          MOCK_MUTATION_LATENCY_MS,
        );
      }
      subscribed.add(key);
      return mockLatency(okResponse({ subscribed: true as const }), MOCK_MUTATION_LATENCY_MS);
    },
  };
}
