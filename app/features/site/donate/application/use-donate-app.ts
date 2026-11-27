import { unwrapApiResponse } from "~/shared/api-envelope";
import type { DonationPledge, PaidDonation } from "../domain/donate-types";
import type { DonateMutationPort } from "../ports/donate.port";

/** Donate use cases: pledge a gift, pay a naira gift through Paystack, confirm the payment. */
export default function useDonateApp(options: { deps: { mutationPort: DonateMutationPort } }) {
  const pledgeMutation = options.deps.mutationPort.usePledgeMutation();
  const start = options.deps.mutationPort.useStartPaymentMutation();
  const verify = options.deps.mutationPort.useVerifyMutation();

  async function pledge(input: DonationPledge): Promise<void> {
    const res = await pledgeMutation.mutateAsync(input);
    unwrapApiResponse(
      res,
      "We couldn't record your pledge just now. Please try again or contact us.",
    );
  }

  /** Returns Paystack's payment page URL. Throws with a readable message on failure. */
  async function startPayment(input: DonationPledge): Promise<string> {
    const res = await start.mutateAsync(input);
    const data = unwrapApiResponse(res, "We couldn't start the payment. Please try again.").data;
    if (!data?.authorizationUrl)
      throw new Error("We couldn't start the payment. Please try again.");
    return data.authorizationUrl;
  }

  async function confirmPayment(reference: string): Promise<PaidDonation> {
    const res = await verify.mutateAsync(reference);
    const data = unwrapApiResponse(res, "We couldn't confirm the payment.").data;
    if (!data) throw new Error("We couldn't confirm the payment.");
    return data;
  }

  return {
    pledge,
    startPayment,
    confirmPayment,
    isPending: computed(() => pledgeMutation.isPending.value || start.isPending.value),
  };
}
