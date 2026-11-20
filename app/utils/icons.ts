import { ICON_PATHS } from "./icon-paths";

/**
 * Semantic icon names (ARCHITECTURE §5.2). Templates say `name="volunteer"`, never a raw Phosphor
 * name, so swapping an icon is one line in scripts/generate-icons.mjs (ICON_SOURCES) plus a re-run.
 * Feature icons render in the duotone weight, UI chrome in regular — see `NIcon`.
 *
 * The SVG paths are generated from @phosphor-icons/core into icon-paths.ts. We don't use the
 * @phosphor-icons/vue components: each bundles all six weights as render code, which was 216KB of
 * startup JavaScript for ~60 icons.
 */
export type IconName = keyof typeof ICON_PATHS;
export type IconWeight = "regular" | "duotone" | "fill";

/** Inner SVG markup for an icon (256×256 viewBox). Falls back to regular for a missing weight. */
export function iconMarkup(name: IconName, weight: IconWeight): string {
  const icon: { regular: string; duotone: string; fill?: string } = ICON_PATHS[name];
  return (
    (weight === "fill" ? icon.fill : weight === "duotone" ? icon.duotone : icon.regular) ??
    icon.regular
  );
}
