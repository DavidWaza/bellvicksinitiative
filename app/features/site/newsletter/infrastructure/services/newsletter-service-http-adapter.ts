import { postForm } from "~/shared/form-post";
import type { NewsletterServicePort } from "../../ports/newsletter.port";

/**
 * Emails each new subscriber to the contact inbox via our server. (No mailing-list service yet:
 * Bellvicks adds them to its list by hand.)
 */
export default function useNewsletterServiceHttpAdapter(): NewsletterServicePort {
  return {
    subscribe: async (input) => {
      const res = await postForm("/api/forms/newsletter", input);
      return { ...res, data: { subscribed: true as const } };
    },
  };
}
