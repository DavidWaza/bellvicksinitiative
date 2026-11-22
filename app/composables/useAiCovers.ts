/**
 * Whether storybook AI covers are switched on (NUXT_PUBLIC_STORYBOOK_AI_COVERS=1). It changes the
 * photo consent text and privacy policy, and whether the wizard asks the server for covers. The
 * server also needs NUXT_OPENAI_API_KEY.
 */
export function useAiCovers(): boolean {
  const flag = useRuntimeConfig().public.storybookAiCovers;
  return flag === true || String(flag) === "1";
}
