<template>
  <NDoodleBase view-box="0 0 200 20" :class="props.class">
    <path pathLength="1" d="M4 13 C48 4 116 3 196 9" />
    <path pathLength="1" d="M40 17 C84 12 130 12 170 15" />
  </NDoodleBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
