<template>
  <component :is="as" data-slot="heading" :class="cn(SIZES[size], props.class)">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const SIZES = {
  display: "text-[2.5rem] sm:text-5xl lg:text-[4rem] lg:leading-[1.05]",
  h2: "text-[2rem] sm:text-4xl lg:text-[2.75rem]",
  h3: "text-2xl lg:text-[1.75rem]",
  h4: "text-xl",
} as const;

const props = withDefaults(
  defineProps<{
    as?: "h1" | "h2" | "h3" | "h4";
    size?: keyof typeof SIZES;
    class?: HTMLAttributes["class"];
  }>(),
  { as: "h2", size: "h2" },
);
</script>
