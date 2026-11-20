<template>
  <picture
    v-if="logo"
    data-slot="partner-logo"
    :class="cn('flex items-center justify-center', props.class)"
  >
    <source type="image/webp" :srcset="`${logo}.webp`" />
    <img
      :src="`${logo}.png`"
      :alt="name"
      loading="lazy"
      decoding="async"
      class="max-h-full max-w-full object-contain"
    />
  </picture>
  <!-- Text wordmark until a logo is supplied -->
  <span
    v-else
    data-slot="partner-logo"
    :class="
      cn(
        'font-display flex items-center justify-center text-center text-lg font-semibold text-base-550',
        props.class,
      )
    "
  >
    {{ name }}
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/**
 * A partner's logo, contained within the box given by `class` (set a height and max width).
 * `logo` is the path WITHOUT extension: scripts/generate-partner-logos.mjs writes .webp + .png.
 * Falls back to the name as a wordmark.
 */
const props = defineProps<{
  name: string;
  /** e.g. "/partners/auto-credit" */
  logo?: string;
  class?: HTMLAttributes["class"];
}>();
</script>
