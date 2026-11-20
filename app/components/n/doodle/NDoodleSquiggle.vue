<template>
  <NDoodleBase view-box="0 0 120 16" :class="props.class">
    <path pathLength="1" d="M3 8 C13 -2 23 18 33 8 S53 -2 63 8 S83 18 93 8 S111 0 117 8" />
  </NDoodleBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
