// Barrel: domain and port types only (ARCHITECTURE §9.2).
// THE ONE SHARED SLICE: its <nl-strip> is mounted once by the default layout, so every page gets
// the newsletter without slices importing each other (the role audit-trail plays in ARCHITECTURE).
export * from "./domain/newsletter-types";
export type { NewsletterMutationPort, NewsletterServicePort } from "./ports/newsletter.port";
