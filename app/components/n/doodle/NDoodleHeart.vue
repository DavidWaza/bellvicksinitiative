<template>
  <NDoodleBase view-box="0 0 48 44" :class="props.class">
    <path
      pathLength="1"
      d="M24 40 C8 28 3 19 6 12 C9 4 20 4 24 12 C28 4 39 4 42 12 C45 19 40 28 24 40 Z"
    />
  </NDoodleBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
