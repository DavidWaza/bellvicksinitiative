/** Slice-owned query keys, hung off a `root` so others can invalidate by prefix. */
export const causesQueryKeys = {
  root: ["site", "causes"] as const,
  list: () => [...causesQueryKeys.root, "list"] as const,
  detail: (slug: string) => [...causesQueryKeys.root, "detail", slug] as const,
};
