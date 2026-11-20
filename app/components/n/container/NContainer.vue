<template>
  <div
    data-slot="container"
    :class="cn('mx-auto w-full px-5 sm:px-8 lg:px-10', SIZES[size], props.class)"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const SIZES = {
  narrow: "max-w-[760px]",
  default: "max-w-[1200px]",
  wide: "max-w-[1360px]",
} as const;

const props = withDefaults(
  defineProps<{ size?: keyof typeof SIZES; class?: HTMLAttributes["class"] }>(),
  { size: "default" },
);
</script>
