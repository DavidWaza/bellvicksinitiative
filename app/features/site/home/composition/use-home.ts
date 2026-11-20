import useHomeApp from "../application/use-home-app";

/**
 * What the page mounts. Prefetches on the server (`onServerPrefetch` + `suspense`) so the query
 * cache is dehydrated into the payload and hydrated on the client — no `<client-only>` needed.
 */
export default function useHome() {
  const app = useHomeApp({ deps: useHomeDeps(), showPlaceholders: import.meta.dev });

  onServerPrefetch(async () => {
    await app.suspense();
  });

  return app;
}
