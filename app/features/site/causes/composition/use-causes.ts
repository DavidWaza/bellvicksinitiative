import { useCauseDetailApp, useCausesListApp } from "../application/use-causes-app";

/** The causes list, prefetched on the server so the payload hydrates (no <client-only>). */
export default function useCauses() {
  const app = useCausesListApp({ deps: useCausesDeps() });
  onServerPrefetch(async () => {
    await app.suspense();
  });
  return app;
}

/** One cause by slug, prefetched on the server. */
export function useCause(slug: () => string) {
  const app = useCauseDetailApp({ deps: useCausesDeps(), slug });
  onServerPrefetch(async () => {
    await app.suspense();
  });
  return app;
}
