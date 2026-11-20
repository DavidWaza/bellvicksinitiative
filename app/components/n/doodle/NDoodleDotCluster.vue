<template>
  <NDoodleBase view-box="0 0 40 40" :class="props.class">
    <g fill="currentColor" stroke="none">
      <circle cx="8" cy="10" r="3" />
      <circle cx="22" cy="6" r="2.2" />
      <circle cx="32" cy="16" r="3" />
      <circle cx="14" cy="26" r="2.4" />
      <circle cx="28" cy="33" r="2" />
    </g>
  </NDoodleBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
