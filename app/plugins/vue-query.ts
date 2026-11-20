import {
  dehydrate,
  hydrate,
  QueryClient,
  VueQueryPlugin,
  type DehydratedState,
} from "@tanstack/vue-query";

/**
 * TanStack Query with real SSR dehydration (replaces the `<client-only>` rule from ARCHITECTURE §12).
 *
 * Server: one QueryClient per request. Feature roots prefetch with `onServerPrefetch(suspense)`;
 * when rendering finishes the cache is dehydrated into the Nuxt payload.
 * Client: the payload is hydrated into the cache before the app mounts, so the first render
 * matches the server DOM and nothing refetches inside `staleTime`.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query", () => null);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        // On the server a finite gcTime would leave timers alive after the request.
        gcTime: import.meta.server ? Number.POSITIVE_INFINITY : 5 * 60 * 1000,
        retry: 0,
        refetchOnWindowFocus: true,
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  if (import.meta.server) {
    nuxtApp.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxtApp.hooks.hook("app:created", () => {
      if (vueQueryState.value) hydrate(queryClient, vueQueryState.value);
    });
  }
});
