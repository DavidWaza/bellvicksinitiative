// Barrel: domain only (ARCHITECTURE §9.2). The shell has no server data, so it has no ports,
// adapters or application layer — just domain constants, two UI-state composables and ui/.
// ROUTES and SITE_INFO live in ~/shared because the home slice needs them too.
export * from "./domain/site-nav";
