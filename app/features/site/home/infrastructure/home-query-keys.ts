/** Slice-owned query keys, hung off a `root` so another slice can invalidate by prefix. */
export const homeQueryKeys = {
  root: ["site", "home"] as const,
  content: () => [...homeQueryKeys.root, "content"] as const,
};
