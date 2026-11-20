<template>
  <NDoodleBase view-box="0 0 64 44" :class="props.class">
    <path pathLength="1" d="M6 36 L9 10 L22 24 L32 6 L42 24 L55 10 L58 36 Z" />
    <path pathLength="1" d="M9 41 L55 41" />
  </NDoodleBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
