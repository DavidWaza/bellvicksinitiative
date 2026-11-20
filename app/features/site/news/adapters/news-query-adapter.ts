import { useQuery } from "@tanstack/vue-query";
import { newsQueryKeys } from "../infrastructure/news-query-keys";
import type { NewsQueryPort, NewsServicePort } from "../ports/news.port";

export function useNewsQueryAdapter(service: NewsServicePort): NewsQueryPort {
  return {
    usePostsQuery(options) {
      const kind = computed(() => options.kind());
      return useQuery({
        queryKey: computed(() => newsQueryKeys.list(kind.value)),
        queryFn: () => service.getPosts(kind.value),
      });
    },
  };
}
