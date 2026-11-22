/**
 * Whether storybook AI covers are on for THIS build. Needs both the switch
 * (NUXT_PUBLIC_STORYBOOK_AI_COVERS=1) and a server: a static upload (`nuxt generate`, e.g.
 * cPanel) has no /api, so covers stay drawn there even if .env switches them on.
 */
export function useAiCovers(): boolean {
  const pub = useRuntimeConfig().public;
  const on = pub.storybookAiCovers === true || String(pub.storybookAiCovers) === "1";
  return on && !pub.staticSite;
}
