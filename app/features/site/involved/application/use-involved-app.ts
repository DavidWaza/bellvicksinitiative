import { computed } from "vue";
import { unwrapApiResponse } from "~/shared/api-envelope";
import type {
  ApplicationKind,
  MentorApplication,
  PartnerEnquiry,
  VolunteerApplication,
} from "../domain/involved-forms";
import type { InvolvedMutationPort } from "../ports/involved.port";

export interface InvolvedSubmissions {
  volunteer: VolunteerApplication;
  mentor: MentorApplication;
  partner: PartnerEnquiry;
}

const FALLBACK = "We couldn't send your details just now. Please try again.";

/**
 * Submits one kind of application. Throws (via unwrapApiResponse) when the backend answers
 * `status: false`, so the form's catch shows the backend's message.
 */
export default function useInvolvedApp<K extends ApplicationKind>(options: {
  deps: { mutationPort: InvolvedMutationPort };
  kind: K;
}) {
  const port = options.deps.mutationPort;
  const mutations = {
    volunteer: port.useVolunteerMutation(),
    mentor: port.useMentorMutation(),
    partner: port.usePartnerMutation(),
  };
  const mutation = mutations[options.kind];

  async function submit(input: InvolvedSubmissions[K]): Promise<void> {
    // The three mutations share a shape; the kind decides which one runs.
    const res = await (
      mutation.mutateAsync as (i: InvolvedSubmissions[K]) => ReturnType<typeof mutation.mutateAsync>
    )(input);
    unwrapApiResponse(res, FALLBACK);
  }

  return { submit, isPending: computed(() => mutation.isPending.value) };
}
