<template>
  <div data-slot="card-footer" :class="cn('flex items-center gap-3 p-5 pt-0', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
