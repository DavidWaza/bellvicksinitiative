import { unwrapApiResponse } from "~/shared/api-envelope";
import type { ContactMessage } from "../domain/contact-types";
import type { ContactMutationPort } from "../ports/contact.port";

export default function useContactApp(options: { deps: { mutationPort: ContactMutationPort } }) {
  const mutation = options.deps.mutationPort.useSendMessageMutation();
  async function send(input: ContactMessage): Promise<void> {
    const res = await mutation.mutateAsync(input);
    unwrapApiResponse(res, "We couldn't send your message just now. Please try again or email us.");
  }
  return { send, isPending: mutation.isPending };
}
