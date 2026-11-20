<template>
  <!-- eslint-disable-next-line vue/no-v-html -- generated, trusted Phosphor path data -->
  <svg
    data-slot="icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
    :width="size"
    :height="size"
    aria-hidden="true"
    focusable="false"
    :class="cn('shrink-0', props.class)"
    v-html="markup"
  />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { iconMarkup, type IconName, type IconWeight } from "~/utils/icons";

/**
 * Inline Phosphor icon from generated path data (utils/icon-paths.ts). Always decorative
 * (aria-hidden): pair it with visible text or an aria-label on the control.
 * If a `fill` weight isn't generated for an icon, add a static weight="fill" usage and re-run
 * scripts/generate-icons.mjs — until then it falls back to regular.
 */
const props = withDefaults(
  defineProps<{
    name: IconName;
    /** duotone for feature icons, regular for UI chrome (ARCHITECTURE §5.2). */
    weight?: IconWeight;
    size?: string | number;
    class?: HTMLAttributes["class"];
  }>(),
  { weight: "regular", size: "1.25em" },
);

const markup = computed(() => iconMarkup(props.name, props.weight));
</script>
