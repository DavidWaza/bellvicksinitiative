import type { ImageSlot } from "~/shared/image";
import { isReal, type Content } from "~/shared/todo-content";

export type PostKind = "news" | "story";

/** The news slice's read model. The homepage keeps its own narrower copy. */
export interface Post {
  id: string;
  kind: PostKind;
  title: Content<string>;
  excerpt: Content<string>;
  category: Content<string>;
  /** ISO date; formatted at the call site with formatDisplayDate. */
  publishedAt: Content<string>;
  image: ImageSlot;
}

/** A post is publishable only once its title, excerpt and date are real. */
export const isPublishable = (post: Post) =>
  isReal(post.title) && isReal(post.excerpt) && isReal(post.publishedAt);
