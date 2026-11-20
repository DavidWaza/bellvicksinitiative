<template>
  <svg
    ref="el"
    data-slot="doodle"
    data-draw
    :viewBox="viewBox"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    :class="cn('pointer-events-none select-none', props.class)"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/**
 * Shared shell for every doodle: currentColor, ~3px round-capped stroke, aria-hidden, and a
 * one-time stroke-dashoffset "draw in" when scrolled into view (disabled under reduced motion).
 * `data-draw` is picked up by the inline head reveal script (utils/reveal-script.ts), so the draw
 * never waits for hydration. Child paths set `pathLength="1"` so the dash is size-independent.
 */
const props = defineProps<{ viewBox: string; class?: HTMLAttributes["class"] }>();

// Doodles created on the client (after navigation) join the same observer.
const el = ref<SVGElement | null>(null);
onMounted(() => {
  if (el.value && !el.value.hasAttribute("data-revealed")) window.__bvReveal?.observe(el.value);
});
</script>
