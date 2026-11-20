import { mockWrite } from "~/shared/mock";
import type { InvolvedServicePort } from "../../ports/involved.port";

/** No backend yet: submissions are accepted and discarded. */
export default function useInvolvedServiceMockAdapter(): InvolvedServicePort {
  const received = { received: true as const };
  return {
    submitVolunteer: () => mockWrite(received),
    submitMentor: () => mockWrite(received),
    submitPartner: () => mockWrite(received),
  };
}
