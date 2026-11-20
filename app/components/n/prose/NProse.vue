<template>
  <div
    data-slot="prose"
    :class="
      cn(
        'max-w-[68ch] text-base-600',
        '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[1.75rem] [&_h2]:text-forest-900 [&_h2:first-child]:mt-0',
        '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:text-forest-900',
        '[&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_a]:font-medium [&_a]:text-forest-500 [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-base-900',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/** Long-form text styling (legal pages, articles) via descendant selectors. */
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
