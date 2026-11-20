// Barrel: domain, query keys and port types only (ARCHITECTURE §9.2).
export * from "./domain/cause-types";
export { causesQueryKeys } from "./infrastructure/causes-query-keys";
export type { CausesQueryPort, CausesServicePort } from "./ports/causes.port";
