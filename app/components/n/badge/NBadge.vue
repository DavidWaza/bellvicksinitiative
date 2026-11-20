<template>
  <span
    data-slot="badge"
    :class="
      cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold',
        TONE_CLASSES[tone].soft,
        TONE_CLASSES[tone].text,
        props.class,
      )
    "
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { TONE_CLASSES, type Tone } from "~/utils/tones";

const props = withDefaults(defineProps<{ tone?: Tone; class?: HTMLAttributes["class"] }>(), {
  tone: "mint",
});
</script>
