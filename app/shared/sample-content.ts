/**
 * SAMPLE CONTENT: invented demo values (impact figures, cause funding, book titles, stories, news,
 * testimonials, team names). They make the site look complete for reviews and demos. They are NOT
 * facts about Bellvicks and must be replaced before launch.
 *
 * Every invented value is wrapped in `sample(...)`, so `grep "sample("` finds them all. A production
 * build fails while any file imports this module (see the `build:before` hook in nuxt.config.ts),
 * unless ALLOW_SAMPLE_CONTENT=1 is set for a demo deploy. To replace one: swap `sample(x)` for the
 * real value (or TODO_CONTENT), then drop the import once a file has none left.
 */
export function sample<T>(value: T): T {
  return value;
}
