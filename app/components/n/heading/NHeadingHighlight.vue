<template>
  <span
    data-slot="heading-highlight"
    :class="cn('relative inline-block', TONES[tone].text, props.class)"
  >
    <slot />
    <NDoodleSwoosh
      :class="cn('absolute -bottom-[0.14em] left-0 h-[0.3em] w-full', TONES[tone].swoosh)"
      preserveAspectRatio="none"
    />
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// Large display text only needs 3:1: accent-600 on cream is 3.15, coral-600 on lavender 3.83,
// accent-500 on forest-900 5.49.
const TONES = {
  accent: { text: "text-accent-600", swoosh: "text-coral-500" },
  coral: { text: "text-coral-600", swoosh: "text-sun-500" },
  forest: { text: "text-forest-500", swoosh: "text-accent-500" },
  /** On dark forest bands */
  light: { text: "text-accent-500", swoosh: "text-sun-500" },
} as const;

/** Colour + a hand-drawn swoosh underline (HopeBridge colour, BrightPath hand). */
const props = withDefaults(
  defineProps<{ tone?: keyof typeof TONES; class?: HTMLAttributes["class"] }>(),
  { tone: "accent" },
);
</script>
