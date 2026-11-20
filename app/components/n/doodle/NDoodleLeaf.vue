<template>
  <NDoodleBase view-box="0 0 40 48" :class="props.class">
    <path pathLength="1" d="M20 44 C6 36 4 18 20 4 C36 18 34 36 20 44 Z" />
    <path pathLength="1" d="M20 44 L20 16" />
  </NDoodleBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
