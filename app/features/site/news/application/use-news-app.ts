import { computed } from "vue";
import { readApiData } from "~/shared/response-helpers";
import { isPublishable, type Post, type PostKind } from "../domain/news-types";
import type { NewsQueryPort } from "../ports/news.port";

/** hasRealContent lives here: production lists only publishable posts; dev shows placeholders. */
export default function useNewsApp(options: {
  deps: { queryPort: NewsQueryPort };
  kind: PostKind;
  showPlaceholders: boolean;
}) {
  const query = options.deps.queryPort.usePostsQuery({ kind: () => options.kind });
  const all = computed<Post[]>(() => readApiData(query.data.value, [] as Post[]));
  const posts = computed(() =>
    options.showPlaceholders ? all.value : all.value.filter(isPublishable),
  );
  return {
    posts,
    hasPosts: computed(() => posts.value.length > 0),
    isLoading: query.isLoading,
    suspense: query.suspense,
  };
}
