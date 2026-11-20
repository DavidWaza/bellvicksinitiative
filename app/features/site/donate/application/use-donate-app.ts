import { unwrapApiResponse } from "~/shared/api-envelope";
import type { DonationPledge } from "../domain/donate-types";
import type { DonateMutationPort } from "../ports/donate.port";

export default function useDonateApp(options: { deps: { mutationPort: DonateMutationPort } }) {
  const mutation = options.deps.mutationPort.usePledgeMutation();
  async function pledge(input: DonationPledge): Promise<void> {
    const res = await mutation.mutateAsync(input);
    unwrapApiResponse(
      res,
      "We couldn't record your pledge just now. Please try again or contact us.",
    );
  }
  return { pledge, isPending: mutation.isPending };
}
