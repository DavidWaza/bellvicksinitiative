import { useSponsorshipMutationAdapter } from "../adapters/sponsorship-mutation-adapter";
import useSponsorshipApp from "../application/use-sponsorship-app";
import type { SponsorshipForm } from "../domain/sponsorship-forms";
import useSponsorshipServiceHttpAdapter from "../infrastructure/services/sponsorship-service-http-adapter";

/** Composition root for the Back to School forms (emails via server/api/sponsorship). */
export default function useSponsorship(form: SponsorshipForm) {
  const service = useSponsorshipServiceHttpAdapter();
  return useSponsorshipApp({
    deps: { mutationPort: useSponsorshipMutationAdapter(service) },
    form,
  });
}
