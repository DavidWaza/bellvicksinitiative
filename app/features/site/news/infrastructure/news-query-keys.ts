export const newsQueryKeys = {
  root: ["site", "news"] as const,
  list: (kind: string) => [...newsQueryKeys.root, "list", kind] as const,
};
