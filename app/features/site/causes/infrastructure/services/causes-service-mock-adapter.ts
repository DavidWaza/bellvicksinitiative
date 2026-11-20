import { mockRead } from "~/shared/mock";
import type { CausesServicePort } from "../../ports/causes.port";
import { CAUSES } from "../mock/causes-data";

export default function useCausesServiceMockAdapter(): CausesServicePort {
  return {
    getCauses: () => mockRead(CAUSES),
    getCause: (slug) => mockRead(CAUSES.find((c) => c.slug === slug) ?? null),
  };
}
