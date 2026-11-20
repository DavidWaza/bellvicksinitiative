<template>
  <svg
    data-slot="dot-map"
    :viewBox="DOT_MAP_VIEWBOX"
    fill="none"
    stroke="currentColor"
    stroke-width="0.6"
    stroke-linecap="round"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="xMidYMid meet"
    :class="
      cn(
        'pointer-events-none text-base-900 opacity-[0.08] will-change-transform select-none',
        props.class,
      )
    "
  >
    <path :d="DOT_MAP_PATH" />
  </svg>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DOT_MAP_PATH, DOT_MAP_VIEWBOX } from "./dot-map-path";

/**
 * The HopeBridge dotted world-map texture — one path, ~7KB, ~8% opacity by default.
 *
 * Performance notes (measured, see AGENTS.md):
 * - `will-change-transform` gives it its own compositor layer, so it is rasterised once instead
 *   of on every frame of animations layered above it (that repaint dominated TBT).
 * - Keep it inline SVG. As an <img> it became the page's LCP element (4.9s vs 0.9s).
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
