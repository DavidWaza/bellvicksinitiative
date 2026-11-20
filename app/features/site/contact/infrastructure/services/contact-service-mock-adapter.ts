import { mockWrite } from "~/shared/mock";
import type { ContactServicePort } from "../../ports/contact.port";

/** No backend yet: messages are accepted and discarded. */
export default function useContactServiceMockAdapter(): ContactServicePort {
  return { sendMessage: () => mockWrite({ received: true as const }) };
}
