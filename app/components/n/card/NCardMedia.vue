<template>
  <div data-slot="card-media" :class="cn('relative aspect-[16/10] overflow-hidden', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
