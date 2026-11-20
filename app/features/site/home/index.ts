// Barrel: domain, query keys and port *types* only (ARCHITECTURE §9.2). Never adapters,
// application, composition or mocks — so deleting a mock stays a one-line change.
export * from "./domain/home-types";
export * from "./domain/home-sections";
export { homeQueryKeys } from "./infrastructure/home-query-keys";
export type { HomeServicePort } from "./ports/home-service.port";
export type { HomeQueryPort, HomeMutationPort, HomeDeps } from "./ports/home-query.port";
