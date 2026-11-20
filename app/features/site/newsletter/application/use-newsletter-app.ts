import { unwrapApiResponse } from "~/shared/api-envelope";
import type { NewsletterInput } from "../domain/newsletter-types";
import type { NewsletterMutationPort } from "../ports/newsletter.port";

/** Newsletter subscription. Throws (via unwrapApiResponse) when the backend says `status: false`. */
export default function useNewsletterApp(options: {
  deps: { mutationPort: NewsletterMutationPort };
}) {
  const mutation = options.deps.mutationPort.useSubscribeMutation();

  async function subscribe(input: NewsletterInput): Promise<void> {
    const res = await mutation.mutateAsync(input);
    unwrapApiResponse(res, "We couldn't subscribe you just now. Please try again.");
  }

  return { subscribe, isPending: mutation.isPending };
}
