<template>
  <p
    data-slot="eyebrow"
    :class="
      cn('text-[12px] leading-none font-bold tracking-[0.18em] uppercase', TONES[tone], props.class)
    "
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// accent-700, not the brief's accent-600: 12px text on cream needs 4.5:1 and 600 only reaches 3.15.
const TONES = {
  accent: "text-accent-700",
  coral: "text-coral-700",
  forest: "text-forest-500",
  light: "text-sun-500",
} as const;

const props = withDefaults(
  defineProps<{ tone?: keyof typeof TONES; class?: HTMLAttributes["class"] }>(),
  { tone: "accent" },
);
</script>
