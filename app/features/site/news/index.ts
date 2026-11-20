// Barrel: domain, query keys and port types only (ARCHITECTURE §9.2).
export * from "./domain/news-types";
export { newsQueryKeys } from "./infrastructure/news-query-keys";
export type { NewsQueryPort, NewsServicePort } from "./ports/news.port";
