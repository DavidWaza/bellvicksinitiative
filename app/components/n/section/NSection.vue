<template>
  <component
    :is="as"
    data-slot="section"
    :aria-labelledby="labelledby"
    :class="cn(sectionVariants({ tone, spacing }), props.class)"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { sectionVariants, type SectionVariants } from "./section-variants";

const props = withDefaults(
  defineProps<{
    tone?: SectionVariants["tone"];
    spacing?: SectionVariants["spacing"];
    /** Native tag only (not a component name). */
    as?: "section" | "div" | "footer" | "header" | "aside";
    /** id of the heading that names this landmark. */
    labelledby?: string;
    class?: HTMLAttributes["class"];
  }>(),
  { tone: "cream", spacing: "default", as: "section" },
);
</script>
