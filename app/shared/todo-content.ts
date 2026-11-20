/**
 * `TODO_CONTENT` marks every fact that does not exist yet (impact figures, amounts raised, stories,
 * testimonials, news, team names, registration number, book titles). It is a plain string — not a
 * Symbol — so it survives JSON serialisation into the SSR payload and the query cache.
 *
 * Rendering: `<n-todo>` / `<n-stat>` show a dashed outline + "content needed" tag in dev and a
 * safe fallback (or nothing) in production. Never invent a value to fill one in.
 */
export const TODO_CONTENT = "__TODO_CONTENT__" as const;
type TodoContent = typeof TODO_CONTENT;

/** A field that is either real content or still to be supplied. */
export type Content<T> = T | TodoContent;

/** Narrows to real content. */
export function isReal<T>(value: Content<T> | null | undefined): value is T {
  return value !== undefined && value !== null && value !== TODO_CONTENT;
}
