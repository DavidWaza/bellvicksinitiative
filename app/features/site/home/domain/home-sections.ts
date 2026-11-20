import { isReal } from "~/shared/todo-content";
import type { HomeContent } from "./home-types";

/**
 * `hasRealContent` per section. Sections that would otherwise publish placeholders are hidden in
 * production here, in one place — never with scattered `v-if`s in templates. `showPlaceholders`
 * (true in dev) keeps every section visible so designers can see the dashed "content needed" slots.
 */
export function resolveHomeVisibility(content: HomeContent | undefined, showPlaceholders: boolean) {
  const has = {
    impact: content?.impact.some((s) => isReal(s.value)) ?? false,
    story:
      content !== undefined &&
      isReal(content.story.intro) &&
      isReal(content.story.quote) &&
      isReal(content.story.attribution) &&
      content.story.image.consent !== "pending",
    news: content?.news.some((p) => isReal(p.title)) ?? false,
    testimonials: content?.testimonials.some((t) => isReal(t.quote) && isReal(t.name)) ?? false,
  };

  return {
    impact: showPlaceholders || has.impact,
    story: showPlaceholders || has.story,
    news: showPlaceholders || has.news,
    testimonials: showPlaceholders || has.testimonials,
  };
}

export type HomeVisibility = ReturnType<typeof resolveHomeVisibility>;
