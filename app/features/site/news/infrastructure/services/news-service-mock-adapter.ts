import { mockRead } from "~/shared/mock";
import type { NewsServicePort } from "../../ports/news.port";
import { POSTS } from "../mock/posts-data";

export default function useNewsServiceMockAdapter(): NewsServicePort {
  return { getPosts: (kind) => mockRead(POSTS.filter((p) => p.kind === kind)) };
}
