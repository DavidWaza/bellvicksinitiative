import { useNewsQueryAdapter } from "../adapters/news-query-adapter";
import useNewsApp from "../application/use-news-app";
import type { PostKind } from "../domain/news-types";
import useNewsServiceMockAdapter from "../infrastructure/services/news-service-mock-adapter";

/** THE SWAP POINT is the service line below. Prefetched on the server. */
export default function useNews(kind: PostKind) {
  const service = useNewsServiceMockAdapter(); // ← swap for useNewsServiceHttpAdapter()
  const app = useNewsApp({
    deps: { queryPort: useNewsQueryAdapter(service) },
    kind,
    showPlaceholders: import.meta.dev,
  });
  onServerPrefetch(async () => {
    await app.suspense();
  });
  return app;
}
