<template>
  <span
    data-slot="sticker"
    :class="
      cn(
        'font-hand inline-block -rotate-6 rounded-md bg-sun-500 px-2 py-0.5 text-lg leading-none font-bold text-base-950 shadow-sm',
        props.class,
      )
    "
  >
    <slot>New ✨</slot>
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

/** The tilted Caveat sticker ("New ✨"). Decorative label — never carries an action. */
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
