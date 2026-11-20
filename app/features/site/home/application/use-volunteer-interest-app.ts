import { unwrapApiResponse } from "~/shared/api-envelope";
import type { VolunteerInterestInput } from "../domain/home-types";
import type { HomeMutationPort } from "../ports/home-query.port";

/** Volunteer interest form. Throws (via unwrapApiResponse) when the backend says `status: false`. */
export default function useVolunteerInterestApp(options: {
  deps: { mutationPort: HomeMutationPort };
}) {
  const mutation = options.deps.mutationPort.useVolunteerInterestMutation();

  async function submit(input: VolunteerInterestInput): Promise<void> {
    const res = await mutation.mutateAsync(input);
    unwrapApiResponse(res, "We couldn't send your details just now. Please try again.");
  }

  return { submit, isPending: mutation.isPending };
}
