<template>
  <NDoodleBase view-box="0 0 48 44" :class="props.class">
    <path pathLength="1" d="M6 14 L14 22" />
    <path pathLength="1" d="M24 4 L25 17" />
    <path pathLength="1" d="M42 10 L33 20" />
  </NDoodleBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
